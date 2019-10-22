# RPC Calls - Wallet

```shell--curl
# examples in these docs will use a DIFFERENT environment variable
# than the built-in bcoin wallet API calls above:
walletrpcurl=http://x:api-key@127.0.0.1:48334/

curl $walletrpcurl \
  -X POST \
  --data '{ "method": "<method>", "params": [...] "id": "some-id" }'
```

```shell--cli
bwallet-cli rpc <method> <params>
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

(async () => {
  const result = await walletClient.execute('<method>', [ <params> ]);
  console.log(result);
})();
```
Like the [bcoin node RPC calls](#rpc-calls-node), the wallet RPC calls mimic Bitcoin Core's RPC.

Refer to the sections on [the wallet client](#the-wallet-client) and [the wallet db object](#the-walletdb-and-object)
for host, port, and authentication information.

RPC Calls are accepted at:
`POST /`

### wallet RPC POST Parameters
Parameter | Description
--------- | -----------
method  | Name of the RPC call
params  | Parameters accepted by method
id      | `int` Will be returned with the response (cURL only)

<aside class='warning'>
A note about the <code>label</code> parameter:<br>
These RPC calls were designed to be backwards-compatible with Bitcoin Core, which has the option
to label addresses. bcoin ignores this parameter because it does not label addresses.
To match the order and sequence of RPC parameters with Bitcoin Core, a <code>label</code>
parameter MUST be passed in certain RPC calls, even though it will be ignored by bcoin.
The following calls are affected:<br>
<code><a href="#importprivkey">importprivkey</a></code><br>
<code><a href="#importaddress">importaddress</a></code><br>
<code><a href="#importpubkey">importpubkey</a></code><br>
<code><a href="#importprunedfunds">importprunedfunds</a></code><br>
<code><a href="#sendmany">sendmany</a></code><br>
<code><a href="#sendtoaddress">sendtoaddress</a></code>
</aside>



## selectwallet

```javascript
let id;
```

```shell--vars
id='primary'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "selectwallet",
    "params": [ "'$id'" ]
  }'
```

```shell--cli
bwallet-cli rpc selectwallet $id
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

(async () => {
  const result = await walletClient.execute('selectwallet', [id]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
null
```

Switch target wallet for all future RPC calls.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | id | Required | id of selected wallet



## getwalletinfo

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "getwalletinfo" }'
```

```shell--cli
bwallet-cli rpc getwalletinfo
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

(async () => {
  const result = await walletClient.execute('getwalletinfo');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "result": {
    "walletid": "primary",
    "walletversion": 6,
    "balance": 50,
    "unconfirmed_balance": 50,
    "txcount": 1,
    "keypoololdest": 0,
    "keypoolsize": 0,
    "unlocked_until": 0,
    "paytxfee": 0
  },
  "error": null,
  "id": null
}
```

Get basic wallet details.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## fundrawtransaction

```javascript
let tx;
let options={"changeAddress": "mfi6TVtSYsNk4ADkXbFT9d6f95kmDMXgKp", "feeRate": 0.00001000};
```

```shell--vars
tx='0100000000024e61bc00000000001976a914fbdd46898a6d70a682cbd34420ccf0b6bb64493788acf67e4929010000001976a9141b002b6fc0f457bf8d092722510fce9f37f0423b88ac00000000'
```

```shell--curl
options='{"changeAddress": "mfi6TVtSYsNk4ADkXbFT9d6f95kmDMXgKp", "feeRate": 0.00001000}'

curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "fundrawtransaction",
    "params": [ "'$tx'", '"$options"']
  }'
```

```shell--cli
options='{"changeAddress": "mfi6TVtSYsNk4ADkXbFT9d6f95kmDMXgKp", "feeRate": 0.00001000}'

bwallet-cli rpc fundrawtransaction $tx "$options"
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

(async () => {
  const result = await walletClient.execute('fundrawtransaction', [tx, options]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

<!---
########
#  TODO: Currently this method does not work: https://github.com/bcoin-org/bcoin/issues/521
########
-->

```json

```

Add inputs to a transaction until it has enough in value to meet its out value.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | hexstring | Required | raw transaction
2 | options | Optional | Object containing options

### Options
Option | Description
---- | ----
feeRate | Sets fee rate for transaction in BTC/kb
changeAddress |Bitcoin address for change output of transaction



## resendwallettransactions

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "resendwallettransactions" }'
```

```shell--cli
bwallet-cli rpc resendwallettransactions
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

(async () => {
  const result = await walletClient.execute('resendwallettransactions');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  "147c2527e2bb7ddfa855cc4b933ab288e05aa7816c487db69db344971f1b0951",
  "c3c92d6686442755d70d2ea44401437d9fab51bc7a504b041d6d6b950ba45e85",
  "77f09f2f307aaa62c8d36a9b8efeac368381c84ebd195e8aabc8ba3023ade390",
  "2c0fa5740c494e8c86637c1fad645511d0379d3b6f18f84c1e8f7b6a040a399c",
  "ef38a6b68afe74f637c1e1bc605f7dc810ef50c6f475a0a978bac9546cac25d8",
  "1146d21bb5c46f1de745d9def68dafe97bbf917fe0f32cef31937731865f10e9"
]
```

Re-broadcasts all unconfirmed transactions to the network.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## abandontransaction

```javascript
let tx;
```

```shell--vars
tx='a0a65cd0508450e8acae76f35ae622e7b1e7980e95f50026b98b2c6e025dae6c'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "abandontransaction",
    "params": [ "'$tx'" ]
  }'
```

```shell--cli
bwallet-cli rpc abandontransaction $tx
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

(async () => {
  const result = await walletClient.execute('abandontransaction', [tx]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
null
```

Remove transaction from the database. This allows "stuck" coins to be respent.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txid | Required | Transaction ID to remove



## addmultisigaddress

Not implemented -- Impossible to implement in bcoin (no address book).



## addwitnessaddress

Not implemented -- Deprecated in Bitcoin Core 0.16.0



## backupwallet

```javascript
let path;
```

```shell--vars
path='/home/user/WalletBackup'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "backupwallet",
    "params": [ "'$path'" ]
  }'
```

```shell--cli
bwallet-cli rpc backupwallet $path
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

(async () => {
  const result = await walletClient.execute('backupwallet', [path]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
null
```

Back up wallet database and files to directory created at specified path.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | path | Required | Path and name of destination directory for backup



## dumpprivkey

```javascript
let address;
```

```shell--vars
address='msKYwEVXcKBxatPMfFLdVwYug6bz4YS87J'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "dumpprivkey",
    "params": [ "'$address'" ]
  }'
```

```shell--cli
bwallet-cli rpc dumpprivkey $address
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

(async () => {
  const result = await walletClient.execute('dumpprivkey', [address]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
cNRiqwzRfcUfokNV8nSnDKb3NsKPhfRV2z5kBN11GKFb3GXkk1Hj
```

Get the private key (WIF format) corresponding to specified address.
Also see [importprivkey](#importprivkey)

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Reveal the private key for this Bitcoin address 



## dumpwallet

```javascript
let path;
```

```shell--vars
path='/home/user-1/secretfiles/dump1.txt'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "dumpwallet",
    "params": [ "'$path'" ]
  }'
```

```shell--cli
bwallet-cli rpc dumpwallet $path
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

(async () => {
  const result = await walletClient.execute('dumpwallet', [path]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
null
```

> The contents of the wallet dump file are formatted like this:

```
# Wallet Dump created by Bcoin 2.0.0-dev
# * Created on 2019-10-22T18:29:15Z
# * Best block at time of backup was 845 (72365e9f4b4ed638bb1600116a67e3fa59b6ad6be2a449b675db607a984da4f8).
# * File: /home/user-1/secretfiles/dump1.txt

cNUUoZYmUGoJyodrNaohzfu6LmKy7pBk6yqubJcTeL5WPWw97DQ1 2019-10-22T18:29:15Z label= addr=mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5j
cNH7YBw6haTB3yWkAndoPhwXRLNibXjWAYpqRQdvqPKLeW7JAj6h 2019-10-22T18:29:15Z change=1 addr=mgj4oGTbvCHxvx4EESYJKPkXWamxh2R6ef
cNmBeL4kpjLtNZcvjSezftq4ks6ajzZRi1z2AGpuBGy6XjxzytiQ 2019-10-22T18:29:15Z label= addr=mhX1xHbKGzw3r8FoN5bUkmRixHPEDNywxh
cUEfRrvPpKCy87QReCmPmd74Hz68kgZEHAErkuvEDFqwJKcCLsMn 2019-10-22T18:29:15Z label= addr=mhcx3M1AitoiwDQS3sz42CQLpVCEVkJLfq
cP4N8mxe81DhZfrgTz2GoV3croXD2o6Hern4DTB6Gr5jUwoLkT8h 2019-10-22T18:29:15Z change=1 addr=mhpSYq8bnM5XJVbpafdLNUtLZefr2d6xSq
...

# End of dump
```

Creates a new human-readable file at specified path with all wallet private keys in 
Wallet Import Format (base58).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | path | Required | Path and name of destination file for dump



## encryptwallet

```javascript
let passphrase;
```

```shell--vars
passphrase='bikeshed'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "encryptwallet",
    "params": [ "'$passphrase'" ]
  }'
```

```shell--cli
bwallet-cli rpc encryptwallet $passphrase
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

(async () => {
  const result = await walletClient.execute('encryptwallet', [passphrase]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
wallet encrypted; we do not need to stop!
```

Encrypts wallet with provided passphrase.
This action can only be done once on an unencrypted wallet.
See [walletpassphrasechange](#walletpassphrasechange) or [change passphrase](#change-passphrase)
if wallet has already been encrypted.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | passphrase | Required | Strong passphrase with which to encrypt wallet



## getaccountaddress

```javascript
let account;
```

```shell--vars
account='default'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "getaccountaddress",
    "params": [ "'$account'" ]
  }'
```

```shell--cli
bwallet-cli rpc getaccountaddress $account
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

(async () => {
  const result = await walletClient.execute('getaccountaddress', [account]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
bcrt1qp3kym2sv7k23ndpqrv4hhcpzcm392l97hq932m
```

Get the current receiving address for specified account.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | account | Required | Account to retrieve address from



## getaccount

```javascript
let address;
```

```shell--vars
address='bcrt1qp3kym2sv7k23ndpqrv4hhcpzcm392l97hq932m'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "getaccount",
    "params": [ "'$address'" ]
  }'
```

```shell--cli
bwallet-cli rpc getaccount $address
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

(async () => {
  const result = await walletClient.execute('getaccount', [address]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
default
```

Get the account associated with a specified address.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Address to search for



## getaddressesbyaccount

```javascript
let account;
```

```shell--vars
account='default'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "getaddressesbyaccount",
    "params": [ "'$account'" ]
  }'
```

```shell--cli
bwallet-cli rpc getaddressesbyaccount $account
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

(async () => {
  const result = await walletClient.execute('getaddressesbyaccount', [account]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  "mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5j",
  "mgj4oGTbvCHxvx4EESYJKPkXWamxh2R6ef",
  "mhX1xHbKGzw3r8FoN5bUkmRixHPEDNywxh",
  "mhcx3M1AitoiwDQS3sz42CQLpVCEVkJLfq",
  "mhpSYq8bnM5XJVbpafdLNUtLZefr2d6xSq",
  ...
  "mjQqy8E7WJLaybxHcpiaWQMppjizi6nG3Y"
]
```

Get all addresses for a specified account.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | account | Required | Account name



## getbalance

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "getbalance" }'
```

```shell--cli
bwallet-cli rpc getbalance 
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

(async () => {
  const result = await walletClient.execute('getbalance');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
50.01205819
```

Get total balance for entire wallet or a single, specified account.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | account | Optional | Account name



## getnewaddress

```javascript
let account;
```

```shell--vars
account='default'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "getnewaddress",
    "params": [ "'$account'" ]
  }'
```

```shell--cli
bwallet-cli rpc getnewaddress $account
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

(async () => {
  const result = await walletClient.execute('getnewaddress', [account]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
msSaQkCXyrEefbSH9TCSWNjnacTwGGc55d
```

Get the next receiving address from specified account, or `default` account.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | account | Optional | Account name



## getrawchangeaddress

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "getrawchangeaddress" }'
```

```shell--cli
bwallet-cli rpc getrawchangeaddress
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

(async () => {
  const result = await walletClient.execute('getrawchangeaddress');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
moKaYJdRT19YUWSsfhnTQpo68wkVvzkk8y
```

Get the next change address from specified account.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getreceivedbyaccount

```javascript
let account, minconf;
```

```shell--vars
account='default'
minconf=6
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "getreceivedbyaccount",
    "params": [ "'$account'", '$minconf' ]
  }'
```

```shell--cli
bwallet-cli rpc getreceivedbyaccount $account $minconf
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

(async () => {
  const result = await walletClient.execute('getreceivedbyaccount', [account, minconf]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
50.00001234
```

Get total amount received by specified account. 
Optionally only count transactions with `minconf` number of confirmations.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | account | Required | Account name
2 | minconf | Optional | Only include transactions with this many confirmations




## getreceivedbyaddress

```javascript
let address, minconf;
```

```shell--vars
address='bcrt1quvydwldtduzjpdz8nm79d30g49nt6u5nurw0dt'
minconf=6
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "getreceivedbyaddress",
    "params": [ "'$address'", '$minconf' ]
  }'
```

```shell--cli
bwallet-cli rpc getreceivedbyaddress $address $minconf
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

(async () => {
  const result = await walletClient.execute('getreceivedbyaddress', [address, minconf]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
50.00001234
```

Get total amount received by specified address. 
Optionally only count transactions with `minconf` number of confirmations.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Address to request balance of
2 | minconf | Optional | Only include transactions with this many confirmations



## gettransaction

```javascript
let address, minconf;
```

```shell--vars
txid='36cbb7ad0cc98ca86640a04c485f164dd741c20339af34516d359ecba2892c21'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "gettransaction",
    "params": [ "'$txid'" ]
  }'
```

```shell--cli
bwallet-cli rpc gettransaction $txid
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

(async () => {
  const result = await walletClient.execute('gettransaction', [txid]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "amount": 0.00072058,
  "blockhash": "1134065cc665e4f6df36202307ea1c9ad31287c45a7b9a5196e446885a76fc1c",
  "blocktime": 1571760038,
  "txid": "bc8336f7bb88e9613d5d1e81bef73837d8ec1c2bd47b9e19c3c4bf1eeb7e03b8",
  "walletconflicts": [],
  "time": 1571759979,
  "timereceived": 1571759979,
  "bip125-replaceable": "no",
  "details": [
    {
      "account": "default",
      "address": "bcrt1qvjewtg83j8w7halz0h2axlwcn6c2ver4u75avy",
      "category": "receive",
      "amount": 0.00072058,
      "label": "default",
      "vout": 1
    }
  ],
  "hex": "010000000001013384747e0e0d5f7a8dfff4220c5bc25479a4abf674abe9ac5e5b77da7b2973050400000000ffffffff038f8f0000000000001976a9149a006584ab0383ef07ad289395118ed9fba0e45688ac7a1901000000000016001464b2e5a0f191ddebf7e27dd5d37dd89eb0a66475d97249fc0700000016001449f1b89f0b09bbf77f33035ed3d4c30bd90eade90248304502210098989192ba64b6d1008e6137bbffffcfc7c8b7d4d05fb4a03b6906f9ce1e6ed302204bf8c7915ed4b35b6120901fc7459b2dcfe62567f7d6649d451a2136ba15f6700121029bf6c7b020b6e106b8492c6a3d396a265566c6294f553d10557a274d572a0e9e00000000"
}
```

Get details about a transaction in the wallet.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txid | Required | ID of transaction to fetch
2 | watchonly | Optional | (bool) Whether to include watch-only addresses in balance details



## getunconfirmedbalance

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "getunconfirmedbalance" }'
```

```shell--cli
bwallet-cli rpc getunconfirmedbalance
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

(async () => {
  const result = await walletClient.execute('getunconfirmedbalance');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
50
```

Get the unconfirmed balance from the wallet.
<aside class="notice">
In bcoin balances, <code>confirmed</code> refers to the total balance of coins
confirmed in the blockchain. <code>unconfirmed</code> refers to that total
IN ADDITION to any transactions still unconfirmed in the mempool.
Another way to think about it is your <code>unconfirmed</code> balance is the
FUTURE total value of your wallet after everything is confirmed.
</aside>

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## importprivkey

```javascript
let key, label, rescan;
```

```shell--vars
key='cNH7YBw6haTB3yWkAndoPhwXRLNibXjWAYpqRQdvqPKLeW7JAj6h'
label='this_is_ignored'
rescan=false
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "importprivkey",
    "params": [ "'$key'", "'$label'", '$rescan' ]
  }'
```

```shell--cli
bwallet-cli rpc importprivkey $key $label $rescan
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

(async () => {
  const result = await walletClient.execute('importprivkey', [key, label, rescan]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Import a private key into wallet. Also see [dumpprivkey](#dumpprivkey).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | key | Required | Private key to import (WIF format)
2 | label | Optional | [Ignored but required if additional parameters are passed](#rpc-calls-wallet)
3 | rescan | Optional | (bool) Whether to rescan wallet after importing



## importwallet

```javascript
let file, rescan;
```

```shell--vars
file='/home/user/WalletDump'
rescan=false
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "importwallet",
    "params": [ "'$file'", '$rescan' ]
  }'
```

```shell--cli
bwallet-cli rpc importwallet $file $rescan
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

(async () => {
  const result = await walletClient.execute('importwallet', [file, rescan]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Import all keys from a  wallet backup file. Also see [dumpwallet](#dumpwallet).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | file | Required | Path to wallet file
2 | rescan | Optional | (bool) Whether to rescan wallet after importing



## importaddress

```javascript
let address;
```

```shell--vars
address='mg54SV2ZubNQ5urTbd42mUsQ54byPvSg5j'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "importaddress",
    "params": [ "'$address'" ]
  }'
```

```shell--cli
bwallet-cli rpc importaddress $address

# P2SH example, imports script as address 2N57YNxkxUcUR9tXHsdEsvybTaAdsdc4fx
bwallet-cli rpc importaddress 76a9145e50fb5b7475ebe2f7276ed3f29662e5321d1d7288ac "this_is_ignored" true true
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

(async () => {
  const result = await walletClient.execute('importaddress', [address]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Import address to a watch-only wallet.
May also import a Bitcoin script (in hex) as pay-to-script-hash (P2SH) address.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Address to watch in wallet
2 | label | Optional | [Ignored but required if additional parameters are passed](#rpc-calls-wallet)
3 | rescan | Optional | (bool) Whether to rescan wallet after importing
4 | p2sh | Optional | (bool) Whether to generate P2SH address from given script



## importprunedfunds

```javascript
let rawtx, txoutproof;
```

```shell--vars
rawtx='01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1e510e6d696e65642062792062636f696e048e0e9256080000000000000000ffffffff0100f2052a010000001976a9145e50fb5b7475ebe2f7276ed3f29662e5321d1d7288ac00000000'
txoutproof='0000002006226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f212c89a2cb9e356d5134af3903c241d74d165f484ca04066a88cc90cadb7cb36e749355bffff7f20040000000100000001212c89a2cb9e356d5134af3903c241d74d165f484ca04066a88cc90cadb7cb360101'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "importprunedfunds",
    "params": [ "'$rawtx'", "'$txoutproof'" ]
  }'
```

```shell--cli
bwallet-cli rpc importprunedfunds $rawtx $txoutproof
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

(async () => {
  const result = await walletClient.execute('importprunedfunds', [rawtx, txoutproof]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Imports funds (without rescan) into pruned wallets.
Corresponding address or script must previously be included in wallet.
Does NOT check if imported coins are already spent, rescan may be required after
the point in time in which the specified transaciton was included in the blockchain.
See [gettxoutproof](#gettxoutproof) and [removeprunedfunds](#removeprunedfunds).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | rawtx | Required | Raw transaction in hex that funds an address already in the wallet
2 | txoutproof | Required | Hex output from [gettxoutproof](#gettxoutproof) containing the tx



## importpubkey

```javascript
let pubkey;
```

```shell--vars
pubkey='02548e0a23b90505f1b4017f52cf2beeaa399fce7ff2961e29570c6afdfa9bfc5b'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "importpubkey",
    "params": [ "'$pubkey'" ]
  }'
```

```shell--cli
bwallet-cli rpc importpubkey $pubkey
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

(async () => {
  const result = await walletClient.execute('importpubkey', [pubkey]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Import public key to a watch-only wallet.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | pubkey | Required | Hex-encoded public key
2 | label | Optional | [Ignored but required if additional parameters are passed](#rpc-calls-wallet)
3 | rescan | Optional | (bool) Whether to rescan wallet after importing



## keypoolrefill

```javascript
let newsize;
```

```shell--vars
newsize=100
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "keypoolrefill",
    "params": [ '$newsize' ]
  }'
```

```shell--cli
bwallet-cli rpc keypoolrefill $newsize
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

(async () => {
  const result = await walletClient.execute('keypoolrefill', [newsize]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
null
```

<aside class="alert">
This method is preserved for backwards compatibility with Bitcoin Core,
but it has no effect on bcoin node or wallet.
</aside>

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | newsize | Required | The new keypool size



## listaccounts

```javascript
let minconf, watchonly;
```

```shell--vars
minconf=6
watchonly=false
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "listaccounts",
    "params": [ '$minconf', '$watchonly' ]
  }'
```

```shell--cli
bwallet-cli rpc listaccounts $minconf $watchonly
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

(async () => {
  const result = await walletClient.execute('listaccounts', [minconf, watchonly]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "default": 46.87650028,
  "savings": 9.37345432
}
```

Get list of account names and balances.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | minconf | Optional | Minimum confirmations for transaction to be included in balance
2 | watchonly | Optional | (bool) Include watch-only addresses



## listaddressgroupings

Not implemented.



## lockunspent

```javascript
let unlock, outputs;
outputs=[{ "txid": "3962a06342fc62a733700d74c075a5d24c4f44f7108f6d9a318b66e92e3bdc72", "vout": 1 }];
```

```shell--vars
unlock=false
```

```shell--curl
outputs='[{ "txid": "3962a06342fc62a733700d74c075a5d24c4f44f7108f6d9a318b66e92e3bdc72", "vout": 1 }]'

curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "lockunspent",
    "params": [ '$unlock', '"$outputs"' ]
  }'
```

```shell--cli
outputs='[{ "txid": "3962a06342fc62a733700d74c075a5d24c4f44f7108f6d9a318b66e92e3bdc72", "vout": 1 }]'

bwallet-cli rpc lockunspent $unlock "$outputs"

# unlock all coins
bwallet-cli rpc lockunspent true
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

(async () => {
  const result = await walletClient.execute('lockunspent', [unlock, outputs]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
true
```

Lock or unlock specified transaction outputs. If no outputs are specified,
ALL coins will be unlocked (`unlock` only).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | unlock | Required | (bool) `true` = unlock coins, `false` = lock coins
2 | outputs | Optional | Array of outputs to lock or unlock



## listlockunspent

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "listlockunspent" }'
```

```shell--cli
bwallet-cli rpc listlockunspent
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

(async () => {
  const result = await walletClient.execute('listlockunspent');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "txid": "3962a06342fc62a733700d74c075a5d24c4f44f7108f6d9a318b66e92e3bdc72",
    "vout": 1
  }
]
```

Get list of currently locked (unspendable) outputs.
See [lockunspent](#lockunspent) and [lock-coin-outpoints](#lock-coin-outpoints).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## listreceivedbyaccount

```javascript
let minconf, includeEmpty, watchOnly;
```

```shell--vars
minconf=1
includeEmpty=true
watchOnly=true
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "listreceivedbyaccount",
    "params": [ '$minconf', '$includeEmpty', '$watchOnly' ]
  }'
```

```shell--cli
bwallet-cli rpc listreceivedbyaccount $minconf $includeEmpty $watchOnly
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

(async () => {
  const result = await walletClient.execute('listreceivedbyaccount', [minconf, includeEmpty, watchOnly]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "involvesWatchonly": false,
    "account": "hot",
    "amount": 6.2500454,
    "confirmations": 0,
    "label": ""
  },
  {
    "involvesWatchonly": false,
    "account": "default",
    "amount": 96.87650028,
    "confirmations": 0,
    "label": ""
  },
  {
    "involvesWatchonly": false,
    "account": "savings",
    "amount": 9.37345432,
    "confirmations": 0,
    "label": ""
  }
]
```

Get balances for all accounts in wallet.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | minconf | Optional | Minimum confirmations required to count a transaction
2 | includeEmpty | Optional | (bool) Whether to include accounts with zero balance
3 | watchOnly | Optional | (bool) Whether to include watch-only addresses



## listreceivedbyaddress

```javascript
let minconf, includeEmpty, watchOnly;
```

```shell--vars
minconf=1
includeEmpty=false
watchOnly=false
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "listreceivedbyaddress",
    "params": [ '$minconf', '$includeEmpty', '$watchOnly' ]
  }'
```

```shell--cli
bwallet-cli rpc listreceivedbyaddress $minconf $includeEmpty $watchOnly 
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

(async () => {
  const result = await walletClient.execute('listreceivedbyaddress', [minconf, includeEmpty, watchOnly]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "involvesWatchonly": true,
    "address": "bcrt1ql8ll4v0u83uf3ghafr9f6c5slhnn7dfrxm499g",
    "account": "default",
    "amount": 0.00030033,
    "confirmations": 313,
    "label": ""
  },
  {
    "involvesWatchonly": true,
    "address": "bcrt1qlfeauahf7jdpruxm6f2vax2yu3xsdkkw2z7n9g",
    "account": "default",
    "amount": 0.00015496,
    "confirmations": 321,
    "label": ""
  },
  {
    "involvesWatchonly": true,
    "address": "bcrt1qlaawtlmdcfjdegghxvdh5pqphk5fjhlevsup7s",
    "account": "default",
    "amount": 342.97828963,
    "confirmations": 348,
    "label": ""
  },
  ...
  {
    "involvesWatchonly": true,
    "address": "bcrt1ql797szp8tvdday5r3zpeepc8fjfk4qs09uaq7t",
    "account": "default",
    "amount": 0.00091418,
    "confirmations": 337,
    "label": ""
  }
]
```

Get balances for all addresses in wallet.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | minconf | Optional | Minimum confirmations required to count a transaction
2 | includeEmpty | Optional | (bool) Whether to include addresses with zero balance
3 | watchOnly | Optional | (bool) Whether to include watch-only addresses



## listsinceblock

```javascript
let block, minconf, watchOnly;
```

```shell--vars
block='26b5e76dcdfc51b94e8e09ca1cf55b453e6c542b7abb863df0a306c6f00ebc8e'
minconf=1
watchOnly=false
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "listsinceblock",
    "params": [ "'$block'", '$minconf', '$watchOnly' ]
  }'
```

```shell--cli
bwallet-cli rpc listsinceblock $block $minconf $watchOnly 
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

(async () => {
  const result = await walletClient.execute('listsinceblock', [block, minconf, watchOnly]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "transactions": [
    {
      "account": "default",
      "address": "bcrt1q730jd9qryjjd7wqyc3aw72mu8u3804m3qxz3qe",
      "category": "receive",
      "amount": 0.00036954,
      "label": "default",
      "vout": 0,
      "confirmations": 314,
      "blockhash": "142abcc5469da7684c84404f93b247b7948dc36933cd438360f611d05f3c62b8",
      "blockindex": -1,
      "blocktime": 1571760040,
      "blockheight": 532,
      "txid": "5f5f496a6095f729755e22eec19484c0e2ea4b144ab266be722e0fe7e5a2ea98",
      "walletconflicts": [],
      "time": 1571759982,
      "timereceived": 1571759982,
      "bip125-replaceable": "no"
    },
    {
      "account": "default",
      "address": "bcrt1qy86kqv3cxfqkemu4e7f6kzxzk2cyt6j6vsxptz",
      "category": "receive",
      "amount": 0.00050209,
      "label": "default",
      "vout": 2,
      "confirmations": 316,
      "blockhash": "34d0385c667319c5225c7f82e025681bae2fb5df28809cc7cf432b491125c83c",
      "blockindex": -1,
      "blocktime": 1571760040,
      "blockheight": 530,
      "txid": "9b7899e0800389aa293578ea14d03f9c7d0249faaced52c2120c20cde8f0479b",
      "walletconflicts": [],
      "time": 1571759982,
      "timereceived": 1571759982,
      "bip125-replaceable": "no"
    },
    {
      "account": "default",
      "address": "bcrt1q8nnvw4h09u6avx4tn8gkrx4t9ayd56v86q7ceg",
      "category": "receive",
      "amount": 0.00037547,
      "label": "default",
      "vout": 0,
      "confirmations": 316,
      "blockhash": "34d0385c667319c5225c7f82e025681bae2fb5df28809cc7cf432b491125c83c",
      "blockindex": -1,
      "blocktime": 1571760040,
      "blockheight": 530,
      "txid": "77a39583060aa3ff2a705d401fea0c07e77e95d66cc10b744dc95098cad1bee1",
      "walletconflicts": [],
      "time": 1571759981,
      "timereceived": 1571759981,
      "bip125-replaceable": "no"
    }
  ],
  "lastblock": "20b062aa8ff8a1611b86016c8ba4f0cec0a6c55b69f1f0431190018bd23d5aec"
}
```

Get all transactions in blocks since a block specified by hash, or all
transactions if no block is specifiied.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | block | Optional | Hash of earliest block to start listing from
2 | minconf | Optional | Minimum confirmations required to count a transaction
3 | watchOnly | Optional | (bool) Whether to include watch-only addresses



## listtransactions

```javascript
let account, count, from, watchOnly;
```

```shell--vars
account='hot'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "listtransactions",
    "params": [ "'$account'" ]
  }'
```

```shell--cli
bwallet-cli rpc listtransactions $account
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

(async () => {
  const result = await walletClient.execute('listtransactions', [account]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "account": "default",
    "address": "bcrt1qpqgnssrdfkfv9pkdj23c7k9w02x8n9ezv4nm3z",
    "category": "receive",
    "amount": 0.00013937,
    "label": "default",
    "vout": 1,
    "confirmations": 406,
    "blockhash": "2ad44c048bc555d18f06d31065856ab3ea24c9a749d579f036aef102bddeabf9",
    "blockindex": -1,
    "blocktime": 1571760025,
    "blockheight": 440,
    "txid": "675d4f09e1da5e9d8268de41ecdbb77795d738333caf6a7c86775211c19b6550",
    "walletconflicts": [],
    "time": 1571759957,
    "timereceived": 1571759957,
    "bip125-replaceable": "no"
  },
  {
    "account": "",
    "address": "bcrt1qh7jclanaex66gpkr5x4duyd45nltxvpppcqnw6",
    "category": "send",
    "amount": -0.00125648,
    "vout": 1,
    "confirmations": 404,
    "blockhash": "53441b98c5286ef75e9aa431b2dd44adbef840b04a3b6c07ca79ff6a5e599373",
    "blockindex": -1,
    "blocktime": 1571760025,
    "blockheight": 442,
    "txid": "725ca556002481e4445110fa4c67fb31d4fdf436e4939bf3c8fa7ff93b1b6c89",
    "walletconflicts": [],
    "time": 1571759957,
    "timereceived": 1571759957,
    "bip125-replaceable": "no"
  },
  {
    "account": "default",
    "address": "bcrt1qpc0fu2fl3hdhf0kaheta67gzdfmfe90ga27pr6",
    "category": "receive",
    "amount": 0.00044896,
    "label": "default",
    "vout": 1,
    "confirmations": 407,
    "blockhash": "39e8e1d9f19389a3b92c5e024e5d7070fe48f4ca7bd0d045b119c09a155cebbf",
    "blockindex": -1,
    "blocktime": 1571760024,
    "blockheight": 439,
    "txid": "e346029655b10a9cd4df74d87d4001b1fd11ee7a6f53ab556cadb27ce160be14",
    "walletconflicts": [],
    "time": 1571759957,
    "timereceived": 1571759957,
    "bip125-replaceable": "no"
  }
]
```

Get all recent transactions for specified account up to a limit, starting from
a specified index.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | account | Optional | Account name
2 | count | Optional | Max number of transactions to return
3 | from | Optional | Number of oldest transactions to skip
4 | watchOnly | Optional | Whether to include watch-only addresses



## listunspent

```javascript
let minconf, maxconf, addrs;
addrs=["bcrt1qggre40we5qdeenzudq3yz0qxee8qc57s2fqygy"];
```

```shell--vars
minconf=0
maxconf=20
```

```shell--curl
addrs='["bcrt1qggre40we5qdeenzudq3yz0qxee8qc57s2fqygy"]'


curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "listunspent",
    "params": [ '$minconf', '$maxconf', '"$addrs"' ]
  }'
```

```shell--cli
addrs='["bcrt1qggre40we5qdeenzudq3yz0qxee8qc57s2fqygy"]'

bwallet-cli rpc listunspent $minconf $maxconf $addrs
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

(async () => {
  const result = await walletClient.execute('listunspent', [minconf, maxconf, addrs]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "txid": "d07a4211a3633bedd737b850378872191c27fc6126dc8131c3b45f62611a7f36",
    "vout": 1,
    "address": "bcrt1qggre40we5qdeenzudq3yz0qxee8qc57s2fqygy",
    "account": "default",
    "scriptPubKey": "001442079abdd9a01b9ccc5c6822413c06ce4e0c53d0",
    "amount": 342.96788338,
    "confirmations": 313,
    "spendable": true,
    "solvable": true
  }
]
```

Get unsepnt transaction outputs from all addreses, or a specific set
of addresses.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | minconf | Optional | Minimum confirmations required to return tx
2 | maxconf | Optional | Maximum confirmations required to return tx
3 | addrs | Optional | Array of addresses to filter



## move

Not implemented -- Deprecated in Bitcoin Core



## sendfrom

```javascript
let fromaccount, tobitcoinaddress, amount;
```

```shell--vars
fromaccount='hot'
tobitcoinaddress='bcrt1qggre40we5qdeenzudq3yz0qxee8qc57s2fqygy'
amount=0.0195
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "sendfrom",
    "params": [ "'$fromaccount'", "'$tobitcoinaddress'", '$amount' ]
  }'
```

```shell--cli
bwallet-cli rpc sendfrom $fromaccount $tobitcoinaddress $amount
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

(async () => {
  const result = await walletClient.execute('sendfrom', [fromaccount, tobitcoinaddress, amount]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
94f8a6dbaea9b5863d03d3b606c24e2e588d9e82564972148d54058660308e6a
```

Send Bitcoin from an account to an address.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | fromaccount | Required | Wallet account to spend outputs from
2 | tobitcoinaddress | Required | Bitcoin address to send funds to
3 | amount | Required | Amount (in BTC) to send
4 | minconf | Optional | Minimum confirmations for output to be spent from
5 | comment | Optional | _not implemented in bcoin_
6 | comment_to | Optional | _not implemented in bcoin_



## sendmany

```javascript
let fromaccount, outputs, minconf, label, subtractFee;
outputs={"msSaQkCXyrEefbSH9TCSWNjnacTwGGc55d": 0.123, "moKaYJdRT19YUWSsfhnTQpo68wkVvzkk8y": 0.321}
```

```shell--vars
fromaccount='hot'
minconf=1
label="this_is_ignored"
subtractfee=false
```

```shell--curl
outputs='{"msSaQkCXyrEefbSH9TCSWNjnacTwGGc55d": 0.123, "moKaYJdRT19YUWSsfhnTQpo68wkVvzkk8y": 0.321}'

curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "sendmany",
    "params": [ "'$fromaccount'", '"$outputs"', '$minconf', "'$label'", '$subtractfee' ]
  }'
```

```shell--cli
outputs='{"msSaQkCXyrEefbSH9TCSWNjnacTwGGc55d": 0.123, "moKaYJdRT19YUWSsfhnTQpo68wkVvzkk8y": 0.321}'

bwallet-cli rpc sendmany $fromaccount "$outputs" $minconf $label $subtractfee
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

(async () => {
  const result = await walletClient.execute('sendmany', [fromaccount, outputs, minconf, label, subtractfee]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
121d1e44f8125f02433e96c7b672a34af00be9906895f0ee51aaf504f4d76b78
```

Send different amounts of Bitcoin from an account to multiple addresses. 

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | fromaccount | Required | Wallet account to spend outputs from
2 | outputs | Required | Array of Bitcoin addresses and amounts to send
3 | minconf | Optional | Minimum confirmations for output to be spent from
5 | label | Optional | [Ignored but required if additional parameters are passed](#rpc-calls-wallet)
6 | subtractfee | Optional | (bool) Subtract the transaction fee equally from the output amounts



## sendtoaddress

```javascript
let address, amount, comment, comment_to, subtractFee;
```

```shell--vars
address='moKaYJdRT19YUWSsfhnTQpo68wkVvzkk8y'
amount=1.01010101
comment="this_is_ignored"
comment_to="this_is_ignored"
subtractfee=true
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "sendtoaddress",
    "params": [ "'$address'", '$amount', "'$comment'", "'$comment_to'", '$subtractfee' ]
  }'
```

```shell--cli
bwallet-cli rpc sendtoaddress $address $amount $comment $commnt_to $subtractfee
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

(async () => {
  const result = await walletClient.execute('sendtoaddress', [address, amount, comment, comment_to, subtractfee]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
552006b288266ab26fa30d9048b758a469a4101fd8235eff2384141ca5cf604d
```

Send Bitcoin to an address.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Bitcoin address to send funds to
2 | amount | Required | Amount (in BTC) to send
4 | comment | Optional | [Ignored but required if additional parameters are passed](#rpc-calls-wallet)
5 | comment_to | Optional | [Ignored but required if additional parameters are passed](#rpc-calls-wallet)
6 | subtractfee | Optional | (bool) Subtract the transaction fee equally from the output amount



## setaccount

Not implemented 



## settxfee

```javascript
let rate;
```

```shell--vars
rate=0.00001
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "settxfee",
    "params": [ '$rate' ]
  }'
```

```shell--cli
bwallet-cli rpc settxfee $rate
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

(async () => {
  const result = await walletClient.execute('settxfee', [rate]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
true
```

Set the fee rate for all new transactions until the fee is
changed again, or set to `0` (will return to automatic fee).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | rate | Required | Fee rate in BTC/kB



## signmessage

```javascript
let address, message;
```

```shell--vars
address='moKaYJdRT19YUWSsfhnTQpo68wkVvzkk8y'
message='Satoshi'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "signmessage",
    "params": [ "'$address'", "'$message'" ]
  }'
```

```shell--cli
bwallet-cli rpc signmessage $address $message
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

(async () => {
  const result = await walletClient.execute('signmessage', [address, message]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
MEUCIQC5Zzr+JoenWHy7m9XxpbDVVeg3DvKvJVQNyYPvLOuB2gIgP/BT3dRItxarNbE8ajEoTI66q3eB4lo+/SLsp7bbP70=
```

Sign an arbitrary message with the private key corresponding to a
specified Bitcoin address in the wallet.

<aside>Note: Due to behavior of some shells like bash, if your message contains spaces you may need to add additional quotes like this: <code>"'"$message"'"</code></aside>

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Wallet address to use for signing
2 | message | Required | The message to sign



## walletlock

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "walletlock" }'
```

```shell--cli
bwallet-cli rpc walletlock
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

(async () => {
  const result = await walletClient.execute('walletlock');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Locks the wallet by removing the decryption key from memory.
See [walletpassphrase](#walletpassphrase).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## walletpassphrasechange

```javascript
let old, passphrase;
```

```shell--vars
old='OneTwoThreeFour'
passphrase='CorrectHorseBatteryStaple'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "walletpassphrasechange",
    "params": [ "'$old'", "'$passphrase'" ]
  }'
```

```shell--cli
bwallet-cli rpc walletpassphrasechange $old $passphrase
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

(async () => {
  const result = await walletClient.execute('walletpassphrasechange', [old, passphrase]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Change the wallet encryption pasphrase

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | old | Required | The current wallet passphrase
2 | passphrase | Required | New passphrase



## walletpassphrase

```javascript
let passphrase, timeout;
```

```shell--vars
passphrase='CorrectHorseBatteryStaple'
timeout=600
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "walletpassphrase",
    "params": [ "'$passphrase'", '$timeout' ]
  }'
```

```shell--cli
bwallet-cli rpc walletpassphrase $passphrase $timeout
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

(async () => {
  const result = await walletClient.execute('walletpassphrase', [passphrase, timeout]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Store wallet decryption key in memory, unlocking the wallet keys.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | passphrase | Required | The current wallet passphrase
2 | timeout | Required | Amount of time in seconds decryption key will stay in memory



## removeprunedfunds

```javascript
let txid;
```

```shell--vars
txid='6478cafe0c91e5ed4c55ade3b1726209caa0d290c8a3a84cc345caad60073ad5'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "removeprunedfunds",
    "params": [ "'$txid'" ]
  }'
```

```shell--cli
bwallet-cli rpc removeprunedfunds $txid
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

(async () => {
  const result = await walletClient.execute('removeprunedfunds', [txid]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Deletes the specified transaction from the wallet database.
See [importprunedfunds](#importprunedfunds).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txid | Required | txid of the transaction to remove



## wallet getmemoryinfo

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "getmemoryinfo" }'
```

```shell--cli
bwallet-cli rpc getmemoryinfo
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

(async () => {
  const result = await walletClient.execute('getmemoryinfo');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "total": 133,
  "jsHeap": 17,
  "jsHeapTotal": 20,
  "nativeHeap": 112,
  "external": 30
}
```

Get information about memory usage.
Identical to node RPC call [getmemoryinfo](#getmemoryinfo).

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## wallet setloglevel

```javascript
let level;
```

```shell--vars
level='debug'
```

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "setloglevel",
    "params": [ "'$level'" ]
  }'
```

```shell--cli
bwallet-cli rpc setloglevel $level
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

(async () => {
  const result = await walletClient.execute('setloglevel', [level]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
null
```

Change Log level of the running node.

Levels are: `NONE`, `ERROR`, `WARNING`, `INFO`, `DEBUG`, `SPAM`


### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | level | Required | Level for the logger



## wallet stop

```shell--curl
curl $walletrpcurl \
  -X POST \
  --data '{ "method": "stop" }'
```

```shell--cli
bwallet-cli rpc stop
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

(async () => {
  const result = await walletClient.execute('stop');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```
"Stopping."
```

Closes the wallet database.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |

