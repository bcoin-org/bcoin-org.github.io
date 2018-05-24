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
const {WalletClient} = require('bclient');
const {Network} = require('bcoin');
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
  "hash": "c7dcd8f8923f8cd0d44d0d980ddd4da80f67290ef872aab0f7be5858210712f7",
  "height": 501,
  "block": "05b1fa9da2acc862dd8e329bbcd158f240a844951016d9e9cd1a1bf9f61b9ac9",
  "time": 1527184717,
  "mtime": 1527184717,
  "date": "2018-05-24T17:58:37Z",
  "mdate": "2018-05-24T17:58:37Z",
  "size": 200,
  "virtualSize": 173,
  "fee": 0,
  "rate": 0,
  "confirmations": 1,
  "inputs": [
    {
      "value": 0,
      "address": null,
      "path": null
    }
  ],
  "outputs": [
    {
      "value": 625009040,
      "address": "RQCqU5msz7DbNGtti6fYQajEGDY2oabsvN",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/1"
      }
    },
    {
      "value": 0,
      "address": null,
      "path": null
    }
  ],
  "tx": "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff2002f5010e6d696e65642062792062636f696e04f410f00b080000000000000000ffffffff0290e14025000000001976a914a3b7048d9f72788e1e2e161dc63585322689d01388ac0000000000000000266a24aa21a9ed9dae2d79e9b97a2b1f19bb16dd1c1c633f2fce683fba82eb85248fac3e32f3d90120000000000000000000000000000000000000000000000000000000000000000000000000"
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
const {WalletClient} = require('bclient');
const {Network} = require('bcoin');
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
     "wid": 1,
     "id": "primary",
     "hash": "f5968051ce275d89b7a6b797eb6e6b081243ecf027872fc6949fae443e21b858",
     "height": -1,
     "block": null,
     "time": 0,
     "mtime": 1503690544,
     "date": "2017-08-25T19:49:04Z",
     "size": 226,
     "virtualSize": 226,
     "fee": 0,
     "rate": 0,
     "confirmations": 0,
     "inputs": [
       {
         "value": 0,
         "address": "mp2w1u4oqZnHDd1zDeAvCTX9B3SaFsUFQx",
         "path": null
       }
     ],
     "outputs": [
       {
         "value": 100000,
         "address": "myCkrhQbJwqM8wKi9YuhyTjN3pukNuWxZ9",
         "path": {
           "name": "default",
           "account": 0,
           "change": false,
           "derivation": "m/0'/0/3"
         }
       },
       {
         "value": 29790920,
         "address": "mqNm1rSYVqD23Aj6fkupApuSok9DNZAeBk",
         "path": null
       }
     ],
     "tx": "0100000001ef8a38cc946c57634c2db05fc298bf94f5c88829c5a6e2b0610fcc7b38a9264f010000006b483045022100e98db5ddb92686fe77bb44f86ce8bf6ff693c1a1fb2fb434c6eeed7cf5e7bed4022053dca3980a902ece82fb8e9e5204c26946893388e4663dbb71e78946f49dd0f90121024c4abc2a3683891b35c04e6d40a07ee78e7d86ad9d7a14265fe214fe84513676ffffffff02a0860100000000001976a914c2013ac1a5f6a9ae91f66e71bbfae4cc762c2ca988acc892c601000000001976a9146c2483bf52052e1125fc75dd77dad06d65b70a8288ac00000000"
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
const {WalletClient} = require('bclient');
const {Network} = require('bcoin');
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
const {WalletClient} = require('bclient');
const {Network} = require('bcoin');
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
    "hash": "c7dcd8f8923f8cd0d44d0d980ddd4da80f67290ef872aab0f7be5858210712f7",
    "height": 501,
    "block": "05b1fa9da2acc862dd8e329bbcd158f240a844951016d9e9cd1a1bf9f61b9ac9",
    "time": 1527184717,
    "mtime": 1527184717,
    "date": "2018-05-24T17:58:37Z",
    "mdate": "2018-05-24T17:58:37Z",
    "size": 200,
    "virtualSize": 173,
    "fee": 0,
    "rate": 0,
    "confirmations": 1,
    "inputs": [
      {
        "value": 0,
        "address": null,
        "path": null
      }
    ],
    "outputs": [
      {
        "value": 625009040,
        "address": "RQCqU5msz7DbNGtti6fYQajEGDY2oabsvN",
        "path": {
          "name": "default",
          "account": 0,
          "change": false,
          "derivation": "m/0'/0/1"
        }
      },
      {
        "value": 0,
        "address": null,
        "path": null
      }
    ],
    "tx": "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff2002f5010e6d696e65642062792062636f696e04f410f00b080000000000000000ffffffff0290e14025000000001976a914a3b7048d9f72788e1e2e161dc63585322689d01388ac0000000000000000266a24aa21a9ed9dae2d79e9b97a2b1f19bb16dd1c1c633f2fce683fba82eb85248fac3e32f3d90120000000000000000000000000000000000000000000000000000000000000000000000000"
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
