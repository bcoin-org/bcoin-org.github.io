# Store Data on the Blockchain

```post-author
Javed Khan
```
```post-description
This example creates a transaction with output containing a null data script with our data.
```

## OP_RETURN Script Opcode
OP_RETURN is a script opcode which can be used to store an arbitrary 40-byte
data as a part of the signature script (null data script), allowing one to
embed a small amount of data into the blockchain. For example, it can be used
as a way to track digital assets or certify a document with proof-of-existence.
Note that outputs associated with a null data script are lost forever, so make
sure you use a zero value output!

This example creates a transaction with output containing a null data script
with our data:

```javascript
const bcoin = require("bcoin");
const {WalletClient} = require('bclient');
const network = bcoin.Network.get('regtest');

let id, passphrase, rate, script, output;
id="primary"
passphrase="pass"
rate=5000
script = bcoin.Script.fromNulldata(Buffer.from("with ❤︎ from bcoin"))
output = bcoin.Output.fromScript(script, 0)

const wallet = new WalletClient({
  port: network.walletPort,
  apiKey: 'foo'
});

const options = {
  rate: rate,
  outputs: [output],
  passphrase: passphrase
};

(async () => {
  const tx = await wallet.send('primary', options);
  console.log(tx);
})();
```

As an example, here is a transaction created on testnet using the above script: 3bfced561161ce4378132fabe72dd2a1fb8654ceed3d4ceb554f2bb7420b86e7

One can verify this by fetching the transaction and converting its output signature script to ascii string.
