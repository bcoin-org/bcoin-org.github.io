# RPC Calls - Transactions

## gettxout

```javascript
let txhash, index, includemempool;
```

```shell--vars
txhash='0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8';
index=0;
includemempool=1;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "gettxout",
    "params": [ "'$txhash'", '$index', '$includemempool' ]
  }'
```

```shell--cli
bcoin-cli rpc gettxout $txhash $index $includemempool
```

```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('gettxout', [ txhash, index, includemempool ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "bestblock": "0e11d85b2081b84e131ba6692371737e6bb2aa7bc6d16e92954ffb1f9ad762e5",
  "confirmations": 0,
  "value": 0.4,
  "scriptPubKey": {
    "asm": "OP_DUP OP_HASH160 fe7e0711287688b33b9a5c239336c4700db34e63 OP_EQUALVERIFY OP_CHECKSIG",
    "hex": "76a914fe7e0711287688b33b9a5c239336c4700db34e6388ac",
    "type": "PUBKEYHASH",
    "reqSigs": 1,
    "addresses": [
      "RYUpgnvLvfi5T7q3hGSVvFrUy14kt61FC1"
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
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('gettxoutsetinfo');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "height": 100,
  "bestblock": "0e11d85b2081b84e131ba6692371737e6bb2aa7bc6d16e92954ffb1f9ad762e5",
  "transactions": 101,
  "txouts": 100,
  "bytes_serialized": 0,
  "hash_serialized": 0,
  "total_amount": 5000
}
```

Returns information about UTXO's from Chain.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getrawtransaction

```javascript
let txhash, verbose;
```

```shell--vars
txhash='0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8';
verbose=0;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getrawtransaction",
    "params": [ "'$txhash'", '$verbose' ]
  }'
```

```shell--cli
bcoin-cli rpc getrawtransaction $txhash $verbose
```

```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('getrawtransaction', [ txhash, verbose ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
"0100000001eaefefbd1f687ef4e861804aed59ef05e743ea85f432cc146f325d759a026ce6010000006a4730440220718954e28983c875858b5a0094df4607ce2e7c6e9ffea47f3876792b01755c1202205e2adc7c32ff64aaef6d26045f96181e8741e560b6f3a8ef2f4ffd2892add656012103142355370728640592109c3d2bf5592020a6b9226303c8bc98ab2ebcadf057abffffffff02005a6202000000001976a914fe7e0711287688b33b9a5c239336c4700db34e6388ac10ca0f24010000001976a914af92ad98c7f77559f96430dfef2a6805b87b24f888ac00000000"
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
rawtx='0100000001eaefefbd1f687ef4e861804aed59ef05e743ea85f432cc146f325d759a026ce6010000006a4730440220718954e28983c875858b5a0094df4607ce2e7c6e9ffea47f3876792b01755c1202205e2adc7c32ff64aaef6d26045f96181e8741e560b6f3a8ef2f4ffd2892add656012103142355370728640592109c3d2bf5592020a6b9226303c8bc98ab2ebcadf057abffffffff02005a6202000000001976a914fe7e0711287688b33b9a5c239336c4700db34e6388ac10ca0f24010000001976a914af92ad98c7f77559f96430dfef2a6805b87b24f888ac00000000';
```

```shell--curl
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('decoderawtransaction', [ rawtx ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "txid": "0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8",
  "hash": "0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8",
  "size": 225,
  "vsize": 225,
  "version": 1,
  "locktime": 0,
  "vin": [
    {
      "txid": "e66c029a755d326f14cc32f485ea43e705ef59ed4a8061e8f47e681fbdefefea",
      "scriptSig": {
        "asm": "30440220718954e28983c875858b5a0094df4607ce2e7c6e9ffea47f3876792b01755c1202205e2adc7c32ff64aaef6d26045f96181e8741e560b6f3a8ef2f4ffd2892add65601 03142355370728640592109c3d2bf5592020a6b9226303c8bc98ab2ebcadf057ab",
        "hex": "4730440220718954e28983c875858b5a0094df4607ce2e7c6e9ffea47f3876792b01755c1202205e2adc7c32ff64aaef6d26045f96181e8741e560b6f3a8ef2f4ffd2892add656012103142355370728640592109c3d2bf5592020a6b9226303c8bc98ab2ebcadf057ab"
      },
      "sequence": 4294967295,
      "vout": 1
    }
  ],
  "vout": [
    {
      "value": 0.4,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 fe7e0711287688b33b9a5c239336c4700db34e63 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914fe7e0711287688b33b9a5c239336c4700db34e6388ac",
        "type": "PUBKEYHASH",
        "reqSigs": 1,
        "addresses": [
          "RYUpgnvLvfi5T7q3hGSVvFrUy14kt61FC1"
        ]
      }
    },
    {
      "value": 48.9998184,
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 af92ad98c7f77559f96430dfef2a6805b87b24f8 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914af92ad98c7f77559f96430dfef2a6805b87b24f888ac",
        "type": "PUBKEYHASH",
        "reqSigs": 1,
        "addresses": [
          "RRHY3TejXvTh6B1V5auViS9jVUcNxAUcrj"
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
script='76a914af92ad98c7f77559f96430dfef2a6805b87b24f888ac';
```

