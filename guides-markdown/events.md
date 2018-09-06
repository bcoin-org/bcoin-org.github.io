<style>
table, tr, td, th { border: 1px solid black; padding: 5px; text-align: center;}
code { white-space: nowrap;}
</style>

# Events directory
```post-author
Matthew Zipkin
```

```post-description
A list of all emitted events throughout the bcoin library.
Which functions call them, what data they return, which objects catch and re-emit them,
and which events are available over websocket connection.
```

### About this list

This list is comprehensive for all Bitcoin transaction, wallet, and blockchain activity.
Events regarding errors, socket connections and peer conections have been omitted for clarity.
Notice that certain methods emit the same events but with different return objects,
and not all re-emitters return everything they receive.

## Events directory

| Event | Returns | Origin | Re-Emitters |
|-|-|-|-|
| `tip` | [ChainEntry]() | [Chain](): `open()`, `disconnect()`, `reconnect()`, `setBestChain()`, `reset()`| |
| `connect` | [ChainEntry](), [Block](), [CoinView]() | [Chain](): `setBestChain()`, `reconnect()`| _chain_&#8594;[FullNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;[SPVNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;_node_&#8594;[NodeClient]() (emits as `block connect`, returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only) |
| `disconnect` | [ChainEntry](), [Headers](), [CoinView]() | [Chain](): `reorganizeSPV()` | _chain_&#8594;[FullNode]() (returns&nbsp;ChainEntry,&nbsp;Headers&nbsp;only)<br>_chain_&#8594;[SPVNode]() (returns&nbsp;ChainEntry,&nbsp;Headers&nbsp;only)<br>_chain_&#8594;_node_&#8594;[NodeClient]() (emits as `block disconnect`, returns&nbsp;ChainEntry&nbsp;only) |
| `disconnect` | [ChainEntry](), [Block](), [CoinView]() | [Chain](): `disconnect()` | _chain_&#8594;[FullNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;[SPVNode]() (returns&nbsp;ChainEntry,&nbsp;Block&nbsp;only)<br>_chain_&#8594;_node_&#8594;[NodeClient]() (emits as `block disconnect`, returns&nbsp;ChainEntry&nbsp;only)  |
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
| `confirmed` | [TX](), [Details](txdb.js) | [TXDB](): `confirm()` | |
| `unconfirmed` | [TX](), [Block]() | [Mempool](): `_removeBlock()`| |
| `unconfirmed` | [TX](), [Details](txdb.js) | [TXDB](): `disconnect()` | |
| `conflict` | [TX]() | [Mempool](): `_removeBlock()`| |
| `conflict` | [TX](), [Details](txdb.js) | [TXDB](): `disconnect()` | |
| `tx` | [TX](), [CoinView]() | [Mempool](): `addEntry()` | _mempool_&#8594;[Pool]() (returns&nbsp;TX&nbsp;only)<br> _mempool_&#8594;_pool_&#8594;[SPVnode]() (returns&nbsp;TX&nbsp;only)<br> _mempool_&#8594;[FullNode]() (returns&nbsp;TX&nbsp;only) |
| `tx` | [TX]()| [Pool](): `_handleTX()`<br>(only if there is no mempool, i.e. SPV) | _pool_&#8594;[SPVnode]() |
| `tx` | [TX](), [Details](txdb.js) | [TXDB](): `insert()` | |
| `double spend` | [MempoolEntry]() | [Mempool](): `removeDoubleSpends()` | |
| `balance` | [Balance](txdb.js) | [TXDB](): `insert()`, `confirm()`, `disconnect()`, `erase()` | |
| `address` |  [[WalletKey]()] | [Wallet](): `_add()`,  |  _wallet_&#8594;[WalletDB]() (returns&nbsp;parent&nbsp;Wallet,&nbsp;[WalletKey]) |










<!-- TODO: sockets arent reemitters but need their own table -->