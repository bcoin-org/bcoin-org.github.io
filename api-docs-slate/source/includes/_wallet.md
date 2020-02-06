# Wallet
## The Wallet Client

```shell--cli
npm i -g bclient
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
be in a network-specific directory.](https://github.com/bcoin-org/bcoin/blob/master/docs/configuration.md)

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


## Wallet Authentication
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
const {WalletClient, Network} = require('bcoin');
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

There are three levels of authentication for the bcoin wallet API server:

### 1. API Key

The API key is set either in `wallet.conf` or with the argument `--api-key=` at launch.
When set, the API key is required (using [HTTP Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication))
to access ALL endpoints, otherwise a `401 Unauthorized` error is returned.
See the section on [node API server authentication](#authentication) for tips on creating a strong key.

### 2. Wallet tokens

Every individual wallet has its own security token, which is a 32 byte hash calculated from the wallet master key:

`SHA256(m/44' Private Key | tokenDepth)`

A wallet is always created with a corresponding token. Even watch-only wallets will have a master private key,
used just for this purpose. The token is returned when a wallet is created, or from the [wallet info](#get-wallet-info)
API endpoint (which is restricted to `admin` access, see next subsection). When `wallet-auth` is set to `true`,
the token must be sent in the query string or JSON body for any requests regarding that wallet.
Requests with incorrect tokens are rejected with a `403 Forbidden` error.

### 3. Wallet admin token

The admin token is set by the user in `wallet.conf`, with the launch argument `bcoin --wallet-admin-token=`
or, if running `bwallet` as a separate server, just `bwallet --admin-token=`.
It is required to be a 32 byte hex string. Like the individual wallet tokens, it is only required when
`wallet-auth: true`, and must be included in the query string or JSON body. Requests sent with an
admin token automatically overrides individual wallet tokens, and can therefore access all wallets.

The admin token also enables access to extra API endpoints outlined in [Wallet Admin Commands](#wallet-admin-commands).

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
accountKey='tpubDDF921KoqbemP3yPiBMBzvkDY5pe4KpirJtXtSaTdRkZ3LyqorrHy1mv1XLNqrmTQQXztdTQiZxDtPxGZ9Lmiqtv8wJYJs5o52J54djLpqC'
```

```shell--curl
curl $walleturl/$id \
  -X PUT \
  --data '{"witness":'$witness', "passphrase":"'$passphrase'", "watchOnly": '$watchOnly', "accountKey":"'$accountKey'"}'
```

```shell--cli
# watch-only defaults to true if --account-key flag is set

bwallet-cli mkwallet $id --witness=$witness --passphrase=$passphrase --watch-only=$watchOnly --account-key=$accountKey
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
  "wid": 11,
  "id": "newWallet",
  "watchOnly": true,
  "accountDepth": 1,
  "token": "489d43e398dad34e69653e5edb5cb39b6d55be3364753c07d084d4b3d0292af7",
  "tokenDepth": 0,
  "master": {
    "encrypted": true,
    "until": 1571763677,
    "iv": "4e24f2a5908e20da0b8ba3e88dcda272",
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
    "xprivkey": "tprv8ZgxMBicQKsPfNKy1Wf9EV1cTmz1Cmm6MVrvYdgcR6Hf8sEDUAzhnnoiVbw5jejp4EZWXynQEJhB62oSfANpHRAJqfiZarh1gVMowcJZ2Mn"
  },
  "mnemonic": {
    "bits": 128,
    "language": "english",
    "entropy": "e35833c318d677945ec21efff032bb64",
    "phrase": "today screen valid coyote guess sketch kitchen duck zoo light put siege"
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
address="mo2L7KZgmH2QNs9QCBAFwQPqBJNSXNhQWV"

bwallet-cli send --id=$id --value=$value --address=$address ---passphrase=$passphrase
```

```shell--curl
id="primary"
passphrase="secret123"
rate=1000
value=20000
address="mo2L7KZgmH2QNs9QCBAFwQPqBJNSXNhQWV"

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
address="mo2L7KZgmH2QNs9QCBAFwQPqBJNSXNhQWV"

const {WalletClient, Network} = require('bcoin');
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
  "hash": "4d44a0285e4e5ae782fc9dee32d2a7b60ec63009a731d72e51374910582f517c",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1571764348,
  "date": "1970-01-01T00:00:00Z",
  "mdate": "2019-10-22T17:12:28Z",
  "size": 225,
  "virtualSize": 225,
  "fee": 4540,
  "rate": 20177,
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
      "value": 20000,
      "address": "mo2L7KZgmH2QNs9QCBAFwQPqBJNSXNhQWV",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/0"
      }
    },
    {
      "value": 2499975460,
      "address": "mhpSYq8bnM5XJVbpafdLNUtLZefr2d6xSq",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/1"
      }
    }
  ],
  "tx": "010000000195c60f9cdf95961f696a83bac71adcab286b4a269bb5bdae71ca95d634fab681000000006a473044022068d00d638a3b4d4d54c76167fff1bad023f34375d3bb05a7cb0c051ac63133ed0220182eba4cd68d27c43c071d6690a60c8b13f4c775fec145a736f6f58781fa2d5a01210336c99e45e00b73c863497a989fe6feb08439ca2d7cf98f55bc261ed70ed28a7bffffffff02204e0000000000001976a91452572750e3cf71b97a58dd084f34c3b7027ec75288ac24990295000000001976a914193ee8a7e5d7d5c299785dea90802bc1906a893788ac00000000"
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

