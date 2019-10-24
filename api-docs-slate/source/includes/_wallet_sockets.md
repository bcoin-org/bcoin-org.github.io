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
const {WalletClient, Network} = require('bcoin');
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
  "hash": "e0ef577e307b9b798bf98a7aa56ebab431d1918f6c8b29ddd8a89dce5314acca",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1571774743,
  "date": "1970-01-01T00:00:00Z",
  "mdate": "2019-10-22T20:05:43Z",
  "size": 226,
  "virtualSize": 226,
  "fee": 4540,
  "rate": 20088,
  "confirmations": 0,
  "inputs": [
    {
      "value": 2500000000,
      "address": "mhX1xHbKGzw3r8FoN5bUkmRixHPEDNywxh",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/1"
      }
    }
  ],
  "outputs": [
    {
      "value": 10000000,
      "address": "msSaQkCXyrEefbSH9TCSWNjnacTwGGc55d",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/4"
      }
    },
    {
      "value": 2489995460,
      "address": "mtwN3Z4R7Mjdn1Dt6eDCUwoPdYKNFu6oiX",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/5"
      }
    }
  ],
  "tx": "0100000001bf932f6585ce47d552c9f18463820bb4064b97b032606a122947aba4e14f77e6000000006b4830450221009aa7abc5bcc058bbb3c85ea53fdc19bae9351a81ad3f6027b6dfc0437fb1010502202e768a07a9e073833fc7039bebfd5b9b4edc373159e93d5917f074c53355187201210336c99e45e00b73c863497a989fe6feb08439ca2d7cf98f55bc261ed70ed28a7bffffffff0280969800000000001976a91482cd93c2cbdd094599a92ce3317d3087a1975e0a88acc4506a94000000001976a9149337719ab611d0da2ec1317dd195844661e3732f88ac00000000"
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
  "hash": "e0ef577e307b9b798bf98a7aa56ebab431d1918f6c8b29ddd8a89dce5314acca",
  "height": 846,
  "block": "636982487fccf820bc1ca825b2cdd94be1bdd9863e8dec01979b62b45d894e73",
  "time": 1571774818,
  "mtime": 1571774743,
  "date": "2019-10-22T20:06:58Z",
  "mdate": "2019-10-22T20:05:43Z",
  "size": 226,
  "virtualSize": 226,
  "fee": 4540,
  "rate": 20088,
  "confirmations": 1,
  "inputs": [
    {
      "value": 2500000000,
      "address": "mhX1xHbKGzw3r8FoN5bUkmRixHPEDNywxh",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/1"
      }
    }
  ],
  "outputs": [
    {
      "value": 10000000,
      "address": "msSaQkCXyrEefbSH9TCSWNjnacTwGGc55d",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/4"
      }
    },
    {
      "value": 2489995460,
      "address": "mtwN3Z4R7Mjdn1Dt6eDCUwoPdYKNFu6oiX",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/5"
      }
    }
  ],
  "tx": "0100000001bf932f6585ce47d552c9f18463820bb4064b97b032606a122947aba4e14f77e6000000006b4830450221009aa7abc5bcc058bbb3c85ea53fdc19bae9351a81ad3f6027b6dfc0437fb1010502202e768a07a9e073833fc7039bebfd5b9b4edc373159e93d5917f074c53355187201210336c99e45e00b73c863497a989fe6feb08439ca2d7cf98f55bc261ed70ed28a7bffffffff0280969800000000001976a91482cd93c2cbdd094599a92ce3317d3087a1975e0a88acc4506a94000000001976a9149337719ab611d0da2ec1317dd195844661e3732f88ac00000000"
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
    "name": "default",
    "account": 0,
    "branch": 0,
    "index": 16,
    "witness": false,
    "nested": false,
    "publicKey": "0370d759cf5170e718ab02fccf844bc69a3c9ad6ece9899be55455930fb85ff674",
    "script": null,
    "program": null,
    "type": "pubkeyhash",
    "address": "mfzcPvKYNjzULJRjbaAhdR8fEJsTg7SSsV"
  }
]
```

Emitted when a transaction is received by the wallet account's current receive address,
causing the wallet to derive a new receive address.

Returns an array of [KeyRing](https://github.com/bcoin-org/bcoin/blob/master/lib/primitives/keyring.js) objects with new address details.
