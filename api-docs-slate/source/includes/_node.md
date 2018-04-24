# Node

## JSON-RPC Requests

Route for JSON-RPC requests, most of which mimic the bitcoind RPC calls completely.

```shell--curl
curl $url \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "method": "getblockchaininfo", "params": [] }'
```

### HTTP Request
`POST /`

More about RPC Requests in RPC Docs.

## Get server info

```shell--curl
curl $url/
```

```shell--cli
bcoin-cli info
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  await client.open();
  const info = await client.getInfo();

  console.log(info);

  await client.close();
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
{
  "version": "v1.0.0-beta.14",
  "network": "testnet",
  "chain": {
    "height": 1157058,
    "tip": "00000000000002ac70408966be53a1e01e7e014a3d4f1f275201c751de7d6e77",
    "progress": 1
  },
  "pool": {
    "host": "203.0.113.114",
    "port": 18333,
    "agent": "/bcoin:v1.0.0-beta.14/",
    "services": "1001",
    "outbound": 8,
    "inbound": 0
  },
  "mempool": {
    "tx": 39,
    "size": 121512
  },
  "time": {
    "uptime": 7403,
    "system": 1502381034,
    "adjusted": 1502381035,
    "offset": 1
  },
  "memory": {
    "total": 87,
    "jsHeap": 23,
    "jsHeapTotal": 30,
    "nativeHeap": 56,
    "external": 8
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  await client.open();
  const mempoolTxs = await client.getMempool();

  console.log(mempoolTxs);

  await client.close();
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
[
  "9fee8350a3cc2f5bfa9d90f008af0bbc22d84aa5b1242da2f3479935f597c9ed",
  "d3bd772f3b369e2e04b9b928e40dddded5ee1448b9d1ee0b6a13e6c2ae283f6a",
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
blockHash='00000000cabd2d0245add40f335bab18d3e837eccf868b64aabbbbac74fb21e0';
blockHeight='1500';
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  await client.open();
  const blockByHash = await client.getBlock(blockHash);
  const blockByHeight = await client.getBlock(blockHeight);

  console.log(blockByHash, blockByHeight);

  await client.close();
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
{
  "hash": "00000000cabd2d0245add40f335bab18d3e837eccf868b64aabbbbac74fb21e0",
  "height": 1500,
  "version": 1,
  "confirmations": 1192251,
  "prevBlock": "00000000f651e7fe6d9a4845dcf40f5642216e59054453a4368a73a7295f9f3d",
  "merkleRoot": "e3e4590784a828967e6d9319eca2915c1860a63167449f9605e649a0aafe6d0a",
  "time": 1337966228,
  "bits": 486604799,
  "nonce": 2671491584,
  "txs": [
    {
      "hash": "e3e4590784a828967e6d9319eca2915c1860a63167449f9605e649a0aafe6d0a",
      "witnessHash": "e3e4590784a828967e6d9319eca2915c1860a63167449f9605e649a0aafe6d0a",
      "fee": 0,
      "rate": 0,
      "mtime": 1502382669,
      "index": 0,
      "version": 1,
      "flag": 1,
      "inputs": [
        {
          "prevout": {
            "hash": "0000000000000000000000000000000000000000000000000000000000000000",
            "index": 4294967295
          },
          "script": "0494bebf4f0108172f503253482f49636549726f6e2d51432d6d696e65722f",
          "witness": "00",
          "sequence": 4294967295,
          "address": null
        }
      ],
      "outputs": [
        {
          "value": 5000000000,
          "script": "21032fd2666c8d5ffae0147acc0b9628160652679663397e911170ebaf1e26358abfac",
          "address": "mtohBeScUtM2ndcmmpSV8o2jcvmknp1Mpy"
        }
      ],
      "locktime": 0
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
tx='0100000001ff2a3afc3a8133a3bfeedd391bc3cff39d47fe4e3caee492a93f92edff76b9d4000000006a47304402204cc6a35cb3d3d976cb10e3c98df66aba29b5efc7b5ecdbc0f4ed949aa64235f20220512fce2d63739012094f12c3a9402919b32149c32d4d71a3448d4695ae8e3dc601210325c9abd8916d6e5ba0b3c501a70c0186f3bf6e4567922b9d83ae205d1d9e9affffffffff0244cff505000000001976a91423f5580d600bcfe5b99d9fe737530fd8b32492a088ac00111024010000001976a91473f3ecd665da93701358bd957393b8085c1aa2d988ac00000000';
```

```shell--curl
curl $url/broadcast \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "tx": "'$tx'" }'
```

```shell--cli
bcoin-cli broadcast $txhex
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet',
});

(async () => {
  await client.open();

  const result = await client.broadcast(tx);

  console.log(result);

  await client.close();
})().catch((err) => {
  console.error(err.stack);
});
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