### Post Parameters
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
id="multisig-watch"
rate=0.00001000
value=0.05000000
address="mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5j"
sign=false

bwallet-cli mktx --id=$id --rate=$rate --value=$value --address=$address ---passphrase=$passphrase --sign=$sign
```

```shell--curl
id="multisig1"
rate=1000
value=5000000
address="mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5"
sign=false

curl $walleturl/$id/create \
  -X POST \
  --data '{
    "rate":'$rate',
    "outputs":[
      {"address":"'$address'", "value":'$value'}
    ],
    "sign": '$false'
  }'
```

```javascript
let id, rate, value, address, sign;
id="multisig-watch"
rate=1000
value=5000000
address="mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5"
sign=false

const {WalletClient, Network} = require('bcoin');
const network = Network.get('regtest');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: 'api-key'
}

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);

const options = {
  rate: rate,
  outputs: [{ value: value, address: address }],
  sign: sign
};

(async () => {
  const result = await wallet.createTX(options);
  console.log(result);
})();
```

> Sample response:

```json
{
  "hash": "3f61cbbe01ca9eb7eb0fb8c37f15e92d2fee8c28ea54fef5b7bc89eee219074b",
  "witnessHash": "3f61cbbe01ca9eb7eb0fb8c37f15e92d2fee8c28ea54fef5b7bc89eee219074b",
  "fee": 3840,
  "rate": 30000,
  "mtime": 1571766790,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "4e6c7db14b22e39ca800b0eb83d698619849ac3245408cf03ae5dc752e2d884c",
        "index": 0
      },
      "script": "",
      "witness": "00",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 746,
        "value": 312500000,
        "script": "00201e669358ab0b70bbdf63ac7abc442ee1b1f6f0fe24b1d67b2e3527ffac664c39",
        "address": "bcrt1qrenfxk9tpdcthhmr43atc3pwuxcldu87yjcav7ewx5nlltrxfsustr8wj5",
        "coinbase": true
      }
    }
  ],
  "outputs": [
    {
      "value": 5000000,
      "script": "76a914061270cea3bdd77a5442657d177f4490642e7a2288ac",
      "address": "mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5j"
    },
    {
      "value": 307496160,
      "script": "0020485f95ef73a1f444cbbfdb7ff1f43c7e34c069d25a823026d3513cfa64cfd677",
      "address": "bcrt1qfp0etmmn586yfjalmdllrapu0c6vq6wjt2prqfkn2y705ex06ems39f93c"
    }
  ],
  "locktime": 0,
  "hex": "01000000014c882d2e75dce53af08c404532ac49986198d683ebb000a89ce3224bb17d6c4e0000000000ffffffff02404b4c00000000001976a914061270cea3bdd77a5442657d177f4490642e7a2288ace004541200000000220020485f95ef73a1f444cbbfdb7ff1f43c7e34c069d25a823026d3513cfa64cfd67700000000"
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
sign <br> _bool_ | whether to sign the TX (must be false for watch-only wallets)



