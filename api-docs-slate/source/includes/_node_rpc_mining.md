# RPC Calls - Mining

*Note: many mining-related RPC calls require `bcoin` to be started with the flag `--coinbase-address` designating a comma-separated list of payout addresses, randomly selected during block creation*

## getnetworkhashps

```javascript
let blocks, height;
```

```shell--vars
blocks=120;
height=1000000;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getnetworkhashps",
    "params": [ '$blocks', '$height' ]
  }'
```

```shell--cli
bcoin-cli rpc getnetworkhashps $blocks $height
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
  const result = await client.execute('getnetworkhashps', [ blocks, height ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
453742051556.55084
```

Returns the estimated current or historical network hashes per second, based on last `blocks`.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blocks | 120 | Number of blocks to lookup.
2 | height | 1 | Starting height for calculations.



## getmininginfo

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getmininginfo",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getmininginfo
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
  const result = await client.execute('getmininginfo', []);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "blocks": 101,
  "currentblocksize": 0,
  "currentblockweight": 0,
  "currentblocktx": 0,
  "difficulty": 0,
  "errors": "",
  "genproclimit": 0,
  "networkhashps": 8.766601909687916e-7,
  "pooledtx": 0,
  "testnet": true,
  "chain": "regtest",
  "generate": false
}

```

Returns mining info.

*Note: currentblocksize, currentblockweight, currentblocktx, difficulty are returned when there's active work.*
*generate - is true when `bcoin` itself is mining.*

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getwork

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getwork",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getwork
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
  const result = await client.execute('getwork');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "data": "200000001072adb70d69fc2b5a6601eeaaa54e31b7c57417028b429a0b98aa374413799c12c94351d52da980c8fa67eaddf6053dee141b14f4e6a3e10bb7db21c0d533b05b05ec88207fffff00000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000",
  "target": "0000000000000000000000000000000000000000000000000000000000ffff7f",
  "height": 102
}
```

Returns hashing work to be solved by miner.
Or submits solved block.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | data | | Data to be submitted to the network.

## getworklp

```shell--curl
# Because there is a request timeout set on CLI http requests.
# without manually adjusting the timeout (or receiving a new transaction on the current
# network) this call will timeout before the request is complete.
curl $url \
  -X POST \
  --data '{
    "method": "getworklp",
    "params": []
  }'
```

```shell--cli
# Because there is a request timeout set on CLI http requests.
# without manually adjusting the timeout (or receiving a new transaction on the current
# network) this call will timeout before the request is complete.
bcoin-cli rpc getworklp
```

```javascript
// Because there is a request timeout set on CLI http requests.
// without manually adjusting the timeout (or receiving a new transaction on the current
// network) this call will timeout before the request is complete.
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
  const result = await client.execute('getworklp');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "data": "200000001072adb70d69fc2b5a6601eeaaa54e31b7c57417028b429a0b98aa374413799c09e651f7a930c198755993bf7348fd807836d1560b6baded56857def309a03855b05ecf1207fffff00000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000",
  "target": "0000000000000000000000000000000000000000000000000000000000ffff7f",
  "height": 102
}
```

Long polling for new work.

