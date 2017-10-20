# Segwit and Bcoin

```post-author
Nodar Chkuaselidze
```

```post-description
What is segwit, how to use segwit with bcoin and what are the updates
```

Following guide will introduce you to Segwit, its changes and how to fully employ all these changes with bcoin.
Code reviewed here is in its own [repo][guide-repo].

## Segwit
Originally it started as [TX malleability][tx-malleability] fix. Miners and Full nodes in charge
of relaying or including transaction in blocks could change transaction hash and broadcast modified
without invalidating the transaction. This prevented sidechains and some applications
to be built on top of bitcoin blockchain (Lightning Network).
You can check the list of Malleability sources in [BIP62 (Withdrawn)][BIP62].  
Segwit removes sigScripts from the transaction and constructs another merkle tree
for witnesses. Signatures are also subtracted from block size calculations (They
aren't broadcasted with block) leaving space for more transaction with the same
block size. It was crucial to make this update soft fork, so instead of submitting merkle root into
block, it's included in coinbase transaction.  
Another benefit it brings is future possible soft forks for Script updates.  
For backwards compatibility, you can nest Witness programs in P2SH and get
transactions from old nodes.
Check references on reference topic.

## Witness Programs
You can check details in [Segwit BIP][BIP141], we'll cover them as we go for our examples.
In segwit addresses/scriptPubKeys first byte is the `version byte`, which will be used
for extending scripts with new functionalities. Currently version `0` is used and supports
`P2WPKH` and `P2WSH` transactions. After `OP_0` version byte, we expect hash with size
of `20` in case of `P2WPKH` or `32` in case of `P2WSH`.  
scriptPubKeys:
  - `P2WPKH` scriptPubkey is `OP_0 0x14 {20-byte-hash}`, where `OP_0` is *version byte*
*0x14* is size of data, `{20-byte-hash}` is HASH160(PubKey).
  - `P2WSH` scriptPubkey is `OP_0 0x20 {32-byte-hash}`, where `OP_0` is *version byte*
*0x20* is size of data, `{32-byte-hash}` is md5(script).
Note: These witness programs aren't executed right away, they are stacks and are used
to construct the scripts for verification.

When nesting witness programs inside *P2SH*, you will take witness program(stack) and hash it, as you would
have done with normal scripts.

Native Segwit programs come with new Address format [bech32][BIP173], so `P2WPKH` and `P2WSH` scripts
will always use `bech32` addresses. It supports error checking and is comprised from 4 parts:
`human-readable-part(hrp)`, `version number`, `data` and `checksum`. HRP is used for indicating the network:
`bc` for `mainnet` and `tb` for the `testnet` separated by `1` followed by data and the checksum. 

## Code
You will notice, that bcoin API doesn't change much between different transaction types. Also
most of the ring management is same so we'll discuss them first.
*Note: We'll be using `regtest` for in our code.*

### Common Parts

Most important part in our examples will be `KeyRing`s. They store and manage keys and also provide
every method needed to handle scripts and signatures. That's why we have separated `keyring` in separate
utils folder which will cache `privateKey`s in folder `keys/`. We only expose `.getRings` method,
which will generate or return from cache `N` number of keys.  
After importing we always set `ring.witness = true`, because by default it's false. This
will tell `KeyRing` to construct P2WPKH addresses instead of P2PKH and vice versa. 

*Note: Segwit only uses Compressed public keys.*


### Create P2WPKH Address

[create-p2wpkh.js][create-p2wpkh.js]

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
const addrRes = bech32.decode(address.toString());
// addrRes.hrp = 'rb'; // for regtest
// addrRes.version = 0; // Segwit program version
// addrRes.hash = Buffer... // 20 byte Pubkeyhash.


assert(addrRes.hash.toString('hex') === pubkeyhash);
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

We won't cover manual scripts in the next codes, but the process is similar
and can be created using same API.

## Create P2WSH Address
[create-p2wsh.js][create-p2wsh.js]

In this code example, we'll create Multisig/P2WSH address. This process
is similar to [multisig][multisig-guide], only difference is the output address we'll get.

We'll need two public keys, so we grab two rings from cache
```js
const [ring, ring2] = ringUtils.getRings(2, network);

ring.witness = true;
ring2.witness = true;
```

And then create multisig script
```js
const pubkeys = [ring.publicKey, ring2.publicKey];
const multisigScript = Script.fromMultisig(1, 2, pubkeys);
```

Now we can pass multisig script to ring (Ring already knows it needs to generate segwit address).
*Note: If ring has script assigned, it will return P2SH or P2WSH address.*
```js
ring.script = multisigScript;
const address = ring.getAddress();

console.log('Address from ring:', address.toString());
```

Now bech32 address should contain `version byte = 0` and 32 byte long `hash` for script.

```js
const addrRes = bech32.decode(address.toString());

// data in bech32 should be md5(script)
assert(addrRes.hash.equals(multisigScript.sha256()));
```

## Create P2SH-P2WPKH Address
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

Transactions received on this address, first will be redeemed P2SH way
and then retreived redeem script (Witness program) will continue
executing as P2WPKH


### References
Activated with segwit:
  - Segwit - [BIP141][BIP141] 
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
[multisig-guide]: http://bcoin.io/guides/multisig-tx.html

[create-p2wpkh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2wpkh.js
[create-p2wsh.js]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide/blob/master/create-p2wsh.js

[BIP141]: https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki
[BIP143]: https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki
[BIP147]: https://github.com/bitcoin/bips/blob/master/bip-0147.mediawiki
[BIP91]: https://github.com/bitcoin/bips/blob/master/bip-0091.mediawiki
[BIP9]: https://github.com/bitcoin/bips/blob/master/bip-0009.mediawiki
[BIP173]: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
[BIPS]: https://github.com/bitcoin/bips

