# Wallet Admin Commands

Admin commands are simply commands no specific to any particular wallet, and may
impact all wallets on the system.

Additional security is available by specifying `admin-token` in your configuration
if `wallet-auth` is also enabled. If `admin-token` is specified, add `?token=`
to all admin requests.

This is highly recommended, especially on production instances.

## Wallet Rescan
```javascript
let height;
```

```shell--vars
height = 50000
```

```shell--curl
curl $walleturl/rescan \
  -X POST \
  --data '{"height": '$height'}'
```

```shell--cli
bwallet-cli rescan $height
```

```javascript
const height = 50000;
const {WalletClient} = require('bclient');
const { Network } = require('bcoin');
const network = Network.get('testnet');

const walletClient = new WalletClient({
  port: network.walletPort,
  network: network.type
});

(async () => {
  await walletClient.rescan(height);
})();

```

> Response Body:

```json
{"success": true}
```

Initiates a blockchain rescan for the walletdb. Wallets will be rolled back to the specified height (transactions above this height will be unconfirmed).

### Example HTTP Request
`POST /rescan?height=50000`


## Wallet Resend
```shell--curl
curl $walleturl/resend \
-X POST
```

```shell--cli
bwallet-cli resend
```

```javascript
const {WalletClient} = require('bclient');
const { Network } = require('bcoin');
const network = Network.get('testnet');

const walletClient = new WalletClient({
  port: network.walletPort,
  network: network.type
});

(async () => {
  await walletClient.resend();
})();

```

> Response Body:

```json
    {"success": true}
```

Rebroadcast all pending transactions in all wallets.

### HTTP Request

`POST /resend`

##Wallet Backup
```javascript
let path;
```

```shell--vars
path='/path/to/new/backup'
```

```shell--curl
curl $walleturl/backup?path=/home/user/walletdb-backup.ldb \
  -X POST \
```

```shell--cli
bwallet-cli backup $path
```

```javascript
const {WalletClient} = require('bclient');
const { Network } = require('bcoin');
const network = Network.get('testnet');

const walletClient = new WalletClient({
  port: network.walletPort,
  network: network.type
});

(async () => {
  await walletClient.backup(path);
})();

```

> Response Body:

```json
{"success": true}
```

Safely backup the wallet database to specified path (creates a clone of the database).

### HTTP Request

`POST /backup?path=/home/user/walletdb-backup.ldb`

## List all Wallets

```shell--curl
curl $walleturl/wallet
```

```shell--cli
bwallet-cli wallets
```

```javascript
const {WalletClient} = require('bclient');
const { Network } = require('bcoin');
const network = Network.get('testnet');

const walletClient = new WalletClient({
  port: network.walletPort,
  network: network.type
});

(async () => {
  const wallets = await walletClient.getWallets();
  console.log(wallets)
})();

```

> Sample Response Body:

```json
[
  "primary",
  "test"
]
```

List all wallet IDs. Returns an array of strings.

### HTTP Request

`GET /wallet`
