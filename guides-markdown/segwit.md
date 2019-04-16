# Segwit and Bcoin

```post-author
Nodar Chkuaselidze
```

```post-description
What is segwit, how to use segwit with bcoin and what are the updates
```

Following guide will introduce you to Segwit, its changes and how to fully employ all these changes with bcoin.

## What is Segwit and What Does it Solve?
Segwit was first proposed as a [TX malleability][tx-malleability] fix. Miners and Full nodes in charge
of relaying or including transaction in blocks could change transaction hash and broadcast a modified version
without invalidating the transaction. This prevented sidechains and some applications
to be built on top of bitcoin blockchain (Lightning Network).
For a full list of malleability sources see [BIP62 (Withdrawn)][BIP62].  
Segwit solves this by removing validating sigScripts (also known as "witnesses") from the transaction and constructing another merkle tree
for these scripts. The witnesses are also not counted towards from block size calculations as they
aren't broadcasted with the block, leaving space for more transactions with the same
block size limit (which needs a hard fork to implement). In order to make this update a soft fork, and thus safer to deploy, instead of adding the merkle root into the
block, it's included in coinbase transaction.  
Another benefit it brings is future possible soft forks for Script updates.  
For backwards compatibility, you can nest witness programs in [P2SH][BIP16]. This allows old, unupdated nodes to still see a Segwit transaction as a valid (but ANYONECANSPEND) transaction ensuring it will get propogated in the network.

> Witness - this structure contains data required to check transaction validity but not required to determine transaction effects. In particular, scripts and signatures are moved into this new structure.  
> BIP141


## Witness Programs
You can check details in [Segwit BIP][BIP141], we'll cover them as we go for our examples.
In segwit addresses/scriptPubKeys, the first byte is the `version byte`, which will be used
for extending scripts with new functionalities. Currently version `0` is used and supports
`P2WPKH` (Pay To Witness Public Key Hash) and `P2WSH` (Pay To Witness Script Hash) transactions. After `OP_0` version byte, we expect a hash with a size
of `20` in the case of `P2WPKH` transactions or `32` in the case of `P2WSH` transactions.  
scriptPubKeys:
  - `P2WPKH` scriptPubkey is `OP_0 0x14 {20-byte-hash}`, where `OP_0` is the *version byte*
*0x14* is the size of the data, and the `{20-byte-hash}` is HASH160(PubKey).
  - `P2WSH` scriptPubkey is `OP_0 0x20 {32-byte-hash}`, where `OP_0` is the *version byte*
*0x20* is the size of the data, and the `{32-byte-hash}` is SHA256(script).
Note: These witness programs aren't executed right away, they are stacks and are used
to construct the scripts for verification.

When nesting witness programs inside *P2SH*, you will take the witness program (stack) and hash it, as you would
have done with normal scripts.

Native Segwit programs also come with a new address format [bech32][BIP173], so `P2WPKH` and `P2WSH` scripts
will always use `bech32` addresses. Bech32 addresses support error checking and are comprised of 4 parts:
`human-readable-part(hrp)`, `version number`, `data` and `checksum`. HRP is used for indicating the network:
`bc` for `mainnet` and `tb` for the `testnet` separated by `1` followed by data and the checksum. 

## Code

You can see the full code used in the examples below in a separate [repo][guide-repo].

You will notice, that the bcoin API doesn't change much between different transaction types. Also
most of the ring management is the same so we'll discuss them first.
*Note: We'll be using `regtest` network for our code.*

### Common Parts

The most important part in our examples will be `KeyRing`s. They store and manage keys and also provide
every method needed to handle scripts and signatures. That's why we've separated `keyring` into a separate
utils folder which will cache the `privateKey`s in a folder `keys/`. We only expose `.getRings` method,
which will generate or return from cache `N` number of keys.  
After importing we always set `ring.witness = true`, because by default it's false. This
will tell `KeyRing` to construct P2WPKH addresses instead of P2PKH and vice versa. 

*Note: Segwit only uses Compressed public keys.*

The code for this, which should precede all of the following examples, looks like:

```js
const network = 'regtest';
const ring = bcoin.keyring.generate(true, network);
ring.witness = true;
```

## Creating Segwit Addresses

### Create P2WPKH Address

Getting `P2WPKH` Address is as simple as `ring.getAddress();`. Let's see it
in action.  
The code below will print the bech32 address and check if bech32 address data
is Pubkeyhash.


```js
let address = ring.getAddress();

// Will print bech32 address
console.log('Address from ring:', address.toString());

// Grab the pubkeyhash from ring.
const pubkeyhash = ring.getKeyHash('hex');

// Here we can inspect generated bech32 address
// and see that pubkeyhash is included there.
const decodedAddress = bech32.decode(address.toString());

assert(decodedAddress.hrp === 'rb'); // rb for regtest
assert(decodedAddress.version === 0); // Segwit program version
assert(decodedAddress.hash.toString('hex') === pubkeyhash); // 20 byte Pubkeyhash
```

We could also assemble this code manually using `Script`.

```js
let p2wpkhScript = new Script();
p2wpkhScript.pushOp(opcodes.OP_0); // Push Segwit Version
p2wpkhScript.pushData(ring.getKeyHash()); // Push Pubkeyhash
p2wpkhScript.compile(); // Encode the script internally

address = p2wpkhScript.getAddress();
console.log('Address from script:', address.toString(network));
```
Here you can see inner workings of the P2WPKH script, but obviously it's not convenient.

The equvalent script can be generated with helper function too.
```js
p2wpkhScript = Script.fromProgram(0, ring.getKeyHash());
address = p2wpkhScript.getAddress();
console.log('Address from Script/Program:', address.toString(network));
```

We won't cover manual scripts in the next examples, but the process is similar
and can be created using the same API.

### Create P2WSH Address

In this code example, we'll create a Multisig/P2WSH address. This process
is similar to the [multisig][multisig-guide], the only difference is the output address we'll get.

We'll need two public keys, so we grab two rings from the cache
```js
const [ring, ring2] = ringUtils.getRings(2, network);

ring.witness = true;
ring2.witness = true;
```

Then create multisig script
```js
const pubkeys = [ring.publicKey, ring2.publicKey];
const multisigScript = Script.fromMultisig(1, 2, pubkeys);
```

Now we can pass the multisig script to the ring (which already knows it needs to generate segwit address).
*Note: If the ring has a script property assigned, it will automatically return a P2SH or P2WSH address.*

```js
ring.script = multisigScript;
const address = ring.getAddress();

console.log('Address from ring:', address.toString());
```

Now bech32 address should contain `version byte = 0` and 32 byte long `hash` for script.

```js
const decodedAddress = bech32.decode(address.toString());

// data in bech32 should be SHA256(script)
assert(decodedAddress.hash.equals(multisigScript.sha256()));
```

### Create P2SH-P2WPKH Address

Old clients on bitcoin network won't be able to send coins to bech32 addresses,
they know neither bech32 address nor segwit format. To overcome that limitation
we nest segwit programs in P2SH. With bcoin you can achieve this pretty simply:

```js
const ringUtils = require('./utils/keys');

const network = 'regtest';
const [ring] = ringUtils.getRings(1, network);

ring.witness = true;

// Generates Witness program which will redeem
// the P2SH script.
const address = ring.getNestedAddress();

console.log('Nested Address:', address.toString());
```

Transactions sent to this address first will be redeemed as a P2SH
and then redeem script (Witness program) will be retrieved and then it will continue
executing as a P2WPKH.

### Create P2SH-P2WSH Address

Nested address is also defined for P2WSH programs. With this
example we'll create a multisig inside a P2WSH inside a P2SH...
The code is the same for P2SH-P2WSH as for P2WSH, where the only difference is address
generation.
```js
const pubkeys = [ring.publicKey, ring2.publicKey];
const multisigScript = Script.fromMultisig(1, 2, pubkeys);

ring.script = multisigScript;

// This will return nested hash -> nested address
// legacy base58.
const address = ring.getNestedAddress();

console.log('Address from ring:', address.toString());
```
## Spending from Segwit Addresses

All legacy transactions need to be signed with a scriptSig, which are also included in a
transaction and therefore in the blocks that mine them. When using segwit addresses we won't use the same
space for putting our signatures, so the scriptSig of inputs won't contain anything (Unless it's nested in P2SH).
Instead, they will be appended to witness stack.

Spending from segwit addresses is as simple as it is for regular addresses with the bcoin API.
It will automatically allocate coins, construct scripts and sign the transaction for us.
We will use `MTX.fund` for automatically generating change output.

To create and sign transactions "offline"(without going to chain db), we'll need:
`prevTransaction Hash/Id`, `prevTransaction Vout/Index`, `Amount` and `Script`(which
can be constructed from Address).

### Spend from P2WPKH 
When you're spending from P2WPKH you need to put 2 things in the Segwit stack: Signature
and Public key. Bcoin will handle that for us.

First let's grab the address, where we received transaction
```js
const [ring] = ringUtils.getRings(1, network);
ring.witness = true;

const address = ring.getAddress();
```

We need go gather information about the transaction we are spending from and
the address we sent money to.

```js
const Amount = bcoin.amount;
const Script = bcoin.script;
const Coin = bcoin.coin;
const revHex = bcoin.util.revHex;

// ...

const sendTo = 'RTJCrETrS6m1otqXRRxkGCReRpbGzabDRi';
const txhash = revHex('88885ac82ab0b61e909755e7f64f2deeedb89c83'
                    + '3b68242da7de98c0934e1143');
const txinfo = {
  // prevout
  hash: txhash,
  index: 1,

  value: Amount.fromBTC('200').toValue(),
  script: Script.fromAddress(address)
};

const coin = Coin.fromOptions(txinfo);
```

We use revHex to convert Big Endian (BE) to Little Endian (LE) ([Endianness][endianness]).
Coin is used for working with UTXOs and contains
information about the previous output. Coin will later be used
in MTX to fund our transaction.

We have received 200 BTC and we are going to send
only 100 BTC to our recipient, sending change to ourselves
minus fees.
```js
(async () => {
  const spend = new MTX();

  // Let's spend 100 BTC only
  spend.addOutput(sendTo, Amount.fromBTC('100').toValue());

  await spend.fund([coin], {
    rate: 10000,
    changeAddress: address
  });

  spend.sign(ring);

  assert(spend.verify());

  console.log('Transaction is ready');
  console.log('Now you can broadcast it to the network');
  console.log(spend.toRaw().toString('hex'));
})()
```

We could manage inputs and outputs manually by adding
change input and calculate fees but `MTX.fund` does that for us.
Based on existing outputs in MTX, `MTX.fund` will allocate coin(s),
calculate fees based on the passed in rate and send change to the change address.

`spend.sign(ring)` - Will construct the scripts for every input and then sign them. At this
point the transaction can be spent. To validate the correctness of our transaction (signature), we
run one final check `assert(spend.verify())`.

`MTX.toRaw()` will return encoded transaction which can be broadcasted with any method.
e.g. `bcoin-cli broadcast RAWTRANSACTION`.


### Spending from P2WSH

We first need to generate the original address where we received funds.

```js
const [ring, ring2] = ringUtils.getRings(2, network);
ring.witness = true;
ring2.witness = true;

const pubkeys = [ring.publicKey, ring2.publicKey];
const redeemScript = Script.fromMultisig(1, 2, pubkeys);

// let's grab the address
ring.script = redeemScript;

const address = ring.getAddress();

console.log('Address for p2wsh:', address.toString());
```

redeemScript will be used later to redeem P2WPKH program. Now
we can construct the coin from this Address.

```js
const script = Script.fromAddress(address);

const sendTo = 'RTJCrETrS6m1otqXRRxkGCReRpbGzabDRi';
const txhash = revHex('a12738af61f01c94ff3eba949da5bd23edb67ef4'
                  + '5c65b6445c988421eb9c3a37');
const txinfo = {
  // prevout
  hash: txhash,
  index: 0,

  value: Amount.fromBTC('20').toValue(),
  script: script
};

const coin = Coin.fromOptions(txinfo);
```

Signing code for P2WSH is almost identical to standard multisig addresses just with a different scriptSig.