## Sign Transaction
```javascript
let id, tx, passphrase;
```

```shell--vars
id="multisig1"
passphrase="multisecret123"
tx="01000000014c882d2e75dce53af08c404532ac49986198d683ebb000a89ce3224bb17d6c4e0000000000ffffffff02404b4c00000000001976a914061270cea3bdd77a5442657d177f4490642e7a2288ace004541200000000220020485f95ef73a1f444cbbfdb7ff1f43c7e34c069d25a823026d3513cfa64cfd67700000000"
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
const {WalletClient, Network} = require('bcoin');
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
  "hash": "3f61cbbe01ca9eb7eb0fb8c37f15e92d2fee8c28ea54fef5b7bc89eee219074b",
  "witnessHash": "68e9d7a28a571746eb7561ebc107479da26eb1cb2246ad5f05769149f6ec84db",
  "fee": 3840,
  "rate": 21942,
  "mtime": 1571767276,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "4e6c7db14b22e39ca800b0eb83d698619849ac3245408cf03ae5dc752e2d884c",
        "index": 0
      },
      "script": "",
      "witness": "050000483045022100a8ba55fb5bdf6a69fc820d44c4430d55ae0356f7dd5cdcf5bb27e8cb24535fb802204a6a23dedc1acff4725e99b51bce9f2692aa08d6063842be51d5728e8f95f76f0100695221027b88633d65cb48667012bb64039afda0b50c51abb2fe11aca975b324b8f0f44c2102f9ae8660d9dc5f3d62a5c347e8cd431ecc9404c17ecbb57ab89aa54b6df68a422103001a9a61d4989e229cfa5bb9acf0fb03fa5f3f1c9785fc1de2d76a8f363c457953ae",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 746,
        "value": 312500000,
        "script": "00201e669358ab0b70bbdf63ac7abc442ee1b1f6f0fe24b1d67b2e3527ffac664c39",
        "address": "bcrt1qrenfxk9tpdcthhmr43atc3pwuxcldu87yjcav7ewx5nlltrxfsustr8wj5",
        "coinbase": true
      }
    }
  ],
  "outputs": [
    {
      "value": 5000000,
      "script": "76a914061270cea3bdd77a5442657d177f4490642e7a2288ac",
      "address": "mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5j"
    },
    {
      "value": 307496160,
      "script": "0020485f95ef73a1f444cbbfdb7ff1f43c7e34c069d25a823026d3513cfa64cfd677",
      "address": "bcrt1qfp0etmmn586yfjalmdllrapu0c6vq6wjt2prqfkn2y705ex06ems39f93c"
    }
  ],
  "locktime": 0,
  "hex": "010000000001014c882d2e75dce53af08c404532ac49986198d683ebb000a89ce3224bb17d6c4e0000000000ffffffff02404b4c00000000001976a914061270cea3bdd77a5442657d177f4490642e7a2288ace004541200000000220020485f95ef73a1f444cbbfdb7ff1f43c7e34c069d25a823026d3513cfa64cfd677050000483045022100a8ba55fb5bdf6a69fc820d44c4430d55ae0356f7dd5cdcf5bb27e8cb24535fb802204a6a23dedc1acff4725e99b51bce9f2692aa08d6063842be51d5728e8f95f76f0100695221027b88633d65cb48667012bb64039afda0b50c51abb2fe11aca975b324b8f0f44c2102f9ae8660d9dc5f3d62a5c347e8cd431ecc9404c17ecbb57ab89aa54b6df68a422103001a9a61d4989e229cfa5bb9acf0fb03fa5f3f1c9785fc1de2d76a8f363c457953ae00000000"
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
Parameters | Description
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
pubkey='03b28be4fd749be06233452542e9d602f97a9b9c292aed4e4669c3fcc499e366de'
privkey='cNRiqwzRfcUfokNV8nSnDKb3NsKPhfRV2z5kBN11GKFb3GXkk1Hj'
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
const {WalletClient, Network} = require('bcoin');
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
address='msKYwEVXcKBxatPMfFLdVwYug6bz4YS87J'
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

Parameters | Description
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
key="tpubDDkzvYzn2iJLqucWgnULe1x3DR5PCaZvWzpg13ZA395sFmbvKNG3XrPp3KpnbFrdE3R3c93w5ZVfU2XWBzde5LLCBR1YRy8XwMibN7sG39o"
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
key="tpubDDkzvYzn2iJLqucWgnULe1x3DR5PCaZvWzpg13ZA395sFmbvKNG3XrPp3KpnbFrdE3R3c93w5ZVfU2XWBzde5LLCBR1YRy8XwMibN7sG39o"
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
address="msKYwEVXcKBxatPMfFLdVwYug6bz4YS87J"
```

