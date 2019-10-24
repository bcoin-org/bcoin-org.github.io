# bcoin - Transactions
Getting transaction information via API.

<aside class="info">
You need to enable <code>index-tx</code> to lookup transactions by txid.<br>
You also need to enable <code>index-address</code> in order to lookup
transactions by address.<br>
Launch the bcoin daemon with these arguments or modify `bcoin.conf`:<br>
<code>bcoin --daemon --index-address=true --index-tx=true</code>
</aside>

## Get tx by hash

```javascript
let txhash;
```

```shell--vars
txhash='77a39583060aa3ff2a705d401fea0c07e77e95d66cc10b744dc95098cad1bee1';
```

```shell--curl
curl $url/tx/$txhash
```

```shell--cli
bcoin-cli tx $txhash
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
  const result = await client.getTX(txhash);
  console.log(result);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
{
  "hash": "77a39583060aa3ff2a705d401fea0c07e77e95d66cc10b744dc95098cad1bee1",
  "witnessHash": "130bd86dccf06142b6134c7c38997d8babc2104a94d7a84da021d587740ed1c8",
  "fee": 1740,
  "rate": 9942,
  "mtime": 1571763474,
  "height": 530,
  "block": "34d0385c667319c5225c7f82e025681bae2fb5df28809cc7cf432b491125c83c",
  "time": 1571760040,
  "index": 8,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "9d2330c36814d20ccdba1b6fc5153ed3b294cb34fa99fc8199552014250ea285",
        "index": 3
      },
      "script": "",
      "witness": "02473044022008765f15a62f283c06082dfea6a6f413eae4190dbbfd57efae1813432b66613e0220163b708d4e1ccd6a439da2d222f72e4231bdfd877fcdfb73ac85566e6358c559012103d2d0677a136821cb92361501570173e2c6b0d8b12e584737ffc991d2d1ccf026",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 528,
        "value": 34297185559,
        "script": "0014268a968f7d4d1d72bbecc0ebca21d890901ba312",
        "address": "bcrt1qy69fdrmaf5wh9wlvcr4u5gwcjzgphgcjswyuvn",
        "coinbase": false
      }
    }
  ],
  "outputs": [
    {
      "value": 37547,
      "script": "00143ce6c756ef2f35d61aab99d1619aab2f48da6987",
      "address": "bcrt1q8nnvw4h09u6avx4tn8gkrx4t9ayd56v86q7ceg"
    },
    {
      "value": 50131,
      "script": "76a914e53103ac18b5d274dcea14e6b0c856182ce7021688ac",
      "address": "n2QokZQd8Fn6a82vwXtndYy88HeUk3BZio"
    },
    {
      "value": 34297096141,
      "script": "0014f0ddfca1c6023538c032f6fb46a35703099319fe",
      "address": "bcrt1q7rwlegwxqg6n3spj7ma5dg6hqvyexx07zmt40j"
    }
  ],
  "locktime": 0,
  "hex": "0100000000010185a20e251420559981fc99fa34cb94b2d33e15c56f1bbacd0cd21468c330239d0300000000ffffffff03ab920000000000001600143ce6c756ef2f35d61aab99d1619aab2f48da6987d3c30000000000001976a914e53103ac18b5d274dcea14e6b0c856182ce7021688accd2744fc07000000160014f0ddfca1c6023538c032f6fb46a35703099319fe02473044022008765f15a62f283c06082dfea6a6f413eae4190dbbfd57efae1813432b66613e0220163b708d4e1ccd6a439da2d222f72e4231bdfd877fcdfb73ac85566e6358c559012103d2d0677a136821cb92361501570173e2c6b0d8b12e584737ffc991d2d1ccf02600000000",
  "confirmations": 6
}
```

### HTTP Request
`GET /tx/:txhash`

### URL Parameters
Parameter | Description
--------- | -----------
:txhash | Hash of tx.


## Get tx by address

<aside class="info">
You need to enable <code>index-address</code> and <code>index-tx</code> in
order to lookup transactions by address.<br> Launch the bcoin daemon with
these arguments or modify `bcoin.conf` to include the options:<br>
<code>bcoin --daemon --index-address=true --index-tx=true</code>
</aside>

