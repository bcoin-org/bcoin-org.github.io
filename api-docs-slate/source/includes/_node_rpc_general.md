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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('stop');
  console.log(result);
})();
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
curl $url \
  -X POST \
  --data '{ "method": "getinfo" }'
```

```shell--cli
bcoin-cli rpc getinfo
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
  const result = await client.execute('getinfo');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "version": "v1.0.0-pre",
  "protocolversion": 70015,
  "walletversion": 0,
  "balance": 0,
  "blocks": 205,
  "timeoffset": 0,
  "connections": 3,
  "proxy": "",
  "difficulty": 4.6565423739069247e-10,
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
curl $url \
  -X POST \
  --data '{ "method": "getmemoryinfo" }'
```

```shell--cli
bcoin-cli rpc getmemoryinfo
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
  const result = await client.execute('getmemoryinfo');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "total": 72,
  "jsHeap": 14,
  "jsHeapTotal": 17,
  "nativeHeap": 54,
  "external": 12
}
```

Returns Memory usage info.
Identical to node RPC call [wallet-getmemoryinfo](#wallet-getmemoryinfo).


### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## setloglevel

```shell--curl
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('setloglevel', [ 'none' ]);
  console.log(result);
})();
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
address='RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ';
```

```shell--curl
curl $url/ \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('validateaddress', [ address ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "isvalid": true,
  "address": "RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ",
  "scriptPubKey": "76a914a4ecde9642f8070241451c5851431be9b658a7fe88ac",
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
pubkey0='02e3d6bb36b0261628101ee67abd89d678522dc1199912512f814e70803652f395';
pubkey1='03d7ded41bb871936bf4d411371b25d706c572f28ef8d2613b45392e9f9c4348a5';
pubkey2='034bc2280e68d3bdd0ef0664e0ad2949a467344d8e59e435fe2d9be81e39f70f76';
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "createmultisig",
    "params": [ '$nrequired', [ "'$pubkey0'", "'$pubkey1'", "'$pubkey2'" ] ]
  }'
```

```shell--cli
bcoin-cli rpc createmultisig $nrequired '[ "'$pubkey0'", "'$pubkey1'", "'$pubkey2'" ]'
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
  const result = await client.execute('createmultisig', [ nrequired, [ pubkey0, pubkey1, pubkey2 ] ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "address": "GfNqJAAyrCLr2bVHxn8wjMMYMh1EBPzUNk",
  "redeemScript": "522102e3d6bb36b0261628101ee67abd89d678522dc1199912512f814e70803652f39521034bc2280e68d3bdd0ef0664e0ad2949a467344d8e59e435fe2d9be81e39f70f762103d7ded41bb871936bf4d411371b25d706c572f28ef8d2613b45392e9f9c4348a553ae"
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
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('createwitnessaddress', [ script ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "address": "rb1qlfgqame3n0dt2ldjl2m9qjg6n2vut26jw3ezm25hqx9ez4m9wp5qjres8a",
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
privkey='EMyedBwL5mb476uhWZ2wzEsSpu8kZwYgYaw5rGbjJh1kRjXF3M2d';
message='hello';
```

```shell--curl
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('signmessagewithprivkey', [ privkey, message ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
"MEUCIQCGLPYuLuSU1XQ7ctRvRzrY4M0dKAxShzEN3fwVoelGvgIgPmQ2RcRpeu0o68YsN42yzykI9VfTPooWHMvsFbIFEkg="
```


Signs message with private key. 
<aside>Note: Due to behavior of some shells like bash, if your message contains spaces you may need to add additional quotes like this: <code>"'"$message"'"</code></aside>

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
address='RGCudRpNcn299Ja1EaVzgpnPD3YJgfMMiB';
signature='MEUCIQCGLPYuLuSU1XQ7ctRvRzrY4M0dKAxShzEN3fwVoelGvgIgPmQ2RcRpeu0o68YsN42yzykI9VfTPooWHMvsFbIFEkg=';
message='hello';
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "verifymessage",
    "params": [ "'$address'", "'$signature'", "$message" ]
  }'
```

```shell--cli
bcoin-cli rpc verifymessage $address $signature "$message"
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
  const result = await client.execute('verifymessage', [ address, signature, message ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
true
```

Verify signature.
<aside>Note: Due to behavior of some shells like bash, if your message contains spaces you may need to add additional quotes like this: <code>"'"$message"'"</code></aside>


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
curl $url \
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
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('setmocktime', [ timestamp ]);
  console.log(result);
})();
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