Returns new work, whenever new TX is received in the mempool or
new block has been discovered. So miner can restart mining on new data.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getblocktemplate

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getblocktemplate",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getblocktemplate
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
  const result = await client.execute('getblocktemplate');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
{
  "capabilities": [
    "proposal"
  ],
  "mutable": [
    "time",
    "transactions",
    "prevblock"
  ],
  "version": 536870912,
  "rules": [],
  "vbavailable": {},
  "vbrequired": 0,
  "height": 102,
  "previousblockhash": "4413799c0b98aa37028b429ab7c57417aaa54e315a6601ee0d69fc2b1072adb7",
  "target": "7fffff0000000000000000000000000000000000000000000000000000000000",
  "bits": "207fffff",
  "noncerange": "00000000ffffffff",
  "curtime": 1527115118,
  "mintime": 1527103506,
  "maxtime": 1527122318,
  "expires": 1527122318,
  "sigoplimit": 20000,
  "sizelimit": 1000000,
  "longpollid": "4413799c0b98aa37028b429ab7c57417aaa54e315a6601ee0d69fc2b1072adb700000003",
  "submitold": false,
  "coinbaseaux": {
    "flags": "6d696e65642062792062636f696e"
  },
  "coinbasevalue": 5000016600,
  "transactions": [
    {
      "data": "01000000017efbcc72a5733c7b9bcb1b763a81480425425bc10a4157e9553f0fd32eda710b000000006a47304402206a04f6c4fa9be51206e3fb9a48c5960198d7b27ce1b7c1915a4535e63ffdc60b022050796a1e0c09f60384379c2a477bedbce548cbaaa0e42183b737115b4ea77c5d0121020987e993a946a058d0969bd296b08783229fd1a0a779d8bfb376ebe30a164e89ffffffff02005a6202000000001976a914fe7e0711287688b33b9a5c239336c4700db34e6388ac4486a327010000001976a914b1a4d7b11dad88f767d0ad894e11b53d766400a888ac00000000",
      "txid": "7444ea74eaee01ed7c7871f355bb5cb244a4ef2c05ae16ad49b4b06cbf34f539",
      "hash": "7444ea74eaee01ed7c7871f355bb5cb244a4ef2c05ae16ad49b4b06cbf34f539",
      "depends": [],
      "fee": 4540,
      "sigops": 2,
      "weight": 900
    },
    {
      "data": "0100000002e8d187daf94405848c2446bde3689be4ebc93dd103748e388b7c7655660d690e000000006b483045022100eeae86adccb31514ca25d3ddf265b21de05230fd6c93db7fbd185c133647fe640220392c3b5ebd50f4f0538c686b88e1d7051a81c2e5dff8c96f2a5c61154fa3c43a0121032cbf9d9b3beb61004d158ae897257fab6ce46efbad6b1e51b4a64e74732c3b4dffffffffeaefefbd1f687ef4e861804aed59ef05e743ea85f432cc146f325d759a026ce6000000006a47304402203e3ca4312bee4c465e6d5fcaee7aae1301d043444fe7a8f20b7df9f555ca1b4f022060104fc66cdb68af8cc674e94bb1900328cda94a8f6580d12ef0ad9810f24a290121032cbf9d9b3beb61004d158ae897257fab6ce46efbad6b1e51b4a64e74732c3b4dffffffff0220a6c901000000001976a914253d160f8a14c9586c9204553b50b279c71d2c8888ac005a6202000000001976a914fe7e0711287688b33b9a5c239336c4700db34e6388ac00000000",
      "txid": "c0f7dc9540629f6e1623cb25edba1d07cab4dd441b71cd247e629a6d817ed1ad",
      "hash": "c0f7dc9540629f6e1623cb25edba1d07cab4dd441b71cd247e629a6d817ed1ad",
      "depends": [],
      "fee": 7520,
      "sigops": 2,
      "weight": 1492
    },
    {
      "data": "0100000001e8d187daf94405848c2446bde3689be4ebc93dd103748e388b7c7655660d690e010000006b483045022100977567f80741451fe1407fbe453e75d371cc38a0de1411efc7df5c8c3c35d8ec02207a5899976628c19a22dae0058f60f86f43b379991bbf93383b17932310e497b001210284a937f256393b3ba686556e90bd000706600bdbee4169abd092f392689307d2ffffffff02005a6202000000001976a914fe7e0711287688b33b9a5c239336c4700db34e6388ac545ead21010000001976a914520b23898b775a4a5dc19d07a88ca4a4a87b92bf88ac00000000",
      "txid": "fa36691ec5f18a9dc56b1dfce3dff293352ebde8bc1b77489cba4921bc5b0c69",
      "hash": "fa36691ec5f18a9dc56b1dfce3dff293352ebde8bc1b77489cba4921bc5b0c69",
      "depends": [],
      "fee": 4540,
      "sigops": 2,
      "weight": 904
    }
  ]
}
```

returns block template or proposal for use with mining.
Also validates proposal if `mode` is specified as `proposal`.

*Note: This is described in
[BIP22 - Fundamentals](https://github.com/bitcoin/bips/blob/master/bip-0022.mediawiki),
[BIP23 - Pooled Mining](https://github.com/bitcoin/bips/blob/master/bip-0023.mediawiki),
[BIP145 - Updates for Segregated Witness](https://github.com/bitcoin/bips/blob/master/bip-0145.mediawiki)*

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1  | jsonrequestobject | {} | JSONRequestObject.



## submitblock

```javascript
let blockdata;
```

```shell--vars
blockdata='000000203f6397a1442eb6a9901998c4a4b432f8573c7a490b2d5e6d6f2ad0d0fca25e2c56940d79c8f81f3eb5e998bcf79dbf8c7d3b13b01adaac526cf9df8ee385ec0c1ac0055bffff7f20000000000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f01640e6d696e65642062792062636f696e046c62c046080000000000000000ffffffff0100f2052a010000001976a91473815900ee35f3815b3407af2eeb1b611cf533d788ac00000000';
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "submitblock",
    "params": [ "'$blockdata'" ]
  }'
