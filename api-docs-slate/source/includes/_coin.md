# Coin
Getting coin information via API.

*Coin stands for UTXO*

<aside class="info">
You need to enable <code>index-address</code> in order to lookup coins by address(es).
</aside>


## Get coin by Outpoint

<aside class="info">
This API call is always available regardless indexing options.
</aside>

```javascript
let hash, index;
```

```shell--vars
hash='c13039f53247f9ca14206da079bcf738d91bc60e251ac9ebaba9ea9a862d9092';
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
const client = new NodeClient({
  network: 'testnet'
});

(async () => {
  await client.open();

  const coin = await client.getCoin(hash, index);

  console.log(coin);

  await client.close();
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
{
  "version": 1,
  "height": 100019,
  "value": 144709200,
  "script": "76a9148fc80aadf127f6f92b6ed33404b110f851c8eca188ac",
  "address": "mtdCZdNYny2U7met3umk47SoA7HMZGfsa2",
  "coinbase": false,
  "hash": "c13039f53247f9ca14206da079bcf738d91bc60e251ac9ebaba9ea9a862d9092",
  "index": 0
}
```

Get coin by outpoint (hash and index). Returns coin in bcoin coin json format.

### HTTP Request
`GET /coin/:hash/:index`

### URL Parameters
Parameter | Description
--------- | -----------
:hash     | Hash of tx
:index    | Output's index in tx



## Get coins by address

```javascript
let address;
```

```shell--vars
address='n3BmXQPa1dKi3zEyCdCGNHTuE5GLdmw1Tr';
```

```shell--curl
curl $url/coin/address/$address
```

```shell--cli
bcoin-cli coin $address
```

```javascript
const {NodeClient} = require('bclient');
const client = new NodeClient({
  network: 'testnet'
});

(async () => {
  await client.open();

  const coins = await client.getCoinsByAddress(address);

  console.log(coins);

  await client.close();
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
[
  {
    "version": 1,
    "height": 502,
    "value": 275391,
    "script": "76a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac",
    "address": "n3BmXQPa1dKi3zEyCdCGNHTuE5GLdmw1Tr",
    "coinbase": false,
    "hash": "86150a141ebe5903a5d31e701698a01d598b81f099ea7577dad73033eab02ef9",
    "index": 1
  }
]
```

Get coin objects array by address.

### HTTP Request
`GET /coin/address/:address`

### URL Parameters
Parameter | Description
--------- | -----------
:address  | bitcoin address



## Get coins by addresses

```javascript
let address0, address1;
```

```shell--vars
address0='n3BmXQPa1dKi3zEyCdCGNHTuE5GLdmw1Tr';
address1='mwLHWwWPDwtCBZA7Ltg9QSzKK5icdCU5rb';
```

```shell--curl
curl $url/coin/address \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "addresses":[ "'$address0'", "'$address1'" ]}'
```

```shell--cli
No CLI Option.
```

```javascript
const {NodeClient} = require('bclient');
const client = new NodeClient({
  network: 'testnet'
});

(async () => {
  await client.open();

  const coins = await client.getCoinsByAddresses([address0, address1]);

  console.log(coins);

  await client.close();
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
[
  {
    "version": 1,
    "height": 502,
    "value": 275391,
    "script": "76a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac",
    "address": "n3BmXQPa1dKi3zEyCdCGNHTuE5GLdmw1Tr",
    "coinbase": false,
    "hash": "86150a141ebe5903a5d31e701698a01d598b81f099ea7577dad73033eab02ef9",
    "index": 1
  },
  {
    "version": 1,
    "height": 500,
    "value": 1095497,
    "script": "76a914ad7d7b9ac5260ad13fa55e06143283f5b36495f788ac",
    "address": "mwLHWwWPDwtCBZA7Ltg9QSzKK5icdCU5rb",
    "coinbase": false,
    "hash": "4692772a73ea834c836915089acf97f2c790380a2b8fd32f82729da72545d8c5",
    "index": 0
  }
]
```

Get coins by addresses,
returns array of coin objects.

### HTTP Request
`POST /coin/address`

### POST Parameters (JSON)
Parameter | Description
--------- | -----------
addresses | List of bitcoin addresses
