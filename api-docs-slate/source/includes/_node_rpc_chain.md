# RPC Calls - Chain

## pruneblockchain

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "pruneblockchain",
    "params": []
  }'
```

```shell--cli
bcoin-cli rpc pruneblockchain
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('pruneblockchain');

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

Prunes the blockchain, it will keep blocks specified in Network Configurations.

### Default Prune Options
Network | keepBlocks | pruneAfter
------- | -------    | -------
main    | 288        | 1000
testnet | 10000      | 1000
regtest | 10000      | 1000

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
None. |



## invalidateblock

```javascript
let blockhash;
```

```shell--vars
blockhash='0000000000000dca8da883af9515dd90443d59139adbda3f9eeac1d18397fec3';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "invalidateblock",
    "params": [ "'$blockhash'" ]
  }'
```

```shell--cli
bcoin-cli rpc invalidateblock $blockhash
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('invalidateblock', [ blockhash ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```


Invalidates the block in the chain.
It will rewind network to blockhash and invalidate it.

It won't accept that block as valid
*Invalidation will work while running, restarting node will remove invalid block from list.*

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockhash | Required | Block's hash



## reconsiderblock

```javascript
let blockhash;
```

```shell--vars
blockhash='0000000000000dca8da883af9515dd90443d59139adbda3f9eeac1d18397fec3';
```

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{
    "method": "reconsiderblock",
    "params": [ "'$blockhash'" ]
  }'
```

```shell--cli
bcoin-cli rpc reconsiderblock $blockhash
```

```javascript
const {NodeClient} = require('bclient');
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('reconsiderblock', [ blockhash ]);

  console.log(res);
})().catch((err) => {
  console.error(err.stack);
});
```

This rpc command will remove block from invalid block set.

### Params
N. | Name | Default |  Description
--------- | --------- | --------- | -----------
1 | blockhash | Required | Block's hash
