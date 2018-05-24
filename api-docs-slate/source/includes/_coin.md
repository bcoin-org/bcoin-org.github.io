# bcoin - Coins
Getting coin information via API.

*Coin stands for UTXO*

<aside class="info">
You need to enable <code>index-address</code> in order to lookup coins by address.<br>
You can also enable <code>index-tx</code> to lookup transactions by txid.<br>
Launch the bcoin daemon with these arguments:<br>
<code>bcoin --daemon --index-address=true --index-tx=true</code><br>
These index arguments cannot be changed once bcoin has been started for the first time, without resyncing the node.
</aside>


## Get coin by Outpoint

<aside class="info">
This API call is always available regardless indexing options.
</aside>

```javascript
let hash, index;
```

```shell--vars
hash='53faa103e8217e1520f5149a4e8c84aeb58e55bdab11164a95e69a8ca50f8fcc';
index=0;
```

```shell--curl
curl $url/coin/$hash/$index
```

```shell--cli
bcoin-cli coin $hash $index
```

```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.getCoin(hash, index);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
{
  "version": 1,
  "height": -1,
  "value": 30000000,
  "script": "76a91400ba915c3d18907b79e6cfcd8b9fdf69edc7a7db88ac",
  "address": "R9M3aUWCcKoiqDPusJvqNkAbjffLgCqYip",
  "coinbase": false,
  "hash": "53faa103e8217e1520f5149a4e8c84aeb58e55bdab11164a95e69a8ca50f8fcc",
  "index": 0
}
```

Get coin by outpoint (hash and index). Returns coin in bcoin coin JSON format.
`value` is always expressed in satoshis.

### HTTP Request
`GET /coin/:hash/:index`

### URL Parameters
Parameter | Description
--------- | -----------
:hash     | Hash of tx
:index    | Output's index in tx



## Get coins by address

```javascript
let address;
```

```shell--vars
address='R9M3aUWCcKoiqDPusJvqNkAbjffLgCqYip';
```

```shell--curl
curl $url/coin/address/$address
```

```shell--cli
bcoin-cli coin $address
```

```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.getCoinsByAddress(address);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
[
  {
    "version": 1,
    "height": -1,
    "value": 10000000,
    "script": "76a91400ba915c3d18907b79e6cfcd8b9fdf69edc7a7db88ac",
    "address": "R9M3aUWCcKoiqDPusJvqNkAbjffLgCqYip",
    "coinbase": false,
    "hash": "2ef8051e6c38e136ba4d195c048e78f9077751758db710475fa532b9d9489324",
    "index": 0
  },
  ...
  ...
  {
    "version": 1,
    "height": -1,
    "value": 50000000,
    "script": "76a91400ba915c3d18907b79e6cfcd8b9fdf69edc7a7db88ac",
    "address": "R9M3aUWCcKoiqDPusJvqNkAbjffLgCqYip",
    "coinbase": false,
    "hash": "b3c71dd8959ea97d41324779604b210ae881cdaa5d5abfcbfb3502a0e75c1283",
    "index": 0
  }
]
```

Get coin objects array by address.

### HTTP Request
`GET /coin/address/:address`

### URL Parameters
Parameter | Description
--------- | -----------
:address  | bitcoin address



## Get coins by addresses

```javascript
let address0, address1;
```

```shell--vars
address0='RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ';
address1='RHpAA3ZmmmWF6FW8qSfaEvh1jR1nUmVYnj';
```

```shell--curl
curl $url/coin/address \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "addresses":[ "'$address0'", "'$address1'" ]}'
```

```shell--cli
No CLI Option.
```

```javascript
const {NodeClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('regtest');

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'api-key'
}

const client = new NodeClient(clientOptions);

(async () => {
  const result = await client.getCoinsByAddresses([address0, address1]);
  console.log(result);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
[
  {
    "version": 1,
    "height": -1,
    "value": 87654321,
    "script": "76a914a4ecde9642f8070241451c5851431be9b658a7fe88ac",
    "address": "RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ",
    "coinbase": false,
    "hash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
    "index": 0
  },
  {
    "version": 1,
    "height": -1,
    "value": 12345678,
    "script": "76a9145d9c4bf7f9934668c054f1b1a5589632ddc2b5b088ac",
    "address": "RHpAA3ZmmmWF6FW8qSfaEvh1jR1nUmVYnj",
    "coinbase": false,
    "hash": "c87c13635f6004a802676a7f93bf90a4b27b433cf26db0c41a656f377406f3e3",
    "index": 0
  }
]

```

Get coins by addresses, returns array of coin objects.

### HTTP Request
`POST /coin/address`

### POST Parameters (JSON)
Parameter | Description
--------- | -----------
addresses | List of bitcoin addresses
