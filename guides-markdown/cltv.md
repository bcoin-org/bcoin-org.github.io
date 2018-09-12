# Time Locked Bitcoin Transactions w/ CLTV
```post-author
Buck Perley
```

```post-description
Learn how to make and redeem a time locked transaction using Bitcoin
scripts with bcoin. In this guide, we will have a function that
creates a script that locks a UTXO for a predetermined amount of
time as well as separately learn how to sign these types of special
inputs.
```

## What is "CLTV"?
CLTV is an op code in the Bitcoin scripting language that allows you
to lock a UTXO (Unspent Transaction Output) by time. i.e. a coin
cannot be spent until a certain time or blockchain height has been past.
In this guide, we will have a function that creates a script that
locks a UTXO for a predetermined amount of time using the CLTV op code
as well as separately learn how to sign these types of special inputs.

## Unlocking an Unspent TX Output (UTXO)
Sending funds in Bitcoin is really just about pointing to the output
of a previous transaction, making that the input for a new transaction,
and, then satisfying some locking condition on that previous output.
"Scripts" are conditions that need to be satisfied on an output to
prove ownership. You can have a Bitcoin script that is locked with the
math problem "What is 2 + 5", and anyone that knows to answer "7" can "prove"
ownership over that output (Check out this guide, [Intro To Scripting](https://bcoin.io/guides/scripting.html)
to see how to write and redeem this simple script in bcoin, and [this section](https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#a-simple-script) in Mastering Bitcoin for a helpful walkthrough).

In the vast majority of Bitcoin and other cryptocurrency transactions,
you prove ownership by signing a transaction input with the private key
(basically a password that is stored in your wallet) that corresponds to
the address that the source output was sent to. I.e. The UTXO is locked
by the requirement that some signaturemust match a public key or public key
hash that is on the execution stack.

An output that is locked with CLTV works more or less the same way but adds another
condition that before the signature is even accepted, a certain amount of
time must have passed.

In pseudo-code, the script will look like this:

```
Locktime (in blocks or Unix epoch time)
Check if locktime is less than nLocktime of transaction; execution fails if not
Check public key hash matches
Check if the signature validates
```

In Bitcoin, this locking script will look something like this:
```
<some amt of time> CHECKLOCKTIMEVERIFY DROP DUP HASH160
<Redeeming Public Key Hash> EQUALVERIFY CHECKSIG
```

To learn more about CLTV and how it works in Bitcoin, checkout [chapter 07 in
Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch07.asciidoc). See [Chapter 06](https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-scripts-and-script-language)
for more information on how the stack and scripts operate.

This guide will be broken into two parts. First we will walk through
creating and redeeming a mock transaction with no real coins. Next we will do the
same thing on a live regtest network using the bcoin wallet and API.

(If you want to see the full code, checkout the repo [here](https://github.com/bucko13/cltv))

## The Guide - Mock Transaction
Before moving on to the transaction there is some setup that will be useful
for both approaches. Note that this guide assumes use with Segwit transactions so
inputs and redeem scripts are stored in the witness field.

### Setup
Let's first setup the constants and import the modules we will need to create
and spend our transactions.

```javascript
// first the modules we will be using from bcoin
const {
  Amount,
  Coin,
  KeyRing,
  MTX,
  Network,
  Outpoint,
  Script,
  ScriptNum,
  Stack
} = require('bcoin');

// some NodeJS helpers
const fs = require('fs');
const assert = require('assert');

// a helper object with information
// about the regtest network
const network = Network.get('regtest');
```

### Creating the Script
Let's create a function that takes a locktime and a publicKeyHash
that corresponds to the private key that can redeem the transaction
and returns an object of type `Script`. This script is what will
ultimately be used to lock our UTXO, i.e. the locking script.

Note that for CLTV, the locktime can either be a block height _or_
Unix Epoch timestamp (seconds since Jan-1-1970) if above 500 million (
[See BIP-065 Specs](https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki)).

```javascript
/**
 * @param {String} locktime - Time that the script can not
 * be redeemed before
 * @param {Buffer} public key hash
 * @returns {Script}
**/
function createScript(locktime, publicKeyHash) {
  let pkh;
  if (typeof publicKeyHash === 'string')
    pkh = Buffer.from(publicKeyHash);
  else pkh = publicKeyHash;
  assert(Buffer.isBuffer(pkh), 'publicKey must be a Buffer');
  assert(
    locktime,
    'Must pass in a locktime argument, either block height or UNIX epoch time'
  );

  const script = new Script();
  // lock the transactions until
  // the locktime has been reached
  script.pushNum(ScriptNum.fromString(locktime.toString(), 10));
  // check the locktime
  script.pushSym('CHECKLOCKTIMEVERIFY');
  // if verifies, drop time from the stack
  script.pushSym('drop');
  // duplicate item on the top of the stack
  // which should be.the public key
  script.pushSym('dup');
  // hash the top item from the stack (the public key)
  script.pushSym('hash160')
  // push the hash to the top of the stack
  script.pushData(pkh);
  // confirm they match
  script.pushSym('equalverify');
  // confirm the signature matches
  script.pushSym('checksig');
  // Compile the script to its binary representation
  // (you must do this if you change something!).
  script.compile();
  return script;
}
```

This script is pretty long and could be expensive to send in a transaction.
Similar to the way multisignature transactions are typically handled,
let's create a method to embed the script into a P2WSH (Pay to Witness
Script Hash) address.

```javascript
/**
 * @param {Script} script to get corresponding address for
 * @param {Network} to determine encoding based on network
 * @returns {Address} - p2wsh segwit address for specified network
**/
function getAddress(script, network) {
  // get the hash of the script
  // and derive address from that
  const p2wsh = script.forWitness();
  const segwitAddress = p2wsh.getAddress().toBech32(network);
  return segwitAddress;
}
```

### Making the transaction
Here are the steps we'll be walking through:

1) Setup keyrings - In order to mimic spending and receiving from a wallet,
we're going to create some keyrings, which will manage the public-private
keypairs needed to generate addresses and redeem UTXOs. Typically, these
are managed by a wallet, but for the purposes of demonstration,
we'll do this manually.

2) Make the script and save it to keychain. **Note:** when making P2SH or
P2WSH scripts, you need to keep track of the script in order to redeem it later.

3) Create the P2WSH address to receive (and lock) the funds to

4) Create our fake tx that sends an output to our locking address

