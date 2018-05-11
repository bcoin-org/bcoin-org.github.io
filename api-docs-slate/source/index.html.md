---
title: Bcoin API Reference

home_link: http://bcoin.io

language_tabs: # must be one of https://git.io/vQNgJ
  - shell--curl: cURL
  - shell--cli: CLI
  - javascript

toc_footers:
  - <a href='http://bcoin.io/slack-signup.html'>Join us on Slack</a>
  - <a href='https://github.com/bcoin-org/bcoin'>See the code on GitHub</a>
  - <a href='http://bcoin.io/guides.html'>Browse the guides</a>
  - <a href='http://bcoin.io/docs/index.html'>Full API Documentation</a>
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
  - wallet_events
  - errors

search: true
---

# Introduction

Welcome to the Bcoin API!

The default bcoin HTTP server listens on the standard RPC port (`8332` for main, `18332` for testnet, `48332` for regtest, and `18556` default for simnet). It exposes a REST json api, as well as a JSON-RPC api.

# Authentication
## Auth

```shell--curl
curl http://x:api-key@127.0.0.1:8332/ # will get info from mainnet (port 8332)

# examples in these docs will use an environment variable:
url=http://x:api-key@127.0.0.1:8332/
curl $url
```

```shell--cli
# store key in an environment variable:
export BCOIN_API_KEY=api-key
bcoin-cli info
```

```javascript
const {NodeClient, WalletClient} = require('bclient');
const client = new NodeClient({
  apiKey: 'api-key',
  //...
});

const wallet = new WalletClient({
  apiKey: 'api-key',
  //...
});
```

> Make sure to replace `api-key` with your own key.

Auth is accomplished via HTTP Basic Auth, using your node's API key (passed via --api-key).

<aside class="notice">
You must replace <code>api-key</code> with your personal API key.
</aside>

<aside class="warning">
If you intend to use API via network and setup <code>api-key</code>, make sure to setup <code>ssl</code> too.
</aside>
