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
Let's first start by importing the right tools, setting up some constants, and creating our keychains. (make sure you've installed the latest version of bcoin into your project with `npm install bcoin`).

Note that we're setting the fundingTarget and amountToFund as constants for simplicity, but they could be set based on user input or some other variable circumstances.

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
const amountToFund = 50000000; // .5 BTC
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
  "0":
      [
        {
          "type": "pubkeyhash",
          "version": 1,
          "height": -1,
          "value": "5.0",
          "script": <Script: OP_DUP OP_HASH160 0x14 0x64cc4e55b2daec25431bd879ef39302a77c1c1ce OP_EQUALVERIFY OP_CHECKSIG>,
          "coinbase": true,
          "hash": "151e5551cdcec5fff06818fb78ac3d584361276e862b5700110ec8321869d650",
          "index": 0,
          "address": <Address: type=pubkeyhash version=-1 str=mphvcfcFneRZvyYsmzhy57cSDzFbGrWaRb>
        }
      ],
  "1": [...]
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

Because of the async methods being used, in order to take advantage of the async/await structure, the rest of the code will be enclosed in an async function.

The first thing we'll do is split the coinbase coins we created earlier using the utility function we just built.

```javascript
const composeCrowdfund = async function composeCrowdfund() {
  const funderCoins = await splitCoinbase(funders, coins, amountToFund, txRate);
  // ... we'll keep filling out the rest of the code here
};
```

`funderCoins` should return x number of coin arrays, where X is the number of coinbases we created earlier (should be 2) with each array having a coin equal to the amount we want to donate.

For example...

```json
{
  "0":
     [
      {
        "type": "pubkeyhash",
        "version": 1,
        "height": -1,
        "value": "0.5",
        "script": <Script: OP_DUP OP_HASH160 0x14 0x62f725e83caf894aa6c3efd29ef28649fc448825 OP_EQUALVERIFY OP_CHECKSIG>,
        "coinbase": false,
        "hash": "774822d84bd5af02f1b3eacd6215e0a1bcf07cfb6675a000c8a01d2ea34f2a32",
        "index": 0,
        "address": <Address: type=pubkeyhash version=-1 str=mpYEb17KR7MVhuPZT1GsW3SywZx8ihYube>
       },
         ...
      ],
  "1": [...]
}
```
#### Step 5: Calculating the Fee

We have a tricky problem now. In a real world situation you're not going to know how many inputs (i.e. funders) you will have. But the more inputs you have, the bigger the transaction and thus the higher the fee you will need to broadcast it. The best we can do is to estimate the size based off of the max number of inputs we are willing to accept.

In our example, we know there are two inputs. In a more complex application, you might put a cap of say 5, then estimate the fee based on that. If there turn out to be fewer then you just have a relatively high fee.

So, let's next add a utility for estimating a max fee. The way this will work is by creating a mock transaction that uses one of our coins to add inputs up to our maximum, calculate the size of the transaction and the fee based on that amount. We'll also build a utility that we'll need again later for adding coins to a tx and signing the input created.

```javascript
const getMaxFee = function getMaxFee(maxInputs, coin, address, keyring, rate) {
  const fundingTarget = 100000000; // 1 BTC (arbitrary for purposes of this function)
  const testMTX = new MTX();

  testMTX.addOutput({ value: fundingTarget, address })

  while(testMTX.inputs.length < maxInputs) {
    const index = testMTX.inputs.length;
    addInput(coin, index, testMTX, keyring);
  }

  return testMTX.getMinFee(null, rate);
}

const addInput = function addInput(coin, inputIndex, mtx, keyring, hashType) {
  const sampleCoin = coin instanceof Coin ? coin : Coin.fromJSON(coin);
  if(!hashType) hashType = Script.hashType.ANYONECANPAY | Script.hashType.ALL;

  mtx.addCoin(sampleCoin);
  mtx.scriptInput(inputIndex, sampleCoin, keyring);
  mtx.signInput(inputIndex, sampleCoin, keyring, hashType);
  assert(mtx.isSigned(), 'Input was not signed properly');
}

```

Now we can get the fee for our funder transaction. We'll assume a max of 2 inputs, but this can be variable.

```javascript
const composeCrowdfund = async function composeCrowdfund() {
  //...
  const maxInputs = 2;
  const maxFee = getMaxFee(
    maxInputs,
    funderCoins['0'][0],
    fundeeAddress,
    funder1Keyring,
    txRate
  );

  console.log(`Based on a rate of ${txRate} satoshis/kb and a tx with max ${maxInputs}`);
  console.log(`the tx fee should be ${maxFee} satoshis`);
};
```
This should log something like:
> Based on a rate of 10000 satoshis/kb and a tx with max 2 the tx fee should be 3380 satoshis

#### Step 6: Construct the Transaction
Now that we've got our tools and coins ready, we can start to build the transaction! Note that we are going to use the maxFee we calculated earlier and subtract it from the output we add to the mtx.

```javascript
const composeCrowdfund = async function composeCrowdfund() {
  //...

  const fundMe = new MTX();

  // add an output with the target funding amount minus the fee calculated earlier
  fundMe.addOutput({ value: fundingTarget - maxFee, address: fundeeAddress });

  // fund with first funder (using the utility we built earlier)
  let fundingCoin = funderCoins['0'][0];
  addInput(fundingCoin, 0, fundMe, funder1Keyring);

  // fund with second funder
  fundingCoin = funderCoins['1'][0];
  addInput(fundingCoin, 1, fundMe, funder2Keyring);

  // We want to confirm that total value of inputs covers the funding goal
  // NOTE: the difference goes to the miner in the form of fees
  assert(fundMe.getInputValue() >= fundMe.outputs[0].value, 'Total inputs not enough to fund');
  assert(fundMe.verify(), 'The mtx is malformed');

  const tx = fundMe.toTX();
  assert(tx.verify(fundMe.view), 'there is a problem with your tx');

  return tx;
};

composeCrowdfund().then(myCrowdfundTx => console.log(myCrowdfundTx));
```

`composeCrowdfund()` will now return a promise (thanks to async/await) that returns a fully templated transaction that can be transmitted to the network. It should have two inputs and one output equal to the funding target minus the fee. You should also notice the `SIGHASH` flag 0x81 at the end of the input scripts which confirms they are `ALL|ANYONECANPAY` scripts.