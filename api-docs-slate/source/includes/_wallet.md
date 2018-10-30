# Wallet
## The Wallet Client

```shell--cli
npm i -g bclient
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

const id = 'primary'; // or whatever your wallet name is

const wallet = walletClient.wallet(id);
```

The best way to interact with the wallet API is with bwallet-cli in the `bclient`
[package](https://www.npmjs.com/package/bclient). Installing globally with
`npm i -g bclient` gives you access to the CLI. You can also install locally
to your project.

Note that when using it in your own program, you will need to explicitly
pass in a port option. The easiest way to do this is with `bcoin.Network`.

You can create a client for a specific wallet (and be compatible with the old
API) with the `wallet` method on `WalletClient` class.

The wallet HTTP server listens on it's own port, separate from the node's server.
By default the wallet server listens on these `localhost` ports:


Network   | API Port
--------- | -----------
main      | 8334
testnet   | 18334
regtest   | 48334
simnet    | 18558


## Configuration
Persistent configuration can be added to `wallet.conf` in your `prefix` directory.
This could be the same directory as `bcoin.conf` for the node server, [but could also
be in a network-specific directory.](https://github.com/bcoin-org/bcoin/blob/master/docs/Configuration.md)

> Example Configuration:

```shell--vars
network: regtest
wallet-auth: true
api-key: api-key
http-host: 0.0.0.0
```

<aside class="notice">
It is highly recommended to always use <code>wallet-auth</code> and to set a unique <code>api-key</code>,
even for local development or local wallets. Without <code>wallet-auth: true</code> other applications
on your system could theoretically access your wallet through the HTTP server
without any authentication barriers. <code>wallet-auth: true</code> requires a wallet's token to be submitted with every request.
</aside>


## Wallet Auth
> The following samples return a wallet object using a wallet token

```javascript
let token, id;
```

```shell--vars
id='primary'
token='17715756779e4a5f7c9b26c48d90a09d276752625430b41b5fcf33cf41aa7615'
```

```shell--curl
curl $walleturl/$id?token=$token
```

```shell--cli
bwallet-cli get --token=$token
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
const wallet = walletClient.wallet(id, token);

(async () => {
  const result = await wallet.getInfo();
  console.log(result);
})();
```

Individual wallets have their own api keys, referred to internally as "tokens" (a 32 byte hash - calculated as `HASH256(m/44'->ec-private-key|tokenDepth)`).

A wallet is always created with a corresponding token. When using API endpoints
for a specific wallet, the token must be sent back in the query string or JSON
body.

<aside class="warning">
The examples in this section demonstrate how to use a wallet token for API access, which is recommended. However, for clarity, further examples in these docs will omit the token requirement.
</aside>


## The WalletDB and Object
```javascript
let id;
```

```shell--vars
id="primary"
```

```shell--curl
curl http://x:api-key@127.0.0.1:48334/wallet # will list regtest (default port 48334) wallets

# examples in these docs will use an environment variable:
walleturl=http://x:api-key@127.0.0.1:48334/wallet/
curl $walleturl/$id
```

```shell--cli
# Like the node client, you can configure it by passing arguments:
bwallet-cli --network=regtest --id=$id get

# ...or you can use environment variables. The default `id` is `primary`:
export BCOIN_API_KEY=yoursecret
export BCOIN_NETWORK=regtest
bwallet-cli get
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
  const result = await wallet.getInfo();
  console.log(result);
})();
```


> The wallet object will look something like this:

```json
{
  "network": "regtest",
  "wid": 0,
  "id": "primary",
  "watchOnly": false,
  "accountDepth": 1,
  "token": "17715756779e4a5f7c9b26c48d90a09d276752625430b41b5fcf33cf41aa7615",
  "tokenDepth": 0,
  "master": {
    "encrypted": false
  },
  "balance": {
    "tx": 5473,
    "coin": 5472,
    "unconfirmed": 1504999981750,
    "confirmed": 1494999998350
  }
}
```

bcoin maintains a wallet database which contains every wallet. Wallets are not usable without also using a wallet database. For testing, the wallet database can be in-memory, but it must be there. Wallets are uniquely identified by an id and the walletdb is created with a default id of `primary`. (See [Create a Wallet](#create-a-wallet) below for more details.)

Wallets in bcoin use bip44. They also originally supported bip45 for multisig, but support was removed to reduce code complexity, and also because bip45 doesn't seem to add any benefit in practice.

The wallet database can contain many different wallets, with many different accounts, with many different addresses for each account. bcoin should theoretically be able to scale to hundreds of thousands of wallets/accounts/addresses.

Each account can be of a different type. You could have a pubkeyhash account, as well as a multisig account, a witness pubkeyhash account, etc.

Note that accounts should not be accessed directly from the public API. They do not have locks which can lead to race conditions during writes.

### wallet object vs wallet client object

bclient returns a WalletClient object that can perform [admin functions](#wallet-admin-commands) without specifying a wallet, and may be useful when managing multiple wallets. WalletClient can also return a wallet object specified by an <code>id</code>. This object performs functions (and may be authorized by a token) specific to that wallet only.


<aside class="warning">
Accounts within the same wallet are all related by deterministic hierarchy. However, wallets are not related to each other in any way. This means that when a wallet seed is backed up, all of its accounts (and their keys) can be derived from that backup. However, each newly created wallet must be backed up separately.
</aside>


## Create A Wallet

```javascript
let id, passphrase, witness, watchOnly, accountKey;
```

```shell--vars
id='newWallet'
passphrase='secret456'
witness=false
watchOnly=true
accountKey='rpubKBAoFrCN1HzSEDye7jcQaycA8L7MjFGmJD1uuvUZ21d9srAmAxmB7o1tCZRyXmTRuy5ZDQDV6uxtcxfHAadNFtdK7J6RV9QTcHTCEoY5FtQD'
```

```shell--curl
curl $walleturl/$id \
  -X PUT \
  --data '{"witness":'$witness', "passphrase":"'$passphrase'", "watchOnly": '$watchOnly', "accountKey":"'$accountKey'"}'
```

```shell--cli
# watchOnly defaults to true if --key flag is set

bwallet-cli mkwallet $id --witness=$witness --passphrase=$passphrase --watch-only=$watchOnly --account-key=$accountKey
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

const options = {
  passphrase: passphrase,
  witness: witness,
  watchOnly: watchOnly,
  accountKey: accountKey
};

(async() => {
  const result = await walletClient.createWallet(id, options);
  console.log(result);
})();
```

> Sample response:

```json
{
  "network": "regtest",
  "wid": 2,
  "id": "newWallet",
  "watchOnly": true,
  "accountDepth": 1,
  "token": "21b728d8f9e4d909349cf0c8f1e4e74fd45b180103cb7f1885a197d04012ba08",
  "tokenDepth": 0,
  "master": {
    "encrypted": true,
    "until": 1527181467,
    "iv": "53effaf192a346b40b08a52dac0658ce",
    "algorithm": "pbkdf2",
    "n": 50000,
    "r": 0,
    "p": 0
  },
  "balance": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": 0,
    "confirmed": 0
  }
}
```

Create a new wallet with a specified ID.

### HTTP Request

`PUT /wallet/:id`

### Parameters:

Name | Type | Default | Description
---------- | ----------- | -------------- | -------------
id | String |  | Wallet ID (used for storage)
master | HDPrivateKey | | Master HD key. If not present, it will be generated
witness | Boolean | `false` | Whether to use witness programs
watchOnly | Boolean | `false` | (`watch-only` for CLI)
accountKey | String | | The extended public key for the primary account in the new wallet. This value is ignored if `watchOnly` is `false` <br>(`account-key` for CLI)
type | String | |Type of wallet (pubkeyhash (default), multisig)
m | Number | `1` | m value for multisig (`m-of-n`)
n | Number | `1` | n value for multisig (`m-of-n`)
mnemonic | String | | A mnemonic phrase to use to instantiate an hd private key. One will be generated if none provided
passphrase | String | | A strong passphrase used to encrypt the wallet
accountDepth* | Number | `0` | The index of the _next_ [BIP44 account index](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#Account)
compressed* | Boolean | `true` | Whether to use compressed public keys

_(*) options are only available in Javascript usage, not CLI or curl_



## Reset Authentication Token
```javascript
let id;
```

```shell--vars
id='primary'
passphrase='secret123'
```

```shell--cli
bwallet-cli retoken --id=$id --passphrase=$passphrase
```

```shell--curl
curl $walleturl/$id/retoken \
  -X POST \
  --data '{"passphrase":"'$passphrase'"}'
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
  const result = await wallet.retoken(passphrase);
  console.log(result);
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
Note: if you happen to lose the returned token, you will not be able to access the wallet (as long as <nobr><code>wallet-auth: true</code></nobr> is still set, as recommended, in <code>wallet.conf</code>
</aside>


### HTTP Request

`POST /wallet/:id/retoken`

## Get Wallet Info
```javascript
let id;
```

```shell--vars
id='primary'
```

```shell--curl
curl $walleturl/$id
```

```shell--cli
bwallet-cli get --id=$id
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
  const result = await wallet.getInfo();
  console.log(result);
})();
```

> Sample output

```json
{
  "network": "regtest",
  "wid": 0,
  "id": "primary",
  "watchOnly": false,
  "accountDepth": 1,
  "token": "4d9e2a62f67929340b8c600bef0c965370f29cc64afcdeb7aea9cb52906c1d27",
  "tokenDepth": 13,
  "master": {
    "encrypted": true,
    "until": 0,
    "iv": "e33424f46674d4010fb0715bb69abc98",
    "algorithm": "pbkdf2",
    "n": 50000,
    "r": 0,
    "p": 0
  },
  "balance": {
    "tx": 5473,
    "coin": 5472,
    "unconfirmed": 1504999981750,
    "confirmed": 1494999998350
  }
}
```

Get wallet info by ID. If no id is passed in the CLI it assumes an id of `primary`.

### HTTP Request
`GET /wallet/:id`

Parameters | Description
---------- | -----------
id <br> _string_ | named id of the wallet whose info you would like to retrieve

<aside class="notice">
The <code>balance</code> value returned by this API call is a bit confusing. <code>confirmed</code> refers to the total value of all transactions confirmed
on the blockchain. <code>unconfirmed</code> includes all those same confirmed transactions as well as any transactions still in the mempool.
So the <code>unconfirmed</code> value isn't just the value of pending transactions, it's what the total balance of the wallet WILL BE 
once all pending transactions are confirmed.
</aside>

## Get Master HD Key
```javascript
let id;
```
```shell--vars
id='primary'
```

```shell--curl
curl $walleturl/$id/master
```

```shell--cli
bwallet-cli master --id=$id
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
  const result = await wallet.getMaster();
  console.log(result);
})();
```

> Sample responses:

> BEFORE passphrase is set:

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

> AFTER passphrase is set:

```json
{
  "encrypted": true,
  "until": 1527121890,
  "iv": "e33424f46674d4010fb0715bb69abc98",
  "ciphertext": "c2bd62d659bc92212de5d9e939d9dc735bd0212d888b1b04a71d319e82e5ddb18008e383130fd0409113264d1cbc0db42d997ccf99510b168c80e2f39f2983382457f031d5aa5ec7a2d61f4fc92c62117e4eed59afa4a17d7cb0aae3ec5fa0d4",
  "algorithm": "pbkdf2",
  "n": 50000,
  "r": 0,
  "p": 0
}
```

Get wallet master HD key. This is normally censored in the wallet info route. The provided API key must have admin access.
<aside class="warning">
Once a passphrase has been set for a wallet, the API will not reveal the unencrypted master private key or seed phrase. Be sure you back it up right away!
</aside>

### HTTP Request

`GET /wallet/:id/master`

Parameters | Description
---------- | -----------
id <br> _string_ | named id of the wallet whose info you would like to retrieve


## Change Passphrase
```javascript
let id, oldPass, newPass;
```

```shell--vars
id='newWallet'
oldPass='secret456'
newPass='789secret'
```

```shell--cli
> No cli command available
```

```shell--curl
curl $walleturl/$id/passphrase \
  -X POST \
  --data '{"old":"'$oldPass'", "passphrase":"'$newPass'"}'
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
  const result = await wallet.setPassphrase(oldPass, newPass);
  console.log(result);
})();
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
If you have never set a passphrase for this wallet before, you need to omit the <code>old</code> argument and just send a new <nobr><code>passphrase</code></nobr>
</aside>