5) Setup our redeeming tx with the locked coin as our input, spending to
another address, and the correct locktime

6) Sign and verify the input

```javascript
// We'll use this as a reference for later.
// to get value in satoshis all you need is `amountToFund.toValue()`;
const amountToFund = Amount.fromBTC('.5');

// flags are for script and transaction verification
const flags = Script.flags.STANDARD_VERIFY_FLAGS;

// 1) Setup keyrings
const keyring = KeyRing.generate(true);
const keyring2 = KeyRing.generate(true);
// can only be redeemed after the 100th block has been mined
const locktime = '100';
keyring.witness = true;
keyring2.witness = true;

// 2) Get hash and save it to keyring
const pkh = keyring.getKeyHash();
const script = createScript(locktime, pkh);
keyring.script = script;

// 3) Create the address
const lockingAddr = getAddress(script, network);

// 4) Create our funding transaction that sends
// 50,000 satoshis to our locking address
const cb = new MTX();

cb.addInput({
  prevout: new Outpoint(),
  script: new Script(),
  sequence: 0xffffffff
});

// Send 50,000 satoshis to our locking address.
// this will lock up the funds to whoever can solve
// the CLTV script
cb.addOutput(lockingAddr, amountToFund.toValue());

// Convert the coinbase output to a Coin object
// In reality you might get these coins from a wallet.
// `fromTX` will take an output from a previous
// tx and turn it into a coin object
// (the second param is the index of the target UTXO)
const coin = Coin.fromTX(cb, 0, -1);

// 5) Setup the redeeming transaction
// Start with an empty mutable transaction
let mtx = new MTX();

// add our cb coin as the input (i.e. the "funding" UTXO)
mtx.addCoin(coin);

// get an address to send the funds from the coin to
const receiveAddr = keyring2.getAddress('string', network);

// value of the input minus arbitrary amount for fee
// normally we could do this by querying our node to estimate rate
// or use the `fund` method if we had other coins to spend with
const receiveValue = coin.value - 1000;
mtx.addOutput(receiveAddr, receiveValue);

// So now we have an mtx with the right input and output
// but our input still hasn't been signed
console.log('mtx:', mtx);
```

### Script and Sign the Inputs
We're going to create two custom methods to handle this part
since we can use it for the live transactions as well. The `MTX`
primitive in bcoin has its own version of these (see the code
[here](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/mtx.js))
but out of the box they can only handle standard transaction types.

