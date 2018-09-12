# Create a Crowdfunding Transaction
```post-author
Buck Perley
```

```post-description
Learn how SIGHASH flags work in Bitcoin by building out a custom crowdfunding transaction that lets anyone add their own inputs to a transaction with a fixed output.
```

## SIGHASH Flags
In most Bitcoin transactions, when a transaction is signed, the entirety of the data in that transaction is committed to in that input's signature, with all outputs and inputs being included in the unlocking script. This, however, doesn't always have to be the case. The level of commitment is indicated by using `SIGHASH` flags. The most common flag is `SIGHASH_ALL` which has a value of 0x01 (you'll see this represented as a `01` at the end of DER-encoded signatures). To learn more about how the flags work and what other options are available, you should checkout [Chapter 6](https://github.com/bitcoinbook/bitcoinbook/blob/8d01749bcf45f69f36cf23606bbbf3f0bd540db3/ch06.asciidoc) of *Mastering Bitcoin* by Andreas Antonopolous. In that chapter, Andreas posits one novel use of a specialized flag, `ALL|ANYONECANPAY`, and in this guide we'll try and build out a couple of examples implementing this idea using bcoin.

## How it Works
The `ALL|ANYONECANPAY` flag indicates that a signature is committing all of the outputs and just one input. The suggested use case of this proposed in *Mastering Bitcoin* is a kickstarter-like crowdfunding application. Consider the situation where you have a fundraising goal, say 1BTC. You'd like multiple people to contribute to your goal and you want to prove to them that they won't have to pay *unless* you reach your goal (i.e. the transaction is invalid and won't be accepted by the network if attempted to be sent). This means you'd be committing to one output, the one that sends the funds to the charity or project you'd like to donate to, and only one input, your contribution. This allows multiple users to contribute to the same transaction and that transaction won't be valid until it's fully funded.

Here's how it's explained in *Mastering Bitcoin*:
> ALL|ANYONECANPAY  
This construction can be used to make a "crowdfunding”-style transaction. Someone attempting to raise funds can construct a transaction with a single output. The single output pays the "goal" amount to the fundraiser. Such a transaction is obviously not valid, as it has no inputs. However, others can now amend it by adding an input of their own, as a donation. They sign their own input with ALL|ANYONECANPAY. Unless enough inputs are gathered to reach the value of the output, the transaction is invalid. Each donation is a "pledge," which cannot be collected by the fundraiser until the entire goal amount is raised.

## The Code
We'll walk through the steps of creating the transaction first without any wallet database or node running. Then we'll do the same thing using bcoin's walletdb to manage the keys to see how it would work in a more realistic application (skip to [Version 2](#version-2-using-the-bcoin-wallet-system)) further in the guide to check it out). At the end, we'll put out some ideas of how these can be built upon for a more robust, production ready application. (If this is something you'd be interested in building, [get in touch](https://bcoin.io/slack-signup.html)!). If you want to see the code, checkout the [repo on github](https://github.com/Bucko13/bitcoin-fundraise).

If you're not comfortable with key management, coin selection, and how transactions are constructed, checkout the tutorial on [working with transactions](https://bcoin.io/guides/working-with-txs.html) first.

### Version 1 - Manual Key Management
#### Step 1: Setup
Let's first start by importing the right tools, setting up some constants, and creating our keychains. (make sure you've installed the latest version of bcoin into your project with `npm install bcoin`).

Note that we're setting the fundingTarget and amountToFund as constants for simplicity, but they could be set based on user input or some other variable circumstances.

```javascript
'use strict';

const assert = require('assert');
const bcoin = require('bcoin');

const MTX = bcoin.MTX;
const Keyring = bcoin.wallet.WalletKey;
const Outpoint = bcoin.Outpoint;
const Script = bcoin.Script;
const Coin = bcoin.Coin;
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

#### Step 3: Prepare your Coins
Above, we just funded our funder accounts with a single 5BTC outpoint. This means that the next transaction funded from these accounts can only use that one outpoint (or *coin*) as an input and send the remainder back as change. Remember, in Bitcoin the way you send funds is you fund a transaction with a full UTXO (in this case we only have one worth 5BTC available to our keychains) and then send the change back to yourself as an additional output. Since ALL|ANYONECANPAY transactions mean a fixed output, you can't add new change outputs without other signatures becoming invalid which means we need a coin available equal to the amount we want to contribute to the crowdfund.

So what we want to do is have each funder create a coin (UTXO) with the value of what they want to donate.

The first thing we need to do make this work is calculate what the input will be. In our examples we are assuming that the funders cover the fee. Since different keyrings can be using different transaction types of different sizes (p2sh, multisig, etc.), we need a utility to calculate how much the fee should be for that input and add that to the amount to fund with.

##### Utility functions
We'll need some utility functions to help us out. It's nice to split these out separate from our main operations since we'll actually be reusing some of the functionality.

Before we build out the tools to calculate fees and split coins, we'll need a utility for composing the inputs for txs that we'll use for our mock transactions in the fee calculator and later for templating our real transaction

```javascript
const addInput = function addInput(coin, inputIndex, mtx, keyring, hashType) {
  const sampleCoin = coin instanceof Coin ? coin : Coin.fromJSON(coin);
  if(!hashType) hashType = Script.hashType.ANYONECANPAY | Script.hashType.ALL;

  mtx.addCoin(sampleCoin);
  mtx.scriptInput(inputIndex, sampleCoin, keyring);
  mtx.signInput(inputIndex, sampleCoin, keyring, hashType);
  assert(mtx.isSigned(), 'Input was not signed properly');
}
```

Now let's build the utility for calculating the fee for a single input of unknown type or size

```javascript
const getFeeForInput = function getFeeForInput(coin, address, keyring, rate) {
  const fundingTarget = 100000000; // 1 BTC (arbitrary for purposes of this function)
  const testMTX = new MTX();

  // we're not actually going to use this tx for anything other than calculate what fee should be
  addInput(coin, 0, testMTX, keyring);

  return testMTX.getMinFee(null, rate);
}
```

Our last utility is an asyncronous function to help us split the coinbases we created in the previous step (we use the `fund` method on the `MTX` primitive to do this, which is asynchronous).

```javascript
const splitCoinbase = async function splitCoinbase(funderKeyring, coin, targetAmount, txRate) {
  // loop through each coinbase coin to split
  let coins = [];

  const mtx = new MTX();

  assert(coin.value > targetAmount, 'coin value is not enough!');

  // creating a transaction that will have an output equal to what we want to fund
  mtx.addOutput({
    address: funderKeyring.getAddress(),
    value: targetAmount
  });

  // the fund method will automatically split
  // the remaining funds to the change address
  // Note that in a real application these splitting transactions will also
  // have to be broadcast to the network
  await mtx.fund([coin], {
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
      coins.push(Coin.fromTX(tx, index, -1));
    });
  })
  .catch(e => console.log('There was an error: ', e));

  return coins;
};