## Send a transaction

```shell--cli
id="primary"
passphrase="secret123"
rate=0.00001000
value=0.00020000
address="RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"

bwallet-cli send --id=$id --value=$value --address=$address ---passphrase=$passphrase
```

```shell--curl
id="primary"
passphrase="secret123"
rate=1000
value=20000
address="RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"

curl $walleturl/$id/send \
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
let id, passphrase, rate, value, address;
id="primary"
passphrase="secret123"
rate=1000
value=20000
address="RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"

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

const options = {
  passphrase: passphrase,
  rate: rate,
  outputs: [{ value: value, address: address }]
};

(async () => {
  const result = await wallet.send(options);
  console.log(result);
})();
```

> Sample response:

```json
{
  "hash": "8fafdf2a6c44fc48dbe01147339a59fa11f2c5a7254d2e6df27ce0a61df29cf7",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1527181979,
  "date": "1970-01-01T00:00:00Z",
  "mdate": "2018-05-24T17:12:59Z",
  "size": 225,
  "virtualSize": 225,
  "fee": 4540,
  "rate": 20177,
  "confirmations": 0,
  "inputs": [
    {
      "value": 5000000000,
      "address": "R9cS4kuYVWHaDJmRGMpwx7zCNjw97Zm5LL",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/0"
      }
    }
  ],
  "outputs": [
    {
      "value": 1000,
      "address": "RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8",
      "path": null
    },
    {
      "value": 4999994460,
      "address": "RX3ZPBURVYzjRPR3wYdGepMBa26CGK8VMu",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/0"
      }
    }
  ],
  "tx": "01000000017a2c5144386ed317c1f2ff484e7e11be718721d7ddab15773d0dd6133fb38a14000000006a4730440220710c42d68bd02789c31e7d351a6795c2a9386749e1d8a6aa61d46d5ba345843e022023d83a31e657f043d08d7e86379b818c98d788bb34bfe71ad2d9fa6dcb44b48b0121036b90b9f76925944b238239115f0c12ecee1b7e060e50850b4884aa0e0daea0c4ffffffff02e8030000000000001976a9149e6a64a9dfdf49bfa72e1402663ac40aa5e30a7188ac5cdc052a010000001976a914eebeba5a5b40bb11ca70f48b71bdb2c2b89f0c5c88ac00000000"
}
```

