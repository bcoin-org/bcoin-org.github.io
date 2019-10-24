# RPC Calls - Network

## getconnectioncount

```shell--curl
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('getconnectioncount');
  console.log(result);
})();
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
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('ping');
  console.log(result);
})();
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
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('getpeerinfo');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "id": 17,
    "addr": "67.210.228.203:8333",
    "addrlocal": "100.200.50.10:52342",
    "services": "0000000d",
    "relaytxes": true,
    "lastsend": 1571762943,
    "lastrecv": 1571762941,
    "bytessent": 299812,
    "bytesrecv": 1149318,
    "conntime": 2534,
    "timeoffset": 0,
    "pingtime": 0.054,
    "minping": 0.051,
    "version": 70015,
    "subver": "/Satoshi:0.14.2/",
    "inbound": false,
    "startingheight": 600551,
    "besthash": "0000000000000000000425601a59d69922cdce6bad287950004d8308428b0748",
    "bestheight": 600558,
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
nodeAddr='127.0.0.1:48444';
cmd='add'
```


```shell--curl
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('addnode', [ nodeAddr, cmd ]);
  console.log(result);
})();
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
nodeAddr='127.0.0.1:48444';
```


```shell--curl
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('disconnectnode', [ nodeAddr ]);
  console.log(result);
})();
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
nodeAddr='127.0.0.1:48444';
```

```shell--curl
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('getaddednodeinfo', [ nodeAddr ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "addednode": "127.0.0.1:48444",
    "connected": true,
    "addresses": [
      {
        "address": "127.0.0.1:48444",
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
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('getnettotals');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "totalbytesrecv": 42175,
  "totalbytessent": 42175,
  "timemillis": 1527116369308
}
```

Returns information about used network resources.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getnetworkinfo

```shell--curl
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('getnetworkinfo');
  console.log(result);
})();
```


> The above command returns JSON "result" like this:

```json

  "version": "2.0.0-dev",
  "subversion": "/bcoin:2.0.0-dev/",
  "protocolversion": 70015,
  "localservices": "00000009",
  "localservicenames": [
    "NETWORK",
    "WITNESS"
  ],
  "localrelay": true,
  "timeoffset": 0,
  "networkactive": true,
  "connections": 8,
  "networks": [],
  "relayfee": 0.00001,
  "incrementalfee": 0,
  "localaddresses": [
    {
      "address": "200.100.50.10",
      "port": 8333,
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
nodeAddr='127.0.0.1:48444';
cmd='add'
```

```shell--curl
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('setban', [ nodeAddr, cmd ]);
  console.log(result);
})();
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
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('listbanned');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  {
    "address": "127.0.0.1",
    "banned_until": 1527202858,
    "ban_created": 1527116458,
    "ban_reason": ""
  }
]
```

Lists all banned peers.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## clearbanned

```shell--curl
curl $url \
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
const {NodeClient, Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.execute('clearbanned');
  console.log(result);
})();
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
