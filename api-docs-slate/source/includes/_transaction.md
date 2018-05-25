# bcoin - Transactions
Getting transaction information via API.

<aside class="info">
You need to enable <code>index-address</code> in order to lookup coins by address.<br>
You can also enable <code>index-tx</code> to lookup transactions by txid.<br>
Launch the bcoin daemon with these arguments:<br>
<code>bcoin --daemon --index-address=true --index-tx=true</code>
</aside>

## Get tx by txhash

```javascript
let txhash;
```

```shell--vars
txhash='4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586';
```

```shell--curl
curl $url/tx/$txhash
```

```shell--cli
bcoin-cli tx $txhash
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
  const result = await client.getTX(txhash);
  console.log(result);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
{
  "hash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
  "witnessHash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
  "fee": 4540,
  "rate": 20088,
  "mtime": 1527029380,
  "height": -1,
  "block": null,
  "time": 0,
  "index": -1,
  "version": 1,
  "inputs": [
    {
      "prevout": {
        "hash": "a88387ca68a67f7f74e91723de0069154b532bf024c0e4054e36ea2234251181",
        "index": 0
      },
      "script": "4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46a",
      "witness": "00",
      "sequence": 4294967295,
      "coin": {
        "version": 1,
        "height": 36,
        "value": 5000000000,
        "script": "76a91420a060fec9a7dfac723c521e168876909aa37ce588ac",
        "address": "RCFhpyWXkz5GxskL96q4KtceRXuAMnWUQo",
        "coinbase": true
      }
    }
  ],
  "outputs": [
    {
      "value": 87654321,
      "script": "76a914a4ecde9642f8070241451c5851431be9b658a7fe88ac",
      "address": "RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ"
    },
    {
      "value": 4912341139,
      "script": "76a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac",
      "address": "RHefJ5hLW9jyEwwdxhci6r7AH7SAxdpGW3"
    }
  ],
  "locktime": 0,
  "hex": "01000000018111253422ea364e05e4c024f02b534b156900de2317e9747f7fa668ca8783a8000000006b4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff02b17f3905000000001976a914a4ecde9642f8070241451c5851431be9b658a7fe88ac9360cc24010000001976a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac00000000",
  "confirmations": 207
}
```

### HTTP Request
`GET /tx/:txhash`

### URL Parameters
Parameter | Description
--------- | -----------
:txhash | Hash of tx.


## Get tx by address
```javascript
let address;
```

```shell--vars
address='RHefJ5hLW9jyEwwdxhci6r7AH7SAxdpGW3';
```

```shell--curl
curl $url/tx/address/$address
```