Create, sign, and send a transaction.

<aside class="warning">Be careful how you enter values and fee rates!<br>
<code>value</code> and <code>rate</code> are expressed in satoshis when using cURL or Javascript<br>
<code>value</code> and <code>rate</code> are expressed in WHOLE BITCOINS when using CLI<br>
Watch carefully how values are entered in the examples, all examples send the same amount when executed
</aside>

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
sort <br> _bool_ | Sort outputs and inputs according BIP69
maxFee <br> _int_ |  maximum fee you're willing to pay
subtractFee <br> _bool_ | whether to subtract fee from outputs (evenly)
subtractIndex <br> _int_ | subtract only from specified output index
selection <br> _enum_ - `all`, `random`, `age`, `value`| How to select coins
depth <br> _int_  | number of confirmation for coins to spend
value <br> _int_ (or _float_) | Value to send in satoshis (or whole BTC, see warning above)
address <br> _string_ | destination address for transaction

## Create a Transaction
```shell--cli
id="multisig1"
passphrase="multisecret123"
rate=0.00001000
value=0.05000000
address="RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"

bwallet-cli mktx --id=$id --value=$value --address=$address ---passphrase=$passphrase
```

```shell--curl
id="multisig1"
passphrase="multisecret123"
rate=1000
value=5000000
address="RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"

curl $walleturl/$id/create \
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
let id, passphrase, rate, value, address;
id="multisig1"
passphrase="multisecret123"
rate=1000
value=5000000
address="RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"

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

const options = {
  passphrase: passphrase,
  rate: rate,
  outputs: [{ value: value, address: address }]
};

(async () => {
  const result = await wallet.createTX(options);
  console.log(result);
})();
```

