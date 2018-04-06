# Working with transactions
```post-author
Christopher Jeffrey
```
```post-description
Working with transactions using bcoin and the MTX and TX objects.
```

## TX creation

Normal transactions in bcoin are immutable. The primary TX object contains a
bunch of consensus and policy checking methods. A lot of it is for internal use
and pretty boring for users of this library.

Bcoin also offers a mutable transaction object (MTX). Mutable transactions
inherit from the TX object, but can also be signed and modified.

```js
'use strict';

const bcoin = require('bcoin');
const assert = require('assert');
const Keyring = bcoin.wallet.WalletKey;
const MTX = bcoin.MTX;
const Outpoint = bcoin.Outpoint;
const Script = bcoin.Script;

// Create an HD master keypair.
const master = bcoin.hd.generate();

// Derive another private hd key (we don't want to use our master key!).
const key = master.derivePath('m/44/0/0/0/0');

// Create a "keyring" object. A keyring object is basically a key manager that
// is also able to tell you info such as: your redeem script, your scripthash,
// your program hash, your pubkey hash, your scripthash program hash, etc.
// In this case, we'll make it simple and just add one key for a
// pubkeyhash address. `getPublicKey` returns the non-hd public key.
const keyring = new Keyring(key.privateKey);

console.log(keyring.getAddress());

// Create a fake coinbase for our funding.
const cb = new MTX();

// Add a typical coinbase input
cb.addInput({
  prevout: new Outpoint(),
  script: new Script(),
  sequence: 0xffffffff
});

// Send 50,000 satoshis to ourself.
cb.addOutput({
  address: keyring.getAddress(),
  value: 50000
});

// Create our redeeming transaction.
const mtx = new MTX();

// Add output 0 from our coinbase as an input.
mtx.addTX(cb, 0);

// Send 10,000 satoshis to ourself,
// creating a fee of 40,000 satoshis.
mtx.addOutput({
  address: keyring.getAddress(),
  value: 10000
});

// Sign input 0: pass in our keyring.
mtx.sign(keyring);

// The transaction should now verify.
assert(mtx.verify());
assert(mtx.getFee() === 40000);

// Commit our transaction and make it immutable.
// This turns it from an MTX into a TX object.
const tx = mtx.toTX();

// The transaction should still verify.
// Regular transactions require a coin
// viewpoint to be passed in.
assert(tx.verify(mtx.view));
assert(tx.getFee(mtx.view) === 40000);
```

### Coin Selection

The above method works, but is pretty contrived. In reality, you probably
wouldn't select inputs and calculate the fee by hand. You would want a
change output added. Bcoin has a nice method of dealing with this.

Let's try it more realistically:

```js
'use strict';

const bcoin = require('bcoin');
const assert = require('assert');
const Keyring = bcoin.wallet.WalletKey;
const MTX = bcoin.MTX;
const Outpoint = bcoin.Outpoint;
const Script = bcoin.Script;

const master = bcoin.hd.generate();
const key = master.derivePath('m/44/0/0/0/0');
const keyring = new Keyring(key.privateKey);
const cb = new MTX();

cb.addInput({
  prevout: new Outpoint(),
  script: new Script(),
  sequence: 0xffffffff
});

// Send 50,000 satoshis to ourselves.
cb.addOutput({
  address: keyring.getAddress(),
  value: 50000
});

// Our available coins.
const coins = [];

// Convert the coinbase output to a Coin
// object and add it to our available coins.
// In reality you might get these coins from a wallet.
const coin = bcoin.coin.fromTX(cb, 0, -1);
coins.push(coin);

// Create our redeeming transaction.
const mtx = new MTX();

// Send 10,000 satoshis to ourself.
mtx.addOutput({
  address: keyring.getAddress(),
  value: 10000
});

// Now that we've created the output, we can do some coin selection (the output
// must be added first so we know how much money is needed and also so we can
// accurately estimate the size for fee calculation).

// Select coins from our array and add inputs.
// Calculate fee and add a change output.
mtx.fund(coins, {
  // Use a rate of 10,000 satoshis per kb.
  // With the `fullnode` object, you can
  // use the fee estimator for this instead
  // of blindly guessing.
  rate: 10000,
  // Send the change back to ourselves.
  changeAddress: keyring.getAddress()
}).then(() => {
  // Sign input 0
  mtx.sign(keyring);

  // The transaction should now verify.
  assert(mtx.verify());

  // Commit our transaction and make it immutable.
  // This turns it from an MTX into a TX.
  const tx = mtx.toTX();

  // The transaction should still verify.
  // Regular transactions require a coin
  // viewpoint to be passed in.
  assert(tx.verify(mtx.view));
});
```
