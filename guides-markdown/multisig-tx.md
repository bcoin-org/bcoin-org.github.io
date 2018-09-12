# Creating Multisignature Transactions

```post-author
Nodar Chkuaselidze
```

```post-description
Working with and creating multi-signature transactions using built in bcoin utilities and the wallet api.
```

## How It Works
#### General
In bitcoin there are several transaction types and one of them is Multisig. Multisig addresses and transactions are created
from multiple private keys and can be used in multiple situations. For example, you can secure your funds using multiple
keys on multiple devices. If you want to spend transactions received on multisig address, you'll need to sign transactions
on both devices. As another example, in large companies where several people are in charge of funds,
they can create multisig addresses for company funds where you have multiple signatories.
This will improve the security of the funds from both internal and external threats since no one can
send a tx without the approval of other signatories. More examples of multisig applications can be
found on the [wiki][multisig-apps].


#### Definition
Multisig transactions have an `m-of-n` form, where `m` stands for number of signatures required to spend funds and `n` stands
for maximum number of pubkeys that are permitted to sign (`m <= n`). You can check the motivation
and specification in [BIP11][]. We'll also be using the [Pay-to-Script-Hash(P2SH)][BIP16] format for the script
and [its address format][BIP13] for our addresses and for receiving the transactions.


#### Address Creation
When you want to create a multisig address, first you need to aggree on the numbers in `m-of-n`. If one of the
signatories chooses a different `m` or a different `n`, they'll end up with different addresses.
You also need to know the pubkey for all cosigners.
You can share these pubkeys however you want. Wallets support various ways for sharing pubkeys, using QR Codes
or sending base58check encoded strings.  After you have collected all pubkeys and agreed on `m` and `n`,
you construct the multisig script and generate P2SH address from that.


#### Spending Received Transaction
After you've received a transaction on your multisig address, you can spend it if the minimum number of signatures are provided
in a signature script.
1. You need all public keys, the same as were used in address generation.
2. From that you can construct the redeem script, that is the original script you constructed for address.
3. Once you have the redeem script, you can start creating the signature script which will be constructed according
to BIP11 and BIP16.
4. When you prepend your signature, you take this transaction (not yet fully valid) and send it to another pubkey owner,
who'll be signing next. The next person will do the same, until you have `m` signatures in the sigscript.

After this process is done, your transaction is fully signed and you can broadcast your transaction.


[BIP11]: https://github.com/bitcoin/bips/blob/master/bip-0011.mediawiki
[BIP16]: https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki
[BIP13]: https://github.com/bitcoin/bips/blob/master/bip-0013.mediawiki
[multisig-apps]: https://en.bitcoin.it/wiki/Multisignature#Multisignature_Applications

## The Code

### Manual construction

In this setup, we won't be running a node or running any of the blockchain or wallet functionality of bcoin.
This is a slightly more abstract than constructing bare scripts ourselves.
We'll split code in multiple files and share keys using the current directory (So you can use fresh dir).


### Step 1: Address Creation

In the following code, we'll import all necessary libraries, generate private and public keys, and create
a multisig address.

```js
'use strict';

const fs = require('fs');
const bcoin = require('bcoin');
const KeyRing = bcoin.wallet.WalletKey;
const Script = bcoin.Script;

// Network is important when creating addresses
// and storing private keys, You don't want to accidentally spend
// or confuse keys/transactions/addresses with different networks.
const network = 'regtest';

// use compressed pubkeys
// See notes in guide.
const compressed = true;

// This will generate two private keys
// See notes in guide
const ring1 = KeyRing.generate(compressed, network);
const ring2 = KeyRing.generate(compressed, network);

// export to wif for reimporting them later.
fs.writeFileSync(`${network}-key1.wif`, ring1.toSecret(network));
fs.writeFileSync(`${network}-key2.wif`, ring2.toSecret(network));

// create 2-of-2 address
const m = 2;
const n = 2;
const pubKeys = [ring1.publicKey, ring2.publicKey];

// assemble multisig script from pubkeys and m-of-n
const multiSigScript = Script.fromMultisig(m, n, pubKeys);

// now generate P2SH address
const base58addr = multiSigScript.getAddress().toBase58(network);

// store address too
fs.writeFileSync(`${network}-address`, base58addr);

// Print multisig address
console.log(`Address: ${base58addr}`);
```