```

```shell--cli
bcoin-cli rpc submitblock $blockdata
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
  const result = await client.execute('submitblock', [ blockdata ]);
  console.log(result);
})();
```

Adds block to chain.


### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1  | blockdata | Required. | Mined block data (hex)

## verifyblock

```javascript
let blockdata;
```

```shell--vars
blockdata='000000203f6397a1442eb6a9901998c4a4b432f8573c7a490b2d5e6d6f2ad0d0fca25e2c56940d79c8f81f3eb5e998bcf79dbf8c7d3b13b01adaac526cf9df8ee385ec0c1ac0055bffff7f20000000000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f01640e6d696e65642062792062636f696e046c62c046080000000000000000ffffffff0100f2052a010000001976a91473815900ee35f3815b3407af2eeb1b611cf533d788ac00000000';
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "verifyblock",
    "params": [ "'$blockdata'" ]
  }'
```

```shell--cli
bcoin-cli rpc verifyblock $blockdata
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
  // Block data is old, so it should return error
  const result = await client.execute('verifyblock', [ blockdata ]);
  console.log(result);
})();
```

Verifies the block data.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1  | blockdata | Required. | Mined block data (hex)





## setgenerate

```javascript
let mining, proclimit;
```

```shell--vars
mining=1;
proclimit=1;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "setgenerate",
    "params": [ '$mining', '$proclimit' ]
  }'
```

```shell--cli
bcoin-cli rpc setgenerate $mining $proclimit
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
  const result = await client.execute('setgenerate', [ mining, proclimit ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
true
```

Will start the mining on CPU.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1  | mining | 0 | `true` will start mining, `false` will stop.
2 | proclimit | 0 |



## getgenerate

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "getgenerate",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc getgenerate
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
  const result = await client.execute('getgenerate');
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
true
```

Returns status of mining on Node.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None.



## generate

```javascript
let numblocks;
```

```shell--vars
numblocks=2;
```

```shell--curl
curl $url \
  -X POST \
  --data '{
    "method": "generate",
    "params": [ '$numblocks' ]
  }'
```

```shell--cli
bcoin-cli rpc generate $numblocks
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
  // Timeout error
  const result = await client.execute('generate', [ numblocks ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  "11c5504f63aebe71b3e6f46a31f83dd24e65e392a11e905f6acdb7346c8b18c0",
  "64455db5aa23d6277027aea1851d85da8ee07958ed7caee2ca630b065f4faaa8"
]
```

Mines `numblocks` number of blocks. Will return once all blocks are mined. CLI command may
timeout before that happens.


### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | numblocks | 1 | Number of blocks to mine.
2 | maxtries |



## generatetoaddress

```javascript
let numblocks, address;
```

```shell--vars
numblocks=2;
address='RTZJdYScA7uGb5pbQPEczpDmq9HiYLv2fJ';
```

```shell--curl
# Will return once all blocks are mined.
curl $url \
  -X POST \
  --data '{
    "method": "generatetoaddress",
    "params": [ '$numblocks', "'$address'" ]
  }'
```

```shell--cli
# Timeout error
bcoin-cli rpc generatetoaddress $numblocks $address
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
  // Timeout error
  const result = await client.execute('generatetoaddress', [ numblocks, address ]);
  console.log(result);
})();
```

> The above command returns JSON "result" like this:

```json
[
  "65e54939c20f61e54173596eb72a7b00b96baac0c58d2cb30d1fad64d1b51dbb",
  "3959ee3f58bb1ac05af9bebb51ebf7872bcd4231fa41c384bcfef468541b5166"
]
```
Mines `blocknumber` blocks, with `address` as coinbase.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | numblocks | 1 | Number of blocks to mine.
2 | address | | Coinbase address for new blocks.
