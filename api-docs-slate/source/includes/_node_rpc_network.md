# RPC Calls - Network

## getconnectioncount

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getconnectioncount",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getconnectioncount
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getconnectioncount');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
8
```

Returns connection count.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |

## ping

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "ping",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc ping
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('ping');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
null
```

Will send ping request to every connected peer.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getpeerinfo

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getpeerinfo",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getpeerinfo
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getpeerinfo');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
[
  {
    "id": 1,
    "addr": "198.51.100.82:18333",
    "addrlocal": "203.0.113.114:60760",
    "services": "0000000d",
    "relaytxes": true,
    "lastsend": 1503257171,
    "lastrecv": 1503257171,
    "bytessent": 1962,
    "bytesrecv": 32499,
    "conntime": 121,
    "timeoffset": -1,
    "pingtime": 0.143,
    "minping": 0.143,
    "version": 70015,
    "subver": "/Satoshi:0.14.1/",
    "inbound": false,
    "startingheight": 1179570,
    "besthash": null,
    "bestheight": -1,
    "banscore": 0,
    "inflight": [],
    "whitelisted": false
  },
  ...
]
```

Returns information about all connected peers.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |




## addnode

```javascript
let nodeAddr, cmd;
```

```shell--vars
nodeAddr='198.51.100.82:18333';
cmd='add'
```


```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "addnode",
    "params": [ "'$nodeAddr'", "'$cmd'" ]
  }'
```

```shell--cli
bcoin-cli rpc addnode $nodeAddr $cmd
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('addnode', [ nodeAddr, cmd ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
null
```

Adds or removes peers in Host List.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | addr | Required | IP Address of the Node.
2 | cmd | Required | Command

### Commands
Command | Description
---- | ----
add | Adds node to Host List and connects to it
onetry | Tries to connect to the given node
remove | Removes node from host list



## disconnectnode

```javascript
let nodeAddr;
```

```shell--vars
nodeAddr='198.51.100.82:18333';
```


```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "disconnectnode",
    "params": [ "'$nodeAddr'" ]
  }'
```

```shell--cli
bcoin-cli rpc disconnectnode $nodeAddr
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('disconnectnode', [ nodeAddr ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
null
```

Disconnects node.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | addr | Required | IP Address of the Node.



## getaddednodeinfo

```javascript
let nodeAddr;
```

```shell--vars
nodeAddr='198.51.100.82:18333';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getaddednodeinfo",
    "params": [ "'$nodeAddr'" ]
  }'
```

```shell--cli
bcoin-cli rpc getaddednodeinfo $nodeAddr
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getaddednodeinfo', [ nodeAddr ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
[
  {
    "addednode": "198.51.100.82:18333",
    "connected": true,
    "addresses": [
      {
        "address": "198.51.100.82:18333",
        "connected": "outbound"
      }
    ]
  }
]
```

Returns node information from host list.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | addr | Required | IP Address of the Node.



## getnettotals

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getnettotals",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getnettotals
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getnettotals');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "totalbytesrecv": 370598,
  "totalbytessent": 110058,
  "timemillis": 1503262547279
}
```

Returns information about used network resources.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getnetworkinfo

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getnetworkinfo",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getnetworkinfo
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getnetworkinfo');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```


> The above command returns JSON "result" like this:

```json
{
  "version": "v1.0.0-beta.14",
  "subversion": "/bcoin:v1.0.0-beta.14/",
  "protocolversion": 70015,
  "localservices": "00000009",
  "localrelay": true,
  "timeoffset": -1,
  "networkactive": true,
  "connections": 8,
  "networks": [],
  "relayfee": 0.00001,
  "incrementalfee": 0,
  "localaddresses": [
    {
      "address": "203.0.113.114",
      "port": 18333,
      "score": 3
    }
  ],
  "warnings": ""
}
```

Returns local node's network information

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## setban

```javascript
let nodeAddr, cmd;
```

```shell--vars
nodeAddr='198.51.100.82:18333';
cmd='add'
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "setban",
    "params": [ "'$nodeAddr'", "'$cmd'" ]
  }'
```

```shell--cli
bcoin-cli rpc setban $nodeAddr $cmd
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('setban', [ nodeAddr, cmd ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
null
```

Adds or removes nodes from banlist.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | addr | Required | IP Address of the Node.
2 | cmd | Required | Command

### Commands
Command | Description
---- | ----
add | Adds node to ban list, removes from host list, disconnects.
remove | Removes node from ban list



## listbanned

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "listbanned",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc listbanned
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('listbanned');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
[
  {
    "address": "198.51.100.82:18333",
    "banned_until": 1503349501,
    "ban_created": 1503263101,
    "ban_reason": ""
  },
  ...
]
```

Lists all banned peers.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## clearbanned

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "clearbanned",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc clearbanned
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('clearbanned');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
null
```

Removes all banned peers.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |
