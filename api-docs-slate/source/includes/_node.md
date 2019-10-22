# bcoin - Node

## bcoin client requests

Click a command to see its complete description and usage.

Command                     |cURL method    | Description
----------------------------|---------------|------------
[`/`](#get-server-info)                                   | `GET`   | Get basic info
[`/tx/:hash`](#get-tx-by-hash)                            | `GET`   | TX by hash
[`/tx/address/:address`](#get-tx-by-address)              | `GET`   | TX by address
[`/coin/:hash/:index`](#get-coin-by-outpoint)             | `GET`   | UTXO by txid and index
[`/block/:block`](#get-block-by-hash-or-height)           | `GET`   | Block by hash or height
[`/header/:block`](#get-block-header-by-hash-or-height)   | `GET`   | Block header by hash or height
[`/filter/:block`](#get-block-filter-by-hash-or-height)   | `GET`   | BIP158 block filter by hash or height
[`/mempool`](#get-mempool-snapshot)                       | `GET`   | Mempool snapshot
[`/broadcast`](#broadcast-transaction)                    | `POST`  | Broadcast TX
[`/fee`](#estimate-fee)                                   | `GET`   | Estimate fee
[`/reset`](#reset-blockchain)                             | `POST`  | Reset chain to specific height


## Get server info

```shell--curl
curl $url/
```

```shell--cli
bcoin-cli info
```

```javascript
const {NodeClient, Network} = require('bcoin');
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
  "version": "2.0.0-dev",
  "network": "regtest",
  "chain": {
    "height": 208,
    "tip": "283163d3fdf2591ea79fafe110a34e8c735e69c98046e46eeba795fa65d2a2ab",
    "progress": 0.9997082948837989
  },
  "indexes": {
    "addr": {
      "enabled": true,
      "height": 208
    },
    "tx": {
      "enabled": true,
      "height": 208
    },
    "filter": {
      "enabled": true,
      "height": 208
    }
  },
  "pool": {
    "host": "100.200.50.10",
    "port": 48444,
    "agent": "/bcoin:2.0.0-dev/",
    "services": "1001",
    "outbound": 0,
    "inbound": 0
  },
  "mempool": {
    "tx": 0,
    "size": 0,
    "orphans": 0
  },
  "time": {
    "uptime": 109,
    "system": 1571749599,
    "adjusted": 1571749599,
    "offset": 0
  },
  "memory": {
    "total": 55,
    "jsHeap": 19,
    "jsHeapTotal": 33,
    "nativeHeap": 22,
    "external": 7
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
const {NodeClient, Network} = require('bcoin');
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
const {NodeClient, Network} = require('bcoin');
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


## Get block header by hash or height

```javascript
let blockHash, blockHeight;
```

```shell--vars
blockHash='6f1003edd05cad861395225415160b5236968cc223fe982796b6e959c9651d44';
blockHeight='100';
```

```shell--curl
curl $url/header/$blockHash # by hash
curl $url/header/$blockHeight # by height
```

```shell--cli
bcoin-cli header $blockHash # by hash
bcoin-cli header $blockHeight # by height
```

```javascript
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const headerByHeight = await client.getBlockHeader(blockHeight);
  const headerByHash = await client.getBlockHeader(blockHash);
  console.log("By height: \n", headerByHeight);
  console.log("By hash: \n", headerByHash);
})();
```

> The above command returns JSON structured like this:

```json
{
  "hash": "6f1003edd05cad861395225415160b5236968cc223fe982796b6e959c9651d44",
  "version": 536870912,
  "prevBlock": "0c4ea5e675941eca1909275f21903cef755069a03c57c10f4d4dadcdd7146daf",
  "merkleRoot": "9a249c682aba07943c8a1f9bd774a15d71372fcd7f3f9ee99e8c7aa022ae6aa0",
  "time": 1571661863,
  "bits": 545259519,
  "nonce": 8,
  "height": 100,
  "chainwork": "00000000000000000000000000000000000000000000000000000000000000ca"
}
```

Returns block header by block hash or height.

### HTTP Request
`GET /header/:blockhashOrHeight`


### URL Parameters

Parameter | Description
--------- | -----------
:blockhashOrHeight | Hash or Height of block


## Get block filter by hash or height

```javascript
let blockHash, blockHeight;
```

```shell--vars
blockHash='6f1003edd05cad861395225415160b5236968cc223fe982796b6e959c9651d44';
blockHeight='100';
```

```shell--curl
curl $url/filter/$blockHash # by hash
curl $url/filter/$blockHeight # by height
```

```shell--cli
bcoin-cli filter $blockHash # by hash
bcoin-cli filter $blockHeight # by height
```

```javascript
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const filterByHeight = await client.getFilter(blockHeight);
  const filterByHash = await client.getFilter(blockHash);
  console.log("By height: \n", filterByHeight);
  console.log("By hash: \n", filterByHash);
})();
```

> The above command returns JSON structured like this:

```json
{
  "filter": "011ece10",
  "header": "14940c1a3a7c764a1939300c386ceb378abfa581c243ad2c19bf7e0b52a09a09"
}
```

Returns BIP158 block filter by block hash or height.

### HTTP Request
`GET /filter/:blockhashOrHeight`


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
const {NodeClient, Network} = require('bcoin');
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


## Estimate fee
```javascript
let blocks;
```

```shell--vars
blocks=3
```

```shell--curl
curl $url/fee?blocks=$blocks
```

```shell--cli
bcoin-cli fee $blocks
```

```javascript
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.estimateFee(blocks);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
{
  "rate": 13795
}
```

Estimate the fee required (in Satoshis per kB) for a transaction to be confirmed by the network within a targeted number of blocks (default 1).

### HTTP Request
`GET /fee`

### GET Parameters
Parameter | Description
--------- | -----------
blocks | Number of blocks to target confirmation


## Reset blockchain
```javascript
let height;
```

```shell--vars
height=1000;
```

```shell--curl
curl $url/reset \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "height": '$height' }'
```

```shell--cli
bcoin-cli reset $height
```

```javascript
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.reset(height);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
{
  "success": true
}
```

Triggers a hard-reset of the blockchain. All blocks are disconnected from the tip
down to the provided height. Indexes and Chain Entries are removed. Useful for
"rescanning" an SPV wallet. Since there are no blocks stored on disk, the only
way to rescan the blockchain is to re-request [merkle]blocks from peers.

### HTTP Request
`POST /reset`

### POST Parameters (JSON)
Parameter | Description
--------- | -----------
height | block height to reset chain to 
