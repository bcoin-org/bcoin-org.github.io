# Wallet Transactions

## Get Wallet TX Details

```javascript
let id, hash
```

```shell--vars
id="primary"
hash="c7dcd8f8923f8cd0d44d0d980ddd4da80f67290ef872aab0f7be5858210712f7"
```

```shell--cli
bwallet-cli --id=$id tx $hash
```

```shell--curl
curl $walleturl/$id/tx/$hash
```

```javascript
const {WalletClient, Network} = require('bcoin');
const network = Network.get('regtest');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: 'api-key'
}

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);

(async () => {
  const result = await wallet.getTX(hash);
  console.log(result);
})();
```
> Sample Response

```json
{
  "hash": "292fbf4fb037a5354465e0a183d664b99477248f1dd14f47493a2a66a66f40b4",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1571774862,
  "date": "1970-01-01T00:00:00Z",
  "mdate": "2019-10-22T20:07:42Z",
  "size": 226,
  "virtualSize": 226,
  "fee": 4540,
  "rate": 20088,
  "confirmations": 0,
  "inputs": [
    {
      "value": 2500000000,
      "address": "mhX1xHbKGzw3r8FoN5bUkmRixHPEDNywxh",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/1"
      }
    }
  ],
  "outputs": [
    {
      "value": 10000000,
      "address": "mxbdj9hHDLK2TXD3Cztiy8BLiEuKPcsM5x",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/5"
      }
    },
    {
      "value": 2489995460,
      "address": "mjQqy8E7WJLaybxHcpiaWQMppjizi6nG3Y",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/6"
      }
    }
  ],
  "tx": "0100000001a02535c04f1791c7cee4a299d55179d998c23c41c039778ce10d7d3150695b10000000006b483045022100c7ce594aadde910687a6a86ee48a865221066d47b8a2323d10683076d399938e022048844ec1ad29c3733d13ac191a3bc89a1f07abc0f240ae631e5d146acc11f6e901210336c99e45e00b73c863497a989fe6feb08439ca2d7cf98f55bc261ed70ed28a7bffffffff0280969800000000001976a914bb5cb80bfffca7ba777ff3a8f7c33098faf9769188acc4506a94000000001976a9142ab8b9f49d7c3559b4228aa69b1e8cba0a7558d088ac00000000"
}
```
Get wallet transaction details.

### HTTP Request

`GET /wallet/:id/tx/:hash`

### Request Parameters
Parameter | Description
--------- | --------------
id <br> _string_ | id of wallet that handled the transaction
hash <br> _string_ | hash of the transaction you're trying to retrieve

## Delete Transaction
```javascript
let id, hash, passphrase;
```

```shell--vars
id="primary"
hash="a97a9993389ae321b263dffb68ba1312ad0655da83aeca75b2372d5abc70544a"
```

```shell--cli
# Not available in CLI
```

```shell--curl
curl $walleturl/$id/tx/$hash \
  -X DELETE
```

```javascript
 // Not available in javascript wallet client.
```

Abandon single pending transaction. Confirmed transactions will throw an error.
`"TX not eligible"`

### HTTP Request

`DEL /wallet/:id/tx/:hash`

Paramters | Description
----------| --------------------
id <br> _string_ | id of wallet where the transaction is that you want to remove
hash <br> _string_ | hash of transaction you would like to remove.

## Get Wallet TX History

```javascript
let id;
```

```shell--vars
id='primary'
```

```shell--cli
bwallet-cli --id=$id history
```

```shell--curl
curl $walleturl/$id/tx/history
```

```javascript
const {WalletClient, Network} = require('bcoin');
const network = Network.get('regtest');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: 'api-key'
}

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);
const account = 'default';

(async () => {
  const result = await wallet.getHistory(account);
  console.log(result);
})();
```
> Sample Response

```json
[
  {
    "hash": "292fbf4fb037a5354465e0a183d664b99477248f1dd14f47493a2a66a66f40b4",
    "height": -1,
    "block": null,
    "time": 0,
    "mtime": 1571774862,
    "date": "1970-01-01T00:00:00Z",
    "mdate": "2019-10-22T20:07:42Z",
    "size": 226,
    "virtualSize": 226,
    "fee": 4540,
    "rate": 20088,
    "confirmations": 0,
    "inputs": [
      {
        "value": 2500000000,
        "address": "mhX1xHbKGzw3r8FoN5bUkmRixHPEDNywxh",
        "path": {
          "name": "default",
          "account": 0,
          "change": false,
          "derivation": "m/0'/0/1"
        }
      }
    ],
    "outputs": [
      {
        "value": 10000000,
        "address": "mxbdj9hHDLK2TXD3Cztiy8BLiEuKPcsM5x",
        "path": {
          "name": "default",
          "account": 0,
          "change": false,
          "derivation": "m/0'/0/5"
        }
      },
      {
        "value": 2489995460,
        "address": "mjQqy8E7WJLaybxHcpiaWQMppjizi6nG3Y",
        "path": {
          "name": "default",
          "account": 0,
          "change": true,
          "derivation": "m/0'/1/6"
        }
      }
    ],
    "tx": "0100000001a02535c04f1791c7cee4a299d55179d998c23c41c039778ce10d7d3150695b10000000006b483045022100c7ce594aadde910687a6a86ee48a865221066d47b8a2323d10683076d399938e022048844ec1ad29c3733d13ac191a3bc89a1f07abc0f240ae631e5d146acc11f6e901210336c99e45e00b73c863497a989fe6feb08439ca2d7cf98f55bc261ed70ed28a7bffffffff0280969800000000001976a914bb5cb80bfffca7ba777ff3a8f7c33098faf9769188acc4506a94000000001976a9142ab8b9f49d7c3559b4228aa69b1e8cba0a7558d088ac00000000"
  },
 ...
]
```

