# Guide to return accidentally paid fees.

```post-author
Victor Vaschenko

```
```post-description
Guide how to return accidentally paid wrong transaction fees.
```

## How it works

If you can find out miner or pool mined a block. You can try to send signed message with the address that the transaction inputs come from and message with adress to send the money.

## Sigh message.

If you wish for somebody else to be able to verify a message that you have signed, you need to provide:

- the Bitcoin address you're using to sign the message.
- the exact text of the message that you have signed.(something like this "Please send back the money to : 16LcT7uRXK8sJDNj9Fu6avbga54XviYUN3").
- the signature (long code consisting of letters, numbers and symbols).

```bash
address='17AUJUBAiLUwqVUkqPCTmr1ESdTJ8iAMQd'
message='Please send back the money to : 16LcT7uRXK8sJDNj9Fu6avbga54XviYUN3'

curl $walletrpcurl \
  -X POST \
  --data '{
    "method": "signmessage",
    "params": [ "'$address'", "'"$message"'" ]
  }'
```

The above command returns JSON "result" like this:

IO+rG2kO4DG2P06bic6tbwh+ITf6KGtiyjKczzQTTieyMJKVArxOIVtrA5zx+9BAqrxVhL0KxLFfdqsTVyn/WgU=

Sign an arbitrary message with the private key corresponding to a specified Bitcoin address in the wallet.
Note: Due to behavior of some shells like bash, if your message contains spaces you may need to add additional quotes like this: "'"$message"'"


Copy all fields to the email. Send this message to pool mail if you can find it and you have a chance to retun your money.


### reference Information:

- https://bitcoin.stackexchange.com/questions/75115/how-do-we-know-which-miner-or-pool-mined-a-block