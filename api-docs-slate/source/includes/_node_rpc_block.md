# RPC Calls - Block

## getblockchaininfo

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "method": "getblockchaininfo" }'
```

```shell--cli
bcoin-cli rpc getblockchaininfo
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getblockchaininfo');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "chain": "test",
  "blocks": 1178402,
  "headers": 1178402,
  "bestblockhash": "0000000000000dd897f549915ba7099b6d4f86f4512801d617a7c0c655827d08",
  "difficulty": 1048576,
  "mediantime": 1502814951,
  "verificationprogress": 1,
  "chainwork": "00000000000000000000000000000000000000000000002976ca78529498e335",
  "pruned": false,
  "softforks": [
    {
      "id": "bip34",
      "version": 2,
      "reject": {
        "status": true
      }
    },
    {
      "id": "bip66",
      "version": 3,
      "reject": {
        "status": true
      }
    },
    {
      "id": "bip65",
      "version": 4,
      "reject": {
        "status": true
      }
    }
  ],
  "bip9_softforks": {
    "csv": {
      "status": "active",
      "bit": 0,
      "startTime": 1456790400,
      "timeout": 1493596800
    },
    "segwit": {
      "status": "active",
      "bit": 1,
      "startTime": 1462060800,
      "timeout": 1493596800
    },
    "segsignal": {
      "status": "defined",
      "bit": 4,
      "startTime": 4294967295,
      "timeout": 4294967295
    },
    "testdummy": {
      "status": "failed",
      "bit": 28,
      "startTime": 1199145601,
      "timeout": 1230767999
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
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "method": "getbestblockhash" }'
```

```shell--cli
bcoin-cli rpc getbestblockhash
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getbestblockhash');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
"0000000000000225f8332239fe00b74c65f916ff71dde5dee33b72ddd3b0e237"
```

Returns Block Hash of the tip.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getblockcount


```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "method": "getblockcount" }'
```

```shell--cli
bcoin-cli rpc getbestblockhash
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getblockcount');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
1178418
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
blockhash='00000000e0290b7c66227c7499692aac5437860ee912424bf8eea3a3883a4e37';
verbose=1;
details=0;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getblock",
    "params": [ "'$blockhash'", "'$verbose'", "'$details'" ]
  }'
```

```shell--cli
bcoin-cli rpc getblock $blockhash $verbose $details
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getblock', [ blockhash, verbose, details ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "hash": "00000000e0290b7c66227c7499692aac5437860ee912424bf8eea3a3883a4e37",
  "confirmations": 1177921,
  "strippedsize": 2499,
  "size": 2499,
  "weight": 9996,
  "height": 502,
  "version": 1,
  "versionHex": "00000001",
  "merkleroot": "4f7a9087973b891fc86cc59fd9c2cb696f7a813360d3553626dc6c38909f9571",
  "coinbase": "3337346bde777ade327922b5deef5fb7f88e98cecb22",
  "tx": [
    "2a69b021fc6cbd61260767302781c85fb0873acf18980ea6187fc868e4a3e3f9",
    "c61f2ef26bb08dcf1e16db4fece56ac92a3acac24e4dac90315e5c0ad6af67e6",
    "ed8c8213cc2d214ad2f293caae99e26e2c59d158f3eda5d9c1292e0961e20e76",
    "21da008d1fddc1a067d2d6cd9bb6e78acb5bdc9560252c17cfd59c331dd5c2cf",
    "90cc439e0a03109c33c966d92ccd18b0509ef678458d85a097397ee9bfbd54c0",
    "1d67f7466fd711f8106fb437cb6a59b7ccd14cd6069edc132627a9fb01d4f09c",
    "402450f5b4cd794d4198f940977bf4291ce25a7ff8b157adf71c07ed065db380",
    "0173a5d24d393127d5e6fc043ff1a00dafc6a2777143cb98a803a0b6e8cd02c7",
    "86150a141ebe5903a5d31e701698a01d598b81f099ea7577dad73033eab02ef9"
  ],
  "time": 1296746959,
  "mediantime": 1296746728,
  "bits": 486604799,
  "difficulty": 1,
  "chainwork": "000000000000000000000000000000000000000000000000000001f701f701f7",
  "previousblockhash": "00000000c7f50b6dfac8b8a59e11b7e62f07fdef20597089b9c5d64ebfe6d682",
  "nextblockhash": "00000000f797111d0f67d7f08346757948e7c469f14cddbd1c3d0217306bf003"
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
blockheight=502;
verbose=1;
details=0;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getblockbyheight",
    "params": [ "'$blockheight'", "'$verbose'", "'$details'" ]
  }'
