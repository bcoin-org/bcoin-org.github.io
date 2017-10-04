# Generate an Address

```post-author
Javed Khan
```

```post-description
Follow along with the steps to build a transaction from scratch using built-in bcoin utilities. These steps are based on those outlined in the Bitcoin Wiki.
```

Follow along with the steps below to build a transaction from scratch using built-in bcoin utilities. These steps are based on those outlined in the [Bitcoin Wiki](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses).

Of course, if you're using the bcoin wallet module, it will do these steps for you automatically when you [generate an address](../api-docs/index.html#generate-receiving-address)!

```javascript
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

// 3 - Perform RIPEMD-160 hashing on the result of SHA-256
step3 = crypto.ripemd160(step2)

// 4 - Add version byte in front of RIPEMD-160 hash (0x00 for Main Network)
step4 = buffer.Buffer.concat([buffer.Buffer.alloc(1), step3])

// 5 - Perform SHA-256 hash on the extended RIPEMD-160 result
step5 = crypto.sha256(step4)

// 6 - Perform SHA-256 hash on the result of the previous SHA-256 hash
step6 = crypto.sha256(step5)

// 7 - Take the first 4 bytes of the second SHA-256 hash. This is the address checksum
step7 = step6.slice(0, 4)

// 8 - Add the 4 checksum bytes from stage 7 at the end of extended RIPEMD-160 hash from stage 4. This is the 25-byte binary Bitcoin Address.
step8 = buffer.Buffer.concat([step4, step7])

// 9 - Convert the result from a byte string into a base58 string using Base58Check encoding. This is the most commonly used Bitcoin Address format
addr = base58.encode(step8)
```