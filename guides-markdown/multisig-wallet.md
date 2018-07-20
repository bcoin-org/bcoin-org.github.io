# Using bcoin wallet node for multisig wallet

```post-author
Joe Miyamoto <joemphilips@gmail.com>
```

```post-description
How to use bcoin with a multisig wallet and account. For both as a hot-wallet and as a watch-only-wallet.
```

## How it works

Bitcoin multisig account is an account which holds more than 1 public key,
and generates P2SH or P2WSH address for those public keys.
When you want to use those funds,
you must create a multisig transaction which has been signed by private keys corresponding to those public keys.
See [our multisig transaction guide](http://bcoin.io/guides/multisig-tx.html) for more detail about the multisig transaction itself.

In this guide, we take it a little step further and see a whole lifecycle of the multisig account in a more practical way.

## Usecases

### 1. Personal wallet which is secure against key compromise

Usually in a cryptocurrency world, when you lose your master key and it's seed for the wallet there is no way to recover your funds.
But by splitting your secret keys into ...

1. your own laptop.
2. hardware wallet you own.
3. a paper wallet in your personal vault

...your funds will be safe unless more than one key is compromised at the same time.
In this case, you may use 1. and 2. for usual spending,
and only need 3 if you lose your secret keys 1 and 2.

### 2. Wallet held by more than one person

Sometimes it is desireable to distribute the control of funds among several people.
For example, funds for a corporation or for a crowdfunding project.
We can mitigate the risk of fund loss by utilizing a multisig in cases where single person with control:

1. Is no longer in charge
2. Disappears suddenly
3. Loses their secret-key
4. Tries to steal all funds for their own personal use

## Walk-through

 This tutorial includes the following steps
 1. setting up a bcoin wallet server with https
 2. setting up a hot wallet on the server
 3. setting up a watch-only multisig wallet on your server
 4. receive incoming information from the wallet server
 5. spend funds from the wallet
 6. recovering the wallet

### 1. Setting up bcoin wallet server with https.

Q. Why using https(ssl/tls) ?

A. There are two reason to use https.

1. For better privacy and security ... since all commands to a server is encrypted, no one is able to eavesdrop the communication. This is a same motivation behind [bip150](https://github.com/bitcoin/bips/blob/master/bip-0150.mediawiki) and [bip151](https://github.com/bitcoin/bips/blob/master/bip-0151.mediawiki)
2. To collaborate with others easily ... in later secrion, we are showing how to use watch-only wallet with more than one people. In those situation, some might not be familiar with accessing the server with IP address, or want to access from browser, or don't want to bother himself remember(and track) IP address for the server.

We assume you already have gotten your domain name somehow,
and that is `bcoin.multisigtest.com`.

Let's create ssl certification for your domain by [let's encrypt](https://letsencrypt.org/)

This time, we are using [certbot](https://certbot.eff.org/) as an ACME client

First, install [certbot](https://certbot.eff.org/lets-encrypt/ubuntuxenial-other)
and run `sudo certbot --manual certonly` to run interactive setup.
This will create certification and private key under `/etc/letsencrypt/archive/<url>`

> You'd better use [certbot docker image](https://hub.docker.com/r/certbot/certbot/) if you want to create wildcard certificate.

Next, let's create `~/.bcoin/bcoin.conf` and `~/.bcoin/wallet.conf` something like below.

Our `bcoin.conf` is

```bash
# Let's first try with the testnet.
# Moving to the mainnet could be done at anytime you get comfortable with the security model.
network: testnet

# this option is something similar to `-rpcallowip`  in bitcoind.
# This time, we enable public access
http-host: ::

# use ssl certification and private key specified above
ssl: true
ssl-cert: /etc/letsencrypt/archive/bcoin.multisigtest.com/fullchain1.pem
ssl-key: /etc/letsencrypt/archive/bcoin.multisigtest.com/privkey1.com

# It is good idea to always use an api key for security
# Note: We recommend to make it longer and harder to guess in the real environment.
# Here we are making it simple for explanation purpose.
api-key: mySecretApiKey
```

and `wallet.conf`.

> Note that you must place `wallet.conf` under `~/.bcoin/testnet` if you are trying in testnet (or under `~/.bcoin/regtest` if in regtest mode)


```bash
# If you want to run the wallet on the different place from the node, 
# you must specify these. But this time, we are going ro run at the same place.
# node-host: bcoin.multisigtest.com
# node-port: 18332
# node-ssl: true
# node-api-key: mySecretApiKey

# Since we are running wallet at the same place, these are the same with node's
ssl: true
ssl-cert: /etc/letsencrypt/archive/bcoin.multisigtest.com/fullchain1.pem
ssl-key: /etc/letsencrypt/archive/bcoin.multisigtest.com/privkey1.com

# Using a same api-key with node's for simplicity.
api-key: mySecretApiKey

# This will enforce you to submit a wallet-specific token or admin-token explicitly when accessing to a wallet.
wallet-auth: true

# authorization token to perform admin functions for wallets
# it can be any 32 bytes hex string you prefer
admin-token: 959f407c35f3bc4e33a643f9c0e6bbcf0c6c1f65c16bb2e20edcb3197c1fd034

# This will make every account created in this wallet node to use segwit.
# Using segwit has many benefits e.g. lower fee. Just turn this on unless you have any special reason to not.
witness: true

# Useful for debugging.
log-level: debug
log-console: true
log-file: true
```

> You can check full list of configurable variable [here](https://github.com/bcoin-org/bcoin/blob/master/docs/Configuration.md)

By default, rpc port for wallet command in testnet is `18334` so lets check if it's running correctly
by querying the wallet name `primary` (i.e. default wallet.)

```bash
url="https://x:mySecretApiKey@bcoin.multisigtest.com:18334"
myadmintoken="959f407c35f3bc4e33a643f9c0e6bbcf0c6c1f65c16bb2e20edcb3197c1fd034"
curl ${url}/wallet/primary?token=${myadmintoken}
```

If it works, you will see the information of the wallet including it's `token`

Since we have set `wallet-auth` to true in `wallet.conf`, each wallet's are seperated by it's own authorization token. 

And then you can query by

```bash
curl $url/wallet/primary?token=${primarytoken}
```

### 2. Setting up hot wallet on the server.

Now let's create a multisig account in this `primary` wallet.

TODO:

### 3. Setting up a watch-only multisig wallet

Here, we will create a multisig account as we did above with one difference.
This time, the wallet is watch-only. So no private key will be on the server.

Let's assume this wallet is for managing funds for three people.
You, Alice, and Bob.

> NOTE: Strictly speaking, there is no such a thing *watch-only account*.
> Accounts will never hold a private key no matter the wallet which it belongs to holds it's master private key or not.
> If the wallet does, then it is able to derive account private key so the account will be *hot* .
> In fact, this is the way how bcoin actually handles it's private key for an account, it derives every time when it's need.
> If the wallet doesn't hold master private key (i.e. if it's watch-only), then an account derived from the wallet will be also watch-only.

we can set watch-only wallet named `sharedWallet1` on bcoin node by

```bash
curl -X PUT $url/wallet/sharedWallet1 --data '
  {"watchOnly": true, "type": "multisig", "m": 2, "n": 3 }
  '

# or by cli tool (installed with `npm i -g bclient`)
bwallet-cli \
  --url=${url} \
  --network=testnet \
  --api-key=mySecretApiKey \
  --token=${myadmintoken} \ # Must use your admin token to create a new wallet
  --watch-only=true \ # make it watch only
  --type=multisig \
  --m=2 \
  --n=3 \
  mkwallet sharedWallet1
```

Wallet will always have account named `default` when it's created.
This is the multisig account we are going to use.

> NOTE: this time, we specified `type` for the wallet. But strictly speaking again, wallet itself does not hold property if it is multisig or not.
> So some options we have passed here (i.e. `type`, `m`, and `n`) are for the default account created with the wallet.

If the wallet is created successfully, than you will see the access token for that wallet in the return value.
So let's set that token into variable named `sharedWalletToken` and pass to co-signers.

You must register your public key to this `default` account. Let's do it by using bcoin api.

TODO: create and register key.

```js

```

Next, cosigner Alice should create tpub too and set it to the account.
Although it is possible that Alice can create it in the same way you did,
lets assume that Alice uses [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) in her software.
So the code will be something like ...

```js
const bjs = require("bitcoinjs-lib")
const masterHD = new bjs.bip32.fromSeed(Buffer.from("ffffffffffffffffffffffffffffffff", "hex"), bjs.networks.testnet)
// We are using segwit so following bip84
const tpub = masterHD.derivePath("m/84'/0'/3'").neutered().toBase58()
console.log(tpub)
```

and throw it to the bcoin server

```bash
curl -X PUT ${url}/wallet/sharedWallet1/shared-key\?token\=${sharedWalletToken} \
  --data \ 
  '{
    "account": "default",
    "accountKey": '"${aliceTpub}"',
    }'
```

> NOTE: It is possible to delete the xpub(tpub) from the wallet if the number of keys registered hasn't reached to `n`.
> This could be useful when you accidentally registered a wrong key.
> But if it has reached to `n` , you must create a new account.

Finally, do the same thing for Bob. Then the multisig account is ready.

### 4. Receive incoming information from the wallet server.

Ok, so let's check the wallet's status by

```bash
curl ${url}/wallet/sharedWallet1/account/default?token=${sharedWalletToken}
```

You should see something like

```json
{
  "name": "default",
  "initialized": true,
  "witness": true,
  "watchOnly": true,
  "type": "multisig",
  "m": 2,
  "n": 3,
  "accountIndex": 1,
  "receiveDepth": 1,
  "changeDepth": 1,
  "nestedDepth": 1,
  "lookahead": 10,
  "receiveAddress": "tb1..." , // bech32 address for receiving
  "changeAddress": "tb1...", // address for change
  "nestedAddress": "2M...", // base58check address for P2SH-nested-P2WSH,
  "accountKey": "tpub...", // tpubs you've registered above
  "keys": [
    "tpub...",
    "tpub..."
  ],
  "balance": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": 0,
    "confirmed": 0
  }
}
```

You can see that values in a `balance` are all zero.
So before going to the next section, please send the fund to the account's address.

But before sending, let's listen on to the wallet with websocket interface

```bash
bwallet-cli --id=sharedWallet1 \
  --url=${url} \
  --network=testnet \
  --api-key=mySecretApiKey \
  --token=${sharedWalletToken} \
  listen
```

Sending can be done in anyway you like.
Check out our [TX creation guide](http://bcoin.io/guides/working-with-txs.html) if you want to do it using bcoin api.

Ready? than let's continue

### 5. Spending funds from the wallet.

> TODO: wait till [issue No. 444](https://github.com/bcoin-org/bcoin/pull/444) solves.
> Till that, we assume mktx will return the same value with hot wallet


### 6. Recovering the wallet.

Having private key in local itself doesn't mean that your funds are safe.
even when the node is compromised or deleted completely, you must be able to recover it.
So let's assume that `sharedWallet1` has been deleted completely.

Recovering procedure is quite simple.
You just repeat the public key registration process as we did above, and run `rescan` command at the end.

```bash
# create watch-only wallet with default multisig account.
bwallet-cli \
  --url=${url} \
  --network=testnet \
  --api-key=mySecretApiKey \
  --token=${myadmintoken} \ # Must use your admin token to create a new wallet
  --watch-only=true \ # make it watch only
  --type=multisig \
  --m=2 \
  --n=3 \
  mkwallet sharedWallet2

# copy a wallet token from return value
# and set it into sharedWalletToken2

# add shared xpub(tpub) again. You must repeat this `n` times for all keys
bwallet-cli \
  --id=sharedWallet2 \
  --url=${url} \
  --network=testnet \
  --api-key=mySecretApiKey \
  --token=${sharedWalletToken2} \
  --account=default \
  shared add <tpub...>

# and then rescan
bwallet-cli \
  --id=sharedWallet2 \
  --url=${url} \
  --network=testnet \
  --api-key=mySecretApiKey \
  --token=${sharedWalletToken2} \ # rescanning requires admin token
  --account=default \
  rescan 10000  # start rescanning from height 10000
```

> NOTE: rescan is only possible in full archival node.
> If your node currently runs in spv or pruned mode,
> you must change the node settings and run the `reset` command on the node
> to make it full archive node.

You can specify block height from which node starts rescanning.
This will speed up rescanning process, but make sure to start from the number lower than first time the wallet has received the incoming tx.

Currently, rescanning takes significant amount of time and some functionality in node might stop. This might improve in future release
> refs: https://github.com/bcoin-org/bcoin/issues/294
