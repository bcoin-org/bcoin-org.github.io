# Multisig on the command line
```post-author
Matthew Zipkin
```

```post-description
Throw a Multisig party for yourself and some friends using simple command line tools.
```

## Introduction

The goal of this guide is to demonstrate a multi-signature collaboration between bcoin
users who may or may not trust each other. We will use only terminal commands to 
illustrate the process. For a deeper dive into how multisig transactions are constructed
in JavaScript with the library, see
[Creating Multi-signature Transactions](https://bcoin.io/guides/multisig-tx.html).
All the commands in this guide (and so many others!) are described in the
[API docs](https://bcoin.io/api-docs). There are important details in those docs
regarding API keys, wallet tokens, and other security measures that are essential
for using bcoin on mainnet. For this guide, we will just play in regtest mode and
skip over those steps.

## Let's throw a party

We're inviting 5 of our best friends: Alice, Bob, Charlie, David, and Erica.
Each of them will create a multisig wallet on their own computers, and they'll
share their wallet's default account's
[extended public key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#Extended_keys)
with each other. Once everyone knows everyone else's extended public key, they will each be
able to derive multisig receive addresses. After they receive some money, the group will be able
to spend their Bitcoin as long as THREE OF THE FIVE participants agree and sign.

## Creating wallets

Start by launching `bcoin` in `regtest` mode. We'll use 
[environment variables](https://github.com/bcoin-org/bcoin/blob/master/docs/configuration.md)
so we don't have to type the network parameter each time.

```
$ export BCOIN_NETWORK=regtest
$ bcoin --daemon
```

Then we'll create Alice's wallet. There are 
[many options available](https://bcoin.io/api-docs/#create-a-wallet)
for wallet creation, but all Alice needs to do is set up her wallet as a 3-of-5.
We'll also specify Segregated Witness.

```
$ bwallet-cli mkwallet --id=Alice --witness=true --m=3 --n=5
```

Right away, if Alice checks her wallet's default account, she'll notice it has not
been initialized yet. That's because it is waiting for more keys to complete the
multisig policy:

```
bwallet-cli --id=Alice account get default

{
  "name": "default",
  "initialized": false,
  "witness": true,
  "watchOnly": false,
  "type": "multisig",
  "m": 3,
  "n": 5,
  "accountIndex": 0,
  "receiveDepth": 0,
  "changeDepth": 0,
  "nestedDepth": 0,
  "lookahead": 10,
  "receiveAddress": null,
  "changeAddress": null,
  "nestedAddress": null,
  "accountKey": "tpubDDXZKjYarBCHxq9GHQHfRjRVQm8DuVAu33LoigMfHJri1ynqsWVBQbMWQbFU5nT3vabniRrtgJtaDEqnpB9GKQTyac5SbUw4589SvwrYKqQ",
  "keys": [],
  "balance": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": 0,
    "confirmed": 0
  }
}
```

Notice how she DOES have an `accountKey` (or "xpub" -- on networks other than main it's a `tpub`).
When bcoin created this wallet, it generated entropy and created a
[BIP44 master private key](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
for Alice. That will be the key she uses to sign the multisig transaction if she approves.

We can repeat the process for the four other friends:

```
$ bwallet-cli mkwallet --id=Bob --witness=true --m=3 --n=5

$ bwallet-cli mkwallet --id=Charlie --witness=true  --m=3 --n=5

$ bwallet-cli mkwallet --id=David --witness=true  --m=3 --n=5

$ bwallet-cli mkwallet --id=Erica --witness=true  --m=3 --n=5
```

After generating each wallet we can get the `accountKey` from each wallet's default account:


```
$ bwallet-cli --id=Alice account get default | jq -r .accountKey
tpubDDXZKjYarBCHxq9GHQHfRjRVQm8DuVAu33LoigMfHJri1ynqsWVBQbMWQbFU5nT3vabniRrtgJtaDEqnpB9GKQTyac5SbUw4589SvwrYKqQ

$ bwallet-cli --id=Bob account get default | jq -r .accountKey
tpubDDpd2qFrbXW35YkebSqvihtEsUW9ynmpy61FeVmquPzYzYmFupmabBnHwhJjJighrt2Cmss2Ndg7SJ1iXLuQvZia8KCRWvPTBEacpx6BARf

$ bwallet-cli --id=Charlie account get default | jq -r .accountKey
tpubDDtiGfAVwUAz2wHGh24TCsk6smz8QbHLqr7swEjS8YiEm6BczQPjqRVBuEqPefUCLur1U2VB4P8TUXQg9vXqzQdUx8bynP574sbzuADmRff

$ bwallet-cli --id=David account get default | jq -r .accountKey
tpubDDGK1KoY3YQ1xSwz4AyigwWPickr4mFVtRxu7ZZMQz5BDFGNF6SkgJq2kEfTzuudZVgy84rMVZeMv8GDVod2AGxgZSy3fBpWHpYHTEdUkZc

$ bwallet-cli --id=Erica account get default | jq -r .accountKey
tpubDCGKejeBy1oMoZ57NvG2u1X7pffLHkKxew1RAohEzaoPxSSXPdy7st8caWdwymqStLSXxsC4cvKcm9FSLS2PNEcS5rFHo5ccL9xCecqkQth
```

_(I'm using [jq](https://stedolan.github.io/jq/) here to keep the output minimal, but it's optional)_

Now each friend needs to import everyone else's public keys into their own wallet.
This will be a bit tedious for us because we have to do it for everybody but
remember in practice, each participant only needs to do this once. Here's what Alice
types:

```
$ bwallet-cli --id=Alice --account=default shared add tpubDDpd2qFrbXW35YkebSqvihtEsUW9ynmpy61FeVmquPzYzYmFupmabBnHwhJjJighrt2Cmss2Ndg7SJ1iXLuQvZia8KCRWvPTBEacpx6BARf
Added key.

$ bwallet-cli --id=Alice --account=default shared add tpubDDtiGfAVwUAz2wHGh24TCsk6smz8QbHLqr7swEjS8YiEm6BczQPjqRVBuEqPefUCLur1U2VB4P8TUXQg9vXqzQdUx8bynP574sbzuADmRff
Added key.

$ bwallet-cli --id=Alice --account=default shared add tpubDDGK1KoY3YQ1xSwz4AyigwWPickr4mFVtRxu7ZZMQz5BDFGNF6SkgJq2kEfTzuudZVgy84rMVZeMv8GDVod2AGxgZSy3fBpWHpYHTEdUkZc
Added key.

$ bwallet-cli --id=Alice --account=default shared add tpubDCGKejeBy1oMoZ57NvG2u1X7pffLHkKxew1RAohEzaoPxSSXPdy7st8caWdwymqStLSXxsC4cvKcm9FSLS2PNEcS5rFHo5ccL9xCecqkQth
Added key.
```

Now Alice's wallet is fully initialized. She can generate an endless series of receive
(and change) addresses and watch the blockchain for transactions!

```
$ bwallet-cli --id=Alice --account=default account get
{
  "name": "default",
  "initialized": true,
  "witness": true,
  "watchOnly": false,
  "type": "multisig",
  "m": 3,
  "n": 5,
  "accountIndex": 0,
  "receiveDepth": 1,
  "changeDepth": 1,
  "nestedDepth": 1,
  "lookahead": 10,
  "receiveAddress": "bcrt1q59779rsw4267cfts6f0q2nhth49casntju7gnf6n52uj75ttzwys3zph8r",
  "changeAddress": "bcrt1qkefmrhdp2sqgggflfna8uzy72fhj8d6fmg7u3hsft9lvpp0wlmtq7uvkml",
  "nestedAddress": "2MvGMq49SBDaH7C9wg89aEDZrjBxj9eqTDH",
  "accountKey": "tpubDDXZKjYarBCHxq9GHQHfRjRVQm8DuVAu33LoigMfHJri1ynqsWVBQbMWQbFU5nT3vabniRrtgJtaDEqnpB9GKQTyac5SbUw4589SvwrYKqQ",
  "keys": [
    "tpubDCGKejeBy1oMoZ57NvG2u1X7pffLHkKxew1RAohEzaoPxSSXPdy7st8caWdwymqStLSXxsC4cvKcm9FSLS2PNEcS5rFHo5ccL9xCecqkQth",
    "tpubDDGK1KoY3YQ1xSwz4AyigwWPickr4mFVtRxu7ZZMQz5BDFGNF6SkgJq2kEfTzuudZVgy84rMVZeMv8GDVod2AGxgZSy3fBpWHpYHTEdUkZc",
    "tpubDDpd2qFrbXW35YkebSqvihtEsUW9ynmpy61FeVmquPzYzYmFupmabBnHwhJjJighrt2Cmss2Ndg7SJ1iXLuQvZia8KCRWvPTBEacpx6BARf",
    "tpubDDtiGfAVwUAz2wHGh24TCsk6smz8QbHLqr7swEjS8YiEm6BczQPjqRVBuEqPefUCLur1U2VB4P8TUXQg9vXqzQdUx8bynP574sbzuADmRff"
  ],
  "balance": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": 0,
    "confirmed": 0
  }
}
```

Note that the status indicates `"watchOnly": false`. Normally in bcoin a "watch-only"
wallet only has public keys. It can "watch" a set of addresses, but not spend. To
learn more about this, see our guide
[Wallets and Accounts and Keys, Oh My!](https://bcoin.io/guides/wallets.html)
In this case, Alice can not spend from this wallet by herself, despite the wallet
not being "watch-only". She only has one private key (and four public keys) per address.

Bob, Charlie, David, and Erica all go through the same process of importing the other
keys. In the end, all five participants will have the same wallet structure, and
**identical** addresses. Assuming each person is running their own bcoin
full node on their own secure machine, they will now have a totally decentralized
multi-signature wallet! The participants do not need to trust each other to set
up or use this scheme. Some participants may even be using a hardware wallet like
a Ledger connected to their bcoin full node with the
[bledger](https://github.com/bcoin-org/bledger) package.

## Let's spend some money (as a team!)

So now we have five wallets.
Each wallet has its own account `xprv` that can generate many private and public
key pairs. The private keys are used to add the participant's signature to transactions.
Each wallet also has an account `xpub` from each of the four other participants.
These can be used to derive the other 4 public keys used in each multisig address.
This structure allows each participant to generate the same receiving address while
only being able to add their own unique signature to transactions.

All five wallets show the same `receiveAddress`. Let's fund it!
The easiest way to do that in regtest mode is by generating blocks:

```
$ bcoin-cli rpc generatetoaddress 100 bcrt1q59779rsw4267cfts6f0q2nhth49casntju7gnf6n52uj75ttzwys3zph8r
```

All five wallets will now show the same balance. Here's Bob & Charlie as examples:

```
$ bwallet-cli --id=Bob balance
{
  "account": -1,
  "tx": 100,
  "coin": 100,
  "unconfirmed": 500000000000,
  "confirmed": 500000000000
}
$ bwallet-cli --id=Charlie balance
{
  "account": -1,
  "tx": 100,
  "coin": 100,
  "unconfirmed": 500000000000,
  "confirmed": 500000000000
}
```

So, I am the host of this party and I need everyone to chip in for the pizza.
Here's my personal wallet address: `mpEwzcAKTsuGMM7hV49Mh3Ge7r933S6uYd`, and I
need 1.23456789 BTC from the group. This is where it gets interesting:

- ANY single participant can create a transaction spending from the multisig address.
This transaction will be created and signed by that first participant. This is often
called a "proposal" in multisig wallet schemes.

- This transaction with its single signature is NOT valid and will be rejected
from the Bitcoin network.

- Because our scheme is 3-of-5, we only need to get two other participants to add
their signatures before the transaction is valid.

- Although bcoin does not currently comply with the proposed standard
[BIP174 Partially Signed Bitcoin Transactions](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki)
the participants can pass around these blobs in the same way.

Erica is the most responsible friend in the group. She starts off the protocol
by creating a transaction to me:

```
$ bwallet-cli --id=Erica mktx --address=mpEwzcAKTsuGMM7hV49Mh3Ge7r933S6uYd --value=1.23456789

{
  "hash": "659800f1c5a8780ec2215afebd4e3f285ca999027ee3a789ad5655786fd04ead",
  "witnessHash": "3c96d96668caf81c1b797863aeda9d6bd843e461da4511db18e4961f4507c8c2",
  "fee": 4540,
  "rate": 23645,
  "mtime": 1572014394,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "a74c5a27a9d9ac13fd502dad0ed4971c40524fb7a7ca002fc30470997de9622c",
        "index": 0
      },
      "script": "",
      "witness": [
        "",
        "",
        "3045022100804216dc296b0c0c0f1a1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01",
        "",
        "",
        "",
        "53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae"
      ],
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 1,
        "value": 5000000000,
        "script": "0020a17de28e0eaab5ec2570d25e054eebbd4b8ec26b973c89a753a2b92f516b1389",
        "address": "bcrt1q59779rsw4267cfts6f0q2nhth49casntju7gnf6n52uj75ttzwys3zph8r",
        "coinbase": true
      }
    }
  ],
  "outputs": [
    {
      "value": 123456789,
      "script": "76a9145fb239be6a09c81b43591a7bbf5857424438052b88ac",
      "address": "mpEwzcAKTsuGMM7hV49Mh3Ge7r933S6uYd"
    },
    {
      "value": 4876538671,
      "script": "0020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed6",
      "address": "bcrt1qkefmrhdp2sqgggflfna8uzy72fhj8d6fmg7u3hsft9lvpp0wlmtq7uvkml"
    }
  ],
  "locktime": 0,
  "hex": "010000000001012c62e97d997004c32f00caa7b74f52401c97d40ead2d50fd13acd9a9275a4ca70000000000ffffffff0215cd5b07000000001976a9145fb239be6a09c81b43591a7bbf5857424438052b88ac2f13aa2201000000220020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed6070000483045022100804216dc296b0c0c0f1a1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01000000ad53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae00000000"
}
```

Notice how the witness in the input of this transaction has several empty placeholders.
When bcoin creates a multisig transaction, it places null bytes (`0x00`) where each
signature will eventually go. The signatures must be placed in the same order as the public
keys in the redeem script, which is why Erica's signature is not the first on the stack.
This lexicographical ordering of public keys in multi-signature redeem scripts is an
[accepted standard](https://github.com/bitcoin/bips/blob/master/bip-0067.mediawiki)
in the Bitcoin development community.

The last item in the witness stack is the redeem script, and we can take a quick
peek at that like this:

```
$ bcoin-cli rpc decodescript 53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae

{
  "asm": "OP_3 0242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad81 02bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c 02d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c 036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a 039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c288144564 OP_5 OP_CHECKMULTISIG",
  "type": "MULTISIG",
  "reqSigs": 3,
  "addresses": [
    "2NGERC5oyjs2NY4HMvPFQXazAj6JRZRFnua"
  ],
  "p2sh": "2NGERC5oyjs2NY4HMvPFQXazAj6JRZRFnua"
}
```

_You may notice that the public keys in the redeem script are in lexicographical order!_

Let's say Erica tried to make a unilateral decision here and broadcast this transaction
with only her signature -- what would happen? The `hex` at the bottom of the JSON
result above is the serialized transaction in its raw form, let's try to send it
to the network:

```
$ bcoin-cli broadcast 010000000001012c62e97d997004c32f00caa7b74f52401c97d40ead2d50fd13acd9a9275a4ca70000000000ffffffff0215cd5b07000000001976a9145fb239be6a0
9c81b43591a7bbf5857424438052b88ac2f13aa2201000000220020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed6070000483045022100804216dc296b0c0c0f1a
1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01000000ad53210242705b9570ec3c193ba67528ff38e
e272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750
f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae000
00000

[error] (node) Verification failure: non-mandatory-script-verify-flag (code=nonstandard score=0 hash=659800f1c5a8780ec2215afebd4e3f285ca999027ee3a789ad5655786fd04ead)
[warning] (node) Verification failed for tx: 659800f1c5a8780ec2215afebd4e3f285ca999027ee3a789ad5655786fd04ead.
```

Ok then! Let's get a few more signatures. Maybe Alice and Bob are busy engaging in
some other cryptography demonstration (they always are) how about Charlie and David?

Charlie signs first, using the raw hex from Alice's transaction:

```
$ bwallet-cli --id=Charlie sign 010000000001012c62e97d997004c32f00caa7b74f52401c97d40ead2d50fd13acd9a9275a4ca70000000000ffffffff0215cd5b07000000001976a9145
fb239be6a09c81b43591a7bbf5857424438052b88ac2f13aa2201000000220020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed6070000483045022100804216dc29
6b0c0c0f1a1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01000000ad53210242705b9570ec3c193ba
67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d73840
6338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c288144
56455ae00000000
```

Notice how the witness stack is filling up!

```
"witness": [
  "",
  "",
  "3045022100804216dc296b0c0c0f1a1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01",
  "",
  "3045022100a2ea840052c150fe9f260ee9ed27731a11e90722ad10bf2eb175f5b2e8002fad02206d600df6e95ca53cb67640f21c8d6f62f4290b03737d0f9606c8762d21ce63a601",
  "",
  "53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae"
],
```

Now David signs, **using the raw hex from Charlie's transaction**:

```
$  bwallet-cli --id=David sign 010000000001012c62e97d997004c32f00caa7b74f52401c97d40ead2d50fd13acd9a9275a4ca70000000000ffffffff0215cd5b07000000001976a9145fb239be6a09c81b43591a7bbf5857424438052b88ac2f13aa2201000000220020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed6070000483045022100804216dc296b0c0c0f1a1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d0100483045022100a2ea840052c150fe9f260ee9ed27731a11e90722ad10bf2eb175f5b2e8002fad02206d600df6e95ca53cb67640f21c8d6f62f4290b03737d0f9606c8762d21ce63a60100ad53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae00000000

{
  "hash": "659800f1c5a8780ec2215afebd4e3f285ca999027ee3a789ad5655786fd04ead",
  "witnessHash": "b4fde487440e4f6dae04e664d6ab21a53c7bdbaea8e32298ea2578a818eea45f",
  "fee": 4540,
  "rate": 19912,
  "mtime": 1572014872,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "a74c5a27a9d9ac13fd502dad0ed4971c40524fb7a7ca002fc30470997de9622c",
        "index": 0
      },
      "script": "",
      "witness": [
        "",
        "3045022100804216dc296b0c0c0f1a1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01",
        "3045022100f8bd1afdbd090166eb62905c48d05b3d7dbbced6fcb11820b17e7c19fb580aa402203f2b12929ec996611ac16ab39678309d8d3b750bc292835f4eb9e89affe7028a01",
        "3045022100a2ea840052c150fe9f260ee9ed27731a11e90722ad10bf2eb175f5b2e8002fad02206d600df6e95ca53cb67640f21c8d6f62f4290b03737d0f9606c8762d21ce63a601",
        "53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae"
      ],
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 1,
        "value": 5000000000,
        "script": "0020a17de28e0eaab5ec2570d25e054eebbd4b8ec26b973c89a753a2b92f516b1389",
        "address": "bcrt1q59779rsw4267cfts6f0q2nhth49casntju7gnf6n52uj75ttzwys3zph8r",
        "coinbase": true
      }
    }
  ],
  "outputs": [
    {
      "value": 123456789,
      "script": "76a9145fb239be6a09c81b43591a7bbf5857424438052b88ac",
      "address": "mpEwzcAKTsuGMM7hV49Mh3Ge7r933S6uYd"
    },
    {
      "value": 4876538671,
      "script": "0020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed6",
      "address": "bcrt1qkefmrhdp2sqgggflfna8uzy72fhj8d6fmg7u3hsft9lvpp0wlmtq7uvkml"
    }
  ],
  "locktime": 0,
  "hex": "010000000001012c62e97d997004c32f00caa7b74f52401c97d40ead2d50fd13acd9a9275a4ca70000000000ffffffff0215cd5b07000000001976a9145fb239be6a09c81b43591a7bbf5857424438052b88ac2f13aa2201000000220020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed60500483045022100804216dc296b0c0c0f1a1ed54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01483045022100f8bd1afdbd090166eb62905c48d05b3d7dbbced6fcb11820b17e7c19fb580aa402203f2b12929ec996611ac16ab39678309d8d3b750bc292835f4eb9e89affe7028a01483045022100a2ea840052c150fe9f260ee9ed27731a11e90722ad10bf2eb175f5b2e8002fad02206d600df6e95ca53cb67640f21c8d6f62f4290b03737d0f9606c8762d21ce63a601ad53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda147982560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae00000000"
}
```

So, now we have a transaction with 3 signatures. Take a look at the witness, it
looks a lot different from Alice's first transaction. The number of stack items has
gone from 7 to 5. Why? Because bcoin has detected that the multisig policy has
been completed, and removed the 2 extra placeholders. Why is there still an empty
stack item on top? Well for that, you'd need to
[ask Satoshi Nakamoto](https://github.com/bitcoin/bitcoin/blob/48cb468ce3f52195dfc64c6df88b8af36b77dbb0/src/script/interpreter.cpp#L1042-L1052).

We're done. David added the final signature and now holds a valid Bitcoin transaction.
Let's send it to the network!

```
$  bcoin-cli broadcast 010000000001012c62e97d997004c32f00caa7b74f52401c97d40ead2d50fd13acd9a9275a4ca70000000000ffffffff0215cd5b07000000001976a9145fb239be6a0
9c81b43591a7bbf5857424438052b88ac2f13aa2201000000220020b653b1dda1540084213f4cfa7e089e526f23b749da3dc8de09597ec085eefed60500483045022100804216dc296b0c0c0f1a1e
d54751c60a349518f3d6a558927be0099ecdf10a3a022013cf0e5ddaf99b0d94c00e69c875f43f034ac7fb934b4abfb75f91e2a72b966d01483045022100f8bd1afdbd090166eb62905c48d05b3d7
dbbced6fcb11820b17e7c19fb580aa402203f2b12929ec996611ac16ab39678309d8d3b750bc292835f4eb9e89affe7028a01483045022100a2ea840052c150fe9f260ee9ed27731a11e90722ad10
bf2eb175f5b2e8002fad02206d600df6e95ca53cb67640f21c8d6f62f4290b03737d0f9606c8762d21ce63a601ad53210242705b9570ec3c193ba67528ff38ee272f37b14ef33564e8d1b33812efb
3ad812102bcb81bd3451ed30559473940b58e4272765f272dc17855e1be2b21a05945d23c2102d9f1f9f3214b64b31ef82c16376283e438d738406338776750f86424c2ec303c21036427eda14798
2560d066449070c457697cf22ff3bbe2d0ecd5ba070d52d9434a21039c6a894d0067c32997f2390c2ecffaa0376ac34c8c0a4ebfa6d738c28814456455ae00000000
```

Did I get paid? Let's check my personal wallet's default account:

```
$ bwallet-cli balance

{
  "account": -1,
  "tx": 1,
  "coin": 1,
  "unconfirmed": 123456789,
  "confirmed": 0
}

$ bwallet-cli rpc listunspent default

[
  {
    "txid": "659800f1c5a8780ec2215afebd4e3f285ca999027ee3a789ad5655786fd04ead",
    "vout": 0,
    "address": "mpEwzcAKTsuGMM7hV49Mh3Ge7r933S6uYd",
    "account": "default",
    "scriptPubKey": "76a9145fb239be6a09c81b43591a7bbf5857424438052b88ac",
    "amount": 1.23456789,
    "confirmations": 0,
    "spendable": true,
    "solvable": true
  }
]
```

### Thanks everybody!

Next time I promise the pizza won't be so expensive 🍕🍕🍕

