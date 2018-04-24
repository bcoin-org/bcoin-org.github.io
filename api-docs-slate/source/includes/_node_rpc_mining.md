# RPC Calls - Mining

## getnetworkhashps

```javascript
let blocks, height;
```

```shell--vars
blocks=120;
height=1000000;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getnetworkhashps",
    "params": [ "'$blocks'", "'$height'" ]
  }'
```

```shell--cli
bcoin-cli rpc getnetworkhashps $blocks $height
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getnetworkhashps', [ blocks, height ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
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
curl $url/ \
  -H 'Content-Type: application/json' \
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getmininginfo', []);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "blocks": 1178789,
  "currentblocksize": 11895,
  "currentblockweight": 47580,
  "currentblocktx": 35,
  "difficulty": 1048576,
  "errors": "",
  "genproclimit": 0,
  "networkhashps": 10880012194348.812,
  "pooledtx": 34,
  "testnet": true,
  "chain": "test",
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
curl $url/ \
  -H 'Content-Type: application/json' \
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getwork');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "data": "2000000082c18ff1d76f61dccbf37d5eca24d252c009af5f622ce08700000580000000009f447a03a1df9ae8f1ee24f0cf5ab69f1b321071f0e57344f2c61b922c12b8335994bdb51a0ffff000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000",
  "target": "0000000000000000000000000000000000000000000000f0ff0f000000000000",
  "height": 1178782
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
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getworklp",
    "params": []
  }'
```

```shell--cli
# Because there is a request timeout set on CLI http requests
# without manually adjusting the timeout, this call will timeout before the request is complete
bcoin-cli rpc getworklp
```

