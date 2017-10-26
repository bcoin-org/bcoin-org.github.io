# Wallet Events

## Using Wallet Sockets
Wallet events use the socket.io protocol.

Socket IO implementations:

- JS: https://github.com/socketio/socket.io-client
- Python: https://github.com/miguelgrinberg/python-socketio
- Go: https://github.com/googollee/go-socket.io
- C++: https://github.com/socketio/socket.io-client-cpp

### Wallet Socket Auth

Authentication with the API server must be completed before any other events
will be accepted.

Note that even if the server API key is disabled on the test server, the
`wallet auth` event must still be sent to complete the handshake.

`emit('wallet auth', 'server-api-key')`

The server will respond with a socket.io ACK packet once auth is completed.

### Listening on a wallet

After creating a websocket and authing with the server, you must send a `wallet
join` event to listen for events on a wallet.

`emit('wallet join', 'wallet-id', 'wallet-token')`

### Unlistening on a wallet

`emit('wallet leave', 'wallet-id')`


## `version`

Emitted on connection.

Returns version. Object in the form:
`[{ version: 'v1.0.0-alpha', agent: '/bcoin:v1.0.0-alpha/', network: 'main' }]`.

## `wallet tx`

Received on transaction.

> Example:

``` json
{
  "wid": 1,
  "id": "primary",
  "hash": "0de09025e68b78e13f5543f46a9516fa37fcc06409bf03eda0e85ed34018f822",
  "height": -1,
  "block": null,
  "time": 0,
  "mtime": 1486685530,
  "date": "2017-02-10T00:12:10Z",
  "index": -1,
  "size": 226,
  "virtualSize": 226,
  "fee": "0.0000454",
  "rate": "0.00020088",
  "confirmations": 0,
  "inputs": [
    {
      "value": "50.0",
      "address": "n4UANJbj2ZWy1kgt9g45XFGp57FQvqR8ZJ",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/0"
      }
    }
  ],
  "outputs": [
    {
      "value": "5.0",
      "address": "mu5Puppq4Es3mibRskMwoGjoZujHCFRwGS",
      "path": {
        "name": "default",
        "account": 0,
        "change": false,
        "derivation": "m/0'/0/7"
      }
    },
    {
      "value": "44.9999546",
      "address": "n3nFYgQR2mrLwC3X66xHNsx4UqhS3rkSnY",
      "path": {
        "name": "default",
        "account": 0,
        "change": true,
        "derivation": "m/0'/1/0"
      }
    }
  ],
  "tx": "0100000001c5b23b4348b7fa801f498465e06f9e80cf2f61eead23028de14b67fa78df3716000000006b483045022100d3d4d945cdd85f0ed561ae8da549cb083ab37d82fcff5b9023f0cce608f1dffe02206fc1fd866575061dcfa3d12f691c0a2f03041bdb75a36cd72098be096ff62a810121021b018b19426faa59fdda7f57e68c42d925752454d9ea0d6feed8ac186074a4bcffffffff020065cd1d000000001976a91494bc546a84c481fbd30d34cfeeb58fd20d8a59bc88ac447b380c010000001976a914f4376876aa04f36fc71a2618878986504e40ef9c88ac00000000"
}
```

## `wallet conflict`

Received on double spend.

Returns tx details of removed double spender.

## `wallet confirmed`

Received when a transaction is confirmed.

Returns tx details.

## `wallet unconfirmed`

Received if a transaction was changed from
confirmed->unconfirmed as the result of a reorg.

Returns tx details.

## `wallet balance`

Received on balance update. Only emitted for
entire wallet balance (not individual accounts).

> Example:

``` json
{
  "wid": 1,
  "id": "primary",
  "unconfirmed": "8149.9999546",
  "confirmed": "8150.0"
}
```

## `wallet address`

Received when a new address is derived.

> Example:

``` json
{
  "network": "regtest",
  "wid": 1,
  "id": "primary",
  "name": "default",
  "account": 0,
  "branch": 0,
  "index": 9,
  "witness": false,
  "nested": false,
  "publicKey": "02801d9457837ed50e9538ee1806b6598e12a3c259fdc9258bbd32934f22cb1f80",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "mwX8J1CDGUqeQcJPnjNBG4s97vhQsJG7Eq"
}
```