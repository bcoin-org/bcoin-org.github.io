# Wallet Transactions

## Get Wallet TX Details

```javascript
let id, hash
```

```shell--vars
id="foo"
hash="18d2cf5683d7befe06941f59b7fb4ca0e915dcb9c6aece4ce8966a29e7c576fe"
```

```shell--cli
bwallet-cli --id=$id tx $hash
```

```shell--curl
curl $url/wallet/$id/tx/$hash
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.getTX(hash);
  console.log(response);
})();
```
> Sample Response

```json
{
  "wid": 1,
  "id": "foo",
  "hash": "18d2cf5683d7befe06941f59b7fb4ca0e915dcb9c6aece4ce8966a29e7c576fe",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1507077109,
  "date": "2017-10-04T00:31:49Z",
  "size": 225,
  "virtualSize": 225,
  "fee": 4540,
  "rate": 20177,
  "confirmations": 0,
  "inputs":
   [ { value: 5000009080,
       address: "SdCEuxkbdMygcKtL36x2CT8p1vhz56SsbG",
       path: [Object] } ],
  "outputs":
   [ { value: 100000000,
       address: "SP7K3cSLH66zDisioqPrTC3QSRwP9GPENB",
       path: null },
     { value: 4900004540,
       address: "SSzzdLbBeWBwNTUpbGdD9gBk6Wzk34sT7J",
       path: [Object] } ],
  "tx": "010000000148ae6682231f381845f98049c871e9b6bf0a9a7f5c5270354f71079262577977000000006a47304402203359117c409d292700fbacc03e4b540066a6b8ca763f1dd578e8262fe5e74c1b02206c91f816755469cd4a6b110941b51f29e251b86afe246456cf17823ef4fc7f5301210299c1a1049d546a720dd614034ce2802a3f64d64c37b729ae184825f71d0a037affffffff0200e1f505000000001976a91413eab6745a3fcbcf8b4448c130ff8bc37db6e91b88acbc221024010000001976a9143e9958577401fe8d75ed6f162cc6832fcb26094188ac00000000"
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
id="foo"
hash="2a22606ee555d2c26ec979f0c45cd2dc18c7177056189cb345989749fd58786"
passphrase="bar"
```

```shell--cli
# Not available in CLI
```

```shell--curl
curl $url/wallet/$id/tx/$hash \
  -X DELETE \
  --data '{"passphrase": "'$passphrase'"}'
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
id='foo'
```

```shell--cli
bwallet-cli --id=$id history
```

```shell--curl
curl $url/wallet/$id/tx/history
```

```javascript
const wallet = WalletClient.wallet(id);
const account = 'default';

(async () => {
  const response = await wallet.getHistory(account);
  console.log(response);
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
id='foo'
```

```shell--cli
bwallet-cli --id=$id pending
```

```shell--curl
curl $url/wallet/$id/tx/unconfirmed
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.getPending(account);
  console.log(response);
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
id="foo"
account="foo"
start="1506909119"
end="1506909154"
```

```shell--cli
# range not available in CLI
```

```shell--curl
curl $url/wallet/$id/tx/range?start=$start
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.getRange(account, {start: start, end: end});
  console.log(response);
})();
```
> Sample Response

```json
[
  { "wid": 1,
    "id": "primary",
    "hash": "80ac63671e7b8635d10d372c4c3bed5615624d9fa28dfd747abf440417d70983",
    "height": -1,
    "block": null,
    "time": 0,
    "mtime": 1506909119,
    "date": "2017-10-02T01:51:59Z",
    "size": 200,
    "virtualSize": 173,
    "fee": 0,
    "rate": 0,
    "confirmations": 0,
    "inputs": [ [Object] ],
    "outputs": [ [Object], [Object] ],
    "tx": "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff20028d010e6d696e65642062792062636f696e045460ad97080000000000000000ffffffff02bc03062a010000001976a914d7ee508e06ece23679ba9ee0a770561ae2ed595688ac0000000000000000266a24aa21a9ed5772988727e8641cf3c7d2bf5a7fee9a5d0e827de0b6bed5658eee8f0821b5200120000000000000000000000000000000000000000000000000000000000000000000000000"
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
