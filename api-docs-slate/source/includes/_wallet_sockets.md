# Wallet Sockets

## Wallet sockets - bsock

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const bsock = require('bsock');
const walletSocket = bsock.connect('<network wallet RPC port>');

// Authenticate and join wallet after connection to listen for events
walletSocket.on('connect', async () => {
  // Auth
  await walletSocket.call('auth', '<api-key>');

  // Join - All wallets
  await walletSocket.call('join', '*', '<admin token>');

  // Join - Specific wallet
  await walletSocket.call('join', '<wallet id>', '<wallet token>');
});

// Listen for new transactions
walletSocket.bind('tx', (walletID, details) => {
  console.log('Wallet -- TX Event, Wallet ID:\n', walletID);
  console.log('Wallet -- TX Event, TX Details:\n', details);
});

// Leave
walletSocket.call('leave', <wallet id>);
```

### Wallet Socket Authentication

Authentication with the API server must be completed before any other events
will be accepted.

### Joining a wallet

After creating a websocket and authing with the server, you must send a `join`
event to listen for events on a wallet. Join all wallets by passing `'*'`.
Leave a wallet with the `leave` event.
Wallet or admin token is required if `wallet-auth` is `true`.

### Listening for events

All wallet events return the `wallet-id` in addition to the JSON data described below.

## Wallet sockets - bclient

```shell--curl
(See JavaScript example)
```

```shell--cli
(See JavaScript example)
```

```javascript
const {WalletClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: '<api-key>'
}

const walletClient = new WalletClient(walletOptions);

(async () => {
  // Connection and auth handled by opening client
  await walletClient.open();
  await walletClient.join('*', '<admin token>');
})();

// Listen for new transactions
walletClient.bind('tx', (walletID, details) => {
  console.log('Wallet -- TX Event, Wallet ID:\n', walletID);
  console.log('Wallet -- TX Event, TX Details:\n', details);
});

// Leave all wallets
walletClient.leave('<wallet id>');
```

`bclient` abstracts away the connection and authentication steps to make listening
for events much easier.

## Wallet sockets - Calls

The only wallet calls available are covered in the [previous section.](#wallet-sockets-bsock)

They are:

`auth`
`join`
`leave`


## Wallet sockets - Events

## wallet `tx`

> Example:

```
{
  hash: '8f6492b8fbdf5d71322b32fb0ade956aed7ed761173108791f782001800be8e2',
  height: -1,
  block: null,
  time: 0,
  mtime: 1536690801,
  date: '1970-01-01T00:00:00Z',
  mdate: '2018-09-11T18:33:21Z',
  size: 225,
  virtualSize: 225,
  fee: 4540,
  rate: 20177,
  confirmations: 0,
  inputs: 
   [ { value: 5000000000,
       address: 'RQuXE6LxTC7WZTEZkpLxrTV2fX2aioBjrB',
       path: [Object] } ],
  outputs: 
   [ { value: 10000000,
       address: 'RQuXE6LxTC7WZTEZkpLxrTV2fX2aioBjrB',
       path: [Object] },
     { value: 4989995460,
       address: 'RJBhmLQHUNNiJNpRkcKfSCs8bU47Ew8zgU',
       path: [Object] } ],
  tx: '01000000010260ea8f1c4c0609a89a2120654cc7a2bf903dbd408d23b9d42614ef199ff063000000006a473044022036ee7381ad177e140d77123eab15e980535f2ae581c2fe633160d565f153c3e802205d348e0a49b4ed1b87e3c12665a8a61f1477ed40639b883c0190a15011e17a1e0121025ad70d43d5844fec60a406515ff86b96ac5b9c5c8c186ae571198986e23322beffffffff0280969800000000001976a914ab68d8609ddd31698303963d642164f29392e32a88acc4496d29010000001976a91461af6ad7fa4037ec97207944ac220565e98a3ab388ac00000000'
}
```

Emitted on transaction.

Returns tx details.

## `conflict`

Emitted on double spend.

Returns tx details of removed double spender.


## `confirmed`

> Example:

```
{
  hash: '8f6492b8fbdf5d71322b32fb0ade956aed7ed761173108791f782001800be8e2',
  height: 114,
  block: '67e73bd4d08397cbc96f605fa4e3e0bd2d7eeb865309ccfd0cf885fab3d1c966',
  time: 1536690803,
  mtime: 1536690801,
  date: '2018-09-11T18:33:23Z',
  mdate: '2018-09-11T18:33:21Z',
  size: 225,
  virtualSize: 225,
  fee: 4540,
  rate: 20177,
  confirmations: 1,
  inputs: 
   [ { value: 5000000000,
       address: 'RQuXE6LxTC7WZTEZkpLxrTV2fX2aioBjrB',
       path: [Object] } ],
  outputs: 
   [ { value: 10000000,
       address: 'RQuXE6LxTC7WZTEZkpLxrTV2fX2aioBjrB',
       path: [Object] },
     { value: 4989995460,
       address: 'RJBhmLQHUNNiJNpRkcKfSCs8bU47Ew8zgU',
       path: [Object] } ],
  tx: '01000000010260ea8f1c4c0609a89a2120654cc7a2bf903dbd408d23b9d42614ef199ff063000000006a473044022036ee7381ad177e140d77123eab15e980535f2ae581c2fe633160d565f153c3e802205d348e0a49b4ed1b87e3c12665a8a61f1477ed40639b883c0190a15011e17a1e0121025ad70d43d5844fec60a406515ff86b96ac5b9c5c8c186ae571198986e23322beffffffff0280969800000000001976a914ab68d8609ddd31698303963d642164f29392e32a88acc4496d29010000001976a91461af6ad7fa4037ec97207944ac220565e98a3ab388ac00000000'
}
```

Emitted when a transaction is confirmed.

Returns tx details.


## `unconfirmed`

Emitted if a transaction was changed from
confirmed->unconfirmed as the result of a reorg.

Returns tx details.


## `balance`

> Example:

```
{
  account: -1,
  tx: 113,
  coin: 113,
  unconfirmed: 539999990920,
  confirmed: 540000000000
}
```

Emitted on balance update. Only emitted for
entire wallet balance (not individual accounts).

Returns Balance object.


## `address`

> Example:

```
[
  {
    name: 'default',
    account: 0,
    branch: 0,
    index: 13,
    witness: false,
    nested: false,
    publicKey: '0268bff8723598210c7f8fa52edbfdfaaae1f1b1377fa77bc6ac550f9e5875f844',
    script: null,
    program: null,
    type: 'pubkeyhash',
    address: 'R9zQNo4U7bUXzT7QJmVxKBrmJfp67wrK7h'
  }
]
```

Emitted when a transaction is received by the wallet account's current receive address,
causing the wallet to derive a new receive address.

Returns an array of [KeyRing](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/keyring.js) objects with new address details.
