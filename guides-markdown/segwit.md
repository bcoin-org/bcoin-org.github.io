# Segwit and Bcoin

```post-author
Nodar Chkuaselidze
```

```post-description
What is segwit, how to use segwit with bcoin and what are the updates
```

Following guide will introduce you to Segwit, its changes and how to fully employ all these changes with bcoin.
Code reviewed here is in it's on [repo][guide-repo]

## Segwit
Originally it started as [TX malleability][tx-malleability] fix. Miners as well as Full nodes in charge
of relaying or including transaction in blocks could change transaction hash and broadcast modified
without invalidating the transaction. This prevented sidechains and some applications
to be built on top of bitcoin blockchain (Lightning Network).
You can check the list of Malleability sources in [BIP62 (Withdrawn)][BIP62].  
Segwit removes sigScripts from the transaction and constructs another merkle tree
for witnesses. Signatures are also subtracted from block size calculations (They
aren't broadcasted with block) leaving space for more transaction with the same
block size. It was crucial to make this update soft fork, so instead of submitting merkle root into
block, it's included in coinbase transaction. Another benefit it brings is
future possible soft forks for Script updates.
Check references on reference topic.


### References
Activated with segwit:
  - Segwit - [BIP141][BIP141] 
  - Segwit version 0 programs - [BIP143][BIP143]
  - Dummy stack element malleability [BIP147][BIP147]

Activation:
  - Reduced threshold Segwit MASF - [BIP91](BIP91)
  - Signaling method - [BIP9][BIP9]

Related:
  - Bech32 Addresses [BIP173][BIP173]

You can check [BIP List][BIPS] for other related proposals.


[tx-malleability]: https://en.bitcoin.it/wiki/Transaction_Malleability
[BIP62]: https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki#motivation
[guide-repo]: https://github.com/nodar-chkuaselidze/bcoin-segwit-guide

[BIP141]: https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki
[BIP143]: https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki
[BIP147]: https://github.com/bitcoin/bips/blob/master/bip-0147.mediawiki
[BIP91]: https://github.com/bitcoin/bips/blob/master/bip-0091.mediawiki
[BIP9]: https://github.com/bitcoin/bips/blob/master/bip-0009.mediawiki
[BIP173]: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
[BIPS]: https://github.com/bitcoin/bips
