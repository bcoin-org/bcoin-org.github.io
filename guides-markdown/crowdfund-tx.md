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

### Version 1 - Manual Key Management
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
> Based on a rate of 10000 satoshis/kb and a tx with max 2 inputs, the tx fee should be 3380 satoshis

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

### Version 2: Using the Bcoin Wallet System
Since trying to manage your own keys is pretty tedious, not to mention impractical especially if you want to let other people contribute to your campaign, let's use the bcoin wallet system to take care of that part of the process. For the this example, we're going to interact via the wallet client, but you could also do something similar within a bcoin node (using the wallet and walletdb directly) which would also be more secure.

Note that this is a little more tedious to test since you need to have funded wallets in order to actually fund your campaign. You can find a bitcoin testnet faucet to get some funds to play with or, as we will do in this example, create your own simnet or regtest network where you mine your own blocks to fund yourself.

#### Step 1: Setup Our Wallets
We'll skip the setup of constants since and import modules since we can use the same from the previous example. Since there are a lot of asynchronous operations here now that we're using the client, we'll also put this in an async function and will continue to build out the contents of the function throughout this guide.

```javascript
const network = 'simnet';
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
We have the same issue to deal with here as in step 2 in the previous example: we need to have "exact change" coins available for funding. The process of splitting is a little different with the wallet system though so let's walk through this version

```javascript
const composeWalletCrowdfund = async function composeWalletCrowdfund() {
  //...

  const fundingCoins = {};

  // go through each funding wallet to prepare coins
  for(let id in funders) {
    const funder = funders[id];

    const coins = await funder.getCoins();
    const funderInfo = await funder.getInfo();

    // go through available coins to find a coin equal to or greater than value to fund

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

We now should have an object available that has the information of the coins we will be using to fund our transaction with mapped to the name of each wallet (so we can retrieve the wallet information later). It should look something like this:

```json
{
  "funder1": {
    "version": 1,
    "height": -1,
    "value": 50000000,
    "script": "76a914127cb1a40212169c49fe22d13307b18af1fa07ad88ac",
    "address": "SNykaBMuTyeUQkK8exZyymWNrnYX5vVPuY",
    "coinbase": false,
    "hash": "163068016a39e2d9c869bcdb8646dbca93e07824db39217b5c444e7c61d1a82c",
    "index": 0
  },
  "funder2": {
    "version": 1,
    "height": -1,
    "value": 50000000,
    "script": "76a9146e08c73b355e690ba0b1198d578c4c6c52b3813688ac",
    "address": "SXKossD65D7h62fhzGrntERBrPeXUfiC92",
    "coinbase": false,
    "hash": "11f3180c5069f2692f1ee1463257b21dc217441e792493c8f5ee230c35d97d96",
    "index": 0
  }
}
```

#### Step 3: Create our Crowdfund Tx
We also have to include the `getmaxFee` step as before, but we can use the same utility that we created for the other example. The way that we're funding the inputs is pretty insecure as we are sending private keys unencrypted across the network, but we'll leave for the sake of the example. **DON'T USE THIS IN PRODUCTION**.

```javascript
const composeWalletCrowdfund = async function composeWalletCrowdfund() {
  //...
  const testKey = await funders['funder1'].getWIF(fundingCoins['funder1'].address);
  const testKeyring = new bcoin.keyring.fromSecret(testKey.privateKey);
  const maxFee = getMaxFee(maxInputs, fundingCoins['funder1'], fundeeAddress.address, testKeyring, rate);

  const fundMe = new MTX();

  // Use the maxFee to calculate output value for transaction
  fundMe.addOutput({value: fundingTarget - maxFee, address: fundeeAddress.address });

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

  // Step 6: broadcast tx
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

## How to Build it Out
These examples are obviously pretty basic, but they should give you an idea of how to use Bitcoin's scripting to build out the foundation for more complex applications. Here are some ideas on how you could build on top of these examples and get closer to a production ready application.

- More flexible contribution scheme (currently it's just 2 funders that split the amount evenly). E.g. custom number of contributers, custom contribution amount, etc.
- UX to let people interact with the transaction via a browser
- More advanced interface for fee estimation and include platform for large number of funders (for example, since you may be limited to number of funders per tx, you could include interface for multiple transactions for a single campaign. You would also want to include a check to make sure your tx is not bigger than 100kb otherwise it'll get rejected by the network)
- Add a fund matching scheme where someone can say they will match future contributions
- Currently the examples split transactions to make a coin available that equals the target contribution amount. This is expensive since you have to broadcast multiple transactions. An interface to choose to donate from available available coins might help to make this more efficient.
- This approach also isn't ideal if funders have non-p2pkh outputs. Something like a multisig will be much bigger and will cause the estimated fee to be too low. One possible approach would be to shift the burden of fees on the funders, have the application calculate the size of their contribution and add the resulting fee to their funding amount. Finally, use the amount calculated (including the fee) when [splitting the coins](#step-4-prepare-your-coins). This has the added advantage of not needing to limit the number of inputs

Make sure to get in touch with us on Twitter or Slack if you build out any of these ideas!

Again, for a working example of the code (without all the text and explanations), check out [the repo on github](https://github.com/Bucko13/bitcoin-fundraise).