```shell--cli
bcoin-cli tx $address
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
  const result = await client.getTXByAddress(address);
  console.log(result);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

```json
[
  {
    "hash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
    "witnessHash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
    "fee": 4540,
    "rate": 20088,
    "mtime": 1527029380,
    "height": -1,
    "block": null,
    "time": 0,
    "index": -1,
    "version": 1,
    "inputs": [
      {
        "prevout": {
          "hash": "a88387ca68a67f7f74e91723de0069154b532bf024c0e4054e36ea2234251181",
          "index": 0
        },
        "script": "4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46a",
        "witness": "00",
        "sequence": 4294967295,
        "coin": {
          "version": 1,
          "height": 36,
          "value": 5000000000,
          "script": "76a91420a060fec9a7dfac723c521e168876909aa37ce588ac",
          "address": "RCFhpyWXkz5GxskL96q4KtceRXuAMnWUQo",
          "coinbase": true
        }
      }
    ],
    "outputs": [
      {
        "value": 87654321,
        "script": "76a914a4ecde9642f8070241451c5851431be9b658a7fe88ac",
        "address": "RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ"
      },
      {
        "value": 4912341139,
        "script": "76a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac",
        "address": "RHefJ5hLW9jyEwwdxhci6r7AH7SAxdpGW3"
      }
    ],
    "locktime": 0,
    "hex": "01000000018111253422ea364e05e4c024f02b534b156900de2317e9747f7fa668ca8783a8000000006b4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff02b17f3905000000001976a914a4ecde9642f8070241451c5851431be9b658a7fe88ac9360cc24010000001976a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac00000000",
    "confirmations": 207
  }
  ...
]
```

Returns transaction objects array by address

### HTTP Request
`GET /tx/address/:address`

### URL Parameters
Parameter | Description
--------- | -----------
:address | Bitcoin address.

## Get tx by addresses
```javascript
let address0, address1;
```

```shell--vars
address0='RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ';
address1='RHpAA3ZmmmWF6FW8qSfaEvh1jR1nUmVYnj';
```

```shell--curl
 curl $url/tx/address \
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
  const result = await client.getTXByAddresses([address0, address1]);
  console.log(result);
})();
```

> The above command returns JSON structured like this:

```json
[
  {
    "hash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
    "witnessHash": "4c7846a8ff8415945e96937dea27bdb3144c15d793648d725602784826052586",
    "fee": 4540,
    "rate": 20088,
    "mtime": 1527029380,
    "height": -1,
    "block": null,
    "time": 0,
    "index": -1,
    "version": 1,
    "inputs": [
      {
        "prevout": {
          "hash": "a88387ca68a67f7f74e91723de0069154b532bf024c0e4054e36ea2234251181",
          "index": 0
        },
        "script": "4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46a",
        "witness": "00",
        "sequence": 4294967295,
        "coin": {
          "version": 1,
          "height": 36,
          "value": 5000000000,
          "script": "76a91420a060fec9a7dfac723c521e168876909aa37ce588ac",
          "address": "RCFhpyWXkz5GxskL96q4KtceRXuAMnWUQo",
          "coinbase": true
        }
      }
    ],
    "outputs": [
      {
        "value": 87654321,
        "script": "76a914a4ecde9642f8070241451c5851431be9b658a7fe88ac",
        "address": "RQKEexR9ZufYP6AKbwhzdv8iuiMFDh4sNZ"
      },
      {
        "value": 4912341139,
        "script": "76a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac",
        "address": "RHefJ5hLW9jyEwwdxhci6r7AH7SAxdpGW3"
      }
    ],
    "locktime": 0,
    "hex": "01000000018111253422ea364e05e4c024f02b534b156900de2317e9747f7fa668ca8783a8000000006b4830450221009fcb51c7b5956f4524490ee5f2c446faf29cc159f750d93455a9af393cd5b78d02201c3b8b0388dba8cfe3f5bef52a39e980be581d87e06433390f2b099df3855913012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff02b17f3905000000001976a914a4ecde9642f8070241451c5851431be9b658a7fe88ac9360cc24010000001976a9145bd075f5e3c5ff3e8467d94dee593d410967d93d88ac00000000",
    "confirmations": 207
  },
  {
    "hash": "c87c13635f6004a802676a7f93bf90a4b27b433cf26db0c41a656f377406f3e3",
    "witnessHash": "c87c13635f6004a802676a7f93bf90a4b27b433cf26db0c41a656f377406f3e3",
    "fee": 4540,
    "rate": 20177,
    "mtime": 1527029368,
    "height": -1,
    "block": null,
    "time": 0,
    "index": -1,
    "version": 1,
    "inputs": [
      {
        "prevout": {
          "hash": "ec25d3b6d62135eb7bba6443f0257363d961ed59526f9b4474814aeeddacbe80",
          "index": 0
        },
        "script": "473044022076644f57ae5a77f5dd511b61cd7349cf85a5646d4e17c7954dfe664c87e812c2022011c91b45c3274074215d32b6dc4599f5d4bf30f7963140e4dfe9f7ce3a9512ff012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46a",
        "witness": "00",
        "sequence": 4294967295,
        "coin": {
          "version": 1,
          "height": 63,
          "value": 5000000000,
          "script": "76a91420a060fec9a7dfac723c521e168876909aa37ce588ac",
          "address": "RCFhpyWXkz5GxskL96q4KtceRXuAMnWUQo",
          "coinbase": true
        }
      }
    ],
    "outputs": [
      {
        "value": 12345678,
        "script": "76a9145d9c4bf7f9934668c054f1b1a5589632ddc2b5b088ac",
        "address": "RHpAA3ZmmmWF6FW8qSfaEvh1jR1nUmVYnj"
      },
      {
        "value": 4987649782,
        "script": "76a91438530a92842d2912ea8003b934214b05c713c31888ac",
        "address": "RER1Q4xkZ4WdyYSLvWVzeH2o8KVB4yHoXh"
      }
    ],
    "locktime": 0,
    "hex": "010000000180beacddee4a8174449b6f5259ed61d9637325f04364ba7beb3521d6b6d325ec000000006a473044022076644f57ae5a77f5dd511b61cd7349cf85a5646d4e17c7954dfe664c87e812c2022011c91b45c3274074215d32b6dc4599f5d4bf30f7963140e4dfe9f7ce3a9512ff012103cb25dc2929ea58675113e60f4c08d084904189ab44a9a142179684c6cdd8d46affffffff024e61bc00000000001976a9145d9c4bf7f9934668c054f1b1a5589632ddc2b5b088acf67e4929010000001976a91438530a92842d2912ea8003b934214b05c713c31888ac00000000",
    "confirmations": 207
  }
]
```

Returns transaction objects array by addresses

### HTTP Request
`POST /tx/address`

### POST Parameters (JSON)
Parameter | Description
--------- | -----------
addresses | array of bitcoin addresses

