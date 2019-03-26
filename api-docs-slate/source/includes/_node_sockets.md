# Node Sockets

## Node sockets - bsock

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const {ChainEntry, TX} = require('bcoin');
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

// Authenticate and subscribe to channels after connection
nodeSocket.on('connect', async () => {
  // Auth
  await nodeSocket.call('auth', '<api-key>');

  // Subscribe to chain events to listen for blocks
  await nodeSocket.call('watch chain');

  // Subscribe to mempool events to listen for transactions
  await nodeSocket.call('watch mempool');
});

// Listen for new blocks -- from chain channel
nodeSocket.bind('chain connect', (raw) => {
  console.log('Node -- Chain Connect Event:\n', ChainEntry.fromRaw(raw));
});

// Listen for new transactions -- from mempool channel (bloom filter required)
nodeSocket.bind('tx', (raw) => {
  console.log('Node -- TX Event:\n', TX.fromRaw(raw));
});
```

### Node Socket Authentication

Authentication with the API server must be completed before any other events
will be accepted.

### Joining a channel

Instead of joining wallets, the node server offers two "channels" of events:
`chain` and `mempool`. When the node has no mempool (for example in SPV mode)
transaction events will be relayed from the pool of peers instead. In both
channels, transactions are only returned if they match a bloom filter sent in
advance (see [set filter](#code-set-filter-code)).

### Listening for events

Unlike the wallet events, data returned by node events are not converted into
JSON format. The results are raw Buffers or arrays of Buffers. Be sure to observe
how the examples use library modules from bcoin and `fromRaw()` methods to recreate
the objects.

### Making calls

The node socket server can also respond to more calls than the wallet socket
server.


## Node sockets - bclient

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const {NodeClient} = require('bclient');
const {Network, ChainEntry} = require('bcoin');
const network = Network.get('regtest');

const nodeOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: '<api-key>'
}

const nodeClient = new NodeClient(nodeOptions);

(async () => {
  // Connection and both channel subscriptions handled by opening client
  await nodeClient.open();
})();

// Listen for new blocks
nodeClient.bind('chain connect', (raw) => {
  console.log('Node -- Chain Connect Event:\n', ChainEntry.fromRaw(raw));
});
```

`bclient` abstracts away the connection, subscription, and authentication steps
to make listening for events much easier.

## Node sockets - Calls

## `watch chain`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

nodeSocket.on('connect', async () => {
  // Auth
  await nodeSocket.call('auth', '<api-key>');

  // Subscribe to chain events to listen for blocks
  await nodeSocket.call('watch chain');
});
```

Subscribe to chain events:

[`chain connect`](#code-chain-connect-code)

[`block connect`](#code-block-connect-code)

[`chain disconnect`](#code-chain-disconnect-code)

[`block disconnect`](#code-block-disconnect-code)

[`chain reset`](#code-chain-reset-code)

Unsubscribe by calling `unwatch chain`.


## `watch mempool`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

nodeSocket.on('connect', async () => {
  // Auth
  await nodeSocket.call('auth', '<api-key>');

  // Subscribe to chain events to listen for blocks
  await nodeSocket.call('watch mempool');
});
```

Subscribe to mempool/pool events:

[`tx`](#node-code-tx-code)

Unsubscribe by calling `unwatch mempool`.

##  `set filter`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const {BloomFilter} = require('bfilter');

const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

(async () => {
  // Authentication required

  // Create new Bloom filter with standard false-positive parameters
  const filter = BloomFilter.fromRate(20000, 0.001, BloomFilter.flags.ALL);

  // Add address to Bloom filter (arguments are similar to `Buffer.from()`)
  filter.add('2N4Y3oQo6w2rLdsPuYKcsQtMQeXAHnZizeC', 'ascii');

  // Send to server. The Bloom filter's `filter` property is type `Buffer`
  nodeSocket.call('set filter', filter.filter);
})();
```

Load a bloom filter to the node socket server. Only transactions matching the filter
will be returned. Applies to node [`tx`](#node-code-tx-code) events and the array
of transactions returned by the [`block connect`](#code-block-connect-code) event.

##  `add filter`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

(async () => {
  // Authentication required
  // Bloom filter set required

  // Add address (as a Buffer) to Bloom filter
  const addrBuffer = Buffer.from('mp33NDe153Umb4AbRgPDFKyKmmkYEVx1fX', 'ascii');

  // Send to server.
  nodeSocket.call('add filter', [addrBuffer]);
})();
```

Add an array of Buffers to the existing Bloom filter. [`set filter`](#code-set-filter-code)
required in advance.

##  `reset filter`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

(async () => {
  // Authentication required
  // Bloom filter set required

  nodeSocket.call('reset filter');
})();
```

Resets the Bloom filter on the server to an empty buffer.

##  `get tip`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const {ChainEntry} = require('bcoin');

const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

(async () => {
  // Authentication required

  const tip = nodeSocket.call('get tip');
  console.log(ChainEntry.fromRaw(tip));
})();
```

Returns the chain tip.

##  `get entry`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const {ChainEntry} = require('bcoin');

const bsock = require('bsock');
const nodeSocket = bsock.connect('<regtest node RPC port>');

(async () => {
  // Authentication required

  // Get the regtest genesis block by REVERSE hash
  const hash = Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex')
  const entryByHash = await nodeSocket.call('get entry', hash);
  console.log(ChainEntry.fromRaw(entryByHash));

  // Get block at height 5
  const entryByHeight = await nodeSocket.call('get entry', 5);
  console.log(ChainEntry.fromRaw(entryByHeight));
})();
```

Returns a chain entry requested by little-endian block hash or by integer height.
No response if entry is not found.

##  `get hashes`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

(async () => {
  // Authentication required

  // Get all block hashes from height 10 through 20
  const hashes = await nodeSocket.call('get hashes', 10, 20);
  console.log(hashes);
})();
```

Returns an array of block hashes (as Buffers) in the specified range of height
(inclusive).

##  `estimate fee`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

(async () => {
  // Authentication required

  // Request fee estimation for inclusion within 6 blocks
  const estimate = await nodeSocket.call('estimate fee', 6);
  console.log(estimate);
})();
```

Returns an estimated fee rate (in satoshis per kB) necessary to include a
transaction in the specified number of blocks.

##  `send`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<network node RPC port>');

(async () => {
  // Authentication required

  // Send raw transaction
  const rawtx = Buffer.from(
    '01000000018613693410cbaba5aec0d2660fa17efa70bc6e6951a190f61b5c7096c2b58' +
    '10f000000006a47304402202e6bc4acbcc6dc823cd188e7d4179ff2ebdee0bad1b2ef66' +
    '21b73e9f28145a7e022051fdfe89c4322312038eb81193665b688b002c15d6b2ca8a5a1' +
    '8505e90918ba20121036297333416f91d1db918882ec637c009f180b1f54b7c21663c2a' +
    '53df48e09e57ffffffff02809698000000000017a9147bd7f36e8f4504f4eaf9ab0a74d' +
    '65f3d2995e8d887ec496d29010000001976a914c1a47957fda3fdba2a7b5761f86c1dc4' 
    '03e23f8f88ac00000000',
    'hex'
  );
  nodeSocket.call('send', rawtx);
})();
```

Send a raw transaction (as Buffer) to node server to broadcast. Server will attempt
to broadcast the transaction without any checks.

##  `rescan`

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const nodeSocket = bsock.connect('<regtest node RPC port>');

// Establish a socket hook to process the filter-matched blocks and transactions
nodeSocket.hook('block rescan', (entry, txs) => {
  // Do something (like update your wallet DB)
});

(async () => {
  // Authentication required
  // Bloom filter set required

  // Rescan the blockchain from height 5
  const entry = await nodeSocket.call('rescan', 5);
})();
```

Rescan the chain from the specified integer height OR little-endian block
hash (as Buffer). Requires Bloom filter. Returns a call _back to the client_
after scanning each block:

`socket.call('block rescan', block, txs)`

Where `block` is a raw `ChainEntry` and `txs` is an array of filter-matched
transactions (as Buffers).

Note that this is NOT a wallet rescan, but the returned data can be used by a
client-side wallet to update its state.

## Node sockets - Events

## `chain connect`

> Example:

```
# ChainEntry.fromRaw(raw)
{
  hash:
   '5e3b0f5ea3eb2305936191c7255625abee9890fb68625ca2279647533c7eac35',
  version: '30000001',
  prevBlock:
   '5e585c5828132bead36f684ab4e2d23e78d563ab743081823d3a96c0077885b5',
  merkleRoot:
   '2090e1be81e0d9f740bd68bc42ab790cfc3edb8ce04451ff88dda50107bba103',
  time: 1553614114,
  bits: 545259519,
  nonce: 0,
  height: 234,
  chainwork:
   '00000000000000000000000000000000000000000000000000000000000001d6'
}
```

### Channel: `chain`

Emitted when a block is added to the chain. Returns raw `ChainEntry` of new
block.

## `block connect`

> Example:

```
# ChainEntry.fromRaw(raw), txs
{ 
  hash:
   '5e3b0f5ea3eb2305936191c7255625abee9890fb68625ca2279647533c7eac35',
  version: '30000001',
  prevBlock:
   '5e585c5828132bead36f684ab4e2d23e78d563ab743081823d3a96c0077885b5',
  merkleRoot:
   '2090e1be81e0d9f740bd68bc42ab790cfc3edb8ce04451ff88dda50107bba103',
  time: 1553614114,
  bits: 545259519,
  nonce: 0,
  height: 234,
  chainwork:
   '00000000000000000000000000000000000000000000000000000000000001d6'
}

[
  <Buffer 01 00 00 00 00 01 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ... >,
  <Buffer 01 00 00 00 01 2f 32 30 94 24 88 42 4e b8 e4 08 9d 0d aa ee 3a  ... >,
  <Buffer 01 00 00 00 01 2f 9e 7d 93 16 1c 0f 0a 48 93 79 63 a8 2c 9f 6c  ... >,
  <Buffer 01 00 00 00 01 e2 47 a2 d1 2b 90 03 39 94 09 f2 bf d9 7a ff 6b  ... >
]
```

### Channel: `chain`

Emitted when a block is added to the chain. Returns raw `ChainEntry` of new
block. If a [Bloom filter has been loaded in advance](#code-set-filter-code),
this call will also return an array of filter-matching transactions (as raw
Buffers).

## `chain disconnect`

> Example:

```
# ChainEntry.fromRaw(raw)
{
  hash:
   '0fcf0745e15e9b05098e7d82628c2b3e3693a26779ecf18b728e2acbbb2c9d2f',
  version: '30000001',
  prevBlock:
   '0d60d46a80201c8d50fb62bb8ff73dec62f0f90de6d14c0419ab57e06d46f888',
  merkleRoot:
   '0112fe4c48685b8bee773a939b3a5c1361e4c7fc0f9c1b7a0ee310be9431b12a',
  time: 1553784886,
  bits: 545259519,
  nonce: 0,
  height: 229,
  chainwork:
   '00000000000000000000000000000000000000000000000000000000000001cc'
}
```

### Channel: `chain`

Emitted when a block is removed from the chain. Returns raw `ChainEntry` of the
block being removed.

## `block disconnect`

Identical to [`chain disconnect`](#code-chain-disconnect-code)

## `chain reset`

> Example:

```
# ChainEntry.fromRaw(raw)
{ 
  hash:
   '7b3e9c3b8ea3924f44a1c3ac8b539be1a019cb1d5c384cb603aa99f44c8f9c55',
  version: '30000001',
  prevBlock:
   '4a1871311ec860a82dc56d0b198757217b751458e03f5bbe557685d1e883c9fb',
  merkleRoot:
   '0fffb562f0aba5edd566047b4a226328a2284a361391ef477b9351f39a472771',
  time: 1553783915,
  bits: 545259519,
  nonce: 1,
  height: 226,
  chainwork:
   '00000000000000000000000000000000000000000000000000000000000001c6'
}
```

### Channel: `chain`

Returns raw `ChainEntry` of the new current tip.


## Node `tx`

> Example:

```
 # TX.fromRaw(raw)
 {
  hash:
   'c6ff80856c192179f1ee5a9462dcf9992fa145fc16e7332ead0dd58bdd8c5e12',
  witnessHash:
   'c6ff80856c192179f1ee5a9462dcf9992fa145fc16e7332ead0dd58bdd8c5e12',
  size: 223,
  virtualSize: 223,
  value: '49.999955',
  fee: '0.0',
  rate: '0.0',
  minFee: '0.00000223',
  height: -1,
  block: null,
  time: 0,
  date: null,
  index: -1,
  version: 1,
  inputs:
   [ { type: 'pubkeyhash',
       subtype: null,
       address:
        <Address: type=pubkeyhash version=-1 str=1EMhzKJsFARX1To4nf8ZSkEitsSu1uPAAQ>,
       script:
        <Script: 0x47 0x304402201619988d47c70c0834bd0c0c407b116654f0fb29faabc68129ab66487ca86ba802204a683fa071f177db960b9bd98e62703c3cb1a7a0888ccc41ee854cb0633dcfe501 0x21 0x02c9e389af9245e7e38c64c46465d6d281e7cc822e909f20454dada561c47e0d3e>,
       witness: <Witness: >,
       redeem: null,
       sequence: 4294967295,
       prevout:
        <Outpoint: a0b3d51f320493660af2f92171f1ed01bc1e85e1c66e2785fe42cb20069b4fb8/0>,
       coin: null } ],
  outputs:
   [ { type: 'scripthash',
       value: '0.1',
       script:
        <Script: OP_HASH160 0x14 0x7bd7f36e8f4504f4eaf9ab0a74d65f3d2995e8d8 OP_EQUAL>,
       address:
        <Address: type=scripthash version=-1 str=3Cyqjfs5KaLzS5mMsBzznwN9SAx814WVe2> },
     { type: 'pubkeyhash',
       value: '49.899955',
       script:
        <Script: OP_DUP OP_HASH160 0x14 0x31cb0ced3ff113b82e5e7d935a5c0e23a9f659c3 OP_EQUALVERIFY OP_CHECKSIG>,
       address:
        <Address: type=pubkeyhash version=-1 str=15YHMbY1rFgss64CaqMZyGVDUqZKqHHetM> } ],
  locktime: 0
}
```

### Channel: `mempool`

Emitted when a transaction that matches a previously set Bloom filter is received
by the node server. Returns transaction as raw Buffer.
