# Configuring Clients

## Default Listeners
```shell--visible
# With curl you just send HTTP Requests based on further docs
curl http://127.0.0.1:48332/ # will get info from regtest
```

By default the API server listens on these `localhost` ports:

Network   | API Port
--------- | -----------
main      | 8332
testnet   | 18332
regtest   | 48332
simnet    | 18556

You can interact with bcoin with its REST API as well as with RPC.
There are couple of ways you can use the API:

- `bcoin-cli` - methods built specifically into bcoin by its developers
- `bcoin-cli rpc` - adds functionality that mimics Bitcoin Core RPC
- `javascript` - methods used by `bcoin-cli` can be accessed directly from javascript
- `curl` - you can use direct HTTP calls for invoking both REST and RPC API calls

Only thing to keep in mind is authentication, which is described in the ["Authentication"](#authentication) section.


## Configuring bcoin-cli

```shell--visible
# You can configure it by passing arguments:
bcoin-cli --network=regtest info
bcoin-cli info --network=regtest

# Or use environment variables (Starting with BCOIN_)
export BCOIN_NETWORK=regtest
export BCOIN_API_KEY=$YOUR-API-KEY
bcoin-cli info
```

Install `bcoin-cli` and `bwallet-cli` command line tools with the `bclient` package.
Included with `bcoin` by default, but can be installed separately:
`npm install -g bclient`

`bcoin-cli` params:

### General configurations are:

Config    | Options                      | Description
--------- | -----------                  | -----------
network   | `main`, `testnet`, `regtest` | This will configure which network to load, also where to look for `bcoin.conf` file
uri, url  | Base HTTP URI                | This can be used for custom port
api-key   | _string_                       | Secret used by RPC for authorization

### Wallet Specific

Config    | Options         | Description
--------- | -----------     | -----------
id        | _string_ | specify which account to use by default
token     | _string_       | Token specific wallet


```shell--visible
# Example bcoin.conf syntax:
network: main
prefix: ~/.bcoin
api-key: <api-key>
```

### bcoin.conf and wallet.conf files

These files may contain any of the configuration parameters, and will be interpreted by bclient at startup. The node and wallet clients look for their own respective conf files.

[A sample bcoin.conf file is included in the code repository](https://github.com/bcoin-org/bcoin/blob/master/etc/sample.conf)

[Detailed configuration documentation is available in docs/configuration](https://github.com/bcoin-org/bcoin/blob/master/docs/configuration.md)



<aside class="notice">
Some commands might accept additional parameters.
</aside>

## Using Javascript Clients

```javascript--visible
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
`bcoin` also provides an object `Network` and its method `get` which will return the default configuration paramaters for a specified network.
Custom port numbers are also configurable by the user.

`NodeClient` and `WalletClient` options:

Config    | Type                         | Description
--------- | -----------                  | -----------
network   | _string_ | Network to use: `main`, `testnet`, `regtest`
port      | _int_                          | bcoin socket port (specific for each network)
apiKey    | _string_                       | API secret