#### scriptInput
Roughly speaking what `scriptInput` does is take the index of the input
you're scripting, the coin you're creating the input from, and
the keyring used to redeem it. It then templates the input (or witness
in this case), adding the full redeem script needed to verify the script hash
and putting OP_0 in the place of the signature.

The actual method has more checks in it to see what kind of input,
(P2PKH, P2PK, P2SH, etc.) it is scripting for.

```javascript
/* script the inputs w/ our custom script for an mtx
 * This is modeled after the scriptInput method on
 * the `MTX` class
 * @param {MTX} mtx with unscripted input
 * @param {Number} index - index of input to script
 * @param {Coin} coin- UTXO we are spending
 * @param {KeyRing} ring - keyring we are signing with
 * @returns {MTX}
*/
function scriptInput(mtx, index, coin, ring) {
  const input = mtx.inputs[index];
  const prev = coin.script;
  const wsh = prev.getWitnessScripthash();
  assert(ring instanceof KeyRing, 'Must pass a KeyRing to scriptInput');
  // this is the redeem script used to verify the p2wsh hash
  wredeem = ring.getRedeem(wsh);

  assert(wredeem, 'keyring has no redeem script');

  const vector = new Stack();

  // first add empty space in stack for signature and public key
  vector.pushInt(0);
  vector.pushInt(0);

  // add the raw redeem script to the stack
  vector.push(wredeem.toRaw());

  input.witness.fromStack(vector);
  mtx.inputs[index] = input;
  return mtx;
}
```

#### signInput
`signInput` takes the same parameters, simply verifies the input/witness,
replaces the OP_0 with a signature to satisfy the script.

This is a simplified version of the version of `signInput` that is on
the `MTX` class in bcoin.

```javascript
/* This is modeled after the signInput method on
 * the `MTX` class
 * @param {MTX} mtx with unscripted input
 * @param {Number} index - index of input to script
 * @param {Coin} coin- UTXO we are spending
 * @param {KeyRing} ring - keyring we are signing with
 * @returns {MTX}
*/
function signInput(mtx, index, coin, ring) {
  const input = mtx.inputs[index];
  let witness, version;

  const redeem = input.witness.getRedeem();

  assert(
    redeem,
    'Witness has not been templated'
  );

  witness = input.witness;
  // version is for the signing to indicate signature hash version
  // 0=legacy, 1=segwit
  version = 1;

  const stack = witness.toStack();
  // let's get the signature and replace the placeholder
  // in the stack. We can use the MTX `signature` method
  const sig =
    mtx.signature(
      index,
      wredeem,
      coin.value,
      ring.privateKey,
      null,
      version
    );
  stack.setData(0, sig);

  stack.setData(1, ring.getPublicKey());
  witness.fromStack(stack);
  return mtx;
}
```

Now that we can script and sign, let's finish off the transaction!
In addition to signing, we also need to set the nLocktime parameter
of the transaction. In a live blockchain environment this will be
checked against the current state of the chain in the mempool. So,
a transaction with an nLocktime later than the current block height
or time, will be rejected as invalid.

```javascript
mtx = scriptInput(mtx, 0, coin, keyring);
mtx = signInput(mtx, 0, coin, keyring);

// Now set the locktime
// You can test if the CLTV script is working or not
// by changing this to a value less than what our script requires
// which will cause the `mtx.verify` call to fail below
mtx.setLocktime(parseInt(locktime));

// if you console log the input being signed,
// you'll notice it now has a witness stack and redeem script
// before script, witness, and redeem were empty
console.log('signed mtx:', mtx);
assert(mtx.verify(flags), 'mtx did not verify');

// make tx immutable
const tx = mtx.toTX();

// it should still verify (need mtx's coin view to verify tx)
assert(tx.verify(mtx.view), 'tx did not verify');
console.log('Transaction verified!');
```

## A Live CLTV Transaction
Let's test this on a regtest network that way we can easily
mine our own blocks to verify whether or not everything is working.

Some of the key differences doing this live:

1) We need to use real UTXOs/Coins

2) We need to manually keep track of the redeem script

3) We will interact with the REST API for signing
of our transaction

4) We will need to check against the real height of
a blockchain in order to redeem

