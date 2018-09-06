# Connect two local nodes

```post-author
Orfeas Stefanos Thyfronitis Litos
```

```post-description
Start and manually connect two regtest nodes in a single script.
```

When we start two nodes on the regtest network (loopback network, 127.0.0.1)
with manually set ports, they don't get connected automatically because they
don't know each other's port. We thus have to connect them manually. In this
example we will fire up one SPV and one full node and initiate a connection from
the SPV side. The SPV node is given the address of the full node and attempts to
connect. If everything goes well, the two nodes connect.

To demonstrate that the connection was successful, we'll have full node
broadcast two transactions. The first tx pays to an address contained in the
bloom filter of the SPV node, the second tx to another address which the SPV
node doesn't watch. If everything goes well, the first transaction is received
by the SPV node and the second isn't. Finally the two nodes are gracefully
closed.

We use the library `p-event` which promisifies events in order to `await` for
connection of the nodes and the reception of the transaction cleanly.

Requirements: `bcoin` (duh), `p-event` (`npm install bcoin p-event`)

```javascript
// necessary for portability
const os = require('os');
const path = require('path');

const bcoin = require('bcoin').set('regtest');
const NetAddress = bcoin.net.NetAddress;
const Network = bcoin.Network;
const pEvent = require('p-event'); // tool to await for events

async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const regtest = Network.get().toString();
const logPrefix = path.join(os.homedir(), 'connect-test');

// create nodes
const spvNode = new bcoin.SPVNode({
  network: regtest,
  httpPort: 48449, // avoid clash of ports

  // write log file and chain data to specific directory
  prefix: path.join(logPrefix, 'SPV'),
  memory: false,
  logFile: true,
  logConsole: false,
  logLevel: 'spam',

  // reduce log spam on SPV node (cannot reduce to 0 for full node)
  maxOutbound: 1,
});

const fullNode = new bcoin.FullNode({
  network: regtest,
  port: 48445,
  bip37: true, // accept SPV nodes
  listen: true,

  // write log file and chain data to specific directory
  prefix: path.join(logPrefix, 'FULL'),
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


  // start the SPV node's blockchain sync
  spvNode.startSync();

  // SPV node: watch this address
  const address = bcoin.Address.fromString('R9M3aUWCcKoiqDPusJvqNkAbjffLgCqYip', spvNode.network);
  spvNode.pool.watchAddress(address);

  // SPV node: catch tx events
  spvNode.on('tx', (tx) => {
    console.log('-- SPV node received tx: --\n', tx);
  });

  // allow some time for spvNode to figure
  // out that its peer list is empty
  await delay(800);

  // no peers for the spvNode yet :(
  console.log('spvNode\'s peers before connection:', spvNode.pool.peers.head());

  // get peer from known address
  const addr = new NetAddress({
    host: '127.0.0.1',
    port: fullNode.pool.options.port
  });

  // connect spvNode with fullNode
  const peer = spvNode.pool.createOutbound(addr);
  spvNode.pool.peers.add(peer);

  // await to establish connection
  await pEvent(spvNode.pool, 'peer connect');
  // nodes are now connected!

  console.log('spvNode\'s peers after connection:', spvNode.pool.peers.head());

  // broadcast a tx that DOESN'T pay out to SPV node's watch address
  const tx1 = bcoin.TX.fromRaw('01000000011d06bce42b67f1de811a3444353fab5d400d82728a5bbf9c89978be37ad3eba9000000006a47304402200de4fd4ecc365ea90f93dbc85d219d7f1bd92ec8743648acb48b6602977e0b4302203ca2eeabed8e6f457234652a92711d66dd8eda71ed90fb6c49b3c12ce809a5d401210257654e1b0de2d8b08d514e51af5d770e9ef617ca2b254d84dd26685fbc609ec3ffffffff0280969800000000001976a914a4ecde9642f8070241451c5851431be9b658a7fe88acc4506a94000000001976a914b9825cafc838c5b5befb70ecded7871d011af89d88ac00000000', 'hex');
  await fullNode.sendTX(tx1);
  // broadcast a tx that pays out to SPV node's watch address
  const tx2 = bcoin.TX.fromRaw('010000000106b014e37704109fefe2c5c9f4227d68840c3497fc89a9832db8504df039a6c7000000006a47304402207dc8173fbd7d23c3950aaf91b1bc78c0ed9bf910d47a977b24a8478a91b28e69022024860f942a16bc67ec54884e338b5b87f4a9518a80f9402564061a3649019319012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff0280c3c901000000001976a91400ba915c3d18907b79e6cfcd8b9fdf69edc7a7db88acc41c3c28010000001976a91437f306a0154e1f0de4e54d6cf9d46e07722b722688ac00000000', 'hex');
  fullNode.sendTX(tx2);
  // await for the second transaction to be received by the SPV node
  await pEvent(spvNode, 'tx');


  // closing nodes
  await fullNode.disconnect();
  await spvNode.disconnect();

  await fullNode.close();
  await spvNode.close();
  // nodes closed
})();
```
