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
| `tip` | [ChainEntry]() | [Chain](): `open()`, `disconnect()`, `reconnect()`, `setBestChain()`, `reset()`| |
| `connect` | [ChainEntry](), [Block](), [CoinView]() | [Chain](): `setBestChain()`, `reconnect()`| _chain_&#8594;[FullNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;[SPVNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient]() (emits as `block connect`, returns&nbsp;ChainEntry,&nbsp;Block.txs&nbsp;only) |
| `disconnect` | [ChainEntry](), [Headers](), [CoinView]() | [Chain](): `reorganizeSPV()` | _chain_&#8594;[FullNode]() (returns&nbsp;ChainEntry,&nbsp;Headers&nbsp;only)<br>_chain_&#8594;[SPVNode]() (returns&nbsp;ChainEntry,&nbsp;Headers&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient]() (emits as `block disconnect`, returns&nbsp;ChainEntry&nbsp;only) |
| `disconnect` | [ChainEntry](), [Block](), [CoinView]() | [Chain](): `disconnect()` | _chain_&#8594;[FullNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;[SPVNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient]() (emits as `block disconnect`, returns&nbsp;ChainEntry&nbsp;only)  |
| `reconnect` | [ChainEntry](), [Block]() | [Chain](): `reconnect()`| |
| `reorganize` | tip ([ChainEntry]()), competitor ([ChainEntry]()) | [Chain](): `reorganize()`, `reorganizeSPV()` | _chain_&#8594;[FullNode]()<br>_chain_&#8594;[SPVNode]() |
| `block` | [Block](), [ChainEntry]() | [Chain](): `setBestChain()`<br>[CPUMiner](): `_start()`| _chain_&#8594;[Pool]()<br> _chain_&#8594;[FullNode]() (returns&nbsp;Block&nbsp;only)<br> _chain_&#8594;[SPVNode]() (returns&nbsp;Block&nbsp;only) |
| `competitor` | [Block](), [ChainEntry]() | [Chain](): `saveAlternate()` | |
| `bad orphan` | Error, ID | [Chain](): `handleOrphans()`<br>[Mempool](): `handleOrphans()` | |
| `resolved` | [Block](), [ChainEntry]() | [Chain](): `handleOrphans()` | |
| `checkpoint` | Hash, Height | [Chain](): `verifyCheckpoint()` | |
| `orphan` | [Block]() |  [Chain](): `storeOrphan()` | |
| `full` | | [Chain](): `maybeSync()` | _chain_&#8594;[Pool]()|
| `confirmed` | [TX](), [ChainEntry]() | [Mempool](): `_addBlock()`| |
| `confirmed` | [TX](), [Details](txdb.js) | [TXDB](): `confirm()` | _txdb_&#8594;[WalletDB]() (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet]()|
| `unconfirmed` | [TX](), [Block]() | [Mempool](): `_removeBlock()`| |
| `unconfirmed` | [TX](), [Details](txdb.js) | [TXDB](): `disconnect()` | _txdb_&#8594;[WalletDB]() (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet]()|
| `conflict` | [TX]() | [Mempool](): `_removeBlock()`| |
| `conflict` | [TX](), [Details](txdb.js) | [TXDB](): `disconnect()` | _txdb_&#8594;[WalletDB]() (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet]()|
| `tx` | [TX](), [CoinView]() | [Mempool](): `addEntry()` | _mempool_&#8594;[Pool]() (returns&nbsp;TX&nbsp;only)<br> _mempool_&#8594;_pool_&#8594;[SPVnode]() (returns&nbsp;TX&nbsp;only)<br> _mempool_&#8594;[FullNode]() (returns&nbsp;TX&nbsp;only)<br>_SPVNode_,&nbsp;_FullNode_&#8594;[NodeClient]() (returns&nbsp;TX&nbsp;only) |
| `tx` | [TX]()| [Pool](): `_handleTX()`<br>(only if there is no mempool, i.e. SPV) | _pool_&#8594;[SPVnode]() |
| `tx` | [TX](), [Details](txdb.js) | [TXDB](): `insert()` | _txdb_&#8594;[WalletDB]() (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet]()|
| `double spend` | [MempoolEntry]() | [Mempool](): `removeDoubleSpends()` | |
| `balance` | [Balance](txdb.js) | [TXDB](): `insert()`, `confirm()`, `disconnect()`, `erase()` | _txdb_&#8594;[WalletDB]() (also&nbsp;returns&nbsp;Wallet)<br>_txdb_&#8594;[Wallet]()|
| `address` |  [[WalletKey]()] | [Wallet](): `_add()`,  |  _wallet_&#8594;[WalletDB]() (returns&nbsp;parent&nbsp;Wallet,&nbsp;[WalletKey]) |

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
| `chain connect` | [ChainEntry]()_.toRaw()_ | `chain` | [Chain]() | `connect` |
| `block connect` | [ChainEntry]()_.toRaw()_, [Block]()_.txs_ | `chain` | [Chain]() | `connect` |
| `chain disconnect` | [ChainEntry]()_.toRaw()_ | `chain` | [Chain]() | `disconnect` |
| `block disconnect` | [ChainEntry]()_.toRaw()_ | `chain` | [Chain]() | `disconnect` |
| `tx ` | [TX]()_.toRaw()_ | `mempool` | [Pool]() | `tx` |

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
| `get tip` | (none) | [ChainEntry]()_.toRaw()_ |
| `get entry` | 1. _hash_ | [ChainEntry]()_.toRaw()_ |
| `get hashes` | 1. _start_ (int)<br>2. _end_ (int) | [hashes] |
| `add filter` | 1. _filter_ ([Buffer]) | _null_ |
| `reset filter` | (none) | _null_ |
| `estimate fee` | 1. _blocks_ (int) | _fee rate_ (float) |
| `send` | 1. _tx_ (Buffer) | _null_ |
| `rescan` | 1. _hash_ | _null_ |