> Sample response:

```json
{
  "hash": "2c550d94e3de0de48d82199442aec45bbc75e253eaf67c953db4265691cc60ec",
  "witnessHash": "2c550d94e3de0de48d82199442aec45bbc75e253eaf67c953db4265691cc60ec",
  "fee": 6800,
  "rate": 25855,
  "mtime": 1527182869,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "31ebd87739a0e58098d127d76ee80ebfd8b5d923a8fcaf2d0908c16f123043be",
        "index": 0
      },
      "script": "0000473044022064ac064f8b0e224413cf7e7c3aa2758013dd0cff6b421a273fb6f870894b200f022064da80d0ea08110b1c18817a66b1e576f945f73256407175b0fcc9936644b3320147522102fac079263a41252f1602406313cc26caf76029135fda4f2423b997b6c89ce78f210304ea9eddb0c0fe241c89ceb2ee8b15870ede2757dfbd42fee60ba9f63d91290652ae",
      "witness": "00",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": -1,
        "value": 10000000,
        "script": "a9143ddf94d382bc20b256748e0ab20b040efc07344c87",
        "address": "GPV5UXtx3Zbb7CGL7k31kykXkbNUxM6hXW",
        "coinbase": false
      }
    }
  ],
  "outputs": [
    {
      "value": 4993200,
      "script": "a9144ff1a73bf41d28a8a60e057a5c4bb0a38c0bbaf887",
      "address": "GR8dHeLMn8CPVAztoEjkAxHS6eWSgf6Hcr"
    },
    {
      "value": 5000000,
      "script": "76a9149e6a64a9dfdf49bfa72e1402663ac40aa5e30a7188ac",
      "address": "RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"
    }
  ],
  "locktime": 0,
  "hex": "0100000001be4330126fc108092daffca823d9b5d8bf0ee86ed727d19880e5a03977d8eb3100000000920000473044022064ac064f8b0e224413cf7e7c3aa2758013dd0cff6b421a273fb6f870894b200f022064da80d0ea08110b1c18817a66b1e576f945f73256407175b0fcc9936644b3320147522102fac079263a41252f1602406313cc26caf76029135fda4f2423b997b6c89ce78f210304ea9eddb0c0fe241c89ceb2ee8b15870ede2757dfbd42fee60ba9f63d91290652aeffffffff02b0304c000000000017a9144ff1a73bf41d28a8a60e057a5c4bb0a38c0bbaf887404b4c00000000001976a9149e6a64a9dfdf49bfa72e1402663ac40aa5e30a7188ac00000000"
}
```

