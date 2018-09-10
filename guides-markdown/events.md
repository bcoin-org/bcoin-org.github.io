<style>
table, tr, td, th { border: 1px solid black; padding: 5px; text-align: center;}
code { white-space: nowrap;}
</style>

# Events and Sockets
```post-author
Matthew Zipkin
```

```post-description
A list of all emitted events throughout the bcoin library.
Which functions call them, what data they return, which objects catch and re-emit them,
and which events are available over websocket connection.
```

## Events Directory

This list is comprehensive for all Bitcoin transaction, wallet, and blockchain activity.
Events regarding errors, socket connections and peer conections have been omitted for clarity.
Notice that certain methods emit the same events but with different return objects,
and not all re-emitters return everything they receive.

| Event | Returns | Origin | Re-Emitters |
|-|-|-|-|
| `tip` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `open()`, `disconnect()`, `reconnect()`, `setBestChain()`, `reset()`| |
| `connect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js), [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js), [CoinView](https://github.com/bcoin-org/bcoin/blob/master/lib/coins/coinview.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `setBestChain()`, `reconnect()`| _chain_&#8594;[FullNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/fullnode.js) (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;[SPVNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/spvnode.js) (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/nodeclient.js) (emits as `block connect`, returns&nbsp;ChainEntry,&nbsp;Block.txs&nbsp;only) |
| `disconnect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js), [Headers](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/headers.js), [CoinView](https://github.com/bcoin-org/bcoin/blob/master/lib/coins/coinview.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `reorganizeSPV()` | _chain_&#8594;[FullNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/fullnode.js) (returns&nbsp;ChainEntry,&nbsp;Headers&nbsp;only)<br>_chain_&#8594;[SPVNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/spvnode.js) (returns&nbsp;ChainEntry,&nbsp;Headers&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/nodeclient.js) (emits as `block disconnect`, returns&nbsp;ChainEntry&nbsp;only) |
| `disconnect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js), [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js), [CoinView](https://github.com/bcoin-org/bcoin/blob/master/lib/coins/coinview.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `disconnect()` | _chain_&#8594;[FullNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/fullnode.js) (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;[SPVNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/spvnode.js) (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/nodeclient.js) (emits as `block disconnect`, returns&nbsp;ChainEntry&nbsp;only)  |
| `reconnect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js), [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `reconnect()`| |
| `reorganize` | tip ([ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)), competitor ([ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `reorganize()`, `reorganizeSPV()` | _chain_&#8594;[FullNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/fullnode.js)<br>_chain_&#8594;[SPVNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/spvnode.js) |
| `block` | [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js), [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `setBestChain()`<br>[CPUMiner](https://github.com/bcoin-org/bcoin/blob/master/lib/mining/cpuminer.js): `_start()`| _chain_&#8594;[Pool](https://github.com/bcoin-org/bcoin/blob/master/lib/net/pool.js)<br> _chain_&#8594;[FullNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/fullnode.js) (returns&nbsp;Block&nbsp;only)<br> _chain_&#8594;[SPVNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/spvnode.js) (returns&nbsp;Block&nbsp;only) |
| `competitor` | [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js), [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `saveAlternate()` | |
| `bad orphan` | Error, ID | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `handleOrphans()`<br>[Mempool](https://github.com/bcoin-org/bcoin/blob/master/lib/mempool/mempool.js): `handleOrphans()` | |
| `resolved` | [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js), [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js) | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `handleOrphans()` | |
| `checkpoint` | Hash, Height | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `verifyCheckpoint()` | |
| `orphan` | [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js) |  [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `storeOrphan()` | |
| `full` | | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js): `maybeSync()` | _chain_&#8594;[Pool](https://github.com/bcoin-org/bcoin/blob/master/lib/net/pool.js)|
| `confirmed` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js), [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js) | [Mempool](https://github.com/bcoin-org/bcoin/blob/master/lib/mempool/mempool.js): `_addBlock()`| |
| `confirmed` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js), [Details](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js) | [TXDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js): `confirm()` | _txdb_&#8594;[WalletDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/walletdb.js) (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/wallet.js)|
| `unconfirmed` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js), [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js) | [Mempool](https://github.com/bcoin-org/bcoin/blob/master/lib/mempool/mempool.js): `_removeBlock()`| |
| `unconfirmed` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js), [Details](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js) | [TXDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js): `disconnect()` | _txdb_&#8594;[WalletDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/walletdb.js) (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/wallet.js)|
| `conflict` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js) | [Mempool](https://github.com/bcoin-org/bcoin/blob/master/lib/mempool/mempool.js): `_removeBlock()`| |
| `conflict` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js), [Details](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js) | [TXDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js): `disconnect()` | _txdb_&#8594;[WalletDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/walletdb.js) (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/wallet.js)|
| `tx` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js), [CoinView](https://github.com/bcoin-org/bcoin/blob/master/lib/coins/coinview.js) | [Mempool](https://github.com/bcoin-org/bcoin/blob/master/lib/mempool/mempool.js): `addEntry()` | _mempool_&#8594;[Pool](https://github.com/bcoin-org/bcoin/blob/master/lib/net/pool.js) (returns&nbsp;TX&nbsp;only)<br> _mempool_&#8594;_pool_&#8594;[SPVNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/spvnode.js) (returns&nbsp;TX&nbsp;only)<br> _mempool_&#8594;[FullNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/fullnode.js) (returns&nbsp;TX&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/nodeclient.js) (returns&nbsp;TX&nbsp;only) |
| `tx` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js)| [Pool](https://github.com/bcoin-org/bcoin/blob/master/lib/net/pool.js): `_handleTX()`<br>(only if there is no mempool, i.e. SPV) | _pool_&#8594;[SPVNode](https://github.com/bcoin-org/bcoin/blob/master/lib/node/spvnode.js) |
| `tx` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js), [Details](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js) | [TXDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js): `insert()` | _txdb_&#8594;[WalletDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/walletdb.js) (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/wallet.js)|
| `double spend` | [MempoolEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/mempool/mempoolentry.js) | [Mempool](https://github.com/bcoin-org/bcoin/blob/master/lib/mempool/mempool.js): `removeDoubleSpends()` | |
| `balance` | [Balance](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js) | [TXDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/txdb.js): `insert()`, `confirm()`, `disconnect()`, `erase()` | _txdb_&#8594;[WalletDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/walletdb.js) (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/wallet.js)|
| `address` |  [[WalletKey](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/walletkey.js)] | [Wallet](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/wallet.js): `_add()`,  |  _wallet_&#8594;[WalletDB](https://github.com/bcoin-org/bcoin/blob/master/lib/wallet/walletdb.js) (returns&nbsp;parent&nbsp;Wallet,&nbsp;[WalletKey]) |

## Socket Events

Websocket connections in bcoin are handled by two servers, one for `Node` and one for `Wallet`.
Those servers each have child objects such as `Chain`, `Mempool`, `Pool`, and `WalletDB`, and
relay events from them out the socket. To receive an event, the socket client must watch a
channel (such as `chain`, `mempool`, or `auth`) or join the a wallet
(which would be user-defined like `primary`, `hot-wallet`, or `multisig1`). All wallets can be
joined at once by joining `'*'`. See more about joining and watching with hooks and calls below.

### Wallet

All wallet events are triggered by a `WalletDB` object, which have may be triggered by its parent
`TXDB` or `Wallet`. The socket emits the event along with the wallet ID, and whatever "Returns" are listed above.

| Event |
|-|
| `tx` |
| `confirmed` |
| `unconfirmed` |
| `conflict` |
| `balance` |
| `address` |

### Node

| Event | Returns | Channel | Origin | Original Event |
|-|-|-|-|-|
| `chain connect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)_.toRaw()_ | `chain` | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js) | `connect` |
| `block connect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)_.toRaw()_, [Block](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/block.js)_.txs_ | `chain` | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js) | `connect` |
| `chain disconnect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)_.toRaw()_ | `chain` | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js) | `disconnect` |
| `block disconnect` | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)_.toRaw()_ | `chain` | [Chain](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chain.js) | `disconnect` |
| `tx ` | [TX](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/tx.js)_.toRaw()_ | `mempool` | [Pool](https://github.com/bcoin-org/bcoin/blob/master/lib/net/pool.js) | `tx` |

## Server Hooks

Certain events can also be sent back to the server from the client to request new data
or trigger a server action. The client action is a "call" and the server waits with a "hook".

### Wallet

| Event | Args | Returns |
|-|-|-|
| `auth` | 1. _api key_ | _null_ |
| `join` | 1. _wallet id_ <br>2. _wallet token_ | _null_ |
| `leave` | 1. _wallet id_ | _null_ |

### Node

| Event | Args | Returns |
|-|-|-|
| `auth` | 1. _api key_ | _null_ |
| `watch chain` | (none) | _null_ |
| `unwatch chain` | (none) | _null_ |
| `watch mempool` | (none) | _null_ |
| `unwatch mempool` | (none) | _null_ |
| `set filter` | 1. _Bloom filter_ (Buffer)| _null_ |
| `get tip` | (none) | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)_.toRaw()_ |
| `get entry` | 1. _hash_ | [ChainEntry](https://github.com/bcoin-org/bcoin/blob/master/lib/blockchain/chainentry.js)_.toRaw()_ |
| `get hashes` | 1. _start_ (int)<br>2. _end_ (int) | [hashes] |
| `add filter` | 1. _filter_ ([Buffer]) | _null_ |
| `reset filter` | (none) | _null_ |
| `estimate fee` | 1. _blocks_ (int) | _fee rate_ (float) |
| `send` | 1. _tx_ (Buffer) | _null_ |
| `rescan` | 1. _hash_ | _null_ |