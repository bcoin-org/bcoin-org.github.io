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
  const result = await client.getCoin(hash, index);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
{
  "version": 1,
  "height": -1,
  "value": 30000000,
  "script": "76a91400ba915c3d18907b79e6cfcd8b9fdf69edc7a7db88ac",
  "address": "R9M3aUWCcKoiqDPusJvqNkAbjffLgCqYip",
  "coinbase": false,
  "hash": "53faa103e8217e1520f5149a4e8c84aeb58e55bdab11164a95e69a8ca50f8fcc",
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