```

```shell--cli
bcoin-cli rpc getblockbyheight $blockheight $verbose $details
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getblockbyheight', [ blockheight, verbose, details ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "hash": "00000000e0290b7c66227c7499692aac5437860ee912424bf8eea3a3883a4e37",
  "confirmations": 1177921,
  "strippedsize": 2499,
  "size": 2499,
  "weight": 9996,
  "height": 502,
  "version": 1,
  "versionHex": "00000001",
  "merkleroot": "4f7a9087973b891fc86cc59fd9c2cb696f7a813360d3553626dc6c38909f9571",
  "coinbase": "3337346bde777ade327922b5deef5fb7f88e98cecb22",
  "tx": [
    "2a69b021fc6cbd61260767302781c85fb0873acf18980ea6187fc868e4a3e3f9",
    "c61f2ef26bb08dcf1e16db4fece56ac92a3acac24e4dac90315e5c0ad6af67e6",
    "ed8c8213cc2d214ad2f293caae99e26e2c59d158f3eda5d9c1292e0961e20e76",
    "21da008d1fddc1a067d2d6cd9bb6e78acb5bdc9560252c17cfd59c331dd5c2cf",
    "90cc439e0a03109c33c966d92ccd18b0509ef678458d85a097397ee9bfbd54c0",
    "1d67f7466fd711f8106fb437cb6a59b7ccd14cd6069edc132627a9fb01d4f09c",
    "402450f5b4cd794d4198f940977bf4291ce25a7ff8b157adf71c07ed065db380",
    "0173a5d24d393127d5e6fc043ff1a00dafc6a2777143cb98a803a0b6e8cd02c7",
    "86150a141ebe5903a5d31e701698a01d598b81f099ea7577dad73033eab02ef9"
  ],
  "time": 1296746959,
  "mediantime": 1296746728,
  "bits": 486604799,
  "difficulty": 1,
  "chainwork": "000000000000000000000000000000000000000000000000000001f701f701f7",
  "previousblockhash": "00000000c7f50b6dfac8b8a59e11b7e62f07fdef20597089b9c5d64ebfe6d682",
  "nextblockhash": "00000000f797111d0f67d7f08346757948e7c469f14cddbd1c3d0217306bf003"
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
blockheight=502;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getblockhash",
    "params": [ "'$blockheight'" ]
  }'
```

```shell--cli
bcoin-cli rpc getblockhash $blockheight
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getblockhash', [ blockheight ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
"00000000e0290b7c66227c7499692aac5437860ee912424bf8eea3a3883a4e37"
```

Returns block's hash by height.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockheight | Required | height of the block in the blockchain.



## getblockheader

```javascript
let blockhash, verbose;
```

```shell--vars
blockhash='00000000e0290b7c66227c7499692aac5437860ee912424bf8eea3a3883a4e37';
verbose=1;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getblockheader",
    "params": [ "'$blockhash'", "'$details'" ]
  }'
```

```shell--cli
bcoin-cli rpc getblockheader $blockhash $verbose
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getblockheader', [ blockheight, verbose ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "hash": "00000000e0290b7c66227c7499692aac5437860ee912424bf8eea3a3883a4e37",
  "confirmations": 1177934,
  "height": 502,
  "version": 1,
  "versionHex": "00000001",
  "merkleroot": "4f7a9087973b891fc86cc59fd9c2cb696f7a813360d3553626dc6c38909f9571",
  "time": 1296746959,
  "mediantime": 1296746728,
  "bits": 486604799,
  "difficulty": 1,
  "chainwork": "000000000000000000000000000000000000000000000000000001f701f701f7",
  "previousblockhash": "00000000c7f50b6dfac8b8a59e11b7e62f07fdef20597089b9c5d64ebfe6d682",
  "nextblockhash": "00000000f797111d0f67d7f08346757948e7c469f14cddbd1c3d0217306bf003"
}
```

Returns block's header by hash.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockheight | Required | height of the block in the blockchain.
2 | verbose | true | If set to false, it will return hex of the block.



## getchaintips

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getchaintips');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

Returns chaintips.

> The above command returns JSON "result" like this:

```json
[
  {
    "height": 1159071,
    "hash": "0000000000043bc8896351bf4fbb9fadfa596566e6d88078a2364252346e0d2a",
    "branchlen": 1,
    "status": "valid-headers"
  },
  {
    "height": 1158313,
    "hash": "0000000000011e8328cf0382888e07f207e178e967f896794d600e39c962362e",
    "branchlen": 1,
    "status": "valid-headers"
  },
  ...
]
```

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getdifficulty

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getdifficulty');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
1048576
```

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |

