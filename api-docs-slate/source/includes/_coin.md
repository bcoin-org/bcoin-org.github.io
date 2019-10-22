# bcoin - Coins
Getting coin information via API.

*Coin stands for UTXO (unspent transaction output)*

## Get coin by Outpoint

<aside class="info">
This API call is always available regardless indexing options, and
includes unspent coins only.
</aside>

```javascript
let hash, index;
```

```shell--vars
hash='53faa103e8217e1520f5149a4e8c84aeb58e55bdab11164a95e69a8ca50f8fcc';
index=0;
```

```shell--curl
curl $url/coin/$hash/$index
```

```shell--cli
bcoin-cli coin $hash $index
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
  const result = await client.getCoin(hash, index);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
{
  "version": 1,
  "height": 533,
  "value": 67377,
  "script": "76a9147356fde8f0a321dd114d947495d1f4b9f3cb050088ac",
  "address": "mr2pDQvLN7eGv6xinBgSUmQpYSYdTEWyTf",
  "coinbase": false,
  "hash": "c747afe7aea229ae2aed7135eb768fd2dc1d8172cd7463bf3906e8321baa5608",
  "index": 0
}
```

Get coin by outpoint (hash and index). Returns coin in bcoin coin JSON format.
`value` is always expressed in satoshis.

### HTTP Request
`GET /coin/:hash/:index`

### URL Parameters
Parameter | Description
--------- | -----------
:hash     | Hash of tx
:index    | Output's index in tx