```shell--cli
bwallet-cli --id=$id key $address
```

```shell--curl
curl $walleturl/$id/key/$address
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
  "publicKey": "03b28be4fd749be06233452542e9d602f97a9b9c292aed4e4669c3fcc499e366de",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "msKYwEVXcKBxatPMfFLdVwYug6bz4YS87J"
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
address='msKYwEVXcKBxatPMfFLdVwYug6bz4YS87J'
```

```shell--cli
bwallet-cli --id=$id --passphrase=$passphrase dump $address
```

```shell--curl
curl $walleturl/$id/wif/$address?passphrase=$passphrase
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
  const result = await wallet.getWIF(address, passphrase);
  console.log(result);
})();
```

> Sample Response

```json
{
  "privateKey": "cNRiqwzRfcUfokNV8nSnDKb3NsKPhfRV2z5kBN11GKFb3GXkk1Hj"
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
  "index": 3,
  "witness": false,
  "nested": false,
  "publicKey": "03af169e5a186bbd7b380cb4553c72af243e18f243785b1597f192bbedd4a94fc3",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "n2eoT9D8txT5ZymDvCFPA8PHs2CmTV6oJT"
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
  "index": 3,
  "witness": false,
  "nested": false,
  "publicKey": "03853852949194b426608b55074c54bbb78791a80c1eeece1e83343fb8babe6129",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "mppKe3yeSqnwX6pSVFqCT1AVGYPbnncKGh"
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
  "publicKey": "02d4ac18c8422e1ed65b007bfaef9f6b5b5c2e7070d56806f2928f24e3c92ba04d",
  "script": null,
  "program": "00142248d004cd1afca5fec1d8a92e3ef8de026b395d",
  "type": "scripthash",
  "address": "2NFQrQQSTWWCG3A9du6UNbDeDw1K3BQqQdu"
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
  const result = await wallet.getCoins();
  console.log(result);
})();
```

> Sample Response

```json
[
  {
    "version": 1,
    "height": 533,
    "value": 54145,
    "script": "0014b36ce46975f794a457ace76acf60e9e729afa9f6",
    "address": "bcrt1qkdkwg6t47722g4avua4v7c8fuu56l20khg99xp",
    "coinbase": false,
    "hash": "4d970cefa68cc09a4d591b106d551f2ab7ec5588fad34135e8bf0549acf1071f",
    "index": 1
  },
  {
    "version": 1,
    "height": 533,
    "value": 34296708683,
    "script": "001478c6269acab13571f03ec97e6ef81c06a87d8b91",
    "address": "bcrt1q0rrzdxk2ky6hrup7e9lxa7quq658mzu3yatkz4",
    "coinbase": false,
    "hash": "af4fc1e2490a01f028e837a9a4cc2deef7760ca7c7373e53e2bf0f4f71a7b808",
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
hash="d07a4211a3633bedd737b850378872191c27fc6126dc8131c3b45f62611a7f36"
index="1"
```

```shell--cli
# command is wallet agnostic, same as in vanilla coin command

bcoin-cli coin $hash $index
```

```shell--curl
curl $walleturl/$id/coin/$hash/$index
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
  const result = await wallet.getCoin(hash, index);
  console.log(result);
})();
```

> Sample response:

```json
{
  "version": 1,
  "height": 533,
  "value": 34296788338,
  "script": "001442079abdd9a01b9ccc5c6822413c06ce4e0c53d0",
  "address": "bcrt1qggre40we5qdeenzudq3yz0qxee8qc57s2fqygy",
  "coinbase": false,
  "hash": "d07a4211a3633bedd737b850378872191c27fc6126dc8131c3b45f62611a7f36",
  "index": 1
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