```shell--curl
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('decodescript', [ script ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "asm": "OP_DUP OP_HASH160 af92ad98c7f77559f96430dfef2a6805b87b24f8 OP_EQUALVERIFY OP_CHECKSIG",
  "type": "PUBKEYHASH",
  "reqSigs": 1,
  "addresses": [
    "RRHY3TejXvTh6B1V5auViS9jVUcNxAUcrj"
  ],
  "p2sh": "GYtKY86R5JdPqDGEa3meuhE1tz3f7M45uD"
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
rawtx='0100000001eaefefbd1f687ef4e861804aed59ef05e743ea85f432cc146f325d759a026ce6010000006a4730440220718954e28983c875858b5a0094df4607ce2e7c6e9ffea47f3876792b01755c1202205e2adc7c32ff64aaef6d26045f96181e8741e560b6f3a8ef2f4ffd2892add656012103142355370728640592109c3d2bf5592020a6b9226303c8bc98ab2ebcadf057abffffffff02005a6202000000001976a914fe7e0711287688b33b9a5c239336c4700db34e6388ac10ca0f24010000001976a914af92ad98c7f77559f96430dfef2a6805b87b24f888ac00000000';
```

```shell--curl
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('sendrawtransaction', [ rawtx ]);
  console.log(result);
})();
```

>

```json
"0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8"
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
txhash='0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8';
txindex=1;
amount=48.99900000;
address='RStiqGLWA3aSMrWDyJvur4287GQ81AtLh1';
data='';
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "createrawtransaction",
    "params": [
      [{ "txid": "'$txhash'", "vout": '$txindex' }],
      { "'$address'": '$amount', "data": "'$data'" }
    ]
  }'
```

```shell--cli
bcoin-cli rpc createrawtransaction \
  '[{ "txid": "'$txhash'", "vout": '$txindex' }]' \
  '{ "'$address'": '$amount', "data": "'$data'" }'
```

```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const sendTo = {
    data: data
  };
  sendTo[address] = amount;
  const result = await client.execute('createrawtransaction', [ [{ txid: txhash, vout: txindex }], sendTo]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
"0100000001e8d187daf94405848c2446bde3689be4ebc93dd103748e388b7c7655660d690e0100000000ffffffff02608a0e24010000001976a914c1325e8fb60bd71d23532c39b4c9e743a2cc764988ac0000000000000000026a0000000000"
```

<aside class="info">
Note: Transaction in example doesn't specify change output,
you can do it by specifying another <code>address: amount</code> pair.
</aside>

<aside class="warning">
Amounts are expressed in FULL BITCOINS (not satoshis) in all three interface methods.
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
2.1 | address | 0 | `address: amount` key pairs (_string_: _float_)
2.2 | data | nullData | Data output (added as `OP_RETURN`)
3 | locktime | | earliest time a transaction can be added


## signrawtransaction

```javascript
let rawtx, txhash, txindex, scriptPubKey, amount, privkey;
```

