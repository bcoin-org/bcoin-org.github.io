# Make your own Bcoin Block Clock!
```post-author
Matthew Zipkin
```

```post-description
Learn how to install bcoin on a brand-new Raspberry Pi Zero W, or other linux system.
Create scripts to interact with bcoin in SPV mode and then output a fun, network status display and interface.
In Part II, we'll add some external hardware to make your own stand-alone Bcoin Block Clock and Piggy Bank!
```

## Introduction

The goal of this guide is to run a bcoin node and interact with the Bitcoin network using minimal resources, as quickly as possible.
Once bcoin is running we will add a visual interface and then connect some extra hardware to make it really fun.
Although bcoin is capable of running a full archival node and even mining blocks, for this guide we will keep bcoin in [SPV mode.](https://en.bitcoin.it/wiki/Scalability#Simplified_payment_verification)
This means we can run the program on a tiny [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) using a MicroSD card.
This guide was written specifically for (any) Raspberry Pi but can also be easily ported to most other Linux systems.

## Set up the Raspberry Pi

Get yourself a [Raspberry Pi Zero W](https://purse.io/search/raspberry%20pi%20zero%20w) and a [class 10 MicroSD card.](https://purse.io/search/8gb%20class%2010%20microsd%20card)

### Prepare the MicroSD card using your desktop computer

Before you plug in the Pi for the first time, you need to install the OS on the MicroSD card and get a few settings ready for the Pi before it boots up.
These operations will need to take place on a desktop computer, but almost any will do.

[Download the latest version of Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/) (which is the "headless" version, we don't need the GUI!)

[UnZip the downloaded file and copy the disk image to the MicroSD card.](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)

Mount the MicroSD card with its new disk image on your computer again if it didn't mount automatically. We need to add two files to the `boot` volume:

* [Enable SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md) by just saving a file to `boot` called `ssh`, with no file extension.
The file doesn't need to have any content (a blank text file is fine).

* [Add your local WiFi information](https://www.raspberrypi.org/blog/another-update-raspbian/) by saving a file to `boot` called `wpa_supplicant.conf`.
You will add the following lines to this file -- be sure to include the correct WiFi network name and password!

```bash
# add these lines to a new file boot/wpa_supplicant.conf
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
	ssid="<YOUR NETWORK NAME>"
	psk="<YOUR NETWORK PASSWORD>"
	key_mgmt=WPA-PSK
}
```

### Boot up the Raspberry Pi, connect via SSH, and finish conifguration

Unmount and eject the MicroSD card from your desktop computer and put it in the Raspberry Pi. Power it on!

After a few minutes, open a terminal on your dektop computer and [find the Pi on your network.](https://www.raspberrypi.org/documentation/remote-access/ip-address.md)

```bash
ssh pi@raspberrypi.local
```

*The default password for all Raspberry Pis is `raspberry` :-)*

Now we are connected to, and executing commands on, the Raspberry Pi. Upgrade the OS and utilities.

```bash
sudo apt-get update && sudo apt-get upgrade
```

Configure options.

```bash
sudo raspi-config
```

* Password: Change the password!

* Network: Change the hostname to `bclock` or anything else you like

* Boot: Set the Pi to boot directly to the "text console" with user pi logged in

* Interface: Turn on SPI and GPIO. We'll need these for the hardware add-ons later

* Advanced: Expand file system. This will expand the filesystem from the small size of the disk image we downloaded, to use up all the available space on the MicroSD card.

* Exit the config tool and reboot the Pi: `sudo shutdown -r now`
	
## Install bcoin and its dependencies

After the Pi has had a minute or so to reboot, connect to it again via SSH. Don't forget we changed the hostname and password in the last step!

```bash
ssh pi@bclock.local
```

### Install nodejs

Double check your processor type (Raspberry Pi Zero W is built around an ARMv6).

```bash
uname -a # Linux bpi 4.14.34+ #1110 Mon Apr 16 14:51:42 BST 2018 armv6l GNU/Linux
```

[Get the latest nodejs for 32-bit ARMv6](https://nodejs.org/en/download/).

```bash
cd ~
wget https://nodejs.org/dist/v8.11.2/node-v8.11.2-linux-armv6l.tar.xz
```

Unpack the archive.

```bash
tar -xvf node-v8.11.2-linux-armv6l.tar.xz
```

Add node and installed packages to PATH now and for all future sessions.

```bash
echo 'export PATH=$PATH:/home/pi/node-v8.11.2-linux-armv6l/bin' >> ~/.bashrc
export PATH=$PATH:/home/pi/node-v8.11.2-linux-armv6l/bin
```

Update npm, using npm!

```bash
npm install -g npm
```

Check versions.

```bash
node --version # v8.11.2 at time of writing
npm --version  # 6.1.0 at time of writing
```

Update node path (to global modules) for now and for all future sessions.

```bash
echo "export NODE_PATH=`npm root --quiet -g`" >> ~/.bashrc
export NODE_PATH=`npm root --quiet -g`
```

Install bcoin from GitHub master.

* You'll need to install `git` first, then download the bcoin repository

```bash
sudo apt-get install git
cd ~
git clone https://github.com/bcoin-org/bcoin
cd bcoin
npm install -g
```

Install bclient.

```bash
npm install -g bclient
```

### Test it out!

Launch the bcoin daemon in the background and start it syncing to the main network.

```bash
bcoin --daemon --spv
```

Watch the bcoin log, make sure it looks healthy (ctrl+c to stop printout and return to prompt).

```bash
tail -F ~/.bcoin/debug.log
```

Test the bclient installation by requesting node info from bcoin.

```bash
bcoin-cli info
```

After a few minutes of loading, your output should resemble the printout below.
You can repeat the `info` command to watch bcoin sync with the network, until `progress` reaches `1`. This won't take as much time as a full node would need but it could be a while.
You can learn more about the command-line API clients `bcoin-cli` and `bwallet-cli` at [https://bcoin.io/api-docs.](https://bcoin.io/api-docs/?shell--cli#introduction)

```bash
{
  "version": "v1.0.0-pre",
  "network": "main",
  "chain": {
    "height": 2953,
    "tip": "00000000a98fac937fd0e2a74db339b25b3b0b948b99438c86b9d2a3a7b931da",
    "progress": 0.009168617363335387
  },
  "pool": {
    "host": "2601:645:4200:7dd:4c3e:1321:45a7:f21d",
    "port": 8333,
    "agent": "/bcoin:v1.0.0-pre/",
    "services": "1000",
    "outbound": 8,
    "inbound": 0
  },
  "mempool": {
    "tx": 0,
    "size": 0
  },
  "time": {
    "uptime": 47,
    "system": 1527881475,
    "adjusted": 1527881474,
    "offset": -1
  },
  "memory": {
    "total": 69,
    "jsHeap": 13,
    "jsHeapTotal": 32,
    "nativeHeap": 37,
    "external": 8
  }
}
```

## Backup the wallet

When bcoin is run for the first time, it will create a new wallet for you, labelled `primary`.
That wallet will start off with one account labelled `default`. Display the secret key and mnemonic backup phrase for your wallet.
Write down your seed phrase right now! You won't see it in plaintext again.

```bash
bwallet-cli master

# example output
{
  "encrypted": false,
  "key": {
    "xprivkey": "xprv9s21ZrQH143K3WpgRZFmmT5RpY7Lpbasv6cpi8fJNeWnY9U96M1YX42qr6WUZZZC6q6NE9zXkdaJs5Bfkq88wrCwLsXLeorQCrvcvnzFZiw"
  },
  "mnemonic": {
    "bits": 128,
    "language": "english",
    "entropy": "0be6fc83dd5ea06de27d0c286f8cf731",
    "phrase": "armor dawn can rival tube dad measure pave chronic ladder differ ginger"
  }
}
```

Encrypt the wallet with the following command. This method can only be executed with cURL. Be sure to use a good password.

```bash
curl http://127.0.0.1:8334/wallet/primary/passphrase -X POST --data '{"passphrase":"<YOUR GREAT PASSWORD>"}'
```

Anytime you need an address to send bitcoin to you can use the command line.

```bash
# get account details including the most recently generated address
$ bwallet-cli account get default
{
  "name": "default",
  "initialized": true,
  "witness": false,
  "watchOnly": false,
  "type": "pubkeyhash",
  "m": 1,
  "n": 1,
  "accountIndex": 0,
  "receiveDepth": 1,
  "changeDepth": 1,
  "nestedDepth": 0,
  "lookahead": 10,
  "receiveAddress": "1DGvpMRkSNvybo7Ddoquf6EzvFxxnnbciG",
  "changeAddress": "1GP2VdeqPxw1NoWju1LtWZrm1Jexy1QeYP",
  "nestedAddress": null,
  "accountKey": "xpub6CHwKfAR3HPFkEvNDJ4nBPFqhuaELJq57w9nWNA5JcNVQGGd2BDxdNH62yFw1WhMu4vGd4M2YgKoW3gyPPUgdHfLc9UKoJAesV6hQFrLk3P",
  "keys": [],
  "balance": {
    "tx": 0,
    "coin": 0,
    "unconfirmed": 0,
    "confirmed": 0
  }
}

# generate a new address
$ bwallet-cli --account=default address
{
  "name": "default",
  "account": 0,
  "branch": 0,
  "index": 1,
  "witness": false,
  "nested": false,
  "publicKey": "02fcfc02c218f24e1c2d81bf272ef1cb22b6e277858ad880fda9f2f3bf6df09d0a",
  "script": null,
  "program": null,
  "type": "pubkeyhash",
  "address": "1JNffravKaonUEAxG4oMWYK5CjvuoLax79"
}
```

You can stop the node with the command `bcoin-cli rpc stop`.

## Using the bcoin JavaScript object

*The complete scripts used in this tutorial are available at [https://github.com/pinheadmz/bcoin-clock](https://github.com/pinheadmz/bcoin-clock)*

In addition to starting and controlling a bcoin node from the command line, you can also create a node as an object in a Javascript program.
This will give us more granular control of the options, and allow us to catch events for blocks and transactions.
Just to get started, create a new file called `spv_clock.js` and start it off with the script below.
It is a simpler version of [the actual script that gets run](https://github.com/bcoin-org/bcoin/blob/master/bin/spvnode) by the `bcoin --spv --daemon` command.
Run your script with the command `node spv_clock.js >/dev/null &` to run the bcoin spv node as a background process, or daemon.
Once it's running, you can interact it with it from the command line the same way we did before.
Play around with it a bit and then execute `bcoin-cli rpc stop` so we can start getting fancy!

```javascript
// spv_clock.js

// Get the SPV node object from the globally-installed bcoin package
const {SPVNode} = require('bcoin');

// Configure the node for mainnet, write logs, use the database on disk, etc
const node = new SPVNode({
  network: 'main',
  config: true,
  argv: true,
  env: true,
  logFile: true,
  logConsole: true,
  logLevel: 'debug',
  db: 'leveldb',
  memory: false,
  persistent: true,
  workers: true,
  listen: true,
  loader: require
});

(async () => {

  // Validate the prefix directory (probably ~/.bcoin)
  await node.ensure();
  // Open the node and all its child objects, wait for the database to load
  await node.open();
  // Connect to the network
  await node.connect();

  // TODO: add cool stuff here in the next step! (*)

  // Start the blockchain sync
  node.startSync();
  
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
```

### Respond to events

The line marked `(*)` above is where we can ask bcoin to react to certain "events" like a new block being added to the tip of the blockchain,
or a transaction being received that affects our own wallet.
For our purposes, we want bcoin to write a JSON file for each new block, so we can display the block details on the clock!
First let's add a function (at the very top of the file) that writes these files, labeled by the block's height.
We only need to keep 20 or so of the most recent blocks, so we'll allow the script to prune the directory as well.
On a Raspberry Pi, the script below will create the directory at `/home/pi/blocks` (or `~/blocks`),

```javascript
// spv_clock.js

// allow the script to access the file system on disk
const fs = require('fs');
const os = require('os');
const maxFiles = 20;

// create the a directory for block headers if it doesn't exist already
const blocksDir = os.homedir() + '/blocks/';
if (!fs.existsSync(blocksDir)){
  fs.mkdirSync(blocksDir);
}

// Write a JSON object to disk
function writeFile(index, element, dir){
	fs.writeFile(dir + index, JSON.stringify(element), function(err){
		if(!err){
			// delete files older than 20 blocks if it exists
			try {
				fs.unlinkSync(dir + (index-maxFiles));
			} catch(err) {
				console.log(err);
			}
		}
	});
}
```

Then we can tell bcoin to call the above function whenever a new block arrives. This code will go right where the `(*)` line is in our script:

```javascript
// spv_clock.js

  // write new block details to file
  node.on('block', async (block) => {
  	// most of the block's details are returned by the 'block' event but we need to get its height from the blockchain database
  	headers = await node.chain.getEntryByHash(block.hash('hex'));
  	blockHeight = headers.height;

	// make the block data human readable
  	blockJSON = block.toJSON();

	// index it by height (orphaned blocks will therefore be replaced by new block at same height)
  	writeFile(blockHeight, blockJSON, blocksDir);
  });
```

If you run the script now with `node spv_clock.js >/dev/null &` you should start to see JSON files filling up the `blocks` directory.
Next we will create our visualizer that reads these files! If you `cat` one of them you can see what kind of data is emitted by the 'block' event.
In SPV mode, the node only downloads the block headers and a little bit of extra metadata from the network.
If this block had contained a transaction relevant to our wallet, there would be additional data to prove our transaction was included in that block.

```bash
$ cat ~/blocks/526358
{
	"hash":"00000000000000000009392f74e26fce58359267a64aa9aa86708062a2296492",
	"version":536870912,
	"prevBlock":"0000000000000000001d437becc92a9cdf38af11105bf6370c6cde001bc0a2ec",
	"merkleRoot":"bbbb711d2910205c8c2b444572e79ec5812705203103afc5f82980cb505550e1",
	"time":1528332683,
	"bits":389609537,
	"nonce":3638200179,
	"totalTX":1199,
	"hashes":[
		"bbbb711d2910205c8c2b444572e79ec5812705203103afc5f82980cb505550e1"
	],
	"flags":"00"
}
```

## Enter: Python

Congratulations! If you made it this far, you have a working Bitcoin light client in the palm of your hand, ready to send and receive money.
You've modified it to record details about each new block in a file on disk.
The rest of this guide will focus on interacting with the those block files, as well as the bcoin node and wallet servers via cURL requests in python.
We use Python 2.7 because it is already installed on Raspbian, easy to interact with the command line, and because the extra hardware we add later is driven by libraries written in python.

*Reminder: The finished script is available at [https://github.com/pinheadmz/bcoin-clock](https://github.com/pinheadmz/bcoin-clock)*

First install some dependencies:

```bash
sudo apt-get install python-pip python-pil python-requests
sudo pip install pyqrcode
```

Create a new python file `gui_clock.py` and start with the code below.
Make sure bcoin is already running with the `spv_clock.js` script, and then run your new python script with the command `python gui_clock.py`.
If all goes well you should see a long JSON output, followed by a Bitcoin address and QR code, right in the terminal!
That magic trick is performed by [PyQRCode](https://pythonhosted.org/PyQRCode/rendering.html) which has several methods for returning a QR code.

```python
# gui_clock.py

import requests
import pyqrcode
import json

### default API endpoints, not using any authentication key
# testnet
#nodeurl = "http://127.0.0.1:18332/"
#wallurl = "http://127.0.0.1:18334/wallet/primary/"
# main
nodeurl = "http://127.0.0.1:8332/"
wallurl = "http://127.0.0.1:8334/wallet/primary/"

### set up some functions to get data from bcoin node & wallet servers
### these functions are equivalent to using cURL from the command line
### the Python requests package makes this super easy for us
def getInfo():
	return requests.get(nodeurl).json()

def getAddress():
	params = {"account":"default"}
	return requests.post(wallurl + 'address', json=params).json()

def getBalance():
	return requests.get(wallurl + 'balance?account=default').json()
	
### Output!
print json.dumps(getInfo(), indent=1)
print json.dumps(getBalance(), indent=1)

### display address and QR code
addr = getAddress()['address']
# create a QR code with "M-level" error correction, 29x29 size ("version 3"), and 1-pixel "quiet zone" border
# learn more at https://pythonhosted.org/PyQRCode/create.html
code = pyqrcode.create(addr, 'M', version=3).terminal(quiet_zone=1)
print addr
print code
```

<img src="https://raw.githubusercontent.com/pinheadmz/bcoin-clock/master/InfoAndQRcode.png">

### Get block history and details

So we can talk to bcoin from Python! Awesome. The next step is to read those `blocks` files that are being output by our SPV-node Javascript program.
What we'll do is scan the `blocks` directory and import all the JSON files there into an global object of the 20 most recent blocks, indexed by block height (which should be the file name).
You can just add this blob of code to the end of your Python script for now, we can clean it up later :-)

```python
# gui_clock.py

import os, sys

### read the JSON files from disk and keep the last 20 in memory
# should be the same directory used in the Javascript program (~/blocks on Raspberry Pi)
BLOCKS_DIR = os.path.expanduser('~') + '/blocks/'
# global variable to store all the block details
BLOCKS = {}
# generic function to load any directory of JSON files into any object passed in
def readFiles(dict, dir):
  files = [files for (dirpath, dirnames, files) in os.walk(dir)][0]
  for index in files:
    try:
      with open (dir + index) as file:
        dict[int(index)] = json.load(file)
    except:
      pass
    sortedDictKeys = sorted(dict)
    if len(sortedDictKeys) > 20:
      del dict[sortedDictKeys[0]]

# run the above function one time to load up the BLOCKS object
readFiles(BLOCKS, BLOCKS_DIR)
# Output!
print json.dumps(BLOCKS, indent=1)
```

In addition to the node info, address and QR code we got in the last step, this time you should also get a list of 20 blocks and their metadata.
We've almost got everything ready for the clock display under the hood!
The last bit of internal calculation is to derive the progress of the [difficulty adjustment interval](https://en.bitcoin.it/wiki/Difficulty), 
nd the [block subsidy halving interval.](https://en.bitcoin.it/wiki/Controlled_supply).
Since we can get the block height from `getInfo()` it's easy to calculate where we are in each cycle:

```python
# gui_clock.py

### calculate cycle progress as % and countdown integer given current blockchain height
def getDiff(height):
	return {"percent": (height % 2016 / 2016.0) * 100, "countdown": 2016 - (height % 2016)}
def getHalf(height):
	return {"percent": (height % 210000 / 210000.0 ) * 100, "countdown": 210000 - (height % 210000)}

info = getInfo()
height=info['chain']['height']
print json.dumps(getDiff(height), indent=1)
print json.dumps(getHalf(height), indent=1)`
```

### Transaction notifications

In the same way that we record `block` events from the SPV node script, we can also catch incoming transactions to the wallet, 
and save those details to a file for the clock script to read. Back to that `(*)` section of the node script, let's add another event listener.
We'll need to start by adding the wallet database to our node object.

```javascript
// spv_clock.js

// add wallet database
const walletdb = node.require('walletdb').wdb;
const wallet = await walletdb.primary;

// write new transaction details to file named by tx hash
node.on('tx', async (tx) => {
  // get readable format for transaction message
  txJSON = tx.inspect();
  // discover which outputs of this tx belong to our wallet
  let details = []
  for (const output of txJSON.outputs) {
    // encode the public key hash into the right address format for this network
    let outputJSON = output.getJSON('main');
    if (await wallet.hasAddress(outputJSON.address))
      details.push(outputJSON);
  }
  // add "my output" list to return object
  txJSON.details = details;
  fs.writeFile(txDir + txJSON.hash, JSON.stringify(txJSON), function(err){});
});
```

The JSON recorded for an incoming transaction looks like this:

```bash
{
   "hash":"357d1862850e4370134b1937ba4caff5674f46457b3e1a1750f8c2e7d1fc78bb",
   "witnessHash":"357d1862850e4370134b1937ba4caff5674f46457b3e1a1750f8c2e7d1fc78bb",
   "size":225,
   ...
   "inputs":[
      ...
   ],
   "outputs":[
      {
         "value":123450,
         "script":"76a914e84da987245b8ea2688ed35bbeecef8da1afc05588ac",
         "address":"n2hG6dA6KepqpV7Z6aCQQMnbPiABy4dzMj"
      },
      {
         "value":77676380,
         "script":"76a914487af102bab462d6ee75e06dda1026cae4f9a8f488ac",
         "address":"mn8CDzDkKo7JtF31c4HEqT9sSxZpi4W9YM"
      }
   ],
   "locktime":0,
   "details":[
      {
         "value":123450,
         "script":"76a914e84da987245b8ea2688ed35bbeecef8da1afc05588ac",
         "address":"n2hG6dA6KepqpV7Z6aCQQMnbPiABy4dzMj"
      }
   ]
}
```

Notice that even though the transaction has 2 outputs, only one was recorded in the `details` array. That's the only output we really "received" (that we can actually spend).
In the python clock script, we'll add a function that checks for transaction files and calculates the total amount recieved.

```python
# gui_clock.py

TXS_DIR = os.path.expanduser('~') + '/txs/'
# check for new txs
def checkTXs():
  txs = {}
  try:
    readFiles(txs, TXS_DIR)
  except:
    return False
  for hash, tx in txs.items():
    total = 0
    for detail in tx['details']:
      amt = detail['value'] / 100000000.0
      total += amt
    # remove tx file so we only notify once
    os.remove(TXS_DIR + hash)
```

## Finishing the GUI

What we have built so far is a system that:

1. Launches an SPV Bitcoin node

2. Records metadata about every new block in a file

3. Records incoming transaction details in a file

4. Monitors the status of the node and the blockchain

5. Retrieves Bitcoin addresses on demand from the wallet and generates QR codes

All that remains to package up this structure with a fun graphical interface that refreshes its own status every second *(tick, tick, tick!)*.
The final Python script is [available on Github](https://github.com/pinheadmz/bcoin-clock)
and you can read through it to see how I added the `curses` Python library to draw ASCII-art to the terminal screen.
`curses` is a great tool for terminal applications because you can write text anywhere on the screen with (x,y) coordinates, and it can also
capture single keystrokes from the user and respond immediately inside of an infinite loop.

To draw the block history to the screen, we need to first decide how much time the width of the screen represents.
Then, using the current time and the timestamps of all the blocks in our memory, figure out which blocks are within
our timeline and where they are in that timeline. `curses` will tell us the size of the screen in rows and columns.

```python
# gui_clock.py

# initialize curses
import curses
stdscr = curses.initscr()
# store window dimensions
MAXYX = stdscr.getmaxyx()

### draw the recent blockchain
WINDOW = 30 * 60 # total seconds across width of screen (thirty minutes)
def drawBlockchain():
  # calculate how much time is represented by each column on the screen
  secondsPerCol = WINDOW/MAXYX[1]
  # draw an axis across the screen like this: [-----------]
  stdscr.addstr(0, 0, "[" + "-" * (MAXYX[1]-2) + "]")
  # get the current unix timestamp
  now = int(time.time())
  # iterate through our array of blocks and draw them
  for index, block in BLOCKS.items():
    # how old is this block in seconds?
    secondsAgo = now - block['time']
    # is this block even in our displayed timeline?
    if secondsAgo < WINDOW:
      # calcualte the left-to-right position of the block in the timeline
      col = MAXYX[1] - (secondsAgo / secondsPerCol) - 9
      if col > 0:
        # draw the block details
        stdscr.addstr(0, col, "|")
        stdscr.addstr(1, col, "#" + str(index))
        stdscr.addstr(2, col, "Hash:")
        for i in range(8):
          stdscr.addstr(3+i, col+1, block['hash'][i*8:i*8+8])
        stdscr.addstr(11, col, "TXs:")
        stdscr.addstr(12, col+1, str("{:,}".format(block['totalTX'])))
        stdscr.addstr(13, col, "Age:")
        stdscr.addstr(14, col+1, str(secondsAgo/60) + ":" + str(secondsAgo%60).zfill(2))
```

I've set up a little menu at the bottom of the screen where a user can zoom the timeline in or out.
When `curses` catches a user pressing either `-` or `+`, the `WINDOW` parameter is increased or decreased.

<img src="https://raw.githubusercontent.com/pinheadmz/bcoin-clock/master/BcoinClockGUI.png">

## Next steps

What else can we do with this structure?
What else can you add on your own? Since we are receiving transactions, maybe there should be some kind of send function,
[using the node API and another cURL request from Python.](https://bcoin.io/api-docs/?shell--curl#send-a-transaction)
You could also use the same QR code functionality to [display the private key for an address you have deposited to](https://bcoin.io/api-docs/?shell--curl#get-private-key-by-address),
allowing the user to sweep that key with a mobile phone wallet.

Notice when a wallet-related transaction gets confirmed in a block, the details we get for that block include a [Merkle Proof](https://en.bitcoin.it/wiki/Protocol_documentation#Merkle_Trees).
This is expressed in a series of hashes and flags that describe the structure of the Merkle Tree our transaction is in.

```bash
{
"hash":"0000000000000030563c98f2a19f726c24d6f3ab69295d6161b5e8b99766e9a1",
"version":536870912,
"prevBlock":"00000000000000488d4c972efa9535fb3e3137b109571a5790a3aa284cbd427a",
"merkleRoot":"14f4d13857ea54be5724e3284fddd200f1dce5d6dcb859a9e79c6c8ea45fc200",
"time":1528410807,
"bits":425389056,
"nonce":2023619469,
"totalTX":72,
"hashes":[
	"ea0c37e986eb55c3ff9b0abead1eb567cd6d252e4a2a956430598194b62c060c",
	"fee24064527576237da1ae8a835722596dc573cce1fa29b64b2af2d284c97fbb",
	"7100255726502d117c6d8a118243753f3f38e2f4b43844e09598d66d31e50e2b",
	"8f0d27afb0ae40427c0e900ba8843093e7a5b2b619227e9ec8f7108d4d6d12da",
	"22a0ab5395bef2050f270ebd8a33fb6794bce5e46d6f75289a17b0fecfaf65c3",
	"14c90c01fcc64ff892b1b599039ee6634e712736f37a284944944ee61a3292ea",
	"f9821e9ef769035f8fb845a89ce08106db8bff5c7e9f8997e2765ccdf4da3c37",
	"46e8991fd4c979cfbfa2dbc2a479eb29a16f1e3f4127168c0253dd671586f4e9",
	"4bf208da979cc9eb4b0a6fe7e6ca6ac9baf9660120b0dedc8ae8725456f6528a",
	"cbdb8da8ec97c50d7d5434f12bdb26b44dce9f4ea90aea69e870288d2e5c35ac"
	],
"flags":"773d00"
}
```

...maybe the GUI should indicate somehow which blocks confirm our own transactions?

We have been running bcoin in SPV mode so far, but what if we ran a full bcoin node? We could display the size of the mempool as 
transactions get broadcast across the network and consumed by blocks. The number of transactions in the mempool and its total size in bytes are available
from the `getInfo()` function we wrote.

## Extra credit

You don't have to keep this program in the SSH terminal -- if you've been working on a Raspberry Pi it'd be quite easy to attach a [small HDMI display](https://purse.io/search/5%22%20HDMI%20raspberry%20pi)
and [tiny wireless keyboard](https://purse.io/search/mini%20usb%20keyboard%20wireless) to make yourself a stand alone clock.
Install it in an old picture frame! Hang it on your wall and send us a photo! :-)

The Bcoin Block Clock that I made took the interface one step further: LEDs!
I used a [NeoPixel ring](https://learn.adafruit.com/neopixels-on-raspberry-pi) to display the blocks over the past hour, using LED color to illustrate block version or size.
A second, inner NeoPixel ring [indicates the progress of the difficulty adjustment period.](https://twitter.com/MatthewZipkin/status/885318444387680256)
I added a [small OLED display](https://learn.adafruit.com/ssd1306-oled-displays-with-raspberry-pi-and-beaglebone-black) for the blockchain readout.
The python libraries for these add-ons are open source and will integrate easily into your project.

<iframe width="560" height="315" src="https://www.youtube.com/embed/rSh_Gh1O_YM" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>