Create and template a transaction (useful for multisig).
Does not broadcast or add to wallet.

<aside class="warning">Be careful how you enter values and fee rates!<br>
<code>value</code> and <code>rate</code> are expressed in satoshis when using cURL or Javascript<br>
<code>value</code> and <code>rate</code> are expressed in WHOLE BITCOINS when using CLI<br>
Watch carefully how values are entered in the examples, all examples send the same amount when executed
</aside>

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
value <br> _int_ (or _float_) | Value to send in satoshis (or whole BTC, see warning above)
address <br> _string_ | destination address for transaction



## Sign Transaction
```javascript
let id, tx, passphrase;
```

```shell--vars
id="multisig2"
passphrase="multisecret456"
tx="0100000001be4330126fc108092daffca823d9b5d8bf0ee86ed727d19880e5a03977d8eb3100000000920000473044022064ac064f8b0e224413cf7e7c3aa2758013dd0cff6b421a273fb6f870894b200f022064da80d0ea08110b1c18817a66b1e576f945f73256407175b0fcc9936644b3320147522102fac079263a41252f1602406313cc26caf76029135fda4f2423b997b6c89ce78f210304ea9eddb0c0fe241c89ceb2ee8b15870ede2757dfbd42fee60ba9f63d91290652aeffffffff02b0304c000000000017a9144ff1a73bf41d28a8a60e057a5c4bb0a38c0bbaf887404b4c00000000001976a9149e6a64a9dfdf49bfa72e1402663ac40aa5e30a7188ac00000000"
```

```shell--cli
bwallet-cli sign --id=$id --passphrase=$passphrase --tx=$tx
```

```shell--curl
curl $walleturl/$id/sign \
  -X POST \
  --data '{"tx": "'$tx'", "passphrase":"'$passphrase'"}'
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

const options = { tx: tx, passphrase: passphrase };

(async () => {
  const result = await wallet.sign(options);
  console.log(result);
})();
```

> Sample Output

```json
{
  "hash": "a355e0fcfb727c8161f3b2e55e0cda40f4614ea38d4834f82460cfdc9941381a",
  "witnessHash": "a355e0fcfb727c8161f3b2e55e0cda40f4614ea38d4834f82460cfdc9941381a",
  "fee": 170,
  "rate": 507,
  "mtime": 1527183237,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "31ebd87739a0e58098d127d76ee80ebfd8b5d923a8fcaf2d0908c16f123043be",
        "index": 0
      },
      "script": "004730440220764ce5fa17f7d6fc8921a85ddd81e3378e88aae92a02ab8ff72646bb9d2ad3c102203075f1c8f97d48626ed22e86495c28c19386c1adb9160d84ab28fb5c7c65b103014830450221008bbc87270043e0c701cb4ba8bb7b0b8014f7bdac66fb8ae104bfe91e0469983f022003734c66e3c1f40293e90b2327fe509f68ada13c44b69bec364c01763a0699940147522102fac079263a41252f1602406313cc26caf76029135fda4f2423b997b6c89ce78f210304ea9eddb0c0fe241c89ceb2ee8b15870ede2757dfbd42fee60ba9f63d91290652ae",
      "witness": "00",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": -1,
        "value": 10000000,
        "script": "a9143ddf94d382bc20b256748e0ab20b040efc07344c87",
        "address": "GPV5UXtx3Zbb7CGL7k31kykXkbNUxM6hXW",
        "coinbase": false
      }
    }
  ],
  "outputs": [
    {
      "value": 4999830,
      "script": "a9144ff1a73bf41d28a8a60e057a5c4bb0a38c0bbaf887",
      "address": "GR8dHeLMn8CPVAztoEjkAxHS6eWSgf6Hcr"
    },
    {
      "value": 5000000,
      "script": "76a9149e6a64a9dfdf49bfa72e1402663ac40aa5e30a7188ac",
      "address": "RPipJ9yeeQxHn6YcBXd9WPy2V6cezzAuY8"
    }
  ],
  "locktime": 0,
  "hex": "0100000001be4330126fc108092daffca823d9b5d8bf0ee86ed727d19880e5a03977d8eb3100000000da004730440220764ce5fa17f7d6fc8921a85ddd81e3378e88aae92a02ab8ff72646bb9d2ad3c102203075f1c8f97d48626ed22e86495c28c19386c1adb9160d84ab28fb5c7c65b103014830450221008bbc87270043e0c701cb4ba8bb7b0b8014f7bdac66fb8ae104bfe91e0469983f022003734c66e3c1f40293e90b2327fe509f68ada13c44b69bec364c01763a0699940147522102fac079263a41252f1602406313cc26caf76029135fda4f2423b997b6c89ce78f210304ea9eddb0c0fe241c89ceb2ee8b15870ede2757dfbd42fee60ba9f63d91290652aeffffffff02964a4c000000000017a9144ff1a73bf41d28a8a60e057a5c4bb0a38c0bbaf887404b4c00000000001976a9149e6a64a9dfdf49bfa72e1402663ac40aa5e30a7188ac00000000"
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

```shell--cli
id="primary"
account="default"
age=259200 # 72 hours

