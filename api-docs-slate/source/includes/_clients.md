# Configuring Clients

## Default Listeners
```shell--visible
# With curl you just send HTTP Requests based on further docs
# Only thing to have in mind is Authentication, which is described in Auth section.

curl http://127.0.0.1:18332/ # will get info from testnet
```

By default API listens on these addresses:

Network   | API Port
--------- | -----------
main      | 8332
testnet   | 18332
regtest   | 48332
simnet    | 18556

You can interact with bcoin with REST Api as well as RPC,
there are couple of ways you can use API.

- `bcoin-cli` - has almost all methods described to be used.
- `javascript` - Clients used by `bcoin-cli` can be used directly from javascript
- `curl` - or you can use direct HTTP calls for invoking REST/RPC API calls.

## Configuring BCOIN CLI

```shell--visible
# You can use config file
bcoin-cli --config /full/path/to/bcoin.conf

# Or with prefix (which will later load bcoin.conf file from the directory)
bcoin-cli --prefix /full/path/to/bcoin/dir

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
prefix    | dir path                     | This accepts directory where DBs and `bcoin.conf` are located.
network   | `main`, `testnet`, `regtest` | This will configure which network to load, also where to look for config file
uri, url  | Base HTTP URI                | This can be used for custom port
api-key   | secret                       | Secret used by RPC for auth.

### Wallet Specific

Config    | Options         | Description
--------- | -----------     | -----------
id        | primary, custom | specify which account to use by default
token     | token str       | Token specific wallet

<aside class="notice">
Some commands might accept additional parameters.
</aside>

## Using Javascript Client

```javascript--visible
const bcoin = require('bcoin');
const Client = bcoin.http.Client;
const Wallet = bcoin.http.Wallet;

const client = new Client({
  network: 'testnet',
  uri: 'http://localhost:18332'
});

const wallet = new Wallet({
  network: 'testnet',
  uri: 'http://localhost:18332',
  id: 'primary'
});
```

You can also use api with Javascript Library (used by `bcoin-cli`).
There are two objects: `bcoin.http.Client` for general API and `bcoin.http.Wallet` for wallet API.

`bcoin.http.Client` options:

Config    | Type                         | Description
--------- | -----------                  | -----------
network   | `main`, `testnet`, `regtest` | Network to use (doesn't lookup configs by itself)
uri       | String                       | URI of the service
apiKey    | String                       | api secret

`bcoin.http.Wallet` options:

Config    | Type                         | Description
--------- | -----------                  | -----------
network   | `main`, `testnet`, `regtest` | Network to use (doesn't lookup configs by itself)
uri       | String                       | URI of the service
apiKey    | String                       | api secret
id        | primary, custom              | specify which account to use by default
token     | token str                    | Token specific wallet