```javascript
// Because there is a request timeout set on CLI http requests
// without manually adjusting the timeout, this call will timeout before the request is complete
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getworklp');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "data": "2000000082c18ff1d76f61dccbf37d5eca24d252c009af5f622ce08700000580000000009f447a03a1df9ae8f1ee24f0cf5ab69f1b321071f0e57344f2c61b922c12b8335994bdb51a0ffff000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000",
  "target": "0000000000000000000000000000000000000000000000f0ff0f000000000000",
  "height": 1178782
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
curl $url/ \
  -H 'Content-Type: application/json' \
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getblocktemplate');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
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
  "rules": [
    "csv",
    "!segwit"
  ],
  "vbavailable": {},
  "vbrequired": 0,
  "height": 1178933,
  "previousblockhash": "0000000000000e19ff0c98e7d99987071a791c47338f71389342f7457eeb8695",
  "target": "0000000000000ffff00000000000000000000000000000000000000000000000",
  "bits": "1a0ffff0",
  "noncerange": "00000000ffffffff",
  "curtime": 1502974969,
  "mintime": 1502974260,
  "maxtime": 1502982169,
  "expires": 1502982169,
  "sigoplimit": 80000,
  "sizelimit": 4000000,
  "weightlimit": 4000000,
  "longpollid": "0000000000000e19ff0c98e7d99987071a791c47338f71389342f7457eeb86950000000018",
  "submitold": false,
  "coinbaseaux": {
    "flags": "62636f696e206d6163626f6f6b"
  },
  "coinbasevalue": 156465644,
  "default_witness_commitment": "6a24aa21a9edc9f8a77e851392ce58c6b5c64fafbebd76e92c03a198d1e2c942d71fe05c7bc4",
  "transactions": [
    {
      "data": "010000000194a1dd786bc486412dd4125c90eeac0550131b7ffee190d3c8bce92007dfe682000000006b483045022100e2ee65fcdb3c005e430c279e759764937e70993c3a97c21b8580b16146766cdc022044cbb4a09ce4ed4f9c6be14befb6fbccd7819814073f33220e076ced7b103fca01210396e891cf6f1e71e1a266abd3c1e990331da6dc2d3b41e53c6e991f66262f2f32ffffffff022aee0500000000001976a914a21138d3322b67910f66f676396ea432faee34cb88aca0860100000000001976a91494178f0b288078717873b4228e2aad27b91a492188ac00000000",
      "txid": "809c3d8fb6524acc4ffcaeb2a97ccb1c4c1124ccc5034745ba6ac43f8d4d63c9",
      "hash": "809c3d8fb6524acc4ffcaeb2a97ccb1c4c1124ccc5034745ba6ac43f8d4d63c9",
      "depends": [],
      "fee": 11350,
      "sigops": 8,
      "weight": 904
    },
    ...
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
blockdata='0100000082d6e6bf4ed6c5b989705920effd072fe6b7119ea5b8c8fa6d0bf5c70000000071959f90386cdc263655d36033817a6f69cbc2d99fc56cc81f893b9787907a4fcfc94a4dffff001d000f90930901000000010000000000000000000000000000000000000000000000000000000000000000ffffffff163337346bde777ade327922b5deef5fb7f88e98cecb22ffffffff01800c0c2a0100000023210207a8b8758b4886d85b7f94fbd9cacb3452c5e643dc3188a1dbea8d1a1dd4bbc3ac0000000001000000017c9665a50c9bcc8c359c58ffd511d8cfe122b440cdb6ad864a43f1644eb31fe6000000006b48304502201569b4872c3639811ab467ec559416c1006d257a5d6fea103a41a408dd8a5682022100c1a3c90cbd148a4ca69189c88d059e2af8268807982d89b76725d38f65494f5201210394afa526e43a0e03f5aaa2a55312f6c25a9b5fedd66e7f4e4847af79d517c5f5ffffffff02bc80b01f010000001976a91451513561deaa318f4a3ad2bfccc889225499194388ac359a0300000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac0000000001000000035f836b328d40944483c39c90cb4dfd3d9b83f96d71586b3230118629fb7893f7000000006a473044022076232b5d3b8372da7e0a5b58614676b6ad77debf0ed75a5996f9b91642326059022037e2ee19b56916465e9c76e7e1d558a64738e7444649144bf7e19143423aee1401210281392a2cd37ac1108b8bc0f647784f66017fd837379e6fc2109f1793f5dccfdbffffffff58bd81fd34d42c015ac22537440c49450453e8284b717667c418ed7dc3693579000000006b48304502200352ee3028c8c4ff14574e71837a2e68b1c285dd57b993e19d9b24728161409f022100d7cd062e64e57200bf1ffa0fbd41726a67cfe547849b0fcfe72556fb42596d630121039bd575a5913e93d227afa8e65c5c37954688e53e069980e4790aba8652d9d557ffffffff8a64fa7fb31eff45e2145ba1d09a4ac627e259d14a3b9154c510d44c9954f3c1000000006a473044022044e97e0e287472385c60c68f4e16a73e3e6d7fcb1bc3700fa7c36c4fb653e1cb022034c624487aedb8bc3c86b02d0338b10922fa1c6c8fd8c39eaf64564d62289fe101210370410acad1e5601c9e8e8968ccf648daab3902744091c19b29a17c8e2cf92132ffffffff0268911d00000000001976a91480cac4151b3a9ceffaee95018f0ca3d202a71b2c88ac334f1000000000001976a914cd4529e867a0b96d43e358998387b06fc3e06e8c88ac0000000001000000015f836b328d40944483c39c90cb4dfd3d9b83f96d71586b3230118629fb7893f701000000fd3301347b3d4a6f10829e9c617770a52f2334a434677a08ac775c968b3097b1353d1e1a10b53099a2003c7cb03a5152690e687e191a990048304502201613b0ce320ccc1d206a03f67fecf6d1b31fdd23e51923a821fda745c23cd4db022100854bdd81256edfac75ac7dc9d0b073118b5879f50b26021eeffa4d126f39cf7301493046022100bce73cabbb1d4bca0ee33b241bc526cbb6c17f219057a58993738d614c898e0f022100b9aa31160b3bc6e2bf2e33240ea8543a9f54551b78c7cb268e72a3cee45cc5a3014c69522102ca2a810ab17249b6033a038de563983881b4069270183f3c0aba945653e442162103f480f1b648d0d5167804ad4d586e0e757cc33fde0e133fd036e45d60d2db59e12103c18131d8de99d45fb72a774cab0ccc258cd2abd9605610da20b9a232c88a3cb653aeffffffff025e310100000000001976a91445c502d496058c41721e06c6ebd5a8580dd66d8488ac78940100000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac000000000100000001e667afd60a5c5e3190ac4d4ec2ca3a2ac96ae5ec4fdb161ecf8db06bf22e1fc6000000006b483045022100a0cc8f57d5a171aa4a5d3c963640039e11c5dac38820eb90c284eb360326041d02202917e30b20178f9c4464d44f956aa8105b83b24f4a0f011ca380b35f31c6bcf20121029e6f1aaf22a7114a000627eba8b2990c86136e7fab46dffccf1a33a505d039f6ffffffff024c79a81f010000001976a914a196eec6c686089ffcc8a9d4077643ede546535088ac204407000000000017a914184cd0a38ac3b1357d07179553788375a9e8a3b887000000000100000001c054bdbfe97e3997a0858d4578f69e50b018cd2cd966c9339c10030a9e43cc90000000006a47304402201feccc650991032dc98ed330aaa68840feac3e0ae568d674ebc480d8f810eedf02205b06d5dce842cb5f684fb6816d61425d5533cc73b05cbdf2a1552699da98f97d01210391af1358729c7ea974cf76e43a125158687550610108791a1563be587e48bf9affffffff02a194a41f010000001976a914bdfa420798058a37dd0c37ba1d38f103a793649c88ac5b210300000000001976a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac0000000001000000019cf0d401fba9272613dc9e06d64cd1ccb7596acb37b46f10f811d76f46f7671d000000006b48304502202599390550a38555ae661be940716ac669c7493e34216a71ca86d069636d6e3a022100ae406057ec3f60f9e3410360facf1bd1f59b1e4cc27a2b4ba67e325658319b390121032165eff60895ce9b519aa327adc44e4867b3aa5998d8bdb0e277da3fa67873a3ffffffff024e55991f010000001976a9149c5c9a7c09d843b451eaa0c7cbf866623405babf88ac037c0a000000000017a914a4b7adff15fec83376d5e4468afeed627abe1ed88700000000010000000180b35d06ed071cf7ad57b1f87f5ae21c29f47b9740f998414d79cdb4f5502440000000006c4930460221009014b9cb28077036096492e8c0a46bd8aa6d43758fc211817d22e0401db5a0300221008c23434e440108b2d0dce98a0647bab603e8e876467ecb339201473054ff80650121023cf5ef93ca567172647fad0e3b1cb0456cbfad88e4f65e286471ed93fba66a10ffffffff024a2e8c1f010000001976a914bc7aad9746a0bc03ed9715f13c94e554df90b84688acb4630c00000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac000000000100000001c702cde8b6a003a898cb437177a2c6af0da0f13f04fce6d52731394dd2a57301000000006c493046022100be75ae6dbf9eab7656562136511501c83918ca28c5f96565ca1960b3dbb581b6022100d15692af456e8721fddeeb0d6df5d8a147afd8a3b2a39bbceae9b1bdfd53ade20121038e297cf2cf71c16592c36ca48f5b2a5bbb73e776e772079f4c695b12eec1a509ffffffff023b37871f010000001976a914682215dfa6912d88f55a1853414d516122fcc66988acbf330400000000001976a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac00000000';
```

```shell--curl
# Block data is old, so it should return error
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "submitblock",
    "params": [ "'$blockdata'" ]
  }'
```

```shell--cli
# Block data is old, so it should return error
bcoin-cli rpc submitblock $blockdata
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  // Block data is old, so it should return error
  const res = await rpc.execute('submitblock', [ blockdata ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
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
blockdata='0100000082d6e6bf4ed6c5b989705920effd072fe6b7119ea5b8c8fa6d0bf5c70000000071959f90386cdc263655d36033817a6f69cbc2d99fc56cc81f893b9787907a4fcfc94a4dffff001d000f90930901000000010000000000000000000000000000000000000000000000000000000000000000ffffffff163337346bde777ade327922b5deef5fb7f88e98cecb22ffffffff01800c0c2a0100000023210207a8b8758b4886d85b7f94fbd9cacb3452c5e643dc3188a1dbea8d1a1dd4bbc3ac0000000001000000017c9665a50c9bcc8c359c58ffd511d8cfe122b440cdb6ad864a43f1644eb31fe6000000006b48304502201569b4872c3639811ab467ec559416c1006d257a5d6fea103a41a408dd8a5682022100c1a3c90cbd148a4ca69189c88d059e2af8268807982d89b76725d38f65494f5201210394afa526e43a0e03f5aaa2a55312f6c25a9b5fedd66e7f4e4847af79d517c5f5ffffffff02bc80b01f010000001976a91451513561deaa318f4a3ad2bfccc889225499194388ac359a0300000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac0000000001000000035f836b328d40944483c39c90cb4dfd3d9b83f96d71586b3230118629fb7893f7000000006a473044022076232b5d3b8372da7e0a5b58614676b6ad77debf0ed75a5996f9b91642326059022037e2ee19b56916465e9c76e7e1d558a64738e7444649144bf7e19143423aee1401210281392a2cd37ac1108b8bc0f647784f66017fd837379e6fc2109f1793f5dccfdbffffffff58bd81fd34d42c015ac22537440c49450453e8284b717667c418ed7dc3693579000000006b48304502200352ee3028c8c4ff14574e71837a2e68b1c285dd57b993e19d9b24728161409f022100d7cd062e64e57200bf1ffa0fbd41726a67cfe547849b0fcfe72556fb42596d630121039bd575a5913e93d227afa8e65c5c37954688e53e069980e4790aba8652d9d557ffffffff8a64fa7fb31eff45e2145ba1d09a4ac627e259d14a3b9154c510d44c9954f3c1000000006a473044022044e97e0e287472385c60c68f4e16a73e3e6d7fcb1bc3700fa7c36c4fb653e1cb022034c624487aedb8bc3c86b02d0338b10922fa1c6c8fd8c39eaf64564d62289fe101210370410acad1e5601c9e8e8968ccf648daab3902744091c19b29a17c8e2cf92132ffffffff0268911d00000000001976a91480cac4151b3a9ceffaee95018f0ca3d202a71b2c88ac334f1000000000001976a914cd4529e867a0b96d43e358998387b06fc3e06e8c88ac0000000001000000015f836b328d40944483c39c90cb4dfd3d9b83f96d71586b3230118629fb7893f701000000fd3301347b3d4a6f10829e9c617770a52f2334a434677a08ac775c968b3097b1353d1e1a10b53099a2003c7cb03a5152690e687e191a990048304502201613b0ce320ccc1d206a03f67fecf6d1b31fdd23e51923a821fda745c23cd4db022100854bdd81256edfac75ac7dc9d0b073118b5879f50b26021eeffa4d126f39cf7301493046022100bce73cabbb1d4bca0ee33b241bc526cbb6c17f219057a58993738d614c898e0f022100b9aa31160b3bc6e2bf2e33240ea8543a9f54551b78c7cb268e72a3cee45cc5a3014c69522102ca2a810ab17249b6033a038de563983881b4069270183f3c0aba945653e442162103f480f1b648d0d5167804ad4d586e0e757cc33fde0e133fd036e45d60d2db59e12103c18131d8de99d45fb72a774cab0ccc258cd2abd9605610da20b9a232c88a3cb653aeffffffff025e310100000000001976a91445c502d496058c41721e06c6ebd5a8580dd66d8488ac78940100000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac000000000100000001e667afd60a5c5e3190ac4d4ec2ca3a2ac96ae5ec4fdb161ecf8db06bf22e1fc6000000006b483045022100a0cc8f57d5a171aa4a5d3c963640039e11c5dac38820eb90c284eb360326041d02202917e30b20178f9c4464d44f956aa8105b83b24f4a0f011ca380b35f31c6bcf20121029e6f1aaf22a7114a000627eba8b2990c86136e7fab46dffccf1a33a505d039f6ffffffff024c79a81f010000001976a914a196eec6c686089ffcc8a9d4077643ede546535088ac204407000000000017a914184cd0a38ac3b1357d07179553788375a9e8a3b887000000000100000001c054bdbfe97e3997a0858d4578f69e50b018cd2cd966c9339c10030a9e43cc90000000006a47304402201feccc650991032dc98ed330aaa68840feac3e0ae568d674ebc480d8f810eedf02205b06d5dce842cb5f684fb6816d61425d5533cc73b05cbdf2a1552699da98f97d01210391af1358729c7ea974cf76e43a125158687550610108791a1563be587e48bf9affffffff02a194a41f010000001976a914bdfa420798058a37dd0c37ba1d38f103a793649c88ac5b210300000000001976a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac0000000001000000019cf0d401fba9272613dc9e06d64cd1ccb7596acb37b46f10f811d76f46f7671d000000006b48304502202599390550a38555ae661be940716ac669c7493e34216a71ca86d069636d6e3a022100ae406057ec3f60f9e3410360facf1bd1f59b1e4cc27a2b4ba67e325658319b390121032165eff60895ce9b519aa327adc44e4867b3aa5998d8bdb0e277da3fa67873a3ffffffff024e55991f010000001976a9149c5c9a7c09d843b451eaa0c7cbf866623405babf88ac037c0a000000000017a914a4b7adff15fec83376d5e4468afeed627abe1ed88700000000010000000180b35d06ed071cf7ad57b1f87f5ae21c29f47b9740f998414d79cdb4f5502440000000006c4930460221009014b9cb28077036096492e8c0a46bd8aa6d43758fc211817d22e0401db5a0300221008c23434e440108b2d0dce98a0647bab603e8e876467ecb339201473054ff80650121023cf5ef93ca567172647fad0e3b1cb0456cbfad88e4f65e286471ed93fba66a10ffffffff024a2e8c1f010000001976a914bc7aad9746a0bc03ed9715f13c94e554df90b84688acb4630c00000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac000000000100000001c702cde8b6a003a898cb437177a2c6af0da0f13f04fce6d52731394dd2a57301000000006c493046022100be75ae6dbf9eab7656562136511501c83918ca28c5f96565ca1960b3dbb581b6022100d15692af456e8721fddeeb0d6df5d8a147afd8a3b2a39bbceae9b1bdfd53ade20121038e297cf2cf71c16592c36ca48f5b2a5bbb73e776e772079f4c695b12eec1a509ffffffff023b37871f010000001976a914682215dfa6912d88f55a1853414d516122fcc66988acbf330400000000001976a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac00000000';
```