bwallet-cli zap --id=$id --account=$account --age=$age
```

```shell--curl
id="primary"
account="default"
age=259200 # 72 hours

curl $walleturl/$id/zap \
  -X POST \
  --data '{
    "account": "'$account'",
    "age": '$age'
  }'
```

```javascript
let id, age, account;
id="primary"
account="default"
age=259200 // 72 hours

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
  const result = await wallet.zap(account, age);
  console.log(result);
})();
```

> Sample Response

```shell--cli
Zapped!
```

```shell--curl
{
  "success": true
}
```

```javascript
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
id='primary'
pass='secret123'
timeout=60
```

```shell--cli
bwallet-cli unlock --id=$id $pass $timeout
```

```shell--curl
curl $walleturl/$id/unlock \
  -X POST \
  --data '{"passphrase":"'$pass'", "timeout": '$timeout'}'
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
  const result = await wallet.unlock(pass, timeout);
  console.log(result);
})();
```
> Sample Response

```shell--cli
{"success": true}
```

```javascript
{"success": true}
```
```shell--curl
Unlocked.
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
id='primary'
```

```shell--cli
bwallet-cli lock --id=$id
```

```shell--curl
curl $walleturl/$id/lock \
  -X POST
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
  const result = await wallet.lock(id);
  console.log(result);
})();
```
> Sample Response

```shell--cli
{"success": true}
```

```javascript
{"success": true}
```
```shell--curl
Locked.
```

If unlock was called, zero the derived AES key and revert to normal behavior.

### HTTP Request

`POST /wallet/:id/lock`

## Import Public/Private Key

```javascript
let id, account, key;
```

```shell--vars
id='primary'
watchid='watchonly1'
account='default'
pubkey='0215a9110e2a9b293c332c28d69f88081aa2a949fde67e35a13fbe19410994ffd9'
privkey='EMdDCvF1ZjsCnimTnTQfjw6x8CQmVidtJxKBegCVzPw3g6yRoDkK'
```

```shell--cli
bwallet-cli --id=$id --account=$account import $privkey
bwallet-cli --id=$watchid --account=$account import $pubkey
```

```shell--curl
curl $walleturl/$id/import \
  -X POST \
  --data '{"account":"'$account'", "privateKey":"'$privkey'"}'

curl $walleturl/$watchid/import \
  -X POST \
  --data '{"account":"'$account'", "publicKey":"'$pubkey'"}'
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
const watchwallet = walletClient.wallet(watchid);

(async () => {
  const result = await watchwallet.importPublic(account, pubkey);
  console.log(result);
})();

(async () => {
  const result = await wallet.importPrivate(account, privkey);
  console.log(result);
})();
```
> Sample Responses

```json
Imported private key.

