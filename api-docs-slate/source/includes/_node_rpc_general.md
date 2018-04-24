## stop

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "method": "stop" }'
```

```shell--cli
bcoin-cli rpc stop
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('stop');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
"Stopping."
```

Stops the running node.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getinfo

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getinfo",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getinfo
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getinfo');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "version": "v1.0.0-beta.14",
  "protocolversion": 70015,
  "walletversion": 0,
  "balance": 0,
  "blocks": 1178980,
  "timeoffset": 0,
  "connections": 8,
  "proxy": "",
  "difficulty": 1048576,
  "testnet": true,
  "keypoololdest": 0,
  "keypoolsize": 0,
  "unlocked_until": 0,
  "paytxfee": 0.0002,
  "relayfee": 0.00001,
  "errors": ""
}
```

Returns general info


### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getmemoryinfo

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getmemoryinfo",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getmemoryinfo
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getmemoryinfo');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "total": 99,
  "jsHeap": 19,
  "jsHeapTotal": 29,
  "nativeHeap": 69,
  "external": 10
}
```

Returns Memory usage info.


### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## setloglevel

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "setloglevel",
    "params": [ "none" ]
  }'
```

```shell--cli
bcoin-cli rpc setloglevel none
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('setloglevel', [ 'none' ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
null
```

Change Log level of the running node.

Levels are: `NONE`, `ERROR`, `WARNING`, `INFO`, `DEBUG`, `SPAM`

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | level | Required | Level for the logger


## validateaddress

```javascript
let address;
```

```shell--vars
address='n34pHHSqsXJQwq9FXUsrfhmTghrVtN74yo';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "validateaddress",
    "params": [ "'$address'" ]
  }'
```

```shell--cli
bcoin-cli rpc validateaddress $address
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('validateaddress', [ address ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "isvalid": true,
  "address": "n34pHHSqsXJQwq9FXUsrfhmTghrVtN74yo",
  "scriptPubKey": "76a914ec61435a3c8f0efee2ffafb8ddb4e1440d2db8d988ac",
  "ismine": false,
  "iswatchonly": false
}
```

Validates address.


### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Address to validate



## createmultisig

```javascript
let nrequired, pubkey0, pubkey1, pubkey2;
```

```shell--vars
nrequired=2;
pubkey0='02b3280e779a7c849f9d6460e926097fe4b0f6280fa6fd038ce8e1236a4688c358';
pubkey1='021f1dbc575db95a44e016fe6ecf00231109e7799d9b1e007dbe8814017cf0d65c';
pubkey2='0315613667e3ebe065c0b8d86ae0443d97de56545bdf38c99a6ee584f300206d9a';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "createmultisig",
    "params": [ "'$nrequired'", [ "'$pubkey0'", "'$pubkey1'", "'$pubkey2'" ] ]
  }'
```

```shell--cli
bcoin-cli rpc createmultisig $nrequired '[ "'$pubkey0'", "'$pubkey1'", "'$pubkey2'" ]'
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('createmultisig', [ nrequired, [ pubkey0, pubkey1, pubkey2 ] ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "address": "2MzY9R5P1Wfy9aNdqyoH63K1EQZF7APuZ4S",
  "redeemScript": "5221021f1dbc575db95a44e016fe6ecf00231109e7799d9b1e007dbe8814017cf0d65c2102b3280e779a7c849f9d6460e926097fe4b0f6280fa6fd038ce8e1236a4688c358210315613667e3ebe065c0b8d86ae0443d97de56545bdf38c99a6ee584f300206d9a53ae"
}

```

create multisig address

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | nrequired | Required | Required number of approvals for spending
2 | keyArray  | Required | Array of public keys



## createwitnessaddress

```javascript
let script;
```

```shell--vars
script='5221021f1dbc575db95a44e016fe6ecf00231109e7799d9b1e007dbe8814017cf0d65c2102b3280e779a7c849f9d6460e926097fe4b0f6280fa6fd038ce8e1236a4688c358210315613667e3ebe065c0b8d86ae0443d97de56545bdf38c99a6ee584f300206d9a53ae';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "createwitnessaddress",
    "params": [ "'$script'" ]
  }'
```

```shell--cli
bcoin-cli rpc createwitnessaddress $script
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('createwitnessaddress', [ script ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "address": "tb1qlfgqame3n0dt2ldjl2m9qjg6n2vut26jw3ezm25hqx9ez4m9wp5q567kg2",
  "witnessScript": "0020fa500eef319bdab57db2fab650491a9a99c5ab5274722daa97018b9157657068"
}
```

Creates witness address.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | script | Required | Bitcoin script.



## signmessagewithprivkey

```javascript
let privkey, message;
```

```shell--vars
privkey='EL4QU6ViZvT4RuCTCivw2uBnvBPSamP5jMtH31gGQLbEEcmNCHVz';
message='hello';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "signmessagewithprivkey",
    "params": [ "'$privkey'", "'$message'"]
  }'
```

```shell--cli
bcoin-cli rpc signmessagewithprivkey $privkey $message
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('signmessagewithprivkey', [ privkey, message ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
"MEQCIAwF9NPMo5KBRsCWTBJ2r69/h7CfDl+RQfxxwAbNp1WJAiAiubiK5rg9MugiU7EHpwbJLc3b356LAedob0ePI40Wmg=="
```


Signs message with private key.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | privkey | Required | Private key
1 | message | Required | Message you want to sign.


## verifymessage

```javascript
let address, signature, message;
```

```shell--vars
address='R9LTC6Sp6Zwk71qUrm81sEdsppFNiDM6mF';
signature='MEQCIAwF9NPMo5KBRsCWTBJ2r69/h7CfDl+RQfxxwAbNp1WJAiAiubiK5rg9MugiU7EHpwbJLc3b356LAedob0ePI40Wmg==';
message='hello';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "verifymessage",
    "params": [ "'$address'", "'$signature'", "'$message'" ]
  }'
```

```shell--cli
bcoin-cli rpc verifymessage $address $signature $message
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('verifymessage', [ address, signature, message ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
true
```

Verify sign

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | address | Required | Address of the signer
2 | signature | Required | Signature of signed message
3 | message | Required | Message that was signed

## setmocktime

```javascript
let timestamp;
```

```shell--vars
timestamp=1503058155;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "setmocktime",
    "params": [ '$timestamp' ]
  }'
```

```shell--cli
bcoin-cli rpc setmocktime $timestamp
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('setmocktime', [ timestamp ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
null
```


Changes network time (This is consensus-critical)

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | timestamp | Required | timestamp to change to
