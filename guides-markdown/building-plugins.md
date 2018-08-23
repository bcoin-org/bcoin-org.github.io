# Building Awesome bcoin Plugins

```post-author
Javed Khan
```

```post-description
Extending functionality by building plugins for bcoin.
```

#### Introduction

bcoin has an extensible interface for writing plugins of all sizes . For
example, did you know that the bcoin wallet is actually a plugin?

```javascript
    // file: https://github.com/bcoin-org/bcoin/blob/master/bin/node #48

    const plugin = require('../lib/wallet/plugin');
    node.use(plugin);
```

For a plugin to be usable by bcoin, all it needs is an `init` function which
accepts a `node`. Plugins can use `node` to access objects like `mempool`,
`chain` or `pool`.

#### Hello World

For example, `hello.js` might look like

```javascript
'use strict';

const plugin = exports;

class Plugin {
  constructor(node) {
    console.log('connecting to: %s', node.network);
  }
}

plugin.init = function init(node) {
  return new Plugin(node);
};
```

Running `bcoin --testnet --plugins=${PWD}/hello` should start with

`connecting to: testnet`

Optionally plugins may have a unique `id` string as an identifier, along with
functions `open()` and `close()` which can be used to hook into the startup and
shutdown processes of the node, respectively.

Note:  Some identifiers are reserved by bcoin, so you’ll need to use something
other than `chain fees mempool miner pool rpc http`.

If the plugin needs to maintain any persistent data, it may write to it’s own
database, using `open` and `close` to load and unload connections and handles
for example.

```javascript
    ...
    class Plugin {
      constructor(node) {
      }

    async open() {
        await this.db.open();
        console.log('db opened');
      }

    async close() {
        await this.db.close();
        console.log('db closed');
      }
    };
    ...
```

`bcoin` is thoroughly event driven, which means that most of the time, you just
need to listen to the appropriate  event and add a hook for your handler.
Depending on the level of granularity required, you can choose which object to
listen for the events. For example, `fullnode` emits `tx`, `block` events which
may be sufficient level of detail for your plugin, but you can also dig into the
`mempool` or `chain` for finer details, if required.

Multiple plugins can be enabled by passing an array of modules to the`plugins`
configuration option for example:`plugins=plugin1,plugin2`.

#### Peers Plugin

Example: `peers.js` plugin to announce connected peers

```javascript
    ...
    class Plugin {
      constructor(node) {
        this.node = node;
        this.node.pool.on('peer open', this.peerOpen)
      }

      async peerOpen(peer) {
        console.log('connected to peer %s', peer.hostname())
      }
    }

    plugin.id = 'peers';
    ...
```

You can find official bcoin plugins under the bcoin-org github:

[https://github.com/bcoin-org](https://github.com/bcoin-org)

#### bindex

To showcase some advanced features of the bcoin plugin system, let’s talk about
a new official plugin which is currently being developed.

bindex is a plugin that creates an index database for transactions and
addresses, and soon for generating BIP 158 filters to add support for Neutrino
light clients. This functionality can be extended even further to support
custom indexes, for example for your own colored coins.

In order to persist the indexes, bindex also maintains its own database.  This
also allows it to add indexing retroactively without needing to resync the
whole chain.

Important events that bindex would need to listen to are `chain: connect` for
new blocks and `chain: disconnect` for disconnected blocks (due to re-org)

To learn more about the bindex plugin, checkout the repo:

[https://github.com/bcoin-org/bindex](https://github.com/bcoin-org/bindex)

So, go ahead and write your first bcoin plugin!

Reach out to us at bcoin slack
[https://bcoin-dev.slack.com/](https://bcoin-dev.slack.com/) or IRC freenode
#bcoin with your feedback!