```

Because of the async methods being used, in order to take advantage of the async/await structure, the rest of the code will be enclosed in an async function.

The first thing we'll do is split the coinbase coins we created earlier using the utility function we just built (we'll also have to calculate the fee and add it to the funding amount in order to get an output of the right value).

```javascript
const composeCrowdfund = async function composeCrowdfund(coins) {
  const funderCoins = {};
  // Loop through each coinbase
  for (let index in coins) {
    const coinbase = coins[index][0];
    // estimate fee for each coin (assuming their split coins will use same tx type)
    const estimatedFee = getFeeForInput(coinbase, fundeeAddress, funders[index], txRate);
    const targetPlusFee = amountToFund + estimatedFee;

    // split the coinbase with targetAmount plus estimated fee
    const splitCoins = await Utils.splitCoinbase(funders[index], coinbase, targetPlusFee, txRate);

    // add to funderCoins object with returned coins from splitCoinbase being value,
    // and index being the key
    funderCoins[index] = splitCoins;
  }
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
        "value": "0.5000157"
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

#### Step 4: Construct the Transaction
Now that we've got our tools and coins ready, we can start to build the transaction!

```javascript
const composeCrowdfund = async function composeCrowdfund(coins) {
  //...

  const fundMe = new MTX();

  // add an output with the target funding amount

  fundMe.addOutput({ value: fundingTarget, address: fundeeAddress });

  // fund with first funder
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
  console.log('total input value = ', fundMe.getInputValue());
  console.log('Fee getting sent to miners:', fundMe.getInputValue() - fundingTarget, 'satoshis');

  assert(tx.verify(fundMe.view), 'there is a problem with your tx');

  return tx;
};

composeCrowdfund(coins).then(myCrowdfundTx => console.log(myCrowdfundTx));
```

`composeCrowdfund` will now return a promise (thanks to async/await) that returns a fully templated transaction that can be transmitted to the network. It should have two inputs and one output with a value of 1. The inputs will have a value equal to the amount to fund plus the cost of the fee. You should also notice the `SIGHASH` flag 0x81 at the end of the input scripts which confirms they are `ALL|ANYONECANPAY` scripts.

### Version 2: Using the Bcoin Wallet System
Since trying to manage your own keys is pretty tedious, not to mention impractical especially if you want to let other people contribute to your campaign, let's use the bcoin wallet system to take care of that part of the process. For the this example, we're going to interact via the wallet client, but you could also do something similar within a bcoin node (using the wallet and walletdb directly) which would also be more secure.

Note that this is a little more tedious to test since you need to have funded wallets in order to actually fund your campaign. You can find a bitcoin testnet faucet to get some funds to play with or, as we will do in this example, create your own simnet or regtest network where you mine your own blocks to fund yourself.

#### Step 1: Setup Our Wallets
We'll skip the setup of constants import modules since we can use the same from the previous example. Since there are a lot of asynchronous operations here now that we're using the client, we'll also put this in an async function and will continue to build out the contents of the function throughout this guide. We'll also be using some of the same [utility functions that we created in the last example](#utility-functions).

```javascript
const network = 'regtest';
const composeWalletCrowdfund = async function composeWalletCrowdfund() {
  const client = await new bcoin.http.Client({ network });

  // Step 1: Setup our wallets and funding targets
  const fundeeWallet = await new httpWallet({ id: 'fundee', network });
  const fundeeAddress = await fundeeWallet.createAddress('default');
  const funders = {
    'funder1': await new httpWallet({ id: 'funder1', network }),
    'funder2': await new httpWallet({ id: 'funder2', network })
  };
  //...
}
```

#### Step 2: Prepare Your Coins
We have the same issue to deal with here as in step 2 in the previous example: we need to have "exact change" coins available for funding. The process of splitting is a little different with the wallet system though so let's walk through this version.

Note that the way that we're retrieving the keyring information is pretty insecure as we are sending private keys unencrypted across the network, but we'll leave for the sake of the example. **DON'T USE THIS IN PRODUCTION**.

```javascript
const composeWalletCrowdfund = async function composeWalletCrowdfund() {
  //...

  const fundingCoins = {};

  // go through each funding wallet to prepare coins
  for(let id in funders) {
    const funder = funders[id];

    const coins = await funder.getCoins();
    const funderInfo = await funder.getInfo();

    // Before we do anything we need to get
    // the fee that will be necessary for each funder's input.
    const funderKey = await funder.getWIF(coins[0].address);
    const funderKeyring = new bcoin.keyring.fromSecret(funderKey.privateKey);
    const feeForInput = Utils.getFeeForInput(coins[0], fundeeAddress.address, funderKeyring, rate);
    amountToFund += feeForInput;

    // Next, go through available coins
    // to find a coin equal to or greater than value to fund

    // We didn't do this before because we knew what coins were available. But if we have one already in our wallets, then we can just use that!
    let fundingCoin = {};
    for(let coin of coins) {
      if (coin.value === amountToFund) {
        // if we already have a coin of the right value we can use that
        fundingCoin = coin;
        break;
      }
    }

    if (!Object.keys(fundingCoin).length) {
      // if we don't have a coin of the right amount to fund with
      // we need to create one by sending the funder wallet
      // a tx that includes an output of the right amount

      // this is similar to what we did in the manual version
      const receiveAddress = await funder.createAddress('default') // send it back to the funder
      const tx = await funder.send({
        rate,
        outputs: [{
          value: amountToFund,
          address: receiveAddress.address
        }]
      });

      // get index of ouput for fundingCoin
      let coinIndex;
      for (let i=0; i < tx.outputs.length; i++) {
        if (tx.outputs[i].value === amountToFund) {
          coinIndex = i;
          break;
        }
      }

      assert(tx.outputs[coinIndex].value === amountToFund, 'value of output at index not correct');

      // first argument is for the account
      // default is being used for all examples
      fundingCoin = await funder.getCoin('default', tx.hash, coinIndex);
    }
    fundingCoins[funder.id] = fundingCoin;
  }
}
```

We now should have an object available that has the information of the coins we will be using to fund our transaction with mapped to the name of each wallet (so we can retrieve the wallet information later). It should look something like this (note that the values are larger than our funding amount due to the fee):

```json
{
  "funder1": {
    "version": 1,
    "height": -1,
    "value": 50002370,
    "script": "76a914127cb1a40212169c49fe22d13307b18af1fa07ad88ac",
    "address": "SNykaBMuTyeUQkK8exZyymWNrnYX5vVPuY",
    "coinbase": false,
    "hash": "163068016a39e2d9c869bcdb8646dbca93e07824db39217b5c444e7c61d1a82c",
    "index": 0
  },
  "funder2": {
    "version": 1,
    "height": -1,
    "value": 50002370,
    "script": "76a9146e08c73b355e690ba0b1198d578c4c6c52b3813688ac",
    "address": "SXKossD65D7h62fhzGrntERBrPeXUfiC92",
    "coinbase": false,
    "hash": "11f3180c5069f2692f1ee1463257b21dc217441e792493c8f5ee230c35d97d96",
    "index": 0
  }
}
```

#### Step 3: Create our Crowdfund Tx
Now that we have our coins ready we can start to template the transaction!

Please note again that the way we are funding the transactions is by sending our private keys unencrypted across the network so don't use this in production.

```javascript
const composeWalletCrowdfund = async function composeWalletCrowdfund() {
  //...
  const fundMe = new MTX();

  // Use the maxFee to calculate output value for transaction
  fundMe.addOutput({value: fundingTarget, address: fundeeAddress.address });

  // go through our coins and add each as an input in our transaction
  let inputCounter = 0;
  for(let funder in fundingCoins) {
    const wallet = funders[funder];
    const coinOptions = fundingCoins[funder];

    const key = await wallet.getWIF(coinOptions.address);
    const keyring = new bcoin.keyring.fromSecret(key.privateKey);

    // this is the same utility as we used in our other example
    addInput(coinOptions, inputCounter, fundMe, keyring);
    assert(fundMe.isSigned(), 'Input has not been signed correctly');
    inputCounter++;
  }

  // confirm that the transaction has been properly templated and signed
  assert(
    fundMe.inputs.length === Object.keys(funders).length,
    'Number of inputs in MTX is incorrect'
  );
  assert(fundMe.verify(), 'MTX is malformed');

  // make our transaction immutable so we can send it to th enetwork
  const tx = fundMe.toTX();

  assert(tx.verify(fundMe.view), 'TX is malformed. Fix before broadcasting');

  // check the value of our inputs just to confirm what the fees are
  console.log('Total value of inputs: ', fundMe.getInputValue() );
  console.log('Fee to go to miners: ', fundMe.getInputValue() - fundingTarget);

  // Finally, broadcast tx
  try {
    const broadcastStatus = await client.broadcast(tx);
    return tx;
  } catch (e) {
    console.log('There was a problem: ', e);
  }
}
composeWalletCrowdfund()
  .then(myCrowdfundTx => console.log('Transaction broadcast: ', myCrowdfundTx))
  .catch(e => console.log('There was a problem: ', e));
```

And there you have it! If you were doing this on testnet, your `fundeeWallet` should now be 1BTC richer. If you're on a simnet or regtest network, you'll have to mine a block with your transactions to get those funds confirmed. Also note that, unless you have exact change coins, there will be 3 transactions that need to be confirmed: one each for the wallets that are splitting coins, and one for the crowdfund transaction.

## How to Extend and Improve
These examples are obviously pretty basic, but they should give you an idea of how to use Bitcoin's scripting to build out the foundation for more complex applications. Here are some ideas on how you could build on top of these examples and get closer to a production ready application.

- More flexible contribution scheme (currently it's just 2 funders that split the amount evenly). E.g. custom number of contributers, custom contribution amount, etc.
- UX to let people interact with the transaction via a browser
- More advanced interface for fee estimation and include platform for large number of funders (for example, since you may be limited to number of funders per tx, you could include interface for multiple transactions for a single campaign. You would also want to include a check to make sure your tx is not bigger than 100kb otherwise it'll get rejected by the network)
- Add a fund matching scheme where someone can say they will match future contributions
- Currently the examples split transactions to make a coin available that equals the target contribution amount. This is expensive since you have to broadcast multiple transactions. An interface to choose to donate from available available coins might help to make this more efficient.

Make sure to get in touch with us on Twitter or Slack if you build out any of these ideas!

Again, for a working example of the code (without all the text and explanations), check out [the repo on github](https://github.com/Bucko13/bitcoin-fundraise).