```js
(async () => {
  // Now let's spend our tx
  const spend1 = new MTX();

  ring.script = redeemScript;

  spend1.addOutput({
    address: sendTo,
    value: Amount.fromBTC('10').toValue()
  });

  await spend1.fund([coin], {
    changeAddress: address,
    rate: 10000
  });

  spend1.scriptInput(0, coin, ring);
  spend1.signInput(0, coin, ring);

  // Now you should see that our TX
  // has two witness items in it:
  // First is the signature
  // Second redeem script
  const input = spend1.inputs[0];
  const redeem = input.witness.getRedeem();
  assert(redeem.equals(redeemScript));
```

Redeem script for P2WSH is in the witness with its signature.

### P2SH Nested

Bcoin MTX and KeyRing primitives construct all necessary scripts for us, so the thing
that changes when moving to nested segwit addresses is the UTXO pubkeyScript.

To spend P2SH inputs using bcoin, we just need to use `ring.getNestedAddress`
instead of `ring.getAddress()` or set the `ring.nested` variable to `true` and bcoin
can handle it automatically with `ring.getAddress()`.


Modified P2WPKH example:
```js
const address = ring.getNestedAddress();

console.log(`Address: ${address}`);

const sendTo = 'RTJCrETrS6m1otqXRRxkGCReRpbGzabDRi';
const txhash = revHex('88885ac82ab0b61e909755e7f64f2deeedb89c83'
                    + '3b68242da7de98c0934e1143');
const txinfo = {
  // prevout
  hash: txhash,
  index: 0,

  value: Amount.fromBTC('200').toValue(),
  script: Script.fromAddress(address)
};
```

You can find full version of the code in [guide-repo][guide-repo]

## Final Notes
You need to keep in mind that sending transactions from old clients to new ones
is only possible if witness program is nested inside P2SH.
In order to get better understanding how Segwit scripts work check [BIP141][BIP141].

## References
Activated with segwit:
  - Segwit - [BIP141][BIP141] 
      - P2WPKH [BIP141][BIP141-P2WPKH]
      - P2WPKH nested in P2SH [BIP141][BIP141-NP2WPKH]
      - P2WSH [BIP141][BIP141-P2WSH]
      - P2WSH nested in P2SH [BIP141][BIP141-NP2SH]
  - Transaction Signature Verification for Version 0 Witness Program - [BIP143][BIP143]
  - Dummy stack element malleability [BIP147][BIP147]

Activation:
  - Reduced threshold Segwit MASF - [BIP91](BIP91)
  - Signaling method - [BIP9][BIP9]

Related:
  - Bech32 Addresses [BIP173][BIP173]

You can check [BIP List][BIPS] for other related proposals.


[tx-malleability]: https://en.bitcoin.it/wiki/Transaction_Malleability
[BIP62]: https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki#motivation
[guide-repo]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide
[multisig-guide]: https://bcoin.io/guides/multisig-tx.html

[create-p2wpkh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2wpkh.js
[create-p2wsh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2wsh.js
[create-p2sh-p2wpkh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2sh-p2wpkh.js
[create-p2sh-p2wsh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2sh-p2wsh.js
[spend-p2wpkh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2pkh.js
[spend-p2wsh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2wsh.js
[spend-p2sh-p2wpkh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2sh-p2wpkh.js
[spend-p2sh-p2sh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2sh-p2wsh.js

[BIP141]: https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki
[BIP143]: https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki
[BIP147]: https://github.com/bitcoin/bips/blob/master/bip-0147.mediawiki
[BIP91]: https://github.com/bitcoin/bips/blob/master/bip-0091.mediawiki
[BIP9]: https://github.com/bitcoin/bips/blob/master/bip-0009.mediawiki
[BIP173]: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
[BIP16]: https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki
[BIPS]: https://github.com/bitcoin/bips

[BIP141-P2WPKH]: https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki#p2wpkh
[BIP141-NP2WPKH]: https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki#p2wpkh-nested-in-bip16-p2sh
[BIP141-P2WSH]: https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki#p2wsh
[BIP141-NP2SH]: https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki#p2wsh-nested-in-bip16-p2sh

[endianness]: https://en.wikipedia.org/wiki/Endianness