```javascript
let address;
```

```shell--vars
address='bcrt1q8nnvw4h09u6avx4tn8gkrx4t9ayd56v86q7ceg';
```

```shell--curl
curl $url/tx/address/$address
```

```shell--cli
bcoin-cli tx $address
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
  const result = await client.getTXByAddress(address);
  console.log(result);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
[
  {
    "hash": "77a39583060aa3ff2a705d401fea0c07e77e95d66cc10b744dc95098cad1bee1",
    "witnessHash": "130bd86dccf06142b6134c7c38997d8babc2104a94d7a84da021d587740ed1c8",
    "fee": 1740,
    "rate": 9942,
    "mtime": 1571763513,
    "height": 530,
    "block": "34d0385c667319c5225c7f82e025681bae2fb5df28809cc7cf432b491125c83c",
    "time": 1571760040,
    "index": 8,
    "version": 1,
    "inputs": [
      {
        "prevout": {
          "hash": "9d2330c36814d20ccdba1b6fc5153ed3b294cb34fa99fc8199552014250ea285",
          "index": 3
        },
        "script": "",
        "witness": "02473044022008765f15a62f283c06082dfea6a6f413eae4190dbbfd57efae1813432b66613e0220163b708d4e1ccd6a439da2d222f72e4231bdfd877fcdfb73ac85566e6358c559012103d2d0677a136821cb92361501570173e2c6b0d8b12e584737ffc991d2d1ccf026",
        "sequence": 4294967295,
        "coin": {
          "version": 1,
          "height": 528,
          "value": 34297185559,
          "script": "0014268a968f7d4d1d72bbecc0ebca21d890901ba312",
          "address": "bcrt1qy69fdrmaf5wh9wlvcr4u5gwcjzgphgcjswyuvn",
          "coinbase": false
        }
      }
    ],
    "outputs": [
      {
        "value": 37547,
        "script": "00143ce6c756ef2f35d61aab99d1619aab2f48da6987",
        "address": "bcrt1q8nnvw4h09u6avx4tn8gkrx4t9ayd56v86q7ceg"
      },
      {
        "value": 50131,
        "script": "76a914e53103ac18b5d274dcea14e6b0c856182ce7021688ac",
        "address": "n2QokZQd8Fn6a82vwXtndYy88HeUk3BZio"
      },
      {
        "value": 34297096141,
        "script": "0014f0ddfca1c6023538c032f6fb46a35703099319fe",
        "address": "bcrt1q7rwlegwxqg6n3spj7ma5dg6hqvyexx07zmt40j"
      }
    ],
    "locktime": 0,
    "hex": "0100000000010185a20e251420559981fc99fa34cb94b2d33e15c56f1bbacd0cd21468c330239d0300000000ffffffff03ab920000000000001600143ce6c756ef2f35d61aab99d1619aab2f48da6987d3c30000000000001976a914e53103ac18b5d274dcea14e6b0c856182ce7021688accd2744fc07000000160014f0ddfca1c6023538c032f6fb46a35703099319fe02473044022008765f15a62f283c06082dfea6a6f413eae4190dbbfd57efae1813432b66613e0220163b708d4e1ccd6a439da2d222f72e4231bdfd877fcdfb73ac85566e6358c559012103d2d0677a136821cb92361501570173e2c6b0d8b12e584737ffc991d2d1ccf02600000000",
    "confirmations": 6
  },
  ...
]
```

Returns transaction objects array by address with support for segwit. The
supported address types include `p2pkh`, `p2sh`, `p2wpkh`, and `p2wsh`.
Addresses with hundreds, thousands or millions of transactions, will need
to make multiple queries to request all transactions using the  `after`
query parameter. If no results are found an empty array will be returned.
Results include both confirmed and unconfirmed transactions.

### HTTP Request
`GET /tx/address/:address`

### URL Parameters
Parameter | Description
--------- | -----------
:address | Bitcoin address (base58 or bech32).

### Query string
Parameter | Description
--------- | -----------------
after <br> _string_ | A txid to include transactions after, this is often the last txid of a previous query.
limit <br> _int_ | The maximum number of results to return.
reverse <br> _boolean_ | Reverse the order of transactions, default is false and from oldest to latest.