Imported public key.
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
id='watchonly1'
account='default'
address='RUkNXekA1QcDzNZhn2TqNavPUxmaosCzJC'
```

```shell--cli
bwallet-cli watch --id=$id --account=$account $address
```

```shell--curl
curl $walleturl/$id/import \
  -X POST \
  --data '{"account":"'$account'", "address":"'$address'"}'
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
  const result = await wallet.importAddress(account, address);
  console.log(result);
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
id="primary"
```

```shell--curl
curl $walleturl/$id/block
```

```shell--cli
bwallet-cli blocks --id=$id
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
  const result = await wallet.getBlocks();
  console.log(result);
})();
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
id="primary"
height=50
```

```shell--cli
bwallet-cli --id=$id block $height
```

```shell--curl
curl $walleturl/$id/block/$height
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
  const result = await wallet.getBlock(height);
  console.log(result);
})();
```

> Sample response:

```json
{
  "hash": "5a630279111118885f4489471ddf6f7a318b3510e5e17aa73412088d19b8ba78",
  "height": 50,
  "time": 1527181141,
  "hashes": [
    "4255c0784ae89cfe7ccf878be3a408d8c1f6c665d5df331e27962b4defe3beb8"
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
id="multisig3"
account="default"
key="rpubKBBGCWqgVn4RRVpJTDUvTJnFHYiQuoUNy7s6W57U36KJ3r5inJp7iVRJZHvkFjbgfaGVs9fkvcCQS5ZMmc7BYFCrkADgmGKDCsjYK1vGmoFw"
```

```shell--cli
bwallet-cli --id=$id --account=$account shared add $key
```

```shell--curl
curl $walleturl/$id/shared-key \
  -X PUT \
  --data '{"accountKey": "'$key'", "account": "'$account'"}'
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
  const result = await wallet.addSharedKey(account, key);
  console.log(result);
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
Note that since it must be a multisig, the wallet on creation should be set with <code>m</code> and <code>n</code> where <code>n</code> is greater than 1 (since the first key is always that wallet's own xpubkey). Creating new addresses from this account will not be possible until <code>n</code> number of xpubkeys are added to the account.
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
id="multisig3"
account="default"
key="rpubKBBGCWqgVn4RRVpJTDUvTJnFHYiQuoUNy7s6W57U36KJ3r5inJp7iVRJZHvkFjbgfaGVs9fkvcCQS5ZMmc7BYFCrkADgmGKDCsjYK1vGmoFw"
```

```shell--cli
bwallet-cli --id=$id --account=$account shared remove $key
```

```shell--curl
curl $walleturl/$id/shared-key \
  -X DELETE \
  --data '{"accountKey": "'$key'", "account": "'$account'"}'
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
  const result = await wallet.removeSharedKey(account, key);
  console.log(result);
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
`false` if key was already removed, but will still return `success: true` with status `200`.

<aside class="notice">
Remove Key is only available to a multisig wallet that is not yet "complete" -- as in,
<nobr><code>n-1</code></nobr> number of keys have not yet been added to the wallet's own original key.
Once a multisig wallet has the right number of keys to create m-of-n addresses, this function will return an error.
</aside>

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
id="primary"
address="RM4xYH2GrcHmiptfsDEF7Kqqbm2Humjm2E"
```

```shell--cli
bwallet-cli --id=$id key $address
```

```shell--curl
curl $walleturl/$id/key/$address
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
  const result = await wallet.getKey(address);
  console.log(result);
})();
```

> Sample Response

```json
{
  "name": "default",
  "account": 0,
  "branch": 0,
  "index": 2,
  "witness": false,
  "nested": false,
  "publicKey": "02548e0a23b90505f1b4017f52cf2beeaa399fce7ff2961e29570c6afdfa9bfc5b",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "RM4xYH2GrcHmiptfsDEF7Kqqbm2Humjm2E"
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
id='primary'
passphrase='secret123'
address='RM4xYH2GrcHmiptfsDEF7Kqqbm2Humjm2E'
```

```shell--cli
bwallet-cli --id=$id --passphrase=$passphrase dump $address
```

```shell--curl
curl $walleturl/$id/wif/$address?passphrase=$passphrase
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
  const result = await wallet.getWIF(address, passphrase);
  console.log(result);
})();
```

> Sample Response

```json
{
  "privateKey": "EPAcwFM5E6CS1sGCv3PDeJ68nXSfUZwViZ8HyrP9T8GcGSF14EsK"
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
id="primary"
account="default"
```

```shell--cli
bwallet-cli --id=$id --account=$account address
```

```shell--curl
curl $walleturl/$id/address -X POST --data '{"account":"'$account'"}'
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
  const result = await wallet.createAddress(account);
  console.log(result);
})();
```

> Sample response:

```json
{
  "name": "default",
  "account": 0,
  "branch": 0,
  "index": 5,
  "witness": false,
  "nested": false,
  "publicKey": "030429c7a7007b9da542c029ea72a21852c2e4dfcce339d626df022068f0149680",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "RUkNXekA1QcDzNZhn2TqNavPUxmaosCzJC"
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
id="primary"
account="default"
```

```shell--cli
bwallet-cli --id=$id --account=$account change
```

```shell--curl
curl $walleturl/$id/change -X POST --data '{"account":"'$account'"}'
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
  const result = await wallet.createChange(account);
  console.log(result);
})();
```

> Sample response:

```json
{
  "name": "default",
  "account": 0,
  "branch": 1,
  "index": 27,
  "witness": false,
  "nested": false,
  "publicKey": "02fb03c9c45cbc6436c7c009391bc1410f86da9f6548675e7521856d3b372dfb42",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "R9oeK9hgbBEYjmUffYyvPfh7eMw7q4v4XY"
}
[ec
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
id="witness1"
account='default'
```

```shell--cli
bwallet-cli --id=$id nested --account=$account
```

```shell--curl
curl $walleturl/$id/nested -X POST --data '{"account": "'$account'"}'
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
  const result = await wallet.createNested(account);
  console.log(result);
})();
```

> Sample response

```json
{
  "name": "default",
  "account": 0,
  "branch": 2,
  "index": 1,
  "witness": true,
  "nested": true,
  "publicKey": "02d10d018aad643382a77f6f6305bd209879ae450f9d3fdbcc406a666a20b40332",
  "script": null,
  "program": "001421457f563883db273f4cefd519882dfefcb6ba82",
  "type": "scripthash",
  "address": "GX9yN5m5dUcSqfmNgkfQ7XJAHdyvbTHLhU"
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
id='primary'
account='default'
```

```shell--cli
bwallet-cli --id=$id balance --account=$account
```

```shell--curl
curl $walleturl/$id/balance?account=$account
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
  const result = await wallet.getBalance(account);
  console.log(result);
})();
```

> Sample response:

```json
{
  "account": 0,
  "tx": 307,
  "coin": 287,
  "unconfirmed": 1122500000000,
  "confirmed": 1122500000000
}
```

Get wallet or account balance. If no account option is passed, the call defaults to wallet balance (with account index of <nobr>`-1`</nobr>). Balance values for `unconfimred` and `confirmed` are expressed in satoshis.

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
id="primary"
```

