# Wallet
## The Wallet Client
The best way to interact with the wallet API is with the bwallet-cli in the `bclient`
[package](https://www.npmjs.com/package/bclient). Installing globally with
`npm i -g bclient` gives you access to the cli. You can also install locally
to your project.

Note that when using it in your own program, you will need to explicitly
pass in a port option. The easiest way to do this is with `bcoin.Network`.

You can create a client for a specific wallet (and be compatible with the old
api) with the `wallet` method on `WalletClient` class.

```shell--curl
# n/a
```

```shell--cli
npm i -g bclient && bwallet-cli
```

```javascript
const {WalletClient} = require('bclient');
const { Network } = require('bcoin');
const network = Network.get('testnet');

const walletClient = new WalletClient({
  port: network.walletPort,
  network: network.type
});

const id = 'primary'; // or whatever your wallet name is
const wallet = WalletClient.wallet(id);

```

## The WalletDB and Object
```javascript
let id, url;
```

```shell--vars
id="primary"
url="http://localhost:18334"
```

```shell--curl
curl $url/wallet/$id/
```

```shell--cli
bwallet-cli get --id=$id
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const wallet = await wallet.getInfo();
  console.log(wallet);
})();
```


> The wallet object will look something like this:

```json
{
  "network": "testnet",
  "wid": 1,
  "id": "primary",
  "initialized": true,
  "watchOnly": false,
  "accountDepth": 1,
  "token": "977fbb8d212a1e78c7ce9dfda4ff3d7cc8bcd20c4ccf85d2c9c84bbef6c88b3c",
  "tokenDepth": 0,
  "state": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": 0,
    "confirmed": 0
  },
  "master": {
    "encrypted": false
  },
  "account": {
    "name": "default",
    "initialized": true,
    "witness": false,
    "watchOnly": false,
    "type": "pubkeyhash",
    "m": 1,
    "n": 1,
    "accountIndex": 0,
    "receiveDepth": 1,
    "changeDepth": 1,
    "nestedDepth": 0,
    "lookahead": 10,
    "receiveAddress": "mwfDKs919Br8tNFamk6RhRpfaa6cYQ5fMN",
    "nestedAddress": null,
    "changeAddress": "msG6V75J6XNt5mCqBhjgC4MjDH8ivEEMs9",
    "accountKey": "tpubDDRH1rj7ut9ZjcGakR9VGgXU8zYSZypLtMr7Aq6CZaBVBrCaMEHPzye6ZZbUpS8YmroLfVp2pPmCdaKtRdCuTCK2HXzwqWX3bMRj3viPMZo",
    "keys": []
  }
}
```

Bcoin maintains a wallet database which contains every wallet. Wallets are not usable without also using a wallet database. For testing, the wallet database can be in-memory, but it must be there. Wallets are uniquely identified by an id and the walletdb is created with a default id of `primary`. (See [Create a Wallet](#create-a-wallet) below for more details.)

Wallets in bcoin use bip44. They also originally supported bip45 for multisig, but support was removed to reduce code complexity, and also because bip45 doesn't seem to add any benefit in practice.

The wallet database can contain many different wallets, with many different accounts, with many different addresses for each account. Bcoin should theoretically be able to scale to hundreds of thousands of wallets/accounts/addresses.

Each account can be of a different type. You could have a pubkeyhash account, as well as a multisig account, a witness pubkeyhash account, etc.

Note that accounts should not be accessed directly from the public API. They do not have locks which can lead to race conditions during writes.

## HTTP Server

The wallet HTTP server listens on it's own port, separate from the node's server.
Default ports are:

```shell-vars
main: 8334
testnet: 18334
regtest: 48334
simnet: 18558
```

This can be changed through configuration options.

## Configuration
Persistent configuration can be added to `wallet.conf` in your `prefix` directory.
Same directory has `bcoin.conf` for the node server.

> Example Configuration:

```shell--vars
network: testnet
wallet-auth: true
api-key: hunter2
http-host: 0.0.0.0
```

<aside class="notice">
It is highly recommended to always use `wallet-auth` and to set a unique `api-key`,
even for local development or local wallets. Without wallet auth other applications
on your system could theoretically access your wallet through the HTTP server
without any authentication barriers. Each wallet does have an additional unique auth
token required for most operations.
</aside>

## Wallet Options
> Wallet options object will look something like this

```json
{
  "id": "walletId",
  "witness": true,
  "watchOnly": false,
  "accountKey": "tpubDCk7nRE1aq9MPdLEV1Y5LHdifspWxKDcQWKArMP7axEaZoNZQ2mxPxc1oBxiPahCtUPKAm5TYzf6WWtJ51Yn27Qzf7snxaK36ZASCgEtbPy",
  "accountIndex": 1,
  "type": "pubkeyhash"
  "m": 1,
  "n": 1,
  "keys": [],
  "mnemonic": 'differ trigger sight sun undo fine sheriff mountain prison remove fantasy arm'
}
```
Options are used for wallet creation. None are required.

### Options Object
Name | Type | Default | Description
---------- | ----------- | -------------- | -------------
id | String |  | Wallet ID (used for storage)
master | HDPrivateKey | | Master HD key. If not present, it will be generated
witness | Boolean | `false` | Whether to use witness programs
watchOnly | Boolean | `false` |
accountKey | String | | The extended public key for the primary account in the new wallet. This value is ignored if `watchOnly` is `false`
accountIndex | Number | `0` | The BIP44 [account index](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#Account)
receiveDepth | Number | | The index of the _next_ receiving address
changeDepth | Number | | The index of the _next_ change address
type | String | `'pubkeyhash'` |Type of wallet (pubkeyhash, multisig)
compressed | Boolean | `true` | Whether to use compressed public keys
m | Number | `1` | m value for multisig (`m-of-n`)
n | Number | `1` | n value for multisig (`m-of-n`)
mnemonic | String | | A mnemonic phrase to use to instantiate an hd private key. One will be generated if none provided


## Wallet Auth
> The following samples return a wallet object

```javascript
let token, id;
```

```shell--vars
token='977fbb8d212a1e78c7ce9dfda4ff3d7cc8bcd20c4ccf85d2c9c84bbef6c88b3c'
id='foo'
```

```shell--curl
curl $url/wallet/$id \
    -H 'Content-Type: application/json' \
    -d '{ "token": "$token" ... }'
```

```shell--cli
bwallet-cli get --network=testnet --token=$token
```

```javascript

const wallet = WalletClient.wallet(id);

(async () => {
  const wallet = await wallet.getInfo();
  console.log(wallet);
})();
```

Individual wallets have their own api keys, referred to internally as "tokens" (a 32 byte hash - calculated as `HASH256(m/44'->ec-private-key|tokenDepth)`).

A wallet is always created with a corresponding token. When using api endpoints
for a specific wallet, the token must be sent back in the query string or json
body.

e.g. To get information from a wallet that requires a token

`GET /wallet/primary/tx/:hash?token=977fbb8d212a1e78c7ce9dfda4ff3d7cc8bcd20c4ccf85d2c9c84bbef6c88b3c`

## Reset Authentication Token
```javascript
let id, passphrase;
```

```shell--vars
id='foo'
passphrase='bar'
```

```shell--cli
bwallet-cli retoken --id=$id --passphrase=$passphrase
```

```shell--curl
curl $url/wallet/$id/retoken \
  -X POST
  --data '{"passphrase":"'$passphrase'"}"
```

```javascript
const wallet = new bcoin.http.Wallet({ id: id });

(async () => {
  const token = await wallet.retoken(passphrase);
  console.log(token);
})();
```

> Sample response:

```json
{
  "token": "2d04e217877f15ba920d02c24c6c18f4d39df92f3ae851bec37f0ade063244b2"
}
```

Derive a new wallet token, required for access of this particular wallet.

<aside class="warning">
Note: if you happen to lose the returned token, you will not be able to access the wallet.
</aside>


### HTTP Request

`POST /wallet/:id/retoken`

## Get Wallet Info
```javascript
let id;
```

```shell--vars
id='foo'
```

```shell--curl
curl $url/wallet/$id/

```

```shell--cli
# ID defaults to `primary` if none is passed
bwallet-cli get --id=$id
```

```javascript
`use strict`

const wallet = WalletClient.wallet(id);
const id = 'foo';

(async () => {
  const wallet = await wallet.getInfo();
  console.log(wallet);
})();
```

> Sample output

```json
{
  "network": "testnet",
  "wid": 1,
  "id": "foo",
  "initialized": true,
  "watchOnly": false,
  "accountDepth": 1,
  "token": "2d04e217877f15ba920d02c24c6c18f4d39df92f3ae851bec37f0ade063244b2",
  "tokenDepth": 0,
  "state": {
    "tx": 177,
    "coin": 177,
    "unconfirmed": "8150.0",
    "confirmed": "8150.0"
  },
  "master": {
    "encrypted": false
  },
  "account": {
    "name": "default",
    "initialized": true,
    "witness": false,
    "watchOnly": false,
    "type": "pubkeyhash",
    "m": 1,
    "n": 1,
    "accountIndex": 0,
    "receiveDepth": 8,
    "changeDepth": 1,
    "nestedDepth": 0,
    "lookahead": 10,
    "receiveAddress": "mu5Puppq4Es3mibRskMwoGjoZujHCFRwGS",
    "nestedAddress": null,
    "changeAddress": "n3nFYgQR2mrLwC3X66xHNsx4UqhS3rkSnY",
    "accountKey": "tpubDC5u44zLNUVo2gPVdqCbtX644PKccH5VZB3nqUgeCiwKoi6BQZGtr5d6hhougcD6PqjszsbR3xHrQ5k8yTbUt64aSthWuNdGi7zSwfGVuxc",
    "keys": []
  }
}
```

Get wallet info by ID. If no id is passed in the CLI it assumes an id of `primary`.

### HTTP Request
`GET /wallet/:id`

Parameters | Description
---------- | -----------
id <br> _string_ | named id of the wallet whose info you would like to retrieve

## Get Master HD Key
```javascript
let id, network;
```
```shell--vars
id='foo'
network='testnet'
```

```shell--curl
curl $url/wallet/$id/master
```

```shell--cli
bwallet-cli master --id=$id --network=$network
```

```javascript
const wallet = new bcoin.http.Wallet({ id: id,  network: network});

(async () => {
  const master = await wallet.getMaster();
  console.log(master);
})();
```

> Sample response:

```json
{
  "encrypted": false,
  "key": {
    "xprivkey": "tprv8ZgxMBicQKsPe7977psQCjBBjWtLDoJVPiiKog42RCoShJLJATYeSkNTzdwfgpkcqwrPYAmRCeudd6kkVWrs2kH5fnTaxrHhi1TfvgxJsZD",
    "mnemonic": {
      "bits": 128,
      "language": "english",
      "entropy": "a560ac7eb5c2ed412a4ba0790f73449d",
      "phrase": "pistol air cabbage high conduct party powder inject jungle knee spell derive",
      "passphrase": ""
    }
  }
}
```

Get wallet master HD key. This is normally censored in the wallet info route. The provided api key must have admin access.

### HTTP Request

`GET /wallet/:id/master`

Parameters | Description
---------- | -----------
id <br> _string_ | named id of the wallet whose info you would like to retrieve

## Create A Wallet

```javascript
let id, passphrase, witness, accountKey;
```

```shell--vars
id='foo'
passphrase='bar'
witness='false'
accountKey='tpubDDh2XgSds1vBbeVgye88gsGQeCityoywRndtyrXcmvWqCgsFUyUKwzeDv8HiJhu9fC8jRAFMqxr4jj8eRTNTycmMao5wmsAScVf4jSMdPYZ'
```

```shell--curl
curl $url/wallet/$id \
  -X PUT \
  --data '{"witness":'$witness', "passphrase":"'$passphrase'", "watchOnly": "true", "accountKey":"'$accountKey'"}'
```

```shell--cli
# watchOnly defaults to true if --key flag is set

bwallet-cli create $id --witness=$witness --passphrase=$passphrase --watch=$watchOnly --key=$accountKey
```

```javascript
const client = new bcoin.http.Client();
const options = {
  id: id,
  passphrase: passphrase,
  witness: witness,
  watchOnly: true,
  accountKey: accountKey
};

(async() => {
  const newWallet = await client.createWallet(options)
})();
```

> Sample response:

```json
{
  "network": "testnet",
  "wid": 2,
  "id": "foo",
  "initialized": true,
  "watchOnly": false,
  "accountDepth": 1,
  "token": "d9de1ddc83bf058d14520a203df6ade0dc92a684aebfac57b667705b4cac3916",
  "tokenDepth": 0,
  "state": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": "0.0",
    "confirmed": "0.0"
  },
  "master": {
    "encrypted": false
  },
  "account": {
    "name": "default",
    "initialized": true,
    "witness": false,
    "watchOnly": false,
    "type": "pubkeyhash",
    "m": 1,
    "n": 1,
    "accountIndex": 0,
    "receiveDepth": 1,
    "changeDepth": 1,
    "nestedDepth": 0,
    "lookahead": 10,
    "receiveAddress": "muYkrSDbD8UhyWBMXxXf99EKWn22YqmwyF",
    "nestedAddress": null,
    "changeAddress": "mwveV7A6svE5EGGSduZmMKTwcbE775NVFt",
    "accountKey": "tpubDDh2XgSds1vBbeVgye88gsGQeCityoywRndtyrXcmvWqCgsFUyUKwzeDv8HiJhu9fC8jRAFMqxr4jj8eRTNTycmMao5wmsAScVf4jSMdPYZ",
    "keys": []
  }
}
```

Create a new wallet with a specified ID.

### HTTP Request

`PUT /wallet/:id`

Parameters | Description
---------- | -----------
id <br> _string_ | id of wallet you would like to create

<aside class="notice">
See <a href="#wallet-options">Wallet Options</a> for full list and description of possible options that can be passed
</aside>


## Change Passphrase
```javascript
let id, oldPass, newPass;
```

```shell--vars
id='foo'
oldPass='oldpass123'
newPass='newpass123'
```

```shell--cli
> No cli command available
```

```shell-curl
curl $url/wallet/$id/passphrase \
  -X POST
  --data '{"old":"'$oldPass'", "new":"'$newPass'"}'
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.setPassphrase(oldPass, newPass);
  console.log(response);
});
```

> Sample Response:

```json
{"success": true}
```

Change wallet passphrase. Encrypt if unencrypted.

### HTTP Request

`POST /wallet/:id/passphrase`

### Body Parameters
Paramters | Description
--------- | ---------------------
old <br> _string_ | Old passphrase. Pass in empty string if none
new <br> _string_ | New passphrase

<aside class="notice">
  Note that the old passphrase is still required even if none was set prior. In this case, an empty string should be passed for the old passphrase.
  e.g. <code>client.setPassphrase(id,'""', 'newPass')</code>
</aside>

## Send a transaction

```javascript
let id, passphrase, rate, value, address;
```

```shell--vars
id="foo"
passphrase="bar"
rate=500
value=1000
address="moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA"
```

```shell--cli
bwallet-cli send --id=$id --value=$value --address=$address ---passphrase=$passphrase
```

```shell--curl
curl $url/wallet/$id/send \
  -X POST \
  --data '{
    "passphrase":"'$passphrase'",
    "rate":'$rate',
    "outputs":[
      {"address":"'$address'", "value":'$value'}
    ]
  }'
```

```javascript
const wallet = WalletClient.wallet(id);
const options = {
  rate: rate,
  outputs: [{ value: value, address: address }]
};

(async () => {
  const tx = await wallet.send(options);
  console.log(tx);
})();
```

> Sample response:

```json
{
  "wid": 13,
  "id": "foo",
  "hash": "c2da22cafcd076ea3db74bb2e3cf50f030e5240aa5daf4f778fb4954a866b41c",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1503364758,
  "date": "2017-08-22T01:19:18Z",
  "size": 225,
  "virtualSize": 225,
  "fee": 22,
  "rate": 1000,
  "confirmations": 0,
  "inputs": [
    {
      "value": 59991393,
      "address": "mgChJ3wXDqRns7Y6UhjXCyxeuZZJoQNj7c",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/5"
      }
    }
  ],
  "outputs": [
    {
      "value": 10000000,
      "script": "76a9143f4f69730dcb175c830b94226ae13f89bef969c488ac",
      "address": "mmHhzmwiUzorZLYhFH9fhrfFTAHGhx1biN"
    },
    {
      "value": 30000000,
      "script": "76a9143f4f69730dcb175c830b94226ae13f89bef969c488ac",
      "address": "mmHhzmwiUzorZLYhFH9fhrfFTAHGhx1biN"
    }

  ],
  "tx": "01000000015a9b8fa3fb300a29e9cde6464f49882228862b8e333792fea35ad15536383417010000006a47304402202df28a6fe24dc26b016acee539e137b9502009f57ae6988d468d203e770339f202203b6ab4cc020493061db2d405b2799af2b872d3395f5798616fc51e59f304d5cd0121028986f0724eb55b66bba72985212b95a2c5487631e411dc9cc5348a4531928129ffffffff02e8030000000000001976a9144462dc0989942e38474616dc104e46486c5744ee88ac63619303000000001976a9149affd314659d5ce9fa815fde4e82c879d1ea41d188ac00000000"
}

```

Create, sign, and send a transaction.

### HTTP Request

`POST /wallet/:id/send`

### Post Paramaters
Parameter | Description
--------- | ------------------
outputs <br> _array_ | An array of outputs to send for the transaction
account <br> _string_ | account to use for transaction
passphrase <br> _string_ | passphrase to unlock the account
smart <br> _bool_  | whether or not to choose smart coins, will also used unconfirmed transactions
blocks <br> _int_ | number of blocks to use for fee estimation.
rate <br> _int_ | the rate for transaction fees. Denominated in satoshis per kb
maxFee <br> _int_ |  maximum fee you're willing to pay
subtractFee <br> _bool_ | whether to subtract fee from outputs (evenly)
subtractIndex <br> _int_ | subtract only from specified output index
selection <br> _enum_ - `all`, `random`, `age`, `value`| How to select coins
depth <br> _int_  | number of confirmation for coins to spend


### Output object
Property | Description
--------- | -----------
value <br> _int_ | Value to send in satoshis
address <br> _string_ | destination address for transaction

## Create a Transaction
```javascript
let id, rate, value, address, passphrase;
```

```shell--vars
id="foo"
passphrase="bar"
rate=500
value=1000
address="moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA"
```

```shell--cli
bwallet-cli mktx --id=$id --rate=$rate --value=$value --address=$address --passphrase=$passphrase
```

```shell--curl
curl $url/wallet/$id/create \
  -X POST \
  --data '{
    "rate":"'$rate'",
    "passphrase": "'$passphrase'"
    "outputs":[
      {"address":"'$address'", "value":'$value'}
    ]
  }'
```

```javascript
const wallet = WalletClient.wallet(id);
const outputs = [{ value: value, address: address }]
const options = {
  passphrase: passphrase,
  outputs: outputs,
  rate: rate,
};

(async () => {
  const tx = await wallet.createTX(options);
  console.log(tx);
})();
```

> Sample response:

```json
{
  "hash": "0799a1d3ebfd108d2578a60e1b685350d42e1ef4d5cd326f99b8bf794c81ed17",
  "witnessHash": "0799a1d3ebfd108d2578a60e1b685350d42e1ef4d5cd326f99b8bf794c81ed17",
  "fee": "0.0000454",
  "rate": "0.00020088",
  "mtime": 1486686322,
  "version": 1,
  "flag": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "6dd8dfa9b425a4126061a1032bc6ff6e208b75ee09d0aac089d105dcf972465a",
        "index": 0
      },
      "script": "483045022100e7f1d57e47cd8a28b7c27e015b291f3fd43a6eb0c051a4b65d8697b5133c29f5022020cada0f62a32aecd473f606780b2aef3fd9cbd44cfd5e9e3d9fe6eee32912df012102272dae7ff2302597cb785fd95529da6c07e32946e65ead419291258aa7b17871",
      "witness": "00",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 2,
        "value": "50.0",
        "script": "76a9149621fb4fc6e2e48538f56928f79bef968bf17ac888ac",
        "address": "muCnMvAoUFZXzuao4oy3vQJFcUntax53wE",
        "coinbase": true
      }
    }
  ],
  "outputs": [
    {
      "value": 10000000,
      "script": "76a9143f4f69730dcb175c830b94226ae13f89bef969c488ac",
      "address": "mmHhzmwiUzorZLYhFH9fhrfFTAHGhx1biN"
    },
    {
      "value": 30000000,
      "script": "76a9143f4f69730dcb175c830b94226ae13f89bef969c488ac",
      "address": "moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA"
    }
  ],
  "locktime": 0
}
```

Create and template a transaction (useful for multisig).
Do not broadcast or add to wallet.

### HTTP Request

`POST /wallet/:id/create`

### Post Paramters
Paramter | Description
--------- | ----------------
outputs <br> _array_ | An array of outputs to send for the transaction
passphrase <br> _string_ | passphrase to unlock the account
smart <br> _bool_  | whether or not to choose smart coins, will also used unconfirmed transactions
rate <br> _int_ | the rate for transaction fees. Denominated in satoshis per kb
maxFee <br> _int_ |  maximum fee you're willing to pay
subtractFee <br> _bool_ | whether to subtract fee from outputs (evenly)
subtractIndex <br> _int_ | subtract only from specified output index
selection <br> _enum_ - `all`, `random`, `age`, `value`| How to select coins
depth <br> _int_  | number of confirmation for coins to spend


### Output object
Property | Description
--------- | -----------
value <br> _int_ | Value to send in satoshis
address <br> _string_ | destination address for transaction



## Sign Transaction
```javascript
let id, tx, passphrase;
```

```shell--vars
id="foo"
passphrase="bar"
tx="01000000010d72c6b2582c2b2e625d29dd5ad89209de7e2600ab12a1a8e05813c28b703d2c000000006b483045022100af93a8761ad22af858c5bc4e68b5991eac017dcddd933cf125553ec0b83eb8f30220373a4d8ee331ac4c3975718e2a789f873af0520ddbd2db18957cdf488ccd4ee301210215a9110e2a9b293c332c28d69f88081aa2a949fde67e35a13fbe19410994ffd9ffffffff0280969800000000001976a9143f4f69730dcb175c830b94226ae13f89bef969c488ac80c3c901000000001976a9143f4f69730dcb175c830b94226ae13f89bef969c488ac00000000"
```

```shell--cli
bwallet-cli sign --id=$id --passphrase=$passphrase --tx=$tx
```

```shell--curl
curl $url/wallet/$id/sign \
  -X POST \
  --data '{"tx": "'$tx'", "passphrase":"'$passphrase'"}'
```

```javascript
const wallet = WalletClient.wallet(id);
const options = { passphrase: passphrase };
(async () => {
  const signedTx = await wallet.sign(tx, options);
  console.log(signedTx);
})();
```

> Sample Output

```json
{
  "hash": "2a22606ee555d2c26ec979f0c45cd2dc18c7177056189cb345989749fd587868",
  "witnessHash": "2a22606ee555d2c26ec979f0c45cd2dc18c7177056189cb345989749fd587868",
  "fee": 10000000,
  "rate": 44247787,
  "mtime": 1503683721,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "2c3d708bc21358e0a8a112ab00267ede0992d85add295d622e2b2c58b2c6720d",
        "index": 0
      },
      "script": "483045022100af93a8761ad22af858c5bc4e68b5991eac017dcddd933cf125553ec0b83eb8f30220373a4d8ee331ac4c3975718e2a789f873af0520ddbd2db18957cdf488ccd4ee301210215a9110e2a9b293c332c28d69f88081aa2a949fde67e35a13fbe19410994ffd9",
      "witness": "00",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 1179720,
        "value": 50000000,
        "script": "76a9145730f139d833e3af30ccfb7c4e253ff4bab5de9888ac",
        "address": "moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA",
        "coinbase": false
      }
    }
  ],
  "outputs": [
    {
      "value": 10000000,
      "script": "76a9143f4f69730dcb175c830b94226ae13f89bef969c488ac",
      "address": "mmHhzmwiUzorZLYhFH9fhrfFTAHGhx1biN"
    },
    {
      "value": 30000000,
      "script": "76a9143f4f69730dcb175c830b94226ae13f89bef969c488ac",
      "address": "mmHhzmwiUzorZLYhFH9fhrfFTAHGhx1biN"
    }
  ],
  "locktime": 0,
  "hex": "01000000010d72c6b2582c2b2e625d29dd5ad89209de7e2600ab12a1a8e05813c28b703d2c000000006b483045022100af93a8761ad22af858c5bc4e68b5991eac017dcddd933cf125553ec0b83eb8f30220373a4d8ee331ac4c3975718e2a789f873af0520ddbd2db18957cdf488ccd4ee301210215a9110e2a9b293c332c28d69f88081aa2a949fde67e35a13fbe19410994ffd9ffffffff0280969800000000001976a9143f4f69730dcb175c830b94226ae13f89bef969c488ac80c3c901000000001976a9143f4f69730dcb175c830b94226ae13f89bef969c488ac00000000"
}
```

Sign a templated transaction (useful for multisig).

### HTTP Request

`POST /wallet/:id/sign`

### Post Paramters
Parameter | Description
----------| -----------------
tx <br> _string_ | the hex of the transaction you would like to sign
passphrase <br> _string_ | passphrase to unlock the wallet

## Zap Transactions

```javascript
let id, age, account;
```

```shell--vars
id="foo"
account="baz"
age=259200 # 72 hours
```

```shell--cli
bwallet-cli zap --id=$id account=$account age=$age
```

```shell--curl
curl $url/wallet/$id/zap \
  -X POST \
  --data '{
            "account": "'$account'",
            "age": "'$age'"
          }'
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = wallet.zap(account, age);
  console.log(response);
})();
```

> Sample Response


```json
{
  "success": true
}
```

Remove all pending transactions older than a specified age.

### HTTP Request

`POST /wallet/:id/zap?age=3600`

### Post Parameters
Paramaters | Description
----------- | -------------
account <br> _string_ or _number_ | account to zap from
age <br> _number_ | age threshold to zap up to (unix time)

## Unlock Wallet

```javascript
let id, pass, timeout
```

```shell--vars
id='foo'
pass='bar',
timeout=60
```

```shell--cli
bwallet-cli unlock --id=$id $pass $timeout
```

```shell--curl
curl $url/wallet/$id/unlock \
  -X POST
  --data '{"passphrase":'$pass', "timeout": '$timeout'}'
```

```javascript
const client = new bcoin.http.Client();
(async () => {
  const response = await client.unlock(id, pass, timeout);
  console.log(response);
})();
```
> Sample Response

```json
{"success": true}
```

Derive the AES key from passphrase and hold it in memory for a specified number of seconds. Note: During this time, account creation and signing of transactions will not require a passphrase.

### HTTP Request

`POST /wallet/:id/unlock`

### Body Parameters
Parameter | Description
--------- | -----------------------
passphrase <br> _string_ | Password used to encrypt the wallet being unlocked
timeout <br> _number_ | time to re-lock the wallet in seconds. (default=60)

## Lock Wallet

```javascript
let id;
```

```shell--vars
id='foo'
```

```shell--cli
bwallet-cli lock --id=$id
```

```shell--curl
curl $url/wallet/$id/lock \
  -X POST
```

```javascript
const client = new bcoin.http.Client();
(async () => {
  const response = await client.lock(id);
  console.log(response);
})();
```
> Sample Response

```json
{"success": true}
```

If unlock was called, zero the derived AES key and revert to normal behavior.

### HTTP Request

`POST /wallet/:id/lock`

## Import Public/Private Key

```javascript
let id, account, key;
```

```shell--vars
id='foo'
account='test-account'
key='0215a9110e2a9b293c332c28d69f88081aa2a949fde67e35a13fbe19410994ffd9'
```

```shell--cli
bwallet-cli import --id=$id $key
```

```shell--curl
curl $url/wallet/$id/import \
  -X POST \
  --data '{"account":"'$account'", "privateKey":"'$key'"}'
```


```javascript
const wallet = new bcoin.http.Wallet({ id: id });
(async () => {
  const response = await wallet.importPrivate(account, key);
  console.log(response);
})();
```
> Sample Response

```json
{
  "success": true
}
```

Import a standard WIF key.

An import can be either a private key or a public key for watch-only. (Watch Only wallets will throw an error if trying to import a private key)

A rescan will be required to see any transaction history associated with the
key.

<aside class="warning">
Note that imported keys do not exist anywhere in the wallet's HD tree. They can be associated with accounts but will not be properly backed up with only the mnemonic.
</aside>

### HTTP Request

`POST /wallet/:id/import`

### Body Paramters
Paramter | Description
-------- | -------------------------
id <br> _string_ | id of target wallet to import key into
privateKey <br> _string_ | Base58Check encoded private key
publicKey <br> _string_ | Hex encoded public key

> Will return following error if incorrectly formatted:
`Bad key for import`

## Import Address
```javascript
let id, account, address;
```

```shell--vars
id='foo'
account='bar'
address='moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA'
```

```shell--cli
bwallet-cli watch --id=$id --account=$account $address
```

```shell--curl
curl $url/wallet/$id/import \
  -X POST \
  --data '{"account":"'$account'", "address":"'$address'"}'
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.importAddress(account, address)
})();
```

> Sample Response

```json
{
  "success": true
}
```

Import a Base58Check encoded address. Addresses (like public keys) can only be imported into watch-only wallets

The HTTP endpoint is the same as for key imports.

### HTTP Request

`POST /wallet/:id/import`

### Body Paramters
Paramter | Description
-------- | -------------------------
id <br> _string_ | id of target wallet to import key into
address <br> _string_ | Base58Check encoded address

## Get Blocks with Wallet Txs
```javascript
let id;
```

```shell--vars
id="foo"
```

```shell--curl
curl $url/wallet/$id/block
```

```shell--cli
bwallet-cli blocks --id=$id
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const blocks = await wallet.getBlocks();
  console.log(blocks);
}())
```
> Sample Response

```json
[ 1179720, 1179721, 1180146, 1180147, 1180148, 1180149 ]
```

List all block heights which contain any wallet transactions. Returns an array of block heights

### HTTP Request

`GET /wallet/:id/block`

Parameters | Description
-----------| ------------
id <br> _string_ | id of wallet to query blocks with its transactions in it

## Get Wallet Block by Height
```javascript
let id, height;
```

```shell--vars
id="foo"
height=1179720
```

```shell--cli
bwallet-cli --id=$id block $height
```

```shell--curl
curl $url/wallet/block/$height
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const blockInfo = await wallet.getBlock(height);
  console.log(blockInfo);
})
```

> Sample response:

```json
{
  "hash": "0000000000013cc12ea4b3ff403a3c05d96da695638e468cf26409eca87beb6a",
  "height": 1179720,
  "time": 1503359756,
  "hashes": [
    "2c3d708bc21358e0a8a112ab00267ede0992d85add295d622e2b2c58b2c6720d"
  ]
}
```

Get block info by height.

### HTTP Request

`GET /wallet/:id/block/:height`

Paramaters | Description
-----------| -------------
id <br> _string_ | id of wallet which has tx in the block being queried
height <br> _int_ | height of block being queried


## Add xpubkey (Multisig)
```javascript
let id, key, account;
```

```shell--vars
id="multi-foo"
key="tpubDCUQshhR98hjDDPtefuQdg4Dmpk5mes3TRyUp1Qa4BjxCVytfqmqNWmJ3tUZfqu4qLfEypQhNcpMF3yhZJ8h8hcahnxCzrqWmV5qVHHTqGM"
```

```shell--cli
bwallet-cli --id=$id shared add $key
```

```shell--curl
curl $url/wallet/$id/shared-key \
  -X PUT
  --data '{"accountKey": $key}'
```

```javascript
const wallet = WalletClient.wallet(id);
account = 'default';

(async () => {
  const response = await wallet.addSharedKey(account, key);
  console.log(response);
})();
```

> Sample Response

```json
{
  "success": true,
  "addedKey": true
}
```

Add a shared xpubkey to wallet. Must be a multisig wallet.

<aside class="notice">
Note that since it must be a multisig, the wallet on creation should be set with <code>m</code> and <code>n</code> where <code>n</code> is greater than 1 (since the first key is always that wallet's own xpubkey)
</aside>

Response will return `addedKey: true` true if key was added on this request. Returns
`false` if key already added, but will still return `success: true` with status `200`.

### HTTP Request

`PUT /wallet/:id/shared-key`

### Body Parameters
Paramter | Description
---------| --------------
accountKey <br> _string_ | xpubkey to add to the multisig wallet
account <br> _string_ | multisig account to add the xpubkey to (default='default')

## Remove xpubkey (Multisig)

```javascript
let id, key;
```

```shell--vars
id="multi-foo"
key="tpubDCUQshhR98hjDDPtefuQdg4Dmpk5mes3TRyUp1Qa4BjxCVytfqmqNWmJ3tUZfqu4qLfEypQhNcpMF3yhZJ8h8hcahnxCzrqWmV5qVHHTqGM"
```

```shell--cli
bwallet-cli --id=$id shared remove $key
```

```shell--curl
curl $url/wallet/$id/shared-key \
  -X DELETE
  --data '{"accountKey": "'$key'"}'
```

```javascript
const wallet = WalletClient.wallet(id);
const account = 'default';

(async () => {
  const response = await wallet.removeSharedKey(account, key);
  console.log(response);
})();
```

> Sample Response

```json
{
  "success": true,
  "removedKey": true
}
```

Remove shared xpubkey from wallet if present.

Response will return `removedKey: true` true if key was removed on this request. Returns
`false` if key already removed, but will still return `success: true` with status `200`.

### HTTP Request

`DEL /wallet/:id/shared-key`

### Body Parameters
Paramter | Description
---------| --------------
accountKey <br> _string_ | xpubkey to add to the multisig wallet
account <br> _string_ | multisig account to remove the key from (default='default')


## Get Public Key By Address
```javascript
let id, address;
```

```shell--vars
id="foo"
address="n1EDbjFaKFwz2XwWPueDUac4XZsQg8d1p2"
```

```shell--cli
bwallet-cli --id=$id key $address
```

```shell--curl
curl $url/wallet/$id/key/$address
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.getKey(address);
  console.log(response);
})();
```

> Sample Response

```json
{
  "network": "testnet",
  "wid": 8,
  "id": "foo",
  "name": "default",
  "account": 0,
  "branch": 0,
  "index": 7,
  "witness": false,
  "nested": false,
  "publicKey": "032b110a0f83d45c1010cf03adea64b440d83a1a3726f7c2d5e94db1d6509b3ac6",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "n1EDbjFaKFwz2XwWPueDUac4XZsQg8d1p2"
}
```

Get wallet key by address. Returns wallet information with address and public key

### HTTP Request

`GET /wallet/:id/key/:address`

Parameters | Description
-----------| --------------
id <br> _string_ | id of wallet that holds the address being queried
address <br> _string_ | Base58 encoded address to get corresponding public key for

## Get Private Key By Address
```javascript
let id, address;
```

```shell--vars
id="foo"
address="n1EDbjFaKFwz2XwWPueDUac4XZsQg8d1p2"
```

```shell--cli
bwallet-cli --id=$id dump $address
```

```shell--curl
curl $url/wallet/$id/wif/$address
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.getWIF(address);
  console.log(response);
})();
```

> Sample Response

```json
{
  "privateKey": "cTMUJ7WeFsoQ6dLGR9xdLZeNQafcU88bbibR9TV3W2HheRntYa53"
}

```

Get wallet private key (WIF format) by address. Returns just the private key

### HTTP Request

`GET /wallet/:id/wif/:address`

Parameters | Description
-----------| --------------
id <br> _string_ | id of wallet that holds the address being queried
address <br> _string_ | Base58 encoded address to get corresponding public key for


## Generate Receiving Address
```javascript
let id, account;
```

```shell--vars
id="foo"
account="default"
```

```shell--cli
bwallet-cli --id=$id address
```

```shell--curl
curl $url/wallet/$id/address -X POST --data '{"account":"'$account'"}'
```

```javascript
const wallet = WalletClient.wallet(id);
(async () => {
  const receiveAddress = await wallet.createAddress(account);
  console.log(receiveAddress);
})();
```

> Sample response:

```json
{
  "network": "testnet",
  "wid": 1,
  "id": "foo",
  "name": "default",
  "account": 0,
  "branch": 0,
  "index": 9,
  "witness": false,
  "nested": false,
  "publicKey": "02801d9457837ed50e9538ee1806b6598e12a3c259fdc9258bbd32934f22cb1f80",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "mwX8J1CDGUqeQcJPnjNBG4s97vhQsJG7Eq"
}
```

Derive new receiving address for account.

<aside class="notice">
Note that, except for the CLI which assumes 'default' account, an account must be passed for the call to work.
</aside>

### HTTP Request

`POST /wallet/:id/address`

### Post Paramters
Parameter | Description
--------- | -------------
account <br>_string_ | BIP44 account to generate address from

## Generate Change Address
```javascript
let id, account;
```

```shell--vars
id="foo"
account="default"
```

```shell--cli
bwallet-cli --id=$id change
```

```shell--curl
curl $url/wallet/$id/change -X POST --data '{"account":"'$account'"}'
```

```javascript
const wallet = WalletClient.wallet(id);
(async () => {
  const receiveAddress = await wallet.createChange(account);
  console.log(receiveAddress);
})();
```

> Sample response:

```json
{
  "network": "testnet",
  "wid": 8,
  "id": "foo",
  "name": "default",
  "account": 0,
  "branch": 1,
  "index": 7,
  "witness": false,
  "nested": false,
  "publicKey": "022f5afafcc8c35dbbbe52842d58dc18d739f2dea85021ea1e9183031032f9fa1c",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "mgdArtHtCsxvcjzxRTMfk5ZyBcnsTgNKTT"
}
```
Derive new change address for account.

<aside class="info">
Note that, except for the CLI which assumes 'default' account, an account must be passed for the call to work.
</aside>

### HTTP Request

`POST /wallet/:id/change`

### Post Paramters
Parameter | Description
--------- | -------------
account <br>_string_ | BIP44 account to generate address from

## Derive Nested Address

```javascript
let id, account;
```

```shell--vars
id="foo"
account="baz"
```

```shell--cli
bwallet-cli --id=$id nested --account=$account
```

```shell--curl
curl $url/wallet/$id/nested -X POST --data '{"account": "'$account'"}'
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.createNested(account);
  console.log(response);
})();
```

> Sample response

```json
{
  "network": "testnet",
  "wid": 31,
  "id": "foo",
  "name": "baz",
  "account": 0,
  "branch": 2,
  "index": 2,
  "witness": true,
  "nested": true,
  "publicKey": "02a7a12fa67a7f0dc0bb2ae2c45d80c9b6248c004ef8b3f8da3f6feaf623f60939",
  "script": null,
  "program": "0014be20ad0c7ad43d1bb9f922f15cd7ba63b7fee290",
  "type": "scripthash",
  "address": "2NBzYG49AiNJjUr7NA1r4eee8jUpacb3Eo2"
}
```

Derive new nested p2sh receiving address for account. Note that this can't be done on a non-witness account otherwise you will receive the following error:

`[error] (node) Cannot derive nested on non-witness account.`

### HTTP Request

`POST /wallet/:id/nested`

### Post Paramters
Paramter | Description
--------- | --------------
account <br> _string_ | account to derive the nested address for (default='default')

## Get Balance
```javascript
let id, account;
```

```shell--vars
id='foo'
account='bar'
```

```shell--cli
bwallet-cli --id=$id balance --account=$account
```

```shell--curl
curl $url/wallet/$id/balance?account=$account
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = wallet.getBalance(account);
  console.log(response);
})();
```

> Sample response:

```json
{
  "wid": 1,
  "id": "foo",
  "account": 1,
  "unconfirmed": "8149.9999546",
  "confirmed": "8150.0"
}
```

Get wallet or account balance. If no account option is passed, the call defaults to wallet balance (with account index of `-1`)

### HTTP Request

`GET /wallet/:id/balance?account=:account`

### Request Paramters

Paramters | Description
--------- | -------------
id <br> _string_ | wallet id to get balance of
account <br> _string_ | account name (optional, defaults to entire wallet balance)

## List all Coins

```javascript
let id;
```

```shell--vars
id="foo"
```

```shell--curl
curl $url/wallet/$id/coin
```

```shell--cli
bwallet-cli --id=$id coins
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = wallet.getCoins();
  console.log(response);
})();
```

> Sample Response

```json
[
  {
    "version": 1,
    "height": 1180963,
    "value": 1000,
    "script": "76a9145730f139d833e3af30ccfb7c4e253ff4bab5de9888ac",
    "address": "moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA",
    "coinbase": false,
    "hash": "bf49aaf50dfa229b99e83d29cae2515487b05cccb88cd111fb2ac738dac1058a",
    "index": 0
  },
  {
    "version": 1,
    "height": 1180963,
    "value": 1000,
    "script": "76a9145730f139d833e3af30ccfb7c4e253ff4bab5de9888ac",
    "address": "moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA",
    "coinbase": false,
    "hash": "efbaa2681576e0c2a9ee8e0bdaddd889e95e9631b94467b57552e5bc7048c2ae",
    "index": 0
  }
]
```
List all wallet coins available.

### HTTP Request

`GET /wallet/:id/coin`

## Lock Coin/Outpoints

```javascript
let id, passphrase, hash, index;
```

```shell--vars
id="foo"
passphrase="bar"
hash="dd1a110edcdcbb3110a1cbe0a545e4b0a7813ffa5e77df691478205191dad66f"
index="0"
```

```shell--cli
# Not Supported in CLI
```

```shell--curl
curl $url/wallet/$id/locked$hash/$index -X PUT --data '{"passphrase": "'$pasphrase'"}'
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.lockCoin(hash, index);
  console.log(response);
})();
```

> Sample response:

```json
{
  "success": true
}
```

Lock outpoints.

### HTTP Request

`PUT /wallet/:id/locked/:hash/:index`

### Request Parameters
Paramters | Description
---------- | --------------
id <br> _string_ | id of wallet that contains the outpoint
hash <br> _string_ | hash of transaction that created the outpoint
index <br> _string_ or _int_ | index of the output in the transaction being referenced

### Body Paramters
Parameter | Description
--------- | ------------
passphrase <br> _string_ | passphrase of wallet being referenced

## Unlock Outpoint

```javascript
let id, passphrase, hash, index;
```

```shell--vars
id="foo"
passphrase="bar"
hash="dd1a110edcdcbb3110a1cbe0a545e4b0a7813ffa5e77df691478205191dad66f"
index="0"
```

```shell--cli
# Not Supported in CLI
```

```shell--curl
curl $url/wallet/$id/locked/$hash/$index -X DELETE --data '{"passphrase": "'$pasphrase'"}'
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.unlockCoin(hash, index);
  console.log(response);
})();
```

> Sample response:

```json
{
  "success": true
}
```

Unlock outpoints.

### HTTP Request

`DEL /wallet/:id/locked/:hash/:index`

### Request Parameters
Paramters | Description
---------- | --------------
id <br> _string_ | id of wallet that contains the outpoint
hash <br> _string_ | hash of transaction that created the outpoint
index <br> _string_ or _int_ | index of the output in the transaction being referenced

### Body Paramters
Parameter | Description
--------- | ------------
passphrase <br> _string_ | passphrase of wallet being referenced


## Get Locked Outpoints

```javascript
let id;
```

```shell--vars
id="foo"
```

```shell--cli
# Not supported in CLI
```

```shell--curl
curl $url/wallet/$id/locked
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.getLocked();
  console.log(response);
})();
```

> Sample response:

```json
[
  {
    "hash":"dd1a110edcdcbb3110a1cbe0a545e4b0a7813ffa5e77df691478205191dad66f",
    "index":0
  }
]
```

Get all locked outpoints.

### HTTP Request

`GET /wallet/:id/locked`

### Request Parameters
Paramters | Description
---------- | --------------
id <br> _string_ | id of wallet to check for outpoints


## Get Wallet Coin

```javascript
let id, hash, index;
```

```shell--vars
id="foo"
hash="efbaa2681576e0c2a9ee8e0bdaddd889e95e9631b94467b57552e5bc7048c2ae"
index=0
```

```shell--cli
# command is wallet agnostic, same as in vanilla coin command

bcoin-cli coin $hash $index
```

```shell--curl
curl $url/wallet/$id/coin/$hash/$index
```

```javascript
const wallet = WalletClient.wallet(id);

(async () => {
  const response = await wallet.getCoin(hash, index);
  console.log(response);
})();
```

> Sample response:

```json
{
  "version": 1,
  "height": 1180963,
  "value": 1000,
  "script": "76a9145730f139d833e3af30ccfb7c4e253ff4bab5de9888ac",
  "address": "moTyiK7aExe2v3hFJ9BCsYooTziX15PGuA",
  "coinbase": false,
  "hash": "efbaa2681576e0c2a9ee8e0bdaddd889e95e9631b94467b57552e5bc7048c2ae",
  "index": 0
}
```

Get wallet coin
### HTTP Request

`GET /wallet/:id/coin/:hash/:index`

### Request Parameters
Paramters | Description
---------- | --------------
id <br> _string_ | id of wallet that contains the outpoint
hash <br> _string_ | hash of transaction that created the outpoint
index <br> _string_ or _int_ | index of the output in the transaction being referenced