First we're going to need to setup our bcoin clients so we can talk
to our node and wallet. Make sure you have
[bclient installed](https://www.npmjs.com/package/bclient).

```javascript
// make sure you've installed bclient to your project
// `npm install --save bclient`
const { WalletClient, NodeClient } = require('bclient');
const network = Network.get('regtest');

// if your node needs an API key for access
// you can import it like this for use in setting up your client
const apiKey = fs.readFileSync('./secrets.env');
const clientOptions = {
  network: network.type,
  apiKey: apiKey.toString()
}
const walletClient = new WalletClient({...clientOptions, port: network.walletPort});
const nodeClient = new NodeClient({ ...clientOptions, port: network.rpcPort });
```

Since the bcoin wallet doesn't natively support CLTV coins,
we're going to implement our own naive persistent storage so that
we can keep a reference to the redeem script, locking address (P2WSH address),
locktime, and the redeem address. We'll do this by saving this information
to a json object in a separate text file.

For this portion of the code, we're going to have two evaluation branches.
We'll first check if we have this file with information saved to it. If we don't,
then we need to make the locking transaction. If we do, then we check if the current
block height meets the locktime requirement (saved in our document) and
create, sign, and broadcast our redeeming transaction


```javascript
async function lockAndRedeemCLTV(walletId) {
  try {
    const txInfoPath = './tx-info.json'; // this is where we'll persist our info
    const wallet = walletClient.wallet(walletId); // instantiate a client for our wallet

    let redeemScript, lockingAddr, locktime;

    // check if file exists and if there is info saved to it
    let txInfo = fs.existsSync(txInfoPath) ? fs.readFileSync(txInfoPath) : '';
    if (!txInfo.length) {
      // No saved transaction, so let's create it and then
      // save the information for later

      // Step 1: Setup wallet client and confirm balance
      const { balance } = await wallet.getInfo();
      assert(balance.confirmed > amountToFund.toValue(), 'Not enough funds!');

      // Step 2: Setup keyring w/ pkh and create locking address
      // that can be redeemed by our real wallet after a set locktime
      const { publicKey, address } = await wallet.createAddress('default');

      // create the keyring from the public key
      // and get the public key hash for the locking script
      const keyring = KeyRing.fromKey(Buffer.from(publicKey, 'hex'), true);
      keyring.witness = true;
      const pkh = keyring.getKeyHash();

      // Get current height and set locktime to 10 blocks from now
      const { chain: { height }} = await nodeClient.getInfo();
      locktime = height + 10;

      // create the script and address that can be redeemed by our wallet
      redeemScript = createScript(locktime.toString(), pkh);
      lockingAddr = getAddress(redeemScript, network);

      // Step 3: use the wallet client to send funds to the locking address
      const output = {
        value: amountToFund.toValue(),
        address: lockingAddr
      };

      const lockedTx = await wallet.send({ outputs: [output], rate: 7000 });
      console.log('transaction sent to mempool');

      // save the transaction information to to a file
      txInfo = { lockedTx, lockingAddr, redeemScript, locktime, redeemAddress: address };
      fs.writeFileSync(txInfoPath, JSON.stringify(txInfo, null, 2));

      // mine one block to get tx on chain
      // make sure you're doing this on regtest or simnet and
      // not testnet or mainnet
      // this method won't work if you don't have a
      // coinbase address set on your miner
      // you can also use bPanel and the @bpanel/simple-mining
      // plugin to do this instead
      const minedBlock = await nodeClient.execute('generate', [1]);
      console.log('Block mined', minedBlock);
    } else {
      // if the txInfo file exists then we know we have a locked tx
      // so let's get the information we need to start redeeming!
      const {
        lockedTx,
        lockingAddr,
        redeemScript,
        locktime,
        redeemAddress
      } = JSON.parse(txInfo);

      // 1) let's get the current block height to check if we can actually redeem
      const { chain: { height }} = await nodeClient.getInfo();

      // in reality this could be block height or Unix epoch time
      assert(locktime <= height, `Too soon to redeem the UTXO. Wait until block ${locktime}`);

      // Our locktime is less than or equal to height which means we can redeem

      // 2) Prepare redeeming tx

      // get index of utxo
      const index = lockedTx.outputs.findIndex(
        output => output.address === lockingAddr
      );

      // get the coin associated with our locked tx
      // indicating the index of the UTXO
      const coinJSON = await nodeClient.getCoin(lockedTx.hash, index);

      // create a new coin object that references the UTXO we want to spend
      // and add it as an input to a blank mutable transaction
      const coin = Coin.fromJSON(coinJSON);
      let mtx = new MTX();
      mtx.addCoin(coin);

      // For simplicity we'll redeem the locked tx to ourselves
      // But if you have another wallet that might be easier
      // since you can see the change in balance more easily
      const { address } = await wallet.createAddress('default');
      // send to the address the value of the coin minus the fee
      mtx.addOutput(address, coin.value - 1500);

      // set nLocktime field on transaction
      // mempool and chain will check against this
      // to verify finality for each input
      mtx.setLocktime(height);

      // 3) Setup a keyring to use for signing the input

      // First get the script from our saved tx info
      const script = Script.fromRaw(redeemScript, 'hex');

      // Next we'll get the private key associated with the pkh
      // that the timelocked UTXO is locked to
      // Note it's generally not safe to transfer your private key
      // unencrypted over the network like this, but we're doing it
      // here for simplicity
      const { privateKey } = await wallet.getWIF(redeemAddress);
      const ring = KeyRing.fromSecret(privateKey, network);
      ring.witness = true;
      ring.script= script;

      // 4) Script and sign the input
      // Note that we can use the same methods as in the mock transaction
      mtx = scriptInput(mtx, index, coin, ring);
      mtx = signInput(mtx, index, coin, ring);

      // 5) Verify and broadcast the tx
      // Note that the `verify` won't check against current height
      // of the blockchain and the node won't reject the tx but will
      // still try and broadcast (you can check your node logs for
      // mempool verification errors)
      assert(mtx.verify(), 'MTX did not verify');
      const tx = mtx.toTX();
      assert(tx.verify(mtx.view), 'TX did not verify');
      const raw = tx.toRaw().toString('hex');

      // now we've got a signed raw transaction that we can broadcast to the network!
      const result = await nodeClient.broadcast(raw);
      assert(result.success, 'There was a problem broadcasting the tx');

      // confirm the tx is in the mempool
      // we need to do this because even if the mempool says there is a problem
      // with your transaction, it will try and broadcast anyway
      // and result will come back with `success: true`. If it made it into the
      // mempool and/or chain and can be queried then you know it was successful
      const txFromHash = await nodeClient.getTX(tx.rhash());
      assert(txFromHash, 'The tx does not appear to be in the mempool or chain');
      console.log('Success!');
      console.log('Tx: ', tx);

      // if it was successful then we can clear our saved tx info since it is now
      // obsolete. Clearing this will re-enable the first evaluation branch above
      fs.writeFileSync(txInfoPath, '');
    }

  } catch(e) {
    console.error('There was an error with live solution:', e);
  }
};
```

Now you can run `lockAndRedeemCLTV` once to send the CLTV transaction and again to redeem it
on a live Regtest network! Feel free to play around with the different values to see how it works.
You can use different wallets, change the locktime, or change the redeem amount. Take a look
at the JSON file that is saved after creating the transaction to see what the raw information looks
like that is needed for redeeming.

## Next Steps
What we built in this guide is basically a very basic smart contract that locks funds for
a certain amount of time. This example though can serve as a building block for much more complicated
scripts and contracts. Here are some ideas of other things you can build with CLTV transactions:

- **[Hashed Time Locked Contracts](https://en.bitcoin.it/wiki/Hashed_Timelock_Contracts)**-
Aka HTLCs. These are a key part of enabling trustless payment channels in the Lightning Network and
have the time locked script we built here at its base.

- **Kill Switch Transaction**- You can create an application that uses CLTVs to enforce the condition
where if some action isn't taken every 6 months (such as pressing a button or sending an email),
a transaction will send all your funds to a multisig address controlled by your estate. You can use a version
of an HTLC to either redeem the tx with your own key or redeem with the multisig account after the time
period. When you take the action, it redeems with your key.

- **Authorization Levels by Time Lock**- This idea comes from the [Advanced Scripting
chapter](https://twitter.com/Bcoin/status/1000098072490262528) in Mastering Bitcoin. The rules of the
transaction would follow this basic structure: "[T]hree partners make decisions based on a majority rule,
so two of the three must agree. However, in the case of a problem with their keys, they want their lawyer
to be able to recover the funds with one of the three partner signatures. Finally, if all partners are
unavailable or incapacitated for a while, they want the lawyer to be able to manage the account directly."
You can see why they're called Smart **Contracts**!
