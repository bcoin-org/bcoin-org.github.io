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
const rpc = new NodeClient({
  network: 'testnet'
});

(async () => {
  const res = await rpc.execute('MethodName', [ ...params ]);

  // RES will return "result" part of the object, not the id or error
  // error will be thrown.
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

*Note: bcoin-cli rpc and javascript will return error OR result.*


### POST Parameters RPC
Parameter | Description
--------- | -----------
method  | Name of the RPC call
params  | Parameters accepted by method
id      | Will be returned with the response (Shouldn't be object)
