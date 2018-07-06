# RPC Calls - Block

## getblockchaininfo

```shell--curl
curl $url \
  -X POST \
  --data '{ "method": "getblockchaininfo" }'
```

```shell--cli
bcoin-cli rpc getblockchaininfo
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
  const result = await client.execute('getblockchaininfo');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "chain": "regtest",
  "blocks": 98,
  "headers": 98,
  "bestblockhash": "498d003ecfc60ee829cdc3640dc305583057d88e2c38a7d57dbe0f92aa2bb512",
  "difficulty": 4.6565423739069247e-10,
  "mediantime": 1527028558,
  "verificationprogress": 0.9997162305340502,
  "chainwork": "00000000000000000000000000000000000000000000000000000000000000c6",
  "pruned": false,
  "softforks": [
    {
      "id": "bip34",
      "version": 2,
      "reject": {
        "status": false
      }
    },
    {
      "id": "bip66",
      "version": 3,
      "reject": {
        "status": false
      }
    },
    {
      "id": "bip65",
      "version": 4,
      "reject": {
        "status": false
      }
    }
  ],
  "bip9_softforks": {
    "csv": {
      "status": "defined",
      "bit": 0,
      "startTime": 0,
      "timeout": 4294967295
    },
    "segwit": {
      "status": "defined",
      "bit": 1,
      "startTime": 0,
      "timeout": 4294967295
    },
    "segsignal": {
      "status": "defined",
      "bit": 4,
      "startTime": 4294967295,
      "timeout": 4294967295
    },
    "testdummy": {
      "status": "defined",
      "bit": 28,
      "startTime": 0,
      "timeout": 4294967295
    }
  },
  "pruneheight": null
}
```

Returns blockchain information.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getbestblockhash

```shell--curl
curl $url \
  -X POST \
  --data '{ "method": "getbestblockhash" }'
```

```shell--cli
bcoin-cli rpc getbestblockhash
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
  const result = await client.execute('getbestblockhash');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
"498d003ecfc60ee829cdc3640dc305583057d88e2c38a7d57dbe0f92aa2bb512"
```

Returns Block Hash of the tip.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getblockcount


```shell--curl
curl $url \
  -X POST \
  --data '{ "method": "getblockcount" }'
```

```shell--cli
bcoin-cli rpc getblockcount
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
  const result = await client.execute('getblockcount');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
98
```

Returns block count.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. ||||



## getblock

```javascript
let blockhash, details, verbose;
```

```shell--vars
blockhash='498d003ecfc60ee829cdc3640dc305583057d88e2c38a7d57dbe0f92aa2bb512';
verbose=1;
details=0;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getblock",
    "params": [ "'$blockhash'", '$verbose', '$details' ]
  }'
```

```shell--cli
bcoin-cli rpc getblock $blockhash $verbose $details
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
  const result = await client.execute('getblock', [ blockhash, verbose, details ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "hash": "498d003ecfc60ee829cdc3640dc305583057d88e2c38a7d57dbe0f92aa2bb512",
  "confirmations": 1,
  "strippedsize": 197,
  "size": 197,
  "weight": 788,
  "height": 98,
  "version": 536870912,
  "versionHex": "20000000",
  "merkleroot": "674527b1b1b8604677a0b9e3f7a62fd733af9eba254d9f98748d3d0afdf35602",
  "coinbase": "01620e6d696e65642062792062636f696e046d2df7a0080000000000000000",
  "tx": [
    "674527b1b1b8604677a0b9e3f7a62fd733af9eba254d9f98748d3d0afdf35602"
  ],
  "time": 1527028559,
  "mediantime": 1527028558,
  "bits": 545259519,
  "difficulty": 4.6565423739069247e-10,
  "chainwork": "00000000000000000000000000000000000000000000000000000000000000c6",
  "previousblockhash": "267bec5755cb8362828351a1bedb0de8c8ab37a58627070a79b7aa48d09c7276",
  "nextblockhash": null
}
```

Returns information about block.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockhash | Required | Hash of the block
2 | verbose | true | If set to false, it will return hex of the block
3 | details | false | If set to true, it will return transaction details too.



## getblockbyheight

```javascript
let blockhash, details, verbose;
```

```shell--vars
blockheight=50;
verbose=1;
details=0;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getblockbyheight",
    "params": [ '$blockheight', '$verbose', '$details' ]
  }'
```

```shell--cli
bcoin-cli rpc getblockbyheight $blockheight $verbose $details
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
  const result = await client.execute('getblockbyheight', [ blockheight, verbose, details ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "hash": "51726259de9560e1924f3cb554ad16e889b6170eb4d01d01f5a4ca8a81d1e318",
  "confirmations": 49,
  "strippedsize": 197,
  "size": 197,
  "weight": 788,
  "height": 50,
  "version": 536870912,
  "versionHex": "20000000",
  "merkleroot": "8e2d404a039a7a3e1768b161aa23546aab0444b73905bdd3d68b3d6f1769e8c0",
  "coinbase": "01320e6d696e65642062792062636f696e04a829b925080000000000000000",
  "tx": [
    "8e2d404a039a7a3e1768b161aa23546aab0444b73905bdd3d68b3d6f1769e8c0"
  ],
  "time": 1527028551,
  "mediantime": 1527028550,
  "bits": 545259519,
  "difficulty": 4.6565423739069247e-10,
  "chainwork": "0000000000000000000000000000000000000000000000000000000000000066",
  "previousblockhash": "69eef02e5b7e2558f96a7e9ecb47dbbc4dd9fb1aa46cc22f36d8e7ee1edde33d",
  "nextblockhash": "7f734e621cc3e08834063b9482aa89e0bcaf29e7812b83494f3891c7955958fb"
}
```

Returns information about block by height.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockheight | Required | height of the block in the blockchain.
2 | verbose | true | If set to false, it will return hex of the block.
3 | details | false | If set to true, it will return transaction details too.



## getblockhash

```javascript
let blockheight;
```

```shell--vars
blockheight=50;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getblockhash",
    "params": [ '$blockheight' ]
  }'
```

```shell--cli
bcoin-cli rpc getblockhash $blockheight
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
  const result = await client.execute('getblockhash', [ blockheight ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
"51726259de9560e1924f3cb554ad16e889b6170eb4d01d01f5a4ca8a81d1e318"
```

Returns block's hash given its height.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockheight | Required | height of the block in the blockchain.



## getblockheader

```javascript
let blockhash, verbose;
```

```shell--vars
blockhash='51726259de9560e1924f3cb554ad16e889b6170eb4d01d01f5a4ca8a81d1e318';
verbose=1;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getblockheader",
    "params": [ "'$blockhash'", '$verbose' ]
  }'
```

```shell--cli
bcoin-cli rpc getblockheader $blockhash $verbose
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
  const result = await client.execute('getblockheader', [ blockhash, verbose ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "hash": "51726259de9560e1924f3cb554ad16e889b6170eb4d01d01f5a4ca8a81d1e318",
  "confirmations": 49,
  "height": 50,
  "version": 536870912,
  "versionHex": "20000000",
  "merkleroot": "8e2d404a039a7a3e1768b161aa23546aab0444b73905bdd3d68b3d6f1769e8c0",
  "time": 1527028551,
  "mediantime": 1527028550,
  "bits": 545259519,
  "difficulty": 4.6565423739069247e-10,
  "chainwork": "0000000000000000000000000000000000000000000000000000000000000066",
  "previousblockhash": "69eef02e5b7e2558f96a7e9ecb47dbbc4dd9fb1aa46cc22f36d8e7ee1edde33d",
  "nextblockhash": "7f734e621cc3e08834063b9482aa89e0bcaf29e7812b83494f3891c7955958fb"
}
```

Returns a block's header given its hash.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockheight | Required | height of the block in the blockchain.
2 | verbose | true | If set to false, it will return hex of the block.



## getchaintips

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getchaintips"
  }'
```

```shell--cli
bcoin-cli rpc getchaintips
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
  const result = await client.execute('getchaintips');
  console.log(result);
})();
```

Returns chaintips.

> The above command returns JSON "result" like this:

```json
[
  {
    "height": 98,
    "hash": "498d003ecfc60ee829cdc3640dc305583057d88e2c38a7d57dbe0f92aa2bb512",
    "branchlen": 0,
    "status": "active"
  }
  ...
]
```

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getdifficulty

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getdifficulty"
  }'
```

```shell--cli
bcoin-cli rpc getdifficulty
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
  const result = await client.execute('getdifficulty');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
1048576
```

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |

