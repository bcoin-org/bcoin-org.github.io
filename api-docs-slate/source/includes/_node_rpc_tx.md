# RPC Calls - Transactions

## gettxout

```javascript
let txhash, index, includemempool;
```

```shell--vars
txhash='28d65fdaf5334ffd29066d7076f056bb112baa4bb0842f6eaa06171c277b4e8c';
index=0;
includemempool=1;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "gettxout",
    "params": [ "'$txhash'", "'$index'", "'$includemempool'" ]
  }'
```

```shell--cli
bcoin-cli rpc gettxout $txhash $index $includemempool
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('gettxout', [ txhash, index, includemempool ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "bestblock": "00000000000004f0fbf1b2290e8255bbd468640d747fd9d44a16e77d9e129a55",
  "confirmations": 1,
  "value": 1.01,
  "scriptPubKey": {
    "asm": "OP_HASH160 6a58967510cfd7e04987b245f73dbf62e8d3fdf8 OP_EQUAL",
    "hex": "a9146a58967510cfd7e04987b245f73dbf62e8d3fdf887",
    "type": "SCRIPTHASH",
    "reqSigs": 1,
    "addresses": [
      "2N2wXjoQbEQTKQuqYdkpHMp7rPpnpumYYqe"
    ]
  },
  "version": 1,
  "coinbase": false
}
```

Get outpoint of the transaction.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txid | Required | Transaction hash
2 | index | Required | Index of the Outpoint tx.
3 | includemempool | true | Whether to include mempool transactions.



## gettxoutsetinfo

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "gettxoutsetinfo",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc gettxoutsetinfo
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('gettxoutsetinfo');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "height": 1178729,
  "bestblock": "00000000000004f0fbf1b2290e8255bbd468640d747fd9d44a16e77d9e129a55",
  "transactions": 14827318,
  "txouts": 17644185,
  "bytes_serialized": 0,
  "hash_serialized": 0,
  "total_amount": 20544080.67292757
}
```

Returns information about UTXO's from Chain.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getrawtransaction

```javascript
let txhash, verbose=0;
```

```shell--vars
txhash='28d65fdaf5334ffd29066d7076f056bb112baa4bb0842f6eaa06171c277b4e8c';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getrawtransaction",
    "params": [ "'$txhash'", "'$verbose'" ]
  }'
```

```shell--cli
bcoin-cli rpc getrawtransaction $txhash $verbose
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getrawtransaction', [ txhash, verbose ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
"0100000002500310ff36beb6c3608230534ef995f7751b6f948aeea8d21d5cc9dd5023a2c4010000006b483045022100e7c71d397b687f9f30e6003ceedc4c50436fdb2329b7a8a36c9c6759077969d30220059f24e917260d3e601c77079d03c9e73d04fd85f625eaebfd14a1ff695a72230121020bc134c91f4ff068f3a970616fad577f949406c18849321a2f6d4df96fc56c77feffffffeffed95ded4f227fc6717f224e85e50348ce0198303a5418f157ade42828a1e3000000006b483045022100f0bde463404db0983e0f221bfa1b13edf1063a78e869295c9457864b122a622b02207d9d5df76ecac6289784201e9a918acb34510c2d65144bf8e4753a3413024e320121022565ed0ff8f79ecf11e8f33b9fbba5606dbc0618813acd74603f9466e88fb8a8feffffff02402305060000000017a9146a58967510cfd7e04987b245f73dbf62e8d3fdf8871e194f00000000001976a914132b05f47f2b1b56f26a78d3962e3acd0735f12d88ac00000000"
```

Returns raw transaction

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txhash | Required | Transaction hash
2 | verbose | false | Returns json formatted if true



## decoderawtransaction

```javascript
let rawtx;
```

```shell--vars
rawtx='0100000002500310ff36beb6c3608230534ef995f7751b6f948aeea8d21d5cc9dd5023a2c4010000006b483045022100e7c71d397b687f9f30e6003ceedc4c50436fdb2329b7a8a36c9c6759077969d30220059f24e917260d3e601c77079d03c9e73d04fd85f625eaebfd14a1ff695a72230121020bc134c91f4ff068f3a970616fad577f949406c18849321a2f6d4df96fc56c77feffffffeffed95ded4f227fc6717f224e85e50348ce0198303a5418f157ade42828a1e3000000006b483045022100f0bde463404db0983e0f221bfa1b13edf1063a78e869295c9457864b122a622b02207d9d5df76ecac6289784201e9a918acb34510c2d65144bf8e4753a3413024e320121022565ed0ff8f79ecf11e8f33b9fbba5606dbc0618813acd74603f9466e88fb8a8feffffff02402305060000000017a9146a58967510cfd7e04987b245f73dbf62e8d3fdf8871e194f00000000001976a914132b05f47f2b1b56f26a78d3962e3acd0735f12d88ac00000000';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "decoderawtransaction",
    "params": [ "'$rawtx'" ]
  }'
