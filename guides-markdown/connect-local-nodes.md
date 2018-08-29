# Connect two local nodes

```post-author
Orfeas Stefanos Thyfronitis Litos
```

```post-description
Start and manually connect two regtest nodes in a single script.
```

When we start two nodes in the regtest (loopback network, 127.0.0.1) with
manually set ports, they don't get connected automatically because they don't
know each other's port. We thus have to connect them manually. In this example
we will fire up one SPV and one Full node and initiate a connection from the
SPV side. The SPV node is given the address of the Full node and attempts to
connect. If everything goes well, the two nodes connect. Finally they are
gracefully closed.

The script should work out of the box, the only requirement is having `bcoin`
installed.

```javascript
const bcoin = require('bcoin').set('regtest');
const NetAddress = bcoin.net.NetAddress;
const Network = bcoin.Network;

async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const regtest = Network.get().toString();

// create nodes
const spvNode = new bcoin.SPVNode({
  network: regtest,
  httpPort: 48449, // avoid clash of ports

  // write log file and chain data to specific directory
  prefix: '~/connect-test/SPV',
  memory: false,
  logFile: true,
  logConsole: false,
  logLevel: 'spam',

  // reduce log spam on SPV node (won't warn on Full node)
  maxOutbound: 1,
});

const fullNode = new bcoin.FullNode({
  network: regtest,
  port: 48445,
  bip37: true, // accept SPV nodes
  listen: true,

  // write log file and chain data to specific directory
  prefix: '~/connect-test/FULL',
  memory: false,
  logFile: true,
  logConsole: false,
  logLevel: 'spam'
});
// nodes created!

(async () => {
  // creates directory at `prefix`
  await spvNode.ensure();
  await fullNode.ensure();

  // start nodes
  await spvNode.open();
  await fullNode.open();

  await spvNode.connect();
  await fullNode.connect();
  // nodes started!

  // get peer from known address
  const addr = new NetAddress({
    host: '127.0.0.1',
    port: fullNode.pool.options.port
  });
  const peer = spvNode.pool.createOutbound(addr);

  // allow some time for spvNode to figure
  // out that its peer list is empty
  await delay(800);

  // no peers for the spvNode yet :(
  console.log('spvNode\'s peers before connection:', spvNode.pool.peers.head());

  // connect spvNode with fullNode
  spvNode.pool.peers.add(peer);

  // allow some time to establish connection
  await delay(3000);

  // nodes are now connected!
  console.log('spvNode\'s peers after connection:', spvNode.pool.peers.head());

  // closing nodes
  await fullNode.disconnect();
  await spvNode.disconnect();

  await fullNode.close();
  await spvNode.close();
  // nodes closed

  console.log('success!');
})();
```