```shell--curl
# Block data is old, so it should return error
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "verifyblock",
    "params": [ "'$blockdata'" ]
  }'
```

```shell--cli
# Block data is old, so it should return error
bcoin-cli rpc verifyblock $blockdata
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  // Block data is old, so it should return error
  const res = await rpc.execute('verifyblock', [ blockdata ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
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
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "setgenerate",
    "params": [ "'$mining'", "'$proclimit'" ]
  }'
```

```shell--cli
bcoin-cli rpc setgenerate $mining $proclimit
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('setgenerate', [ mining, proclimit ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
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
curl $url/ \
  -H 'Content-Type: application/json' \
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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getgenerate');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
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
# Will return once all blocks are mined.
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "generate",
    "params": [ "'$numblocks'" ]
  }'
```

```shell--cli
# Timeout error
bcoin-cli rpc generate $numblocks
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  // Timeout error
  const res = await rpc.execute('generate', [ numblocks ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
[
  "0aac2269ce67d5bda3743b1a179a7824f17b3b6df011befd7bd224cb958bd4ec",
  "0871f1a42279397b7508c75e142b903a945a19af08c6de6970e266255d10f08f"
]
```

Mines `numblocks` number of blocks.

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
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "generatetoaddress",
    "params": [ "'$numblocks'", "'$address'" ]
  }'
```

```shell--cli
# Timeout error
bcoin-cli rpc generatetoaddress $numblocks $address
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  // Timeout error
  const res = await rpc.execute('generatetoaddress', [ numblocks, address ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
[
  "0aac2269ce67d5bda3743b1a179a7824f17b3b6df011befd7bd224cb958bd4ec",
  "0871f1a42279397b7508c75e142b903a945a19af08c6de6970e266255d10f08f"
]
```
Mines `blocknumber` blocks, with `address` as coinbase.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | numblocks | 1 | Number of blocks to mine.
2 | address | | Coinbase address for new blocks.
