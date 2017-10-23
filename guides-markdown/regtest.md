# Create A Regtest Chain

Jonathan Gonzalez

Create a Regtest Chain

## Regtest Mode
### General

The Regtest Network, is a local Blockchain; In which a individuals can almost instantaneously generate blocks on demand.
The including the option to generate private satoshi with no real-world value. Ideal for testing applications.
The following example generates a three consecutive blocks, with transaction confirmations in the User's WalletDB

## Example 
'use strict';

process.title = 'bcoin';

const FullNode = require('bcoin/lib/node/fullnode');
const consensus = require('bcoin/lib/protocol/consensus');

const node = new FullNode({
  network: 'regtest',
  db: 'memory',
  prefix: '/home/.bcoin/regtest',
  apiKey: 'bikeshed',
  nodes: '127.0.0.1',
  port: 48444,
  env: true,
  logFile: true,
  logConsole: true,
  logLevel: 'debug',
  persistent: true,
  workers: true,
  listen: true,
  plugins: [require('bcoin/lib/wallet/plugin')]
});

process.on('unhandledRejection', (err, promise) => {
  throw err;
});

(async function connection() {
  await node.open();
  await node.connect();
  await node.pool.connect();
  node.pool.startSync();
  consensus.COINBASE_MATURITY = 0;
})().then(async function miner() {
  const wdb = node.require('walletdb');
  await node.miner.addAddress(wdb.primary.getReceive());

  const tip = node.chain.tip;
  const job = await node.miner.createJob(tip);
  const entry = await node.chain.getEntry(node.chain.tip.hash);
  const block = await node.miner.mineBlock(entry);

  await node.chain.add(block);
  await node.relay(node.chain.db.state);

  const block2 = await node.miner.cpu.mineBlock();
  const tx2 = block2.txs[1];
  block2.refresh(true);
  await node.chain.add(block2);

  const nextEntry = await node.chain.getEntryByHeight(node.chain.height);

  const balance = wdb.primary.getBalance();
});