---

```js
const ring1 = KeyRing.generate(compressed, network);
```
Here we generate a private key and public key pair. We need to provide
information about the network and public key format. There are two [Public key formats][bitcoin-pubkeyformat]
one compressed and one uncompressed.  More details can be found at the [Bitcoin Developer Guide][bitcoin-pubkeyformat]

[bitcoin-pubkeyformat]: https://bitcoin.org/en/developer-guide#public-key-formats


### Step 2: Generate Transaction

In this part, we assume that we received a transaction on the network with the following information:
> Transaction ID: 3b1dd17cc82e2ac43ba62bf8f1c6a0fe805df43911653d22c902571eb3a212ce  
> Output index: 0  
> Amount: 100 BTC  

We are going to send `50 BTC` to `RF1PJ1VkHG6H9dwoE2k19a5aigWcWr6Lsu` on the regtest network.

```js
'use strict';

const fs = require('fs');
const assert = require('assert');
const bcoin = require('bcoin');
const KeyRing = bcoin.wallet.WalletKey;
const Script = bcoin.Script;
const MTX = bcoin.MTX;
const Amount = bcoin.Amount;
const Coin = bcoin.Coin;

const network = 'regtest';

// grab private keys
const secret1 = fs.readFileSync('./regtest-key1.wif').toString();
const secret2 = fs.readFileSync('./regtest-key2.wif').toString();

// generate keyring object (pubkeys too)
const ring1 = KeyRing.fromSecret(secret1);
const ring2 = KeyRing.fromSecret(secret2);

const m = 2;
const n = 2;

// Each of them will have both pubkeys
const pubkey1 = ring1.publicKey;
const pubkey2 = ring2.publicKey;

// the redeem
const redeem = Script.fromMultisig(m, n, [pubkey1, pubkey2]);
// p2sh script
const script = Script.fromScripthash(redeem.hash160());

// NOTE: we'll send change to the same address for simplicity
// consider using HD Wallets and common Paths within HD Wallets.
// See BIP45 for multisig paths.
const changeAddr = script.getAddress().toBase58(network);

// tx info
const sendTo = 'RF1PJ1VkHG6H9dwoE2k19a5aigWcWr6Lsu';
const txInfo = {
  // How much we received with this transaction
  value: Amount.fromBTC('100').toValue(),

  // prevout txid and vout
  hash: '3b1dd17cc82e2ac43ba62bf8f1c6a0fe805df43911653d22c902571eb3a212ce',
  index: 0
};

// Coin provides information for the transaction
// that is aggregated in CoinView within the mtx
// and contains information about the previous output
const coin = Coin.fromJSON({
  version: 1,
  height: -1,
  value: txInfo.value,
  coinbase: false,

  script: script.toJSON(),
  hash: txInfo.hash,
  index: txInfo.index
});

// Now we create mutable transaction object
const spend1 = new MTX();

// let's give redeemscript to ring1
// Later it will be used by signInput for
// signing transaction
ring1.script = redeem;

// send
spend1.addOutput({
  address: sendTo,
  value: Amount.fromBTC('50').toValue()
});

// Check notes below
// send change to ourselves
spend1.addOutput({
  address: changeAddr,
  value: Amount.fromBTC('49.99').toValue()
});

// We can manually add this coin
// and this will also add input
// to our transaction
spend1.addCoin(coin);

// scriptInput will assemble redeem and create
// space for signatures in the script.
spend1.scriptInput(0, coin, ring1);

// all info is here, all is left is to sign
// First signs first one and sends signed tx
// to another person for signing.
spend1.signInput(0, coin, ring1);

// Now we can take raw transaction and do the same
// thing with second user.
const raw = spend1.toRaw();

// let's simulate sending raw tx to another user
const spend2 = MTX.fromRaw(raw);

// information provided before `new MTX` in spend1
// is common for both, both need to construct them

// ring2 needs redeem script too, for signing input
spend2.script = redeem;

// Because input already exists in transaction
// we only need to provide Coin to CoinView
spend2.view.addCoin(coin);

// now we sign
spend2.signInput(0, coin, ring2);

// We are done.
// Both users signed the transactions

// Let's make sure that the transaction is valid
assert(spend2.verify(), 'Transaction isnt valid.');

console.log(spend2.toRaw().toString('hex'));
```

Since there's a lot of code here, I wanted to review a couple of sections.
This snippet below will return a raw transaction and also makes sure the
transaction has all the signatures.


---
```js
// send change to ourselves
spend1.addOutput({
  address: changeAddr,
  value: Amount.fromBTC('49.99').toValue()
});

// We can manually add this coin
// and this will also add input
// to our transaction
spend1.addCoin(coin);
```

In this next snippet we send change to ourselves and specify it manually.
Alternatively, we could also use `MTX.prototype.fund` which automatically
allocates coins to outputs, based on the amounts they need and
also calculate change and append a new output for it.
Instead of the code above, we could have simpler and more automated

calculations:

```js
// this will automatically select coins and
// send change back to our address
await spend1.fund([coin], {
  rate: 1000,

  changeAddress: changeAddr
});
```



## Using Wallet API

While it's possible to use `bcoin` for manually constructing a transaction with just private keys, it's not
convenient to handle all logic manually, and even more complex to deal with all HD wallet logic. So if you have a bcoin node running and you have access to it via HTTP, you can use `bcoin.http.Client` and `bcoin.http.Wallet`. These classes
provide all API methods described on bcoin and will communicate with the node's Wallets.

*NOTE: You can check [API Docs][API-DOCS]*

### Step 1: Address Creation
In this step we'll create two new wallets for two cosigners. In this demo, they will exist on same node,
but it shouldn't matter if these two wallets are on the same node or not.

```js
'use strict';

const assert = require('assert');
const bcoin = require('bcoin');
const {NodeClient, WalletClient} = require('bclient');

const network = 'regtest';
const m = 2;
const n = 2;

// Wrapper for skipping errors, when you rerun the script
// It could have been as simple as
//  await client.createWallet('primary', options);
const createMultisigWallet = async function createMultisigWallet(client, options, skipExists) {
  assert(client instanceof NodeClient, 'client should be NodeClient');
  assert(options.id, 'You need to provide id in options');

  const defaultOpts = {
    type: 'multisig',
    m: m,
    n: n
  };

  Object.assign(defaultOpts, options);

  let res;
  try {
    res = await client.createWallet('primary', defaultOpts);
  } catch (e) {
    if (skipExists && e.message === 'WDB: Wallet already exists.') {
      return null;
    }

    throw e;
  }

  return res;
};

// Wrapper for skipping errors, when you rerun the script
// It could have been as simple as
//  await client.addSharedKey(account, xpubkey);
const addSharedKey = async function addSharedKey(client, account, xpubkey, skipRemoveError) {
  assert(client instanceof WalletClient, 'client should be WalletClient');
  assert(account, 'should provide account');
  assert(xpubkey, 'should provide xpubkey');

  let res;

  try {
    res = await client.addSharedKey('primary', account, xpubkey);
  } catch (e) {
    if (e.message === 'Cannot remove key.') {
      return null;
    }

    throw e;
  }

  return res;
};

(async () => {
  const client = new NodeClient({ network });

  // Let's create wallets if they don't exist
  await createMultisigWallet(client, { id: 'cosigner1' }, true);
  await createMultisigWallet(client, { id: 'cosigner2' }, true);

  // Initialize wallet http clients
  // They will be talking to Node's API
  const wallet1 = new WalletClient({ id: 'cosigner1', network });
  const wallet2 = new WalletClient({ id: 'cosigner2', network });

  // This isn't strictly necessary, but you can either create new
  // accounts under wallets and use them
  const wallet1account = 'default';
  const wallet2account = 'default';

  // Both wallets need to exchange XPUBKEYs to each other
  // in order to generate receiving and change addresses.
  // Let's take it from the default account.
  const wallet1info = await wallet1.getInfo('primary');
  const wallet2info = await wallet2.getInfo('primary');

  // Grab the xpubkey from wallet, we need to share them
  const wallet1xpubkey = wallet1info.account.accountKey;
  const wallet2xpubkey = wallet2info.account.accountKey;

  // Here we share xpubkeys to each other
  await addSharedKey(wallet1, wallet1account, wallet2xpubkey);
  await addSharedKey(wallet2, wallet2account, wallet1xpubkey);

  // Now we can get address from both wallets
  // NOTE: that both wallets should be on the same index
  // (depth) of derivation to geth the same addresses
  // NOTE: Each time you createAddress index(depth) is
  // incremented an new address is generated
  const address1 = await wallet1.createAddress('primary', wallet1account);
  const address2 = await wallet2.createAddress('primary', wallet2account);

  // Address for both shouuld be the same
  // Unless they were run separately. (Or by manually triggering API)
  console.log(address1);
  console.log(address2);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

You will notice that we grab the `.account.accountKey`, first key is the xpubkey
and both will be using xpubkey key derivation to come up with new addresses.
You won't need to share any other public keys, they will derive them for you.
Depth of the account is the only thing you'll need to keep in mind.
[addSharedKey](https://bcoin.io/api-docs/index.html#add-xpubkey-multisig) in
wallet/account is used for adding cosigner xpubkeys keys.

### Step 2: Generate Transaction

We have received transaction

> Transaction ID: c12e1b260354fd2a2848030222c4a66339892f1d63b18752ff80ef4eb0197d2  
> Output index: 0  
> Amount: 100 BTC  

We are going to send `1 BTC` to `RBg1TLaNuRpH6UTFzogFXhjqubPYZaqWgs` on the regtest network.

We won't need transaction ID and output index when using wallet API.  It will be automatically
allocated from coins by bcoin node wallet service.

```js
'use strict';

const bcoin = require('bcoin');
const {NodeClient, WalletClient} = require('bclient');
const Amount = bcoin.Amount;

const network = 'regtest';
const sendTo = 'RBg1TLaNuRpH6UTFzogFXhjqubPYZaqWgs';

(async () => {
  const client = new NodeClient({ network });
  const wallet1 = new WalletClient({ id: 'cosigner1', network });
  const wallet2 = new WalletClient({ id: 'cosigner2', network });

  // Because we can't sign and spend from account
  // We can't use `spend` as we do with normal transactions
  // since it immediately publishes to the network
  // and we need other signatures first.
  // So we first create the transaction
  const outputs = [{ address: sendTo, value: Amount.fromBTC(1).toValue() }];
  const options = {
    // rate: 1000,
    outputs: outputs
  };

  // This will automatically find coins and fund the transaction (Sign it),
  // also create changeAddress and calculate fee
  const tx1 = await wallet1.createTX('primary', options);

  // Now you can share this raw output
  const raw = tx1.hex;

  // Wallet2 will also sign the transaction
  const tx2 = await wallet2.sign('primary', raw);

  // Now we can broadcast this transaction to the network
  const broadcast = await client.broadcast(tx2.hex);
  console.log(broadcast);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Here you can see it's much cleaner and easier.
We still need to manually, using other means, share
raw transaction data for signing.

`wallet1.createTX(options)` will automatically find the coins
sent to the multisig wallet, allocate them for spending,
send remaining funds (minus fee) to change address and sign it.

`wallet2.sign` will take raw transaction and sign it with according key.
After that we can just broadcast the transaction to the network.

[API-DOCS]: https://bcoin.io/api-docs/index.html


## Final Notes

I hope this guide gives you the opportunity to better understand multisig transactions and build apps on top of it.

You can play with this code, extend it, and even use it in production with small changes (e.g. rate estimation).

Here are some other ideas for how to build out on top of the app we built in this guide:
- Build UI for configuring and initializing `m` and `n`.
- Add communication layer to exchange unsigned transactions and public keys securely.
- Bridge bcoin multisig to different wallets.
