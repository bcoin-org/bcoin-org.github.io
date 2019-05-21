---
title: Bcoin API Reference

home_link: https://bcoin.io

language_tabs: # must be one of https://git.io/vQNgJ
  - shell--curl: cURL
  - shell--cli: CLI
  - javascript

toc_footers:
  - <a href='https://bcoin.io/slack-signup.html'>Join us on Slack</a>
  - <a href='https://github.com/bcoin-org/bcoin'>See the code on GitHub</a>
  - <a href='https://bcoin.io/guides.html'>Browse the guides</a>
  - <a href='https://bcoin.io/docs/index.html'>Full API Documentation</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - clients
  - node
  - coin
  - transaction
  - node_rpc
  - node_rpc_general
  - node_rpc_chain
  - node_rpc_block
  - node_rpc_mempool
  - node_rpc_tx
  - node_rpc_mining
  - node_rpc_network
  - wallet
  - wallet_admin
  - wallet_tx
  - wallet_accounts
  - wallet_rpc
  - sockets
  - node_sockets
  - wallet_sockets
  - errors

search: true
---

# Introduction

Welcome to the bcoin API!

The default bcoin HTTP server listens on the standard RPC port (`8332` for main, `18332` for testnet, `48332` for regtest, and `18556` default for simnet). It exposes a REST JSON, as well as a JSON-RPC api.

<aside class="notice">
These docs have been updated to latest version of bcoin and bclient as of May 30 2018 (bcoin version <code>v1.0.0-pre</code>).
Version v1.0.0-pre of bcoin introduced breaking changes from all previous versions (v1.0.0-beta.15 and earlier).
As of this writing the bcoin npm repository has not yet been updated, so it is recommended to install from the latest master branch on github. 
Installation instructions are available there: <a href="https://github.com/bcoin-org/bcoin">https://github.com/bcoin-org/bcoin</a>
</aside>

# Authentication
## Auth

```shell--curl
# default regtest port is 48332 (may be reconfigured by user), API key is required in URL
curl http://x:api-key@127.0.0.1:48332/

# examples in these docs will use an environment variable:
url=http://x:api-key@127.0.0.1:48332/
curl $url
```

```shell--cli
bcoin-cli --api-key=api-key --network=regtest info

# store API key and network type in environment variables:
export BCOIN_API_KEY=api-key
export BCOIN_NETWORK=regtest
bcoin-cli info
```

```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

// network type derived from bcoin object, client object stores API key
const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const clientinfo = await client.getInfo();
  console.log(clientinfo);
})();
```

> Make sure to replace `api-key` with your own key.

Auth is accomplished via HTTP Basic Auth, using your node's API key.

<aside class="notice">
You must replace <code>api-key</code> with your own, strong API key.<br>
<br>
A good way to generate a strong key is to use the <code>bcrypto</code> module that is installed as a 
dependency for <code>bcoin</code>. From your bcoin directory (or anywhere, if <code>bcrypto</code> is installed globally), run:<br>
<code>node -e "bcrypto=require('bcrypto'); console.log(bcrypto.random.randomBytes(32).toString('hex'))"</code><br>
Which will generate and output a securley random, 32-byte hex string.<br>
This string could be saved in <code>bcoin.conf</code> to persist over restarts, or it may be passed to bcoin
at launch (for example):<br>
<code>bcoin --api-key=92ded8555d6f04e440ba540f2221349cbf799c454f7e08d3f16577d3e0127b0e</code><br>
<br>
For more information about <code>bcoin.conf</code> and other launch paramaters, see
<a href="https://github.com/bcoin-org/bcoin/blob/master/docs/configuration.md">docs/Configuration</a>.
</aside>

<aside class="warning">
If you intend to use API via network and setup <code>api-key</code>, make sure to setup <code>ssl</code> too.
</aside>
