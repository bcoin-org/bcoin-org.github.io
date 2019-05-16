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
txhash='4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586';
```

```shell--curl
curl $url/tx/$txhash
```

```shell--cli
bcoin-cli tx $txhash
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
  const result = await client.getTX(txhash);
  console.log(result);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
{
  "hash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
  "witnessHash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
  "fee": 4540,
  "rate": 20088,
  "mtime": 1527029380,
  "height": -1,
  "block": null,
  "time": 0,
  "index": -1,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "a88387ca68a67f7f74e91723de0069154b532bf024c0e4054e36ea2234251181",
        "index": 0
      },
      "script": "4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46a",
      "witness": "00",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 36,
        "value": 5000000000,
        "script": "76a91420a060fec9a7dfac723c521e168876909aa37ce588ac",
        "address": "RCFhpyWXkz5GxskL96q4KtceRXuAMnWUQo",
        "coinbase": true
      }
    }
  ],
  "outputs": [
    {
      "value": 87654321,
      "script": "76a914a4ecde9642f8070241451c5851431be9b658a7fe88ac",
      "address": "RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ"
    },
    {
      "value": 4912341139,
      "script": "76a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac",
      "address": "RHefJ5hLW9jyEwwdxhci6r7AH7SAxdpGW3"
    }
  ],
  "locktime": 0,
  "hex": "01000000018111253422ea364e05e4c024f02b534b156900de2317e9747f7fa668ca8783a8000000006b4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff02b17f3905000000001976a914a4ecde9642f8070241451c5851431be9b658a7fe88ac9360cc24010000001976a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac00000000",
  "confirmations": 207
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
address='RHefJ5hLW9jyEwwdxhci6r7AH7SAxdpGW3';
```

```shell--curl
curl $url/tx/address/$address
```

```shell--cli
bcoin-cli tx $address
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
    "hash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
    "witnessHash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
    "fee": 4540,
    "rate": 20088,
    "mtime": 1527029380,
    "height": -1,
    "block": null,
    "time": 0,
    "index": -1,
    "version": 1,
    "inputs": [
      {
        "prevout": {
          "hash": "a88387ca68a67f7f74e91723de0069154b532bf024c0e4054e36ea2234251181",
          "index": 0
        },
        "script": "4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46a",
        "witness": "00",
        "sequence": 4294967295,
        "coin": {
          "version": 1,
          "height": 36,
          "value": 5000000000,
          "script": "76a91420a060fec9a7dfac723c521e168876909aa37ce588ac",
          "address": "RCFhpyWXkz5GxskL96q4KtceRXuAMnWUQo",
          "coinbase": true
        }
      }
    ],
    "outputs": [
      {
        "value": 87654321,
        "script": "76a914a4ecde9642f8070241451c5851431be9b658a7fe88ac",
        "address": "RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ"
      },
      {
        "value": 4912341139,
        "script": "76a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac",
        "address": "RHefJ5hLW9jyEwwdxhci6r7AH7SAxdpGW3"
      }
    ],
    "locktime": 0,
    "hex": "01000000018111253422ea364e05e4c024f02b534b156900de2317e9747f7fa668ca8783a8000000006b4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff02b17f3905000000001976a914a4ecde9642f8070241451c5851431be9b658a7fe88ac9360cc24010000001976a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac00000000",
    "confirmations": 207
  }
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
