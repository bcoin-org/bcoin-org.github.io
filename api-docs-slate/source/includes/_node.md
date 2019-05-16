# bcoin - Node

## bcoin client requests

Complete list of commands:

Command                     |cURL method	| Description
----------------------------|---------------|------------
`/`							| `GET`			| get info
`/tx/:hash`					| `GET`			| TX by hash
`/tx/address/:address`		| `GET`			| TX by address
`/coin/:hash/:index`		| `GET`			| UTXO by txid and index
`/block/:block`				| `GET`			| Block by hash or height
`/mempool`					| `GET`			| Mempool snapshot
`/broadcast`				| `POST`		| Broadcast TX
`/fee`						| `GET`			| Estimate fee
`/reset`					| `POST`		| Reset chain to specific height



## Get server info

```shell--curl
curl $url/
```

```shell--cli
bcoin-cli info
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
  const clientinfo = await client.getInfo();
  console.log(clientinfo);
})();
```

> The above command returns JSON structured like this:

```json
{
  "version": "v1.0.0-pre",
  "network": "regtest",
  "chain": {
    "height": 205,
    "tip": "38d4ff72bca6737d958e1456be90443c0e09186349f28b952564118ace222331",
    "progress": 1
  },
  "indexes": {
    "addr": {
      "enabled": false,
      "height": 0
    },
    "tx": {
      "enabled": false,
      "height": 0
    }
  },
  "pool": {
    "host": "18.188.224.12",
    "port": 48444,
    "agent": "/bcoin:v1.0.0-pre/",
    "services": "1001",
    "outbound": 1,
    "inbound": 1
  },
  "mempool": {
    "tx": 0,
    "size": 0
  },
  "time": {
    "uptime": 1744,
    "system": 1527028546,
    "adjusted": 1527028546,
    "offset": 0
  },
  "memory": {
    "total": 90,
    "jsHeap": 19,
    "jsHeapTotal": 26,
    "nativeHeap": 64,
    "external": 9
  }
}
```

Get server Info.

### HTTP Request
<p>Get server info. No params.</p>

`GET /`

 No Params.


## Get mempool snapshot

```shell--curl
curl $url/mempool
```

```shell--cli
bcoin-cli mempool
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
  const mempool = await client.getMempool();
  console.log(mempool);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
[
  "2ef8051e6c38e136ba4d195c048e78f9077751758db710475fa532b9d9489324",
  "bc3308b61959664b71ac7fb8e9ee17d13476b5a32926f512882851b7631884f9",
  "53faa103e8217e1520f5149a4e8c84aeb58e55bdab11164a95e69a8ca50f8fcc",
  "fff647849be7408faedda377eea6c37718ab39d656af8926e0b4b74453624f32",
  "b3c71dd8959ea97d41324779604b210ae881cdaa5d5abfcbfb3502a0e75c1283",
  ...
]
```

Get mempool snapshot (array of json txs).

### HTTP Request
`GET /mempool`

No Params.


## Get block by hash or height

```javascript
let blockHash, blockHeight;
```

```shell--vars
blockHash='4003e57eb1c60f3d1b774d8a281353c35cd30dca0d76b751c8dd862da11c41de';
blockHeight='94';
```

```shell--curl
curl $url/block/$blockHash # by hash
curl $url/block/$blockHeight # by height
```

```shell--cli
bcoin-cli block $blockHash # by hash
bcoin-cli block $blockHeight # by height
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
  const blockByHeight = await client.getBlock(blockHeight);
  const blockByHash = await client.getBlock(blockHash);
  console.log("By height: \n", blockByHeight);
  console.log("By hash: \n", blockByHash);
})();
```

> The above command returns JSON structured like this:

```json
{
  "hash": "4003e57eb1c60f3d1b774d8a281353c35cd30dca0d76b751c8dd862da11c41de",
  "height": 94,
  "depth": 112,
  "version": 536870912,
  "prevBlock": "353cbab0d0ae1583ceb6bd88d90f44a7bb2cb2aec824eac688dbf1832e648962",
  "merkleRoot": "b23e398ccf2fe2dcf81c6e7b4cc3c710a79c78bf7e8a63dd819acf83952f960f",
  "time": 1527028558,
  "bits": 545259519,
  "nonce": 4,
  "txs": [
    {
      "hash": "b23e398ccf2fe2dcf81c6e7b4cc3c710a79c78bf7e8a63dd819acf83952f960f",
      "witnessHash": "b23e398ccf2fe2dcf81c6e7b4cc3c710a79c78bf7e8a63dd819acf83952f960f",
      "fee": 0,
      "rate": 0,
      "mtime": 1527028763,
      "index": 0,
      "version": 1,
      "inputs": [
        {
          "prevout": {
            "hash": "0000000000000000000000000000000000000000000000000000000000000000",
            "index": 4294967295
          },
          "script": "015e0e6d696e65642062792062636f696e04899fe44e080000000000000000",
          "witness": "00",
          "sequence": 4294967295,
          "address": null
        }
      ],
      "outputs": [
        {
          "value": 5000000000,
          "script": "76a91420a060fec9a7dfac723c521e168876909aa37ce588ac",
          "address": "RCFhpyWXkz5GxskL96q4KtceRXuAMnWUQo"
        }
      ],
      "locktime": 0,
      "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f015e0e6d696e65642062792062636f696e04899fe44e080000000000000000ffffffff0100f2052a010000001976a91420a060fec9a7dfac723c521e168876909aa37ce588ac00000000"
    }
  ]
}
```

Returns block info by block hash or height.

### HTTP Request
`GET /block/:blockhashOrHeight`


### URL Parameters

Parameter | Description
--------- | -----------
:blockhashOrHeight | Hash or Height of block



## Broadcast transaction
```javascript
let tx;
```

```shell--vars
tx='010000000106b014e37704109fefe2c5c9f4227d68840c3497fc89a9832db8504df039a6c7000000006a47304402207dc8173fbd7d23c3950aaf91b1bc78c0ed9bf910d47a977b24a8478a91b28e69022024860f942a16bc67ec54884e338b5b87f4a9518a80f9402564061a3649019319012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff0280c3c901000000001976a91400ba915c3d18907b79e6cfcd8b9fdf69edc7a7db88acc41c3c28010000001976a91437f306a0154e1f0de4e54d6cf9d46e07722b722688ac00000000';
```

```shell--curl
curl $url/broadcast \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "tx": "'$tx'" }'
```

```shell--cli
bcoin-cli broadcast $tx
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
  const result = await client.broadcast(tx);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
{
  "success": true
}
```

Broadcast a transaction by adding it to the node's mempool. If mempool verification fails, the node will still forcefully advertise and relay the transaction for the next 60 seconds.

### HTTP Request
`POST /broadcast`

### POST Parameters (JSON)
Parameter | Description
--------- | -----------
tx | transaction hash
