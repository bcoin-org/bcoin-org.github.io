# Wallets and Accounts and Keys, Oh My!
```post-author
Daniel McNally
```
```post-description
A guide to creating and working with wallets in bcoin
```

Bcoin offers a powerful, modular way to create and manage bitcoin wallets. In this guide, I'll walk you through the concepts and features you'll need to know about to get started.

## The Basics

If you're a seasoned bitcoiner, you can probably skim this section or skip straight ahead to the [Examples](#examples) section. But if you're relatively new or just want a refresher, this section will help you understand how wallets actually work. 

### Wallets

In the most basic sense, a bitcoin wallet is data that enables you to receive and spend bitcoins. Wallets come in [many different types and designs](https://www.coindesk.com/information/how-to-store-your-bitcoins/), and assessing all the options can be overwhelming. Fortunately, bcoin implements the latest specifications for structuring wallets that are easy to backup, easy to restore, and that work just as well for a bitcoin novice making their first transactions as for a business with millions of users depositing and withdrawing bitcoin.

#### Keys to the Game

If you want to transact with bitcoin, you'll need keys. Each bitcoin address is associated with a particular key, and wallets are made up of many different keys. Keys consist of both a private key and a public key. The private key is required for spending and is extremely sensitive information, while a public key can be used to receive bitcoins and monitor a particular address. If you want to learn more about how this works, read up on [Public-Key Cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography).

#### HD vs. Non-HD, you mean like TVs?

You may have seen references to "HD" wallets and wondered what that means. HD in this context does not mean "high definition," as I assumed it did at first, but rather "hierarchical deterministic." An HD wallet takes a *hierarchy* of keys in order and makes it so any key in that sequence can be *determined* by the one before it. This means that if you can produce the first key in the hierarchy, you can then generate a practically unlimited number of subsequent keys. The specification for HD wallets as implemented in bcoin is defined by [Bitcoin Improvement Proposal (BIP) 32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki).

Non-HD wallets, on the other hand, contain keys that are unrelated to one another. Backing up such a wallet means each key must be preserved individually. Not only is this more cumbersome, but it means that backups can quickly become out of date as new keys are added to the wallet. With an HD wallet, as long as you hold on to the seed - the data needed to recreate the first key - you will be able to recover every other key.

While bcoin uses HD wallets, it does allow you to import individual keys into a wallet. This can be a handy feature in certain cases, but it means you'll need to backup any imported keys separately as they will not be recoverable simply by using your seed.

But what exactly is the seed for an HD wallet? It can come in several forms, but bcoin implements [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) which enables seeds to be represented by a mnemonic made up of a fixed set of common words. This means your seed can be easily spoken, written down, or perhaps even memorized. But be careful! Your seed can be used to recover and spend everything in your HD wallet (except for the aforementioned imported keys), so treat it like you would an actual wallet with cash in it.

By default, mnemonics in bcoin are made up of twelve words representing 128 bits of entropy. This is a common standard that is far and away beyond what cutting edge computers can hope to crack via [brute force](https://en.wikipedia.org/wiki/Brute-force_attack). But if you want additional entropy, bcoin supports up to 512 bits of entropy which makes a 48 word mnemonic.

### Accounts

Wallets in bcoin are partitioned into accounts. When you first create a wallet, a "default" account is created automatically along with it. Accounts can be used to track and manage separate sets of keys all within a single wallet. For example, a business can use accounts to generate distinct addresses for depositors or to segregate customer funds internally. 

Bcoin implements [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) as a method of generating unlimited accounts deterministically. This adds additional dimensions to the hierarchy described above, meaning the same seed that can recover all your keys can also recover all your addresses.

Each account also comes with its own "extended public key," a piece of data that can be used to generate all public keys for that account in deterministic fashion. This means, for instance, that a business can create limitless deposit addresses for its users without having to touch its critical private keys or seed. Remember that public keys can be used for receiving bitcoins, but not for spending, so a public key falling into the wrong hands will not immediately result in theft. 

### Watch Only Wallets

Speaking of not touching private keys, bcoin gives you the option to create wallets that are "watch only." Watch only wallets don't contain *any* private keys, which means they can't be used to spend the bitcoins they receive. However, they work perfectly fine for creating addresses, receiving bitcoins, and detecting incoming transactions. Using watch only wallets where appropriate reduces the risk of your keys and bitcoin being stolen and is good security practice.

Accounts always inherit the watch only behavior of their parent wallet. In other words, a watch only wallet will have exclusively watch only accounts while a regular wallet will have only regular accounts. Accordingly, you can't import private keys into a watch only wallet or public keys into regular wallets. If you try to mix and match watch only wallets and keys with bcoin, you're gonna have a bad time.

```bash
~$ curl http://127.0.0.1:18332/wallet/watchonlywallet/import -X POST -d '{"account":"default"
,"privateKey":"cNZfR3NhQ9oCP3pTjvPZETUuTW
Zo2k6EXtfczvbWyv7FdjMhppvJ"}'
{
  "error": {
    "type": "Error",
    "message": "Cannot import privkey into watch-only wallet."
  }
}
~$ curl http://127.0.0.1:18332/wallet/privatekeywallet/import -X POST -d '{"account":"default","publicKey":"02f4f200cb9391f8bbcc0a35e1f654b9b993b214a04ae7efd0313f4d4bf3d95745"}'{
  "error": {
    "type": "Error",
    "message": "Cannot import pubkey into non watch-only wallet."
  }
}
```

### API Authentication

Bcoin can run as a server and allow you to interact with your wallets via a [REST API](https://bcoin.io/api-docs/index.html?shell--curl#wallet). It also allows you protect wallets from unauthenticated requests by running the server with the `wallet-auth` option. Each wallet you create has a `token` value that must be passed in with each request. Tokens, like accounts and keys, can also be deterministically generated using your HD seed. This means you can change the token on a wallet as often as you'd like.

### Recovery

By using the HD standards mentioned above, bcoin allows one to easily restore or transfer their entire wallet to different wallet implementations. By providing just the mnemonic, one can fully recover their wallet to a fresh instance of bcoin or any other software that properly implements BIP33, BIP39, and BIP44, like the [Trezor](https://trezor.io/) hardware wallet.

## Examples

Enough chit chat, let's get down to business on how to create wallets, accounts, and keys with bcoin.

### Node.js

Below is a demo using javascript to instantiate a wallet and output important data and keys. Since bcoin is modular, you can easily use just the wallet functionality as I've done here.

#### Setup

With the [bcoin package](https://www.npmjs.com/package/bcoin) installed, we'll first import bcoin and open a wallet database in memory.

```javascript
//import the bcoin module and set it to testnet
const bcoin = require('bcoin').set('testnet');
const WalletDB = bcoin.WalletDB;
const WalletKey = bcoin.wallet.WalletKey;
const KeyRing = bcoin.keyring;
const Mnemonic = bcoin.hd.Mnemonic;
const HD = bcoin.hd;

walletExample().catch(console.error.bind(console));

async function walletExample() {
	//for demonstration purposes, we'll be creating a temporary wallet in memory
	const wdb = new WalletDB({ db: 'memory' });
	await wdb.open();
}
```

#### Creating a Wallet

Creating a wallet in our database takes only one line.

```javascript
//creates and returns a Wallet object from scratch using a random master key and default options
const wallet = await wdb.create();
console.log(wallet);
/*{ 
  wid: 2,
  id: 'WLTdx4aYEPmmrQiYNwPop4nLtbpTEdJYwrN4',
  network: 'testnet',
  initialized: true,
  accountDepth: 1,
  token: 'eeae267e99d112793b892a8e30f89b1e1e0ba0d4984c2e6f09fc7931e750af5a', //the token you'll need to use the REST API with `wallet-auth` set to true
  tokenDepth: 0,
  state: 
   { wid: undefined,
     id: undefined,
     tx: 0,
     coin: 0,
     unconfirmed: 0,
     confirmed: 0 },
  master: 
   { encrypted: false,
     key: { xprivkey: 'tprv8ZgxMBicQKsPdcD55gci7HBednWRaosU4CkAHNEAs3kAAj9m8TVrEzxAW3EPrTrFevVssHCCoRsA37vB65SUZs727k45Nz1Cjmy4tyaSFeR' }, //the keys to the castle, guard this carefully!
     mnemonic: 
      { bits: 128,
        language: 'english',
        entropy: '04a50a56fbaaadc26a2b1690ec74243f',
        phrase: 'again choose noble warrior print thrive post glare movie glove animal legal', //the keys to the castle in human readable form
        passphrase: '' } },
  account: 
   { wid: 2,
     name: 'default',
     network: <Network: testnet>,
     initialized: true,
     witness: false,
     watchOnly: false,
     type: 'pubkeyhash',
     m: 1,
     n: 1,
     accountIndex: 0,
     receiveDepth: 1,
     changeDepth: 1,
     nestedDepth: 0,
     lookahead: 10,
     address: <Address: type=pubkeyhash version=-1 str=mhNHETXFKDk7ZpGg3iEZb7guWZ2fbCuFjv>,
     nestedAddress: null,
     accountKey: 'tpubDDZ1r85SUsur87eW6uCrWancnCVHSLf5YcXzudCF6qBUQguR8upC6pgSuzxahDkf75SQ4LJ3R4x5NvfgQPmNjxhg2pcHzBCKcG2fBUQJ5U5', //the extended public key that can be used to generate receiving addresses for this account
     keys: [] } 
 }*/
```

#### Creating Accounts and Receiving Addresses

You can start generating addresses with our first account right away.

```javascript
const account = await wallet.getAccount('default');

//now we have a wallet and default account, let's get our first and current receiving address
const addr = account.receiveAddress();
//this will be the same value as seen in the 'address' property under 'account' in our wallet above
console.log(addr.toString());
//mhNHETXFKDk7ZpGg3iEZb7guWZ2fbCuFjv

//we can skip ahead if we want, grabbing the hundredth key in the heirarchy like so
const key100 = account.deriveReceive(100); //ok, technically this is the hundred-and-first key because the sequence is zero-based
console.log(key100.getAddress('string'));
//mjVdQqQYWBpE6YzKyMRd96LxCMoJyeTX2i
```

You can also create a second account with a custom name.

```javascript
// let's create another account for hypothetical customer John Doe
const jdAccount = await wallet.createAccount({name: 'john_doe'});
console.log(jdAccount);
/*{ 
  wid: 2,
  name: '1',
  network: <Network: testnet>,
  initialized: true,
  witness: false,
  watchOnly: false,
  type: 'pubkeyhash',
  m: 1,
  n: 1,
  accountIndex: 1,
  receiveDepth: 1,
  changeDepth: 1,
  nestedDepth: 0,
  lookahead: 10,
  address: <Address: type=pubkeyhash version=-1 str=muCSbWC6z1tAr2i1M5BKPWEZ8zapzcKfKh>,
  nestedAddress: null,
  accountKey: 'tpubDDZ1r85SUsur9txJF5ziLRD6757E1Q7x6VLfPby4YKqAdNwgmrkXBNDzMowxYJVoAizd7CCLHELY5X2HYzh6YurbH9vMyQJN
T92n87z22yX',
  keys: [] 
}*/

//Mr. Doe wants to make 10 deposits, let's get him a unique address for each one
const depositAddressesToPrint = 10;
for(var i=0; i<depositAddressesToPrint; i++) {
	console.log(jdAccount.deriveReceive(i).getAddress('string'));
}
/*
muCSbWC6z1tAr2i1M5BKPWEZ8zapzcKfKh
n4TWmQyPQ8mAr2oEfbBzKF8Dw6LXXBidYJ
ms1jRu71BvEsJ4K3dMFrKFUnB8axZQdmSq
mn8xFgB68RjWGdKPVb8Up4P4v5MyqPoEQj
mzfXXKRXJBjTGRFrrg4wm1XPsdU9TLoN6T
n36TShvFCDaWgCMHHszUGiczA7Tcru4AQp
mnZBaquULuUhtwwxKTuxWNF7ZDMDNxScJd
mfpwjevu3FY4ZsWPd31J9oBH1qrxZLF1tH
mhTrDspHReXThUmMeo8dVJHqhkyHG8VPZ1
mxKo27kJpNazq9Q3cQ7458k2S2vcQar9Pd
*/
```

#### Getting Private Keys

Bcoin handles your private keys automatically for things like sending transactions and signing messages, but you can also manually extract private keys from a wallet.

```javascript
//the keys above are only good for receiving bitcoins, not spending them
//let's get the extended private key for John Doe's account, which can be used to generate every private key for the account
const jdExtendedPrivateKey = wallet.master.key.deriveAccount(44, jdAccount.network.keyPrefix.coinType, jdAccount.accountIndex); //44 is the fixed purpose for bip44 accounts
console.log(jdExtendedPrivateKey.xprivkey());
//tprv8gryhi3CLWEBGRvWMSL7w1YyY3bHr4w3XBjt75vm842mntgv9Tvvzsc8Bf3NZt13ydD5QZaJVShMudE33egMhSLnEM41t5UUhRj5wA5u8Sc

//for good measure, let's get the private key for John's first receiving address
const branch = 0; //the branch for receiving addresses
const index = 0; //index of 0 means the first key among the receiving addresses
const jdPrivateKey0 = jdExtendedPrivateKey.derive(branch).derive(index);
const jdWalletKey0 = WalletKey.fromHD(jdAccount, jdPrivateKey0, branch, index);
//the private key below can be imported into almost any bitcoin wallet, HD or non-HD, and used to spend coins from the corresponding address
console.log(jdWalletKey0.getPrivateKey('base58'));
//cNZfR3NhQ9oCP3pTjvPZETUuTWZo2k6EXtfczvbWyv7FdjMhppvJ
```

#### Using an HD path

Sometimes it is handy to work with an HD path. This is an object that contains information on a particular path to a key in the tree hierarchy of the wallet. In particular, a path knows the account, the branch and the index of the relevant key. This is according to [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki), which specifies that every account gets its own subtree of keys. According to BIP44, an account has two children (known as branches): the first for receiveing addresses and the second for change addresses. Here in bcoin, there is also a third branch, for nested segwit addresses. (bcoin does not implement BIPS [49](https://github.com/bitcoin/bips/blob/master/bip-0049.mediawiki) and [84](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki) yet.) These three branches can in turn have as many children as needed. These correspond to the aforementioned index and provide the actual keys that are used for transactions.

```javascript
const path = await wdb.getPath(wallet.wid, jdAccount.receiveKey().getHash())
// Let's skip 30 indexes
path.index += 30

// Get the corresponding keyring:
const jdKey = jdAccount.accountKey.derive(path.branch).derive(path.index)
const keyring = WalletKey.fromHD(jdAccount, jdKey, path.branch, path.index)

// Warning: if any coins are paid to the address of the generated keyring above,
// the wallet won't notice until 20 more receive keys are generated. This is
// because by default wallets look for received coins in the addresses that
// correspond to the next 10 indexes. You may actually use this as a trick to
// hide some money from yourself, only to see them again after receiving several
// transactions. Surprise money!

console.log(keyring)
/*
HDPublicKey {
  depth: 5,
  parentFingerPrint: 3443512669,
  childIndex: 30,
  chainCode:
   <Buffer 92 74 63 8e a1 37 4f 76 c3 45 b3 72 a9 f9 6e 3f 6f e8 91 21 ea b7 2f aa d1 14 3b 03 4a 28 88 ec>,
  publicKey:
   <Buffer 02 7e 0a 71 6f ee 92 03 7e 13 4f af d0 b8 41 34 1c 2c e7 7b 31 dc 59 69 84 6a 81 fc 58 57 24 1c 40>,
  fingerPrint: -1 } { name: 'john_doe',
  account: 1,
  branch: 0,
  index: 30,
  witness: false,
  nested: false,
  publicKey:
   '027e0a716fee92037e134fafd0b841341c2ce77b31dc5969846a81fc5857241c40',
  script: null,
  program: null,
  type: 'pubkeyhash',
  address: 'n3ymqyMsqLjhyzZUqkRtGjyvRxVvhHU7q8' }
*/
```

An HD path is a powerful tool that allows you to manually traverse the HD wallet tree with ease. But be warned, there's a lot into HD wallets, so be sure you understand what you're doing. With great power comes great responsibility!

#### Generating Mnemonics and Recovering Keys

Finally, you can create mnemonics manually and seed new wallets with them. And if you need to generate keys from a mnemonic you provide - either by recreating a wallet or by extracting specific keys - you can do that as well.

```javascript
//can we generate a mnemonic with twice as many bits of entropy to future proof against brute force attacks from the next millenium? sure we can.
const mnemonic24 = new Mnemonic({bits: 256});
console.log(mnemonic24.toString());
//page unknown ladder thunder airport merry run ball inject clinic danger valley equip consider normal twist casual duck essay almost trade regular two segment

//what if we need to recover the wallet we've created above? no problem.
const mnemonic = new Mnemonic('again choose noble warrior print thrive post glare movie glove animal legal');
const masterKey = HD.fromMnemonic(mnemonic);
//this wallet will generate all the same accounts, keys, addresses, and tokens if swapped in for the 'wallet' variable in examples above
const recoveredWallet = await wdb.create({master: masterKey});

//we can also recover only the keys for John Doe's first receiving address without recreating the wallet or account
//this time we'll skip instantiating the account and use the BIP44 path for the second account, first branch, and first index on bitcoin testnet
const jdRecoveredPrivateKey = masterKey.derivePath("m/44'/1'/1'/0/0");
const jdKeyRing = new KeyRing(jdRecoveredPrivateKey); 
//our output should be the same as what we logged to the console earlier in this example
console.log(jdKeyRing.getAddress('string'));
//muCSbWC6z1tAr2i1M5BKPWEZ8zapzcKfKh
console.log(jdKeyRing.getPrivateKey('base58'));
//cNZfR3NhQ9oCP3pTjvPZETUuTWZo2k6EXtfczvbWyv7FdjMhppvJ
```

### Command Line Examples against a Local bcoin Server

If you already have bcoin [set up as a full node](https://github.com/bcoin-org/bcoin/wiki/Beginner's-Guide), you can use the command line to create wallets and demonstrate some of the topics I discussed in this guide. My examples below are against a running testnet bcoin instance with `wallet-auth` set to true.

```bash
~$ bcoin wallet create guide1
{
  "network": "testnet",
  "wid": 2,
  "id": "guide1",
  "initialized": true,
  "watchOnly": false,
  "accountDepth": 1,
  "token": "c88bc2fda2f265bc00c8fd28771c62695dbbddfd05ef2510f9e0afbec14818ba",
  "tokenDepth": 0,
  "state": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": 0,
    "confirmed": 0
  },
  "master": {
    "encrypted": false
  },
  "account": {
    "name": "default",
    "initialized": true,
    "witness": false,
    "watchOnly": false,
    "type": "pubkeyhash",
    "m": 1,
    "n": 1,
    "accountIndex": 0,
    "receiveDepth": 1,
    "changeDepth": 1,
    "nestedDepth": 0,
    "lookahead": 10,
    "receiveAddress": "mirZQBLNFsjgxRC6STfCJU71nXqSon9U17",
    "nestedAddress": null,
    "changeAddress": "n3qdAvsVk7v4q4CAp25SSPsfcBARJexSUr",
    "accountKey": "tpubDCsPHK6xw9CziuN6o7tk1rubLopp5ipy4rDsapkA12KYdcuLXNH7frWUcWsMiFjU5Jxqp2d37SidfmvAahsLqon14wXtor7uQvjLZscb2fh",
    "keys": []
  }
}
```

#### Auth Tokens

See that `token`? We'll be needing that. With the token, we can do things like query our wallet balance.

```bash
~$ bcoin wallet balance --id guide1 --token c88bc2fda2f265bc00c8fd28771c62695d
bbddfd05ef2510f9e0afbec14818ba
{
  "wid": 2,
  "id": "guide1",
  "account": -1,
  "unconfirmed": 0,
  "confirmed": 0
}
```

Without it, we get a 403 Forbidden error.

```bash
~$ bcoin wallet balance --id guide1Error: Status code: 403.
    at HTTPClient._request (/opt/bitnami/nodejs/lib/node_modules/bcoin/lib/http/client.js:229:11)
    at process._tickCallback (internal/process/next_tick.js:109:7)
```

However, we can change our token for this wallet as often as we'd like. In a production-like setting, you'd probably want to encrypt the wallet with a passphrase which would also be required for the `retoken` call below. 

``` bash
~$ bcoin wallet retoken --id guide1 --token c88bc2fda2f265bc00c8fd28771c62695dbbddfd05ef2510f9e0afbec14818ba
26ea429fe1c0da8505c9b0e61a46343d802779d73393ee72130df0fb1a9eaa7e
```

#### Creating an Account

With our new token, let's create an account for John Doe's sister, Jane.

```bash
~$ bcoin wallet --id guide1 account create jane_doe --token 26ea429fe1c0da8505c9b0e61a46343d802779d73393ee72130df0fb1a9eaa7e
{
  "wid": 2,
  "id": "guide1",
  "name": "jane_doe",
  "initialized": true,
  "witness": false,
  "watchOnly": false,
  "type": "pubkeyhash",
  "m": 1,
  "n": 1,
  "accountIndex": 1,
  "receiveDepth": 1,
  "changeDepth": 1,
  "nestedDepth": 0,
  "lookahead": 10,
  "receiveAddress": "n4RwFEkSV7MSxBqqvNziakuGgeS8XFusKq",
  "nestedAddress": null,
  "changeAddress": "mfaHH8ESM8pzoR1wLSSRQS89kpaBi9dBVt",
  "accountKey": "tpubDCsPHK6xw9CzjZQMnqwoZjLjMHqbkWjNYakAatZ9ktAf6Lou2H7jw2h93x24zT86BadMMmCAsp69yuUjBsGgHkfC41TpgXMPzSZRFxu3Ghi",
  "keys": []
}
```

We already have the first receiving address for Jane in `receiveAddress` above, but let's get one more for good measure.

```bash
~$ bcoin wallet --id guide1 address --account jane_doe --token 26ea429fe1c0da8505c9b0e61a46343d802779d73393ee72130df0fb1a9eaa7e
{
  "network": "testnet",
  "wid": 2,
  "id": "guide1",
  "name": "jane_doe",
  "account": 1,
  "branch": 0,
  "index": 1,
  "witness": false,
  "nested": false,
  "publicKey": "02dda1237f65e26d05451fb96b15e85c3fb5c420ebdfcf31835857c38daa8ef5d6",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "mqDhGEywrWDm5DHw71Qxm5U8Lc6WvhZVeM"
}
```

## Conclusion

After reading this guide, you should have a decent understanding of not only the concepts behind bitcoin wallets, but also of how to go about creating and managing them with bcoin. Now you can integrate bcoin's wallet functionality directly into your application, or run bcoin as a full node and interact with it for your wallet creation needs. Good luck!
