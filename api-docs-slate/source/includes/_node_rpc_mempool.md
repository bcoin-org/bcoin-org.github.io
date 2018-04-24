# RPC Calls - Mempool

## getmempoolinfo

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getmempoolinfo"
  }'
```

```shell--cli
bcoin-cli rpc getmempoolinfo
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getmempoolinfo');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "size": 20,
  "bytes": 68064,
  "usage": 68064,
  "maxmempool": 100000000,
  "mempoolminfee": 0.00001
}
```

Returns informations about mempool.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## getmempoolancestors

```javascript
let txhash, verbose;
```

```shell--vars
txhash='939a3b8485b53a718d89e7e4412473b3762fa1d9bbd555fc8b01e73be0ab1881';
verbose=1;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getmempoolancestors",
    "params": [ "'$txhash'", "'$verbose'" ]
  }'
```

```shell--cli
bcoin-cli rpc getmempoolancestors $txhash $verbose
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getmempoolancestors', [ txhash, verbose ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
// verbose=1
[
  {
    "size": 225,
    "fee": 0.0000454,
    "modifiedfee": 0,
    "time": 1502891340,
    "height": 201,
    "startingpriority": 0,
    "currentpriority": 0,
    "descendantcount": 1,
    "descendantsize": 451,
    "descendantfees": 9080,
    "ancestorcount": 0,
    "ancestorsize": 0,
    "ancestorfees": 0,
    "depends": []
  }
]
```

```json
// verbose=0
[
  "56ab7663c80cb6ffc9f8a4b493d77b2e6f52ae8ff64eefa8899c2065922665c8"
]
```

returns all in-mempool ancestors for a transaction in the mempool.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txhash | Required | Transaction Hash
2 | verbose | false | False returns only tx hashs, true - returns dependency tx info



## getmempooldescendants

```javascript
let txhash, verbose;
```

```shell--vars
txhash='56ab7663c80cb6ffc9f8a4b493d77b2e6f52ae8ff64eefa8899c2065922665c8';
verbose=1;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getmempooldescendants",
    "params": [ "'$txhash'", "'$verbose'" ]
  }'
```

```shell--cli
bcoin-cli rpc getmempooldescendants $txhash $verbose
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getmempooldescendants', [ txhash, verbose ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
// verbose=1
[
  {
    "size": 226,
    "fee": 0.0000454,
    "modifiedfee": 0,
    "time": 1502891378,
    "height": 201,
    "startingpriority": 0,
    "currentpriority": 0,
    "descendantcount": 0,
    "descendantsize": 226,
    "descendantfees": 4540,
    "ancestorcount": 1,
    "ancestorsize": 0,
    "ancestorfees": 0,
    "depends": [
      "56ab7663c80cb6ffc9f8a4b493d77b2e6f52ae8ff64eefa8899c2065922665c8"
    ]
  }
]
```

```json
// verbose=0
[
  "939a3b8485b53a718d89e7e4412473b3762fa1d9bbd555fc8b01e73be0ab1881"
]
```

returns all in-mempool descendants for a transaction in the mempool.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txhash | Required | Transaction hash
2 | verbose | false | False returns only tx hashs, true - returns dependency tx info



## getmempoolentry

```javascript
let txhash;
```

```shell--vars
txhash='939a3b8485b53a718d89e7e4412473b3762fa1d9bbd555fc8b01e73be0ab1881';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getmempoolentry",
    "params": [ "'$txhash'" ]
  }'
```

```shell--cli
bcoin-cli rpc getmempoolentry $txhash
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getmempoolentry', [ txhash ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "size": 226,
  "fee": 0.0000454,
  "modifiedfee": 0,
  "time": 1502891378,
  "height": 201,
  "startingpriority": 0,
  "currentpriority": 0,
  "descendantcount": 0,
  "descendantsize": 226,
  "descendantfees": 4540,
  "ancestorcount": 1,
  "ancestorsize": 0,
  "ancestorfees": 0,
  "depends": [
    "56ab7663c80cb6ffc9f8a4b493d77b2e6f52ae8ff64eefa8899c2065922665c8"
  ]
}
```

returns mempool transaction info by its hash.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txhash | Required | Transaction Hash



## getrawmempool

```javascript
let verbose;
```

```shell--vars
verbose=1;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "getrawmempool",
    "params": [ "'$verbose'" ]
  }'
```

```shell--cli
bcoin-cli rpc getrawmempool $verbose
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('getrawmempool', [ verbose ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "56ab7663c80cb6ffc9f8a4b493d77b2e6f52ae8ff64eefa8899c2065922665c8": {
    "size": 225,
    "fee": 0.0000454,
    "modifiedfee": 0,
    "time": 1502891340,
    "height": 201,
    "startingpriority": 0,
    "currentpriority": 0,
    "descendantcount": 1,
    "descendantsize": 451,
    "descendantfees": 9080,
    "ancestorcount": 0,
    "ancestorsize": 0,
    "ancestorfees": 0,
    "depends": []
  },
  "939a3b8485b53a718d89e7e4412473b3762fa1d9bbd555fc8b01e73be0ab1881": {
    "size": 226,
    "fee": 0.0000454,
    "modifiedfee": 0,
    "time": 1502891378,
    "height": 201,
    "startingpriority": 0,
    "currentpriority": 0,
    "descendantcount": 0,
    "descendantsize": 226,
    "descendantfees": 4540,
    "ancestorcount": 1,
    "ancestorsize": 0,
    "ancestorfees": 0,
    "depends": [
      "56ab7663c80cb6ffc9f8a4b493d77b2e6f52ae8ff64eefa8899c2065922665c8"
    ]
  }
}
```

Returns mempool detailed information (on verbose).
Or mempool tx list.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | verbose | false | False returns only tx hashs, true - returns full tx info



## prioritisetransaction

```javascript
let txhash, priorityDelta, feeDelta;
```

```shell--vars
txhash='';
priorityDelta=1000;
feeDelta=1000;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "prioritisetransaction",
    "params": [ "'$txhash'", "'$priorityDelta'", "'$feeDelta'" ]
  }'
```

```shell--cli
bcoin-cli rpc prioritisetransaction $txhash $priorityDelta $feeDelta
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('prioritisetransaction', [ txhash, priorityDelta, feeDelta ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
true
```

Prioritises the transaction.

*Note: changing fee or priority will only trick local miner (using this mempool)
into accepting Transaction(s) into the block. (even if Priority/Fee doen't qualify)*


N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | txid | Required | Transaction hash
2 | priority delta | Required | Virtual priority to add/subtract to the entry
3 | fee delta | Required | Virtual fee to add/subtract to the entry



## estimatefee

```javascript
let nblocks;
```

```shell--vars
nblocks=10;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "estimatefee",
    "params": [ "'$nblocks'" ]
  }'
```

```shell--cli
bcoin-cli rpc estimatefee $nblocks
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('estimatefee', [ nblocks ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
0.001
```

Estimates fee to be paid for transaction.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | nblocks | 1 | Number of blocks to check for estimation.



## estimatepriority

```javascript
let nblocks;
```

```shell--vars
nblocks=10;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "estimatepriority",
    "params": [ "'$nblocks'" ]
  }'
```

```shell--cli
bcoin-cli rpc estimatepriority $nblocks
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('estimatepriority', [ nblocks ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
718158904.3501
```

estimates the priority (coin age) that a transaction needs in order to be included within a certain number of blocks as a free high-priority transaction.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | nblocks | 1 | Number of blocks to check for estimation.



## estimatesmartfee

```javascript
let nblocks;
```

```shell--vars
nblocks=10;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "estimatesmartfee",
    "params": [ "'$nblocks'" ]
  }'
```

```shell--cli
bcoin-cli rpc estimatesmartfee $nblocks
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('estimatesmartfee', [ nblocks ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "fee": 0.001,
  "blocks": 10
}
```

Estimates smart fee to be paid for transaction.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | nblocks | 1 | Number of blocks to check for estimation.



## estimatesmartpriority

```javascript
let nblocks;
```

```shell--vars
nblocks=10;
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "estimatesmartpriority",
    "params": [ "'$nblocks'" ]
  }'
```

```shell--cli
bcoin-cli rpc estimatesmartpriority $nblocks
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('estimatesmartpriority', [ nblocks ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON "result" like this:

```json
{
  "priority": 718158904.3501,
  "blocks": 10
}
```

estimates smart priority (coin age) that a transaction needs in order to be included within a certain number of blocks as a free high-priority transaction.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | nblocks | 1 | Number of blocks to check for estimation.



