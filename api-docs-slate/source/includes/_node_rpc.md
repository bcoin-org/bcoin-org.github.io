# RPC Calls - Node

```shell--curl
curl $url/ \
  -H 'Content-Type: application/json' \
  -X POST \
  --data '{ "method": "methodname", "params": [...] "id": "some-id" }'
```

```shell--cli
bcoin-cli rpc params...
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
  const result = await client.execute('MethodName', [ ...params ]);
  console.log(result);
})().catch((err) => {
  console.error(err.stack);
});
```

> The above command returns JSON structured like this:

> Further examples will only include "result" part.

```json
{"result": resultObject ,"error": errorObject, "id": passedID}
```


Bcoin rpc calls mimic Bitcoin Core's RPC.
This is documentation how to use it with `bcoin`.

RPC Calls are accepted at:
`POST /`

*Notes:*

*bcoin-cli rpc and javascript will return error OR result.*

*Javascript result will return the "result" part of the object, not the id or error*

*If a Javascript error is encountered it will be thrown instead of returned in JSON*


### POST Parameters RPC
Parameter | Description
--------- | -----------
method  | Name of the RPC call
params  | Parameters accepted by method
id      | `int` Will be returned with the response (cURL only)
