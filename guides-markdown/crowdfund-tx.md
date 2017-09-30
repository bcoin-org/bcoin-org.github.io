# Creating a Crowdfunding Transaction
```post-author
Buck Perley
```

## SIGHASH Flags
In most Bitcoin transactions, when a transaction is signed, the entirety of the data in that transaction is committed to in that input's signature, with all outputs and inputs being included in the unlocking script. This, however, doesn't always have to be the case. The level of commitment is indicated by using `SIGHASH` flags. The most common flag is `SIGHASH_ALL` which has a value of 0x01 (you'll see this represented as a `01` at the end of DER-encoded signatures). To learn more about how the flags work and what other options are available, you should checkout [Chapter 6](https://github.com/bitcoinbook/bitcoinbook/blob/8d01749bcf45f69f36cf23606bbbf3f0bd540db3/ch06.asciidoc) of *Mastering Bitcoin* by Andreas Antonopolous. In that chapter, Andreas posits one novel use of a specialized flag, `ALL|ANYONECANPAY`, and in this guide we'll try and build out a couple of examples implementing this idea using bcoin.

## How it Works
The `ALL|ANYONECANPAY` flag indicates that a signature is committing all of the outputs and just one input. The suggested use case of this proposed in *Mastering Bitcoin* is a kickstarter-like crowdfunding application. Consider the situation where you have a fundraising goal, say 1BTC. You'd like multiple people to contribute to your goal and you want to prove to them that they won't have to pay *unless* you reach your goal (i.e. the transaction is invalid and won't be accepted by the network if attempted to be sent). This means you'd be committing to one output, the one that sends the funds to the charity or project you'd like to donate to, and only one input, your contribution. This allows multiple users to contribute to the same transaction and that transaction won't be valid until it's fully funded.

Here's how it's explained in *Mastering Bitcoin*:
> ALL|ANYONECANPAY
This construction can be used to make a "crowdfunding”-style transaction. Someone attempting to raise funds can construct a transaction with a single output. The single output pays the "goal" amount to the fundraiser. Such a transaction is obviously not valid, as it has no inputs. However, others can now amend it by adding an input of their own, as a donation. They sign their own input with ALL|ANYONECANPAY. Unless enough inputs are gathered to reach the value of the output, the transaction is invalid. Each donation is a "pledge," which cannot be collected by the fundraiser until the entire goal amount is raised.

## The Code
We'll walk through the steps of creating the transaction first without any wallet database or node running. Then we'll do the same thing using bcoin's walletdb to manage the keys to see how it would work in a more realistic application. At the end, we'll put out some ideas of how these can be built upon for a more robust, production ready application. (If this is something you'd be interested in building, [get in touch](http://bcoin.io/slack-signup.html)!). If you want to see the code, checkout the [repo on github](https://github.com/Bucko13/bitcoin-fundraise).

If you're not comfortable with key management, coin selection, and how transactions are constructed, checkout the tutorial on [working with transactions](https://github.com/bcoin-org/bcoin/blob/master/docs/Working-with-transactions.md) first.

### Version 1 - Manual
#### Step 1: Setup
Let's first start by importing the right tools, setting up some constants, and creating our keychains. (make sure you've installed the latest version of bcoin into your project with `npm install bcoin`)

```javascript
'use strict';

const assert = require('assert');
const bcoin = require('bcoin');

const MTX = bcoin.mtx;
const Keyring = bcoin.keyring;
const Outpoint = bcoin.outpoint;
const Script = bcoin.script;
const Coin = bcoin.coin;
const policy = bcoin.protocol.policy

const fundingTarget = 100000000; // 1 BTC
const txRate = 10000; // 10000 satoshis/kb
```

Let's derive private hd key for fundee and two funders and create a "keyring" object for each (much of this is borrowed from the *Working with Transactions* guide).

A keyring object is basically a key manager that is also able to tell you info such as:
- your redeem script
- your scripthash
- your program hash
- your pubkey hash
- your scripthash program hash

```javascript
// Create an HD master keypair.
const master = bcoin.hd.generate();

const fundeeKey = master.derive(0);
const fundeeKeyring = new Keyring(fundeeKey.privateKey);
const fundeeAddress = fundeeKeyring.getAddress();

// Derive 2 more private hd keys and keyrings for funders
const funder1Key = master.derive(1);
const funder1Keyring = new Keyring(funder1Key.privateKey);

const funder2Key = master.derive(2);
const funder2Keyring = new Keyring(funder2Key.privateKey);

const funders = [funder1Keyring, funder2Keyring];
```

#### Step 2: Fund the Keyrings
This example is working in an isolated environment, so it won't work on the actual network (main, test, or otherwise), but we also don't have to earn or send ourselves coins or wait for confirmation times. That means that we can "spawn" coins for our funder wallets that they can use to spend on the crowdfunding platform.

Let's create some coinbase transactions to give our keyrings some coins that they can spend.

```javascript
// create some coinbase transactions to fund our wallets
const coins = {};

for(let i=0; i < funders.length; i++) {
  const cb = new MTX();

  // Add a typical coinbase input
  cb.addInput({
    prevout: new Outpoint(),
    script: new Script()
  });

  cb.addOutput({
    address: funders[i].getAddress(),
    value: 500000000 // give the funder 5BTC
  });

  assert(cb.inputs[0].isCoinbase());

  // Convert the coinbase output to a Coin
  // object and add it to the available coins for that keyring.
  // In reality you might get these coins from a wallet.
  coins[i] = [Coin.fromTX(cb, 0, -1)];
}
```

The coins object you've created above should look something like this:

```json
{
  '0':
      [
        {
          "type": 'pubkeyhash',
          "version": 1,
          "height": -1,
          "value": '5.0',
          "script": <Script: OP_DUP OP_HASH160 0x14 0x64cc4e55b2daec25431bd879ef39302a77c1c1ce OP_EQUALVERIFY OP_CHECKSIG>,
          "coinbase": true,
          "hash": '151e5551cdcec5fff06818fb78ac3d584361276e862b5700110ec8321869d650',
          "index": 0,
          "address": <Address: type=pubkeyhash version=-1 str=mphvcfcFneRZvyYsmzhy57cSDzFbGrWaRb>
        }
      ],
  '1': [...]
}
```

#### Step 4: Prepare your Coins
Above, we just funded our funder accounts with a single 5BTC outpoint. This means that the next transaction funded from these accounts can only use that one outpoint (or *coin*) as an input and send the remainder back as change. Remember, in Bitcoin the way you send funds is you fund a transaction with a full UTXO (in this case we only have one worth 5BTC available to our keychains) and then send the change back to yourself as an additional output. Since ALL|ANYONECANPAY transactions mean a fixed output, you can't add new change outputs without other signatures becoming invalid which means we need a coin available equal to the amount we want to contribute to the crowdfund.

So what we want to do is have each funder create a coin (UTXO) with the value of what they want to donate.

Let's create an asyncronous utility function to help us split the coinbases we created in the previous step (we use the `fund` method on the `MTX` primitive to do this, which is asynchronous).

```javascript
const splitCoinbase = async function splitCoinbase(keyrings, coins, targetAmount, txRate) {

  // loop through each coinbase coin to split
  for(const coinsIndex in coins) {
    // funder will be at the same index as the key of the coins we are accessing
    const funderKeyring = keyrings[coinsIndex];
    const mtx = new MTX();

    assert(coins[coinsIndex][0].value > targetAmount, 'coin value is not enough!');

    // create a transaction that will have an output equal to what we want to fund
    mtx.addOutput({
      address: funderKeyring.getAddress(),
      value: targetAmount
    });

    // shift off the coinbase coin to use to fund the splitting transaction
    // the fund method will automatically split the remaining funds to the change address
    await mtx.fund([coins[coinsIndex].shift()], {
      rate: txRate,
      // send change back to an address belonging to the funder
      changeAddress: funderKeyring.getAddress()
    }).then(() => {
      // sign the mtx to finalize split
      mtx.sign(funderKeyring);
      assert(mtx.verify());

      const tx = mtx.toTX();
      assert(tx.verify(mtx.view));

      const outputs = tx.outputs;

      // get coins from tx
      outputs.forEach((outputs, index) => {
        coins[coinsIndex].push(Coin.fromTX(tx, index, -1));
      });
    })
    .catch(e => console.log('There was an error: ', e));
  }

  return coins;
};
```