```shell--vars
rawtx='0100000001e8d187daf94405848c2446bde3689be4ebc93dd103748e388b7c7655660d690e0100000000ffffffff02608a0e24010000001976a914c1325e8fb60bd71d23532c39b4c9e743a2cc764988ac0000000000000000026a0000000000';
txhash='0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8';
txindex=1;
scriptPubKey='76a914af92ad98c7f77559f96430dfef2a6805b87b24f888ac';
amount=48.99900000;
privkey='ELvsQiH9X1kgmbzD1j4ESAJnN47whh8qZHVF8B9DpSpecKQDcfX6';
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "signrawtransaction",
    "params": [
      "'$rawtx'",
      [{
        "txid": "'$txhash'",
        "vout": '$txindex',
        "scriptPubKey": "'$scriptPubKey'",
        "amount": '$amount'
      }],
      [ "'$privkey'" ]
    ]
  }'
```

```shell--cli
bcoin-cli rpc signrawtransaction $rawtx \
  '[{ "txid": "'$txhash'", "vout": '$txindex', "scriptPubKey": "'$scriptPubKey'", "amount": '$amount' }]' \
  '[ "'$privkey'" ]'
```


```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('signrawtransaction', [ rawtx,
    [{
      txid: txhash,
      vout: txindex,
      scriptPubKey: scriptPubKey,
      amount: amount
    }],
    [ privkey ]
  ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "hex": "0100000001e8d187daf94405848c2446bde3689be4ebc93dd103748e388b7c7655660d690e010000006a47304402205088870d469e5a878c54186e971cdc59d4e0c74f1c88709f584590ba76a9b97002202b4810a122fc4977e5a77c80dc68d4ffa73d22dbf385e46241dda6bddfd7993901210284a937f256393b3ba686556e90bd000706600bdbee4169abd092f392689307d2ffffffff02608a0e24010000001976a914c1325e8fb60bd71d23532c39b4c9e743a2cc764988ac0000000000000000026a0000000000",
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
2.5 | amount | | value of output in BTC
3 | privkeylist | | List of private keys
4 | sighashtype | | Type of signature hash



## gettxoutproof

```javascript
let txid0, txid1;
```

```shell--vars
txid0='0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8';
txid1='e66c029a755d326f14cc32f485ea43e705ef59ed4a8061e8f47e681fbdefefea';
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "gettxoutproof",
    "params": [ ["'$txid0'", "'$txid1'"] ]
  }'
```

```shell--cli
bcoin-cli rpc gettxoutproof '[ "'$txid0'", "'$txid1'" ]'
```


```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('gettxoutproof', [ [ txid0, txid1 ] ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
"00000020e562d79a1ffb4f95926ed1c67baab26b7e73712369a61b134eb881205bd8110ef08c63626ea13ca11fddad4f2c0a2b67354efdcd50f769b73330af205dcdd054cbd3055bffff7f20010000000500000004ae4be9cd199b09f605119820680eb23462746e98fbc2b0c635643f00b34c3cd8958799d4b8d29f4ab6ae6495047d330a9ea83b377cbb937395c302ea98c72279eaefefbd1f687ef4e861804aed59ef05e743ea85f432cc146f325d759a026ce6e8d187daf94405848c2446bde3689be4ebc93dd103748e388b7c7655660d690e02eb01"
```

Checks if transactions are within block.
Returns proof of transaction inclusion (raw MerkleBlock).

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
proof='00000020e562d79a1ffb4f95926ed1c67baab26b7e73712369a61b134eb881205bd8110ef08c63626ea13ca11fddad4f2c0a2b67354efdcd50f769b73330af205dcdd054cbd3055bffff7f20010000000500000004ae4be9cd199b09f605119820680eb23462746e98fbc2b0c635643f00b34c3cd8958799d4b8d29f4ab6ae6495047d330a9ea83b377cbb937395c302ea98c72279eaefefbd1f687ef4e861804aed59ef05e743ea85f432cc146f325d759a026ce6e8d187daf94405848c2446bde3689be4ebc93dd103748e388b7c7655660d690e02eb01';
```

```shell--curl
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('verifytxoutproof', [ proof ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  "e66c029a755d326f14cc32f485ea43e705ef59ed4a8061e8f47e681fbdefefea",
  "0e690d6655767c8b388e7403d13dc9ebe49b68e3bd46248c840544f9da87d1e8"
]
```

Checks the proof for transaction inclusion. Returns transaction hash if valid.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | proof | Required | Proof of transaction inclusion (raw MerkleBlock).