```

```shell--cli
bcoin-cli rpc decoderawtransaction $rawtx
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('decoderawtransaction', [ rawtx ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "txid": "28d65fdaf5334ffd29066d7076f056bb112baa4bb0842f6eaa06171c277b4e8c",
  "hash": "28d65fdaf5334ffd29066d7076f056bb112baa4bb0842f6eaa06171c277b4e8c",
  "size": 372,
  "vsize": 372,
  "version": 1,
  "locktime": 0,
  "vin": [
    {
      "txid": "c4a22350ddc95c1dd2a8ee8a946f1b75f795f94e53308260c3b6be36ff100350",
      "scriptSig": {
        "asm": "3045022100e7c71d397b687f9f30e6003ceedc4c50436fdb2329b7a8a36c9c6759077969d30220059f24e917260d3e601c77079d03c9e73d04fd85f625eaebfd14a1ff695a722301 020bc134c91f4ff068f3a970616fad577f949406c18849321a2f6d4df96fc56c77",
        "hex": "483045022100e7c71d397b687f9f30e6003ceedc4c50436fdb2329b7a8a36c9c6759077969d30220059f24e917260d3e601c77079d03c9e73d04fd85f625eaebfd14a1ff695a72230121020bc134c91f4ff068f3a970616fad577f949406c18849321a2f6d4df96fc56c77"
      },
      "sequence": 4294967294,
      "vout": 1
    },
    {
      "txid": "e3a12828e4ad57f118543a309801ce4803e5854e227f71c67f224fed5dd9feef",
      "scriptSig": {
        "asm": "3045022100f0bde463404db0983e0f221bfa1b13edf1063a78e869295c9457864b122a622b02207d9d5df76ecac6289784201e9a918acb34510c2d65144bf8e4753a3413024e3201 022565ed0ff8f79ecf11e8f33b9fbba5606dbc0618813acd74603f9466e88fb8a8",
        "hex": "483045022100f0bde463404db0983e0f221bfa1b13edf1063a78e869295c9457864b122a622b02207d9d5df76ecac6289784201e9a918acb34510c2d65144bf8e4753a3413024e320121022565ed0ff8f79ecf11e8f33b9fbba5606dbc0618813acd74603f9466e88fb8a8"
      },
      "sequence": 4294967294,
      "vout": 0
    }
  ],
  "vout": [
    {
      "value": 1.01,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_HASH160 6a58967510cfd7e04987b245f73dbf62e8d3fdf8 OP_EQUAL",
        "hex": "a9146a58967510cfd7e04987b245f73dbf62e8d3fdf887",
        "type": "SCRIPTHASH",
        "reqSigs": 1,
        "addresses": [
          "2N2wXjoQbEQTKQuqYdkpHMp7rPpnpumYYqe"
        ]
      }
    },
    {
      "value": 0.05183774,
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 132b05f47f2b1b56f26a78d3962e3acd0735f12d OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914132b05f47f2b1b56f26a78d3962e3acd0735f12d88ac",
        "type": "PUBKEYHASH",
        "reqSigs": 1,
        "addresses": [
          "mhGJg1PJg8hVPX9A6zg4q389YFisSzQW6d"
        ]
      }
    }
  ],
  "blockhash": null,
  "confirmations": 0,
  "time": 0,
  "blocktime": 0
}
```

Decodes raw tx and provide chain info.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | rawtx | Required | Raw transaction hex



## decodescript

```javascript
let script;
```

```shell--vars
script='483045022100f0bde463404db0983e0f221bfa1b13edf1063a78e869295c9457864b122a622b02207d9d5df76ecac6289784201e9a918acb34510c2d65144bf8e4753a3413024e320121022565ed0ff8f79ecf11e8f33b9fbba5606dbc0618813acd74603f9466e88fb8a8';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "decodescript",
    "params": [ "'$script'" ]
  }'