Get wallet TX history. Returns array of tx details.

### HTTP Request
`GET /wallet/:id/tx/history`

### Request Parameters
Paramter | Description
-------- | -------------------------
id <br> _string_ | id of wallet to get history of

## Get Pending Transactions

```javascript
let id;
```

```shell--vars
id='primary'
```

```shell--cli
bwallet-cli --id=$id pending
```

```shell--curl
curl $walleturl/$id/tx/unconfirmed
```

```javascript
const {WalletClient, Network} = require('bcoin');
const network = Network.get('regtest');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: 'api-key'
}

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);

(async () => {
  const result = await wallet.getPending();
  console.log(result);
})();
```

Get pending wallet transactions. Returns array of tx details.

### HTTP Request

`GET /wallet/:id/tx/unconfirmed`

### Request Parameters
Paramter | Description
-------- | -------------------------
id <br> _string_ | id of wallet to get pending/unconfirmed txs


## Get Range of Transactions
```javascript
let id, account, start, end;
```

```shell--vars
id="primary"
account="default"
start="1527184612"
end="1527186612"
```

```shell--cli
# range not available in CLI
```

```shell--curl
curl $walleturl/$id/tx/range?start=$start'&'end=$end
```

```javascript
const {WalletClient, Network} = require('bcoin');
const network = Network.get('regtest');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: 'api-key'
}

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);

(async () => {
  const result = await wallet.getRange(account, {start: start, end: end});
  console.log(result);
})();
```
> Sample Response

```json
[
  {
    "hash": "292fbf4fb037a5354465e0a183d664b99477248f1dd14f47493a2a66a66f40b4",
    "height": -1,
    "block": null,
    "time": 0,
    "mtime": 1571774862,
    "date": "1970-01-01T00:00:00Z",
    "mdate": "2019-10-22T20:07:42Z",
    "size": 226,
    "virtualSize": 226,
    "fee": 4540,
    "rate": 20088,
    "confirmations": 0,
    "inputs": [
      {
        "value": 2500000000,
        "address": "mhX1xHbKGzw3r8FoN5bUkmRixHPEDNywxh",
        "path": {
          "name": "default",
          "account": 0,
          "change": false,
          "derivation": "m/0'/0/1"
        }
      }
    ],
    "outputs": [
      {
        "value": 10000000,
        "address": "mxbdj9hHDLK2TXD3Cztiy8BLiEuKPcsM5x",
        "path": {
          "name": "default",
          "account": 0,
          "change": false,
          "derivation": "m/0'/0/5"
        }
      },
      {
        "value": 2489995460,
        "address": "mjQqy8E7WJLaybxHcpiaWQMppjizi6nG3Y",
        "path": {
          "name": "default",
          "account": 0,
          "change": true,
          "derivation": "m/0'/1/6"
        }
      }
    ],
    "tx": "0100000001a02535c04f1791c7cee4a299d55179d998c23c41c039778ce10d7d3150695b10000000006b483045022100c7ce594aadde910687a6a86ee48a865221066d47b8a2323d10683076d399938e022048844ec1ad29c3733d13ac191a3bc89a1f07abc0f240ae631e5d146acc11f6e901210336c99e45e00b73c863497a989fe6feb08439ca2d7cf98f55bc261ed70ed28a7bffffffff0280969800000000001976a914bb5cb80bfffca7ba777ff3a8f7c33098faf9769188acc4506a94000000001976a9142ab8b9f49d7c3559b4228aa69b1e8cba0a7558d088ac00000000"
  },
  ...
]
```
Get range of wallet transactions by timestamp. Returns array of tx details.

<aside class="notice">
Note that there are other options documented that `getRange` accepts in the options body, `limit` and `reverse`. At the time of writing however they do not have any effect.
</aside>

### HTTP Request

`GET /wallet/:id/tx/range`

### Body Parameters
Paramter | Description
-------- | -------------------------
account <br>_string_ | account to get the tx history from
start <br> _int_ | start time to get range from
end <br> _int_ | end time to get range from

<!-- ##GET /wallet/:id/tx/last

Get last N wallet transactions.

### HTTP Request

`GET /wallet/:id/tx/last` -->
