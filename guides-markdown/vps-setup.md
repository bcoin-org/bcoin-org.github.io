# Full Node VPS Setup

```post-author
Alex Sherbuck
```

```post-description
This guide provides installation instructions for a Bcoin full node running on a Digital Ocean of Amazon AWS Virtual Private Server.
```

## Introduction

Running a full node requires your computer always be online and connected to the Bitcoin network. For most users, a VPS is an elegant 24/7 full node solution.

## Digital Ocean

### Create an account @digitalocean.com
### Choose 'Create' -> 'Droplet' from the account dashboard

![create droplet](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-create-droplet.png "Create Droplet")
### Choose 'Ubuntu 16.04' for OS Distribution
![choose os](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-choose-os.png "Choose OS")

### Choose '4 GB 2 CPU $20/month' for Droplet Size
![choose plan](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-choose-plan.png "Choose Plan")
### Add Block Storage, 500GB $50/month.
![choose storage](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-block-storage.png "Choose Storage")
### Choose a data center region.
![choose datacenter](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-data-center.png "Choose Datacenter")

##### A Note on hardware requirements
These hardware requirements are for a full node. When run in SPV mode, you will not need the additional block storage. To run a full node you must maintain a complete history of all Bitcoin transactions. Without the full history the node is unable to validate transactions. If it cannot validate transactions, it cannot validate blocks or mine transactions to blocks.

SPV Nodes use something called a bloom filter to maintain a smaller set of records. For example, if your Bitcoin address were `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` your SPV node will ask its network peers for all transactions with an address that starts with `1A1z`. The returned data set will contain extra transactions irrelevant to your wallet. But its storage requirements will be far smaller than a full node. Consequently, SPV Nodes can only verify their own transactions.

More information on SPV Nodes:
+ [Bitcoin Whitepaper - Section 8](https://bitcoin.org/bitcoin.pdf)
+ [Bitcoin.org Developer Guide](https://bitcoin.org/en/developer-guide#simplified-payment-verification-spv)
+ [BIP37](https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki)

### Add a new ssh key
![add ssh](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-ssh-key.png "SSH Key")

### Setting Up SSH
If you already have an ssh key you can copy your pubkey here. If you do not then follow these steps:

```
ssh-keygen -t rsa -C "your_email@example.com"
```

Accept the defaults.

On Windows your keys are located:

```
%userprofile%/.ssh
```

On Linux/Mac:

```
cd ~/.ssh
```

Copy the contents of the `id_rsa.pub` file and paste them into Digital Ocean's form.

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsYKEA5LZCDyMF+ZbrPWeVIYso0ZzpIZx9L7R+CGqMPo0mrSlYeeaPbP1btM/Wis4a81EaTM7Y5kkKqZ4XB/LnRWp415XVl5QdtGF2l5tgiy2ootVxEwdrH0lXyGFHEpOwHU6MYdYCd+bgpQwa291Q4bOUJhGxNZ07L/rMtZfWhWL
+YL+JpSajg/uonu+4YKuFETggGLIuK+piTD9dvjiaThwKtqiCh2dnqdHztRYk+OehJUcof3tFl9kSRUmh9MVI7pDaOxCJWRaU1dsn9YaUwRkIyOwESHqBdCE9ZDU4FzNItRh2dYY4ukGv2iRqZoTrjcB8UGJepI65aINKNvdj email@nomail.com
```

8. Choose a hostname for the droplet and click create.

Digital Ocean will provision your server. Now is a good time to grab coffee.


## Amazon AWS

### Create an account
[AWS](https://aws.amazon.com)

### Launch a new instance from the console
[Console](https://aws.amazon.com/console)

![launch instance](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-amazon-launch-instance.png "Launch Instance")
### Choose 'Ubuntu 16.04' and at least 2CPU 4GiB for hardware
![choose os](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-amazon-os.png "Choose OS")
### Continue to add storage. Add 500GiB
![choose storage](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-amazon-storage.png "Choose Storage")
### Review and Launch
### Amazon will prompt you for an ssh keypair, download a new keypair
![amazon ssh](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-amazon-ssh.png "Amazon SSH")

Treat this keyfile with the same respect you treat your Bitcoin wallet file. Both are private keys and you will be the only person with a copy of your keyfile. If you lose it, Amazon will not be able to recovery it for you.

### Accept Acknowledgement & Launch Instances
### View Instances
![view instances](https://raw.githubusercontent.com/tenthirtyone/bcoin-org.github.io/staging/assets/images/guides/vps-amazon-instances.png "View Instances")

[A Note on Hardware Requirements](#a-note-on-hardware-requirements)

Amazon will provision your server. Now is a good time to grab coffee.


## Connecting to your server

#### Digital Ocean

```
ssh Your.Server.Ip.Here
```

E.g.

```
ssh 178.62.124.90
```

On a Linux/Mac if you don't provide a username it will use the currently logged in user. If you setup ssh keys you will not need to provide a username or password. You can also edit `/etc/hosts` to add a line like so:

```
178.62.124.90    fullnode
```

And then you can use:

```
$ ssh fullnode
```

to login without a username, password or having to remember the server ip.

Accept the RSA key, and you will be at the command line


#### Amazon

In the same directory as the private key you downloaded,

``` bash
chmod 400 test.pem
ssh -i "test.pem" yourname@yourinstance.amazonaws.com
```

E.g.

```
ssh -i "test.pem" ubuntu@ec2-18-219-26-103.us-east-2.compute.amazonaws.com
```

Accept the RSA key, and you will be at the command line

```
ubuntu@ip-172-31-7-194:~$
```

## Setting up the environment
The VPS is setup, from here the intructions will be the same regardless of VPS provider.

1. Install NVM
2. Install Node
4. Install build essential
5. Install python

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
$ source ~/.bashrc
$ nvm install 9.2.1
$ sudo apt-get install build-essential
$ sudo apt-get install python
```
## Install Bcoin

```
$ git clone git://github.com/bcoin-org/bcoin.git
$ cd bcoin
$ npm install
$ node docs/Examples/fullnode
```

You should begin to see blocks syncing as soon as the network peers pickup.