```

```shell--cli
bcoin-cli rpc decodescript $script
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('decodescript', [ script ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "asm": "3045022100f0bde463404db0983e0f221bfa1b13edf1063a78e869295c9457864b122a622b02207d9d5df76ecac6289784201e9a918acb34510c2d65144bf8e4753a3413024e3201 022565ed0ff8f79ecf11e8f33b9fbba5606dbc0618813acd74603f9466e88fb8a8",
  "type": "NONSTANDARD",
  "reqSigs": 1,
  "addresses": [],
  "p2sh": "2MyVRHsEpec67MkPLGr4NR2bT1ZFuzFGUoB"
}
```

Decodes script

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | script | Required | Script hex


## sendrawtransaction

```javascript
let rawtx;
```

```shell--vars
rawtx='0100000002500310ff36beb6c3608230534ef995f7751b6f948aeea8d21d5cc9dd5023a2c4010000006b483045022100e7c71d397b687f9f30e6003ceedc4c50436fdb2329b7a8a36c9c6759077969d30220059f24e917260d3e601c77079d03c9e73d04fd85f625eaebfd14a1ff695a72230121020bc134c91f4ff068f3a970616fad577f949406c18849321a2f6d4df96fc56c77feffffffeffed95ded4f227fc6717f224e85e50348ce0198303a5418f157ade42828a1e3000000006b483045022100f0bde463404db0983e0f221bfa1b13edf1063a78e869295c9457864b122a622b02207d9d5df76ecac6289784201e9a918acb34510c2d65144bf8e4753a3413024e320121022565ed0ff8f79ecf11e8f33b9fbba5606dbc0618813acd74603f9466e88fb8a8feffffff02402305060000000017a9146a58967510cfd7e04987b245f73dbf62e8d3fdf8871e194f00000000001976a914132b05f47f2b1b56f26a78d3962e3acd0735f12d88ac00000000';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "sendrawtransaction",
    "params": [ "'$rawtx'" ]
  }'
```

```shell--cli
bcoin-cli rpc sendrawtransaction $rawtx
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('sendrawtransaction', [ rawtx ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

>

```json
"28d65fdaf5334ffd29066d7076f056bb112baa4bb0842f6eaa06171c277b4e8c"
```

Sends raw transaction without verification

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | rawtx | Required | Raw transaction hex



## createrawtransaction

```javascript
let txhash, txindex, amount, address, data;
```

```shell--vars
txhash='d1e1b6a8ff8c4d2ade2113a5dd250637e5f99667d36dcae9b70139516cb7052f';
txindex=1;
amount=1;

address='RStiqGLWA3aSMrWDyJvur4287GQ81AtLh1';
data='';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "createrawtransaction",
    "params": [
      [{ "txid": "'$txhash'", "vout": "'$txindex'" }],
      { "'$address'": "'$amount'", "data": "'$data'" }
    ]
  }'
```

```shell--cli
bcoin-cli rpc createrawtransaction \
  '[{ "txid": "'$txhash'", "vout": "'$txindex'" }]' \
  '{ "'$address'": "'$amount'", "data": "'$data'" }'

```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'regtest'
});

(async () => {
  const sendTo = {
    data: data
  };

  sendTo[address] = amount;

  const res = await rpc.execute('createrawtransaction', [ [{ txid: txhash, vout: txindex }], sendTo]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
"01000000012f05b76c513901b7e9ca6dd36796f9e5370625dda51321de2a4d8cffa8b6e1d10100000000ffffffff0200e1f505000000001976a914c1325e8fb60bd71d23532c39b4c9e743a2cc764988ac0000000000000000026a0000000000"
```

<aside class="info">
Note: Transaction in example doesn't specify change output,
you can do it by specifying another <code>address: amount</code> pair.
</aside>

Creates raw, unsigned transaction without any formal verification.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | outpoints | Required | Outpoint list
1.1 | txid | | Transaction Hash
1.2 | vout | | Transaction Outpoint Index
1.3 | sequence | | Sequence number for input
2 | sendto | Required | List of addresses with amounts that we are sending to.
2.1 | address | 0 | `address: amount` key pairs
2.2 | data | nullData | Data output
3 | locktime | | earliest time a transaction can be added


## signrawtransaction

```javascript
let rawtx, txhash, txindex, scriptPubKey, amount, privkey;
```

```shell--vars
rawtx='01000000012f05b76c513901b7e9ca6dd36796f9e5370625dda51321de2a4d8cffa8b6e1d10100000000ffffffff020000000000000000026a0000e1f505000000001976a914c1325e8fb60bd71d23532c39b4c9e743a2cc764988ac00000000';
txhash='d1e1b6a8ff8c4d2ade2113a5dd250637e5f99667d36dcae9b70139516cb7052f';
txindex=1;
scriptPubKey='76a9146efd5e2fda72ae2e37f8fb8cde83fbc8025fc96e88ac';
amount=1;

privkey='ET4VkeCoHmtKtoWJKco5PBSaVkqsVwqSbsqhneqN4Uo5yaTMxRmV';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "signrawtransaction",
    "params": [
      "'$rawtx'",
      [{
        "txid": "'$txhash'",
        "vout": "'$txindex'",
        "scriptPubKey": "'$scriptPubKey'",
        "amount": "'$amount'"
      }],
      [ "'$privkey'" ]
    ]
  }'
```

```shell--cli
bcoin-cli rpc signrawtransaction $rawtx \
  '[{ "txid": "'$txhash'", "vout": "'$txindex'", "scriptPubKey": "'$scriptPubKey'", "amount": "'$amount'" }]' \
  '[ "'$privkey'" ]'
```


```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'regtest'
});

(async () => {
  const res = await rpc.execute('signrawtransaction', [ rawtx,
    [{
      txid: txhash,
      vout: txindex,
      scriptPubKey: scriptPubKey,
      amount: amount
    }],
    [ privkey ]
  ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "hex": "01000000012f05b76c513901b7e9ca6dd36796f9e5370625dda51321de2a4d8cffa8b6e1d1010000006b48304502210094252b4db106def63264668717c5ad66e2804c5e1b390c6240e82515fb0c12690220708430b14ceb0a15308e665de21cb3eb9e6cd9e4571e110fbfddf65ef702cd990121035ef2bf6d09a343c4c0be6fb5b489b217c00f477a9878b60ca3ceca4c2b052c3cffffffff020000000000000000026a0000e1f505000000001976a914c1325e8fb60bd71d23532c39b4c9e743a2cc764988ac00000000",
  "complete": true
}
```

Signs raw transaction

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | rawtx | Required | raw tx
2 | inputs | Required | Coins you're going to spend
2.1 | txid | | Transaction Hash
2.2 | vout | | Transaction Outpoint Index
2.3 | scriptPubKey | | script with pubkey you are going to sign
2.4 | redeemScript | | redeemScript if tx is P2SH
3 | privkeylist | | List of private keys
4 | sighashtype | | Type of signature hash



## gettxoutproof

```javascript
let txhash;
```

```shell--vars
txhash='c75f8c12c6d0d1a16d7361b724898968c71de0335993ee589f82fda8ac482bfc';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "gettxoutproof",
    "params": [ "'$txhash'" ]
  }'
```

```shell--cli
bcoin-cli rpc gettxoutproof $txhash
```


```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('gettxoutproof', [ txhash ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
"000000208c13da491196839dd019c4ae0564f351502a4951e11b4302454b020000000000f1788fd057d657150b12e5638c7348fb55fdcda4ff4ddb1d1503de3576de6a4cbe22db58f0ec091b918981c50200000001f1788fd057d657150b12e5638c7348fb55fdcda4ff4ddb1d1503de3576de6a4c0100"
```

Checks if transactions are within block.
Returns raw block.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txidlist | Required | array of transaction hashes
2 | blockhash | Based on TX | Block hash


## verifytxoutproof

```javascript
let proof;
```

```shell--vars
proof='000000208c13da491196839dd019c4ae0564f351502a4951e11b4302454b020000000000f1788fd057d657150b12e5638c7348fb55fdcda4ff4ddb1d1503de3576de6a4cbe22db58f0ec091b918981c50200000001f1788fd057d657150b12e5638c7348fb55fdcda4ff4ddb1d1503de3576de6a4c0100';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "verifytxoutproof",
    "params": [ "'$proof'" ]
  }'
```

```shell--cli
bcoin-cli rpc verifytxoutproof $proof
```


```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('verifytxoutproof', [ proof ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
[]
```

Checks the proof for transaction inclusion.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | proof | Required | Proof of transaction inclusion.