```shell--curl
curl $walleturl/$id/coin
```

```shell--cli
bwallet-cli --id=$id coins
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
  const result = await wallet.getCoins();
  console.log(result);
})();
```

> Sample Response

```json
[
  {
    "version": 1,
    "height": -1,
    "value": 4999998887,
    "script": "76a914a2133747754faf7fbacc31bf0f74808f8409c4b388ac",
    "address": "RQ4AZjpaoyXhEk3mjcWYR74YR8XhxoXGzV",
    "coinbase": false,
    "hash": "7c7de4c48744b09b69bd36ffdb354199407321e305c0a4bd366a6168e0ff7244",
    "index": 1
  },
  {
    "version": 1,
    "height": -1,
    "value": 4999998887,
    "script": "76a9149433dbda44a1f23396a1bd231443b0d29eb8cf2888ac",
    "address": "RNnpD7tGaTpqEuTfBaqrtAqDK1927FLkW2",
    "coinbase": false,
    "hash": "a97a9993389ae321b263dffb68ba1312ad0655da83aeca75b2372d5abc70544a",
    "index": 1
  },
  ...
]
```
List all wallet coins available.

### HTTP Request

`GET /wallet/:id/coin`

## Lock Coin/Outpoints

```javascript
let id, hash, index;
```

```shell--vars
id="primary"
hash="52ada542512ea95be425087ee4b891842d81eb6f9a4e0350f14d0285b5fd40c1"
index="0"
```

```shell--cli
# Not Supported in CLI
```

```shell--curl
curl $walleturl/$id/locked/$hash/$index -X PUT
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
  const result = await wallet.lockCoin(hash, index);
  console.log(result);
})();
```

> Sample response:

```json
{
  "success": true
}
```

Lock outpoints. Also see [lockunspent](#lockunspent) and [listlockunspent](#listlockunspent).

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
id="primary"
hash="52ada542512ea95be425087ee4b891842d81eb6f9a4e0350f14d0285b5fd40c1"
index="0"
```

```shell--cli
# Not Supported in CLI
```

```shell--curl
curl $walleturl/$id/locked/$hash/$index -X DELETE
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
  const result = await wallet.unlockCoin(hash, index);
  console.log(result);
})();
```

> Sample response:

```json
{
  "success": true
}
```

Unlock outpoints. Also see [lockunspent](#lockunspent) and [listlockunspent](#listlockunspent).

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
id="primary"
```

```shell--cli
# Not supported in CLI
```

```shell--curl
curl $walleturl/$id/locked
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
  const result = await wallet.getLocked();
  console.log(result);
})();
```

> Sample response:

```json
[
  {
    "hash": "52ada542512ea95be425087ee4b891842d81eb6f9a4e0350f14d0285b5fd40c1",
    "index": 0
  }
]
```

Get all locked outpoints. Also see [lockunspent](#lockunspent) and [listlockunspent](#listlockunspent).

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
id="primary"
hash="52ada542512ea95be425087ee4b891842d81eb6f9a4e0350f14d0285b5fd40c1"
index="0"
```

```shell--cli
# command is wallet agnostic, same as in vanilla coin command

bcoin-cli coin $hash $index
```

```shell--curl
curl $walleturl/$id/coin/$hash/$index
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
  const result = await wallet.getCoin(hash, index);
  console.log(result);
})();
```

> Sample response:

```json
{
  "version": 1,
  "height": 104,
  "value": 5000000000,
  "script": "76a91403a394378a680558ea205b604b182566381e116e88ac",
  "address": "R9cS4kuYVWHaDJmRGMpwx7zCNjw97Zm5LL",
  "coinbase": true,
  "hash": "52ada542512ea95be425087ee4b891842d81eb6f9a4e0350f14d0285b5fd40c1",
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
