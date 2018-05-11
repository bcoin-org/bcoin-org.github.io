# Configuring Clients

## Default Listeners
```shell--visible
# With curl you just send HTTP Requests based on further docs
# Only thing to have in mind is authentication, which is described in "Authentication" section.

curl http://127.0.0.1:18332/ # will get info from testnet
```

By default the API server listens on these `localhost` ports:

Network   | API Port
--------- | -----------
main      | 8332
testnet   | 18332
regtest   | 48332
simnet    | 18556

You can interact with bcoin with REST API as well as RPC,
there are couple of ways you can use the API:

- `bcoin-cli` - has almost all methods described
- `bcoin-cli rpc` - adds functionality that mimics Bitcoin Core RPC
- `javascript` - methods used by `bcoin-cli` can be used directly from javascript
- `curl` - you can use direct HTTP calls for invoking REST/RPC API calls

## Configuring BCOIN CLI

```shell--visible
# You can use config file
bcoin-cli --config /full/path/to/bcoin.conf

# You can configure it by passing arguments:
bcoin-cli --network=regtest info
bcoin-cli info --network=regtest

# Or use ENV variables (Starting with BCOIN_)
export BCOIN_NETWORK=regtest
export BCOIN_API_KEY=yoursecret
bcoin-cli info
```

Install `bcoin-cli` and `bwallet-cli` command line tools with the `bclient` package.
Included with `bcoin` by default, but can be installed separately:
`npm install bclient`

`bcoin-cli` params:

### General configurations are:

Config    | Options                      | Description
--------- | -----------                  | -----------
network   | `main`, `testnet`, `regtest` | This will configure which network to load, also where to look for config file
uri, url  | Base HTTP URI                | This can be used for custom port
api-key   | secret                       | Secret used by RPC for auth.

### Wallet Specific

Config    | Options         | Description
--------- | -----------     | -----------
id        | primary, custom | specify which account to use by default
token     | token str       | Token specific wallet


```shell--visible
# Example bcoin.conf syntax:
network: main
prefix: ~/.bcoin
api-key: bikeshed
```

### bcoin.conf file

[A sample bcoin.conf file is included in the code repository](https://github.com/bcoin-org/bcoin/blob/master/etc/sample.conf)




<aside class="notice">
Some commands might accept additional parameters.
</aside>

## Using Javascript Client

```javascript--visible
// all examples below will assume this initial configuration
const {NodeClient, WalletClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);
const wallet = new WalletClient(walletOptions);
```

You can also use the API with a Javascript library (used by `bcoin-cli`).
There are two objects: `NodeClient` for general API and `WalletClient` for wallet API.

`NodeClient` and `WalletClient` options:

Config    | Type                         | Description
--------- | -----------                  | -----------
network   | `main`, `testnet`, `regtest` | Network to use (doesn't lookup configs by itself)
port      | int                          | bcoin socket port (specific for each network)
apiKey    | string                       | API secret

`bcoin` also provides an object `Network` and its method `get` which will return the appropriate configuration paramaters for a specified network.
