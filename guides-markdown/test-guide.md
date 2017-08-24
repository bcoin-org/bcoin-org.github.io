# Hello World
```post-author
  daenerys targaryen
```

I'm just testing some markdown right now

```javascript
console.log('hello world!');
const bcoin = require('bcoin');
// do cool stuff with bcoin!
// https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses

secp256k1 = require("bcoin/lib/crypto/secp256k1")
crypto = require("bcoin/lib/crypto")
base58 = require("bcoin/lib/utils/base58")

// 0 - Having a private ECDSA key
privkey = buffer.Buffer.from("18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725", "hex")

// 1 - Take the corresponding public key generated with it (65 bytes, 1 byte 0x04, 32 bytes corresponding to X coordinate, 32 bytes corresponding to Y coordinate)
pubkey = secp256k1.publicKeyCreate(privkey, false)

// 2 - Perform SHA-256 hashing on the public key
step2 = crypto.sha256(pubkey)
...
```
#### This is an example of a fourth level header 

### Embeded gist?
_We_ can __DO__ that too!
<script src="https://gist.github.com/tuxcanfly/23f77cfcc9fe6e61b67d38c8d737e4ad.js"></script>