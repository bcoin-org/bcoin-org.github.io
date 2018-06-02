# Run bcoin on a Raspberry Pi Zero W and make your own Bitcoin Clock!
```post-author
Matthew Zipkin
```

```post-description
Learn how to install bcoin on a brand-new Raspberry Pi Zero W. Create scripts to interact with bcoin in SPV mode and then add some hardware to make your own Bitcoin Clock and Piggy Bank!
```

## Introduction

The goal of this guide is to run a bcoin node and interact with the Bitcoin network using minimal resources, as quickly as possible. Once bcoin is running we will add a visual interface and then connect some extra hardware to make it really fun. Although bcoin is capable of running a full archival node and even mining blocks, for this guide we will keep bcoin in [SPV mode.](https://en.bitcoin.it/wiki/Scalability#Simplified_payment_verification) This means we can run the program on a tiny [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) using a tiny SD card.

## Set up the Raspberry Pi

Get yourself a [Raspberry Pi Zero W](https://purse.io/search/raspberry%20pi%20zero%20w) and a [class 10 MicroSD card.](https://purse.io/search/8gb%20class%2010%20microsd%20card)

### Prepare the MicroSD card using your desktop computer

Before you plug in the Pi for the first time, you need to install the OS on the MicroSD card and get a few settings ready for the Pi before it boots up for the first time.

[Download the latest version of Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/) (which is the "headless" version, we don't need the GUI!)

[UnZip the downloaded file and copy the disk image to the MicroSD card.](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)

Mount the MicroSD card with its new disk image on your computer again if it didn't mount automatically. We need to add two files to the `/boot` volume:

* [Enable SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md) by just saving a file to `/boot` called `ssh`, with no file extension. The file doesn't need to have any content (a blank text file is fine).

* [Add your local WiFi information](https://www.raspberrypi.org/blog/another-update-raspbian/) by saving a file to `/boot` called `wpa_supplicant.conf`. You will add the following lines to this file -- be sure to include the correct WiFi network name and password!

```bash
# add these lines to a new file /boot/wpa_supplicant.conf
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
	ssid="<YOUR NETWORK NAME>"
	psk="<YOUR NETWORK PASSWORD>"
	key_mgmt=WPA-PSK
}
```

### Boot up the Raspberry Pi, connect via SSH, and finish conifguration

Eject the MicroSD card from your desktop computer and put it in the Raspberry Pi. Power it on!

After a few minutes, open a terminal on your dektop computer and [find the Pi on your network.](https://www.raspberrypi.org/documentation/remote-access/ip-address.md)

```bash
ssh pi@raspberrypi.local
```

*The default password for all Raspberry Pis is `raspberry` :-)*

Upgrade the OS and utilities 

```bash
sudo apt-get update && sudo apt-get upgrade
```

Configure options

```bash
sudo raspi-config
```

* Password: Change the password!

* Network: Change the hostname to `bpi` or anything else you like

* Boot: Set the Pi to boot directly to the "text console" with user pi logged in

* Interface: Turn on SPI and GPIO. We'll need these for the hardware add-ons later

* Advanced: Expand file system. This will expand the filesystem from the small size of the disk image we downloaded, to use up all the available space on the MicroSD card.

* Exit the config tool and reboot the Pi: `sudo shutdown -r now`
	
## Install bcoin and its dependencies

After the Pi has had a minute or so to reboot, connect to it again via SSH. Don't forget we changed the hostname and password in the last step!

```shell
ssh pi@bpi.local
```

### Install nodejs

Double check your processor type (Raspberry Pi Zero W is built around an ARMv6)

```shell
uname -a # Linux bpi 4.14.34+ #1110 Mon Apr 16 14:51:42 BST 2018 armv6l GNU/Linux
```

[Get the latest nodejs for 32-bit ARMv6](https://nodejs.org/en/download/).

```shell
cd ~
wget https://nodejs.org/dist/v8.11.2/node-v8.11.2-linux-armv6l.tar.xz
```

Unpack the archive

```shell
tar -xvf node-v8.11.2-linux-armv6l.tar.xz
```

Add node and installed packages to PATH now and for all future sessions

```shell
echo 'export PATH=$PATH:/home/pi/node-v8.11.2-linux-armv6l/bin' >> ~/.bashrc
export PATH=$PATH:/home/pi/node-v8.11.2-linux-armv6l/bin
```

Update npm, using npm!

```shell
npm install -g npm
```

Check versions

```shell
node --version # v8.11.2 at time of writing
npm --version  # 6.1.0 at time of writing
```

Update node path (to global modules) for now and for all future sessions

```shell
echo "export NODE_PATH=`npm root --quiet -g`" >> ~/.bashrc
export NODE_PATH=`npm root --quiet -g`
```

Install bcoin from GitHub master

* You'll need to install `git` first, then download the bcoin repository

```shell
sudo apt-get install git
cd ~
git clone https://github.com/bcoin-org/bcoin
cd bcoin
npm install -g
```

Install bclient

```shell
npm install -g bclient
```

### Test it out!

Launch the bcoin daemon in the background and start it syncing to the main network

```shell
bcoin --daemon --spv
```

Watch the bcoin log, make sure it looks healthy (ctrl+c to stop and return to prompt)

```shell
tail -F ~/.bcoin/debug.log
```

Test the bclient installation by requesting node info from bcoin

```shell
bcoin-cli info
```

After a few minutes of loading, your output should resemble the printout below. You can repeat the command to watch bcoin sync with the network, until `progress` reaches `1`. This won't take as much time as a full node would need but it could be a while. You can learn more about the command-line API clients `bcoin-cli` and `bwallet-cli` at [http://bcoin.io/api-docs.](http://bcoin.io/api-docs/?shell--cli#introduction)

```shell
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

When bcoin is run for the first time, it will create a new wallet for you, labelled `primary`. That wallet will start off with one account labelled `default`. Display the secret key and mnemonic backup phrase for your wallet. Write down your seed phrase right now! You won't see it in plaintext again.

```shell
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

```shell
curl http://127.0.0.1:8334/wallet/primary/passphrase -X POST --data '{"passphrase":"<YOUR GREAT PASSWORD>"}'
```

Anytime you need an address to send bitcoin to you can use the command line

```shell
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

## Enter: python

Congratulations! If you made it this far, you have a working Bitcoin light client in the palm of your hand, ready to send and receive money. The rest of this guide will focus on interacting with the bcoin node and wallet servers via cURL requests in python. We use python mainly because its easy to interact with the command line and also because the extra hardware we add later is driven by libraries written in python.

First install some dependencies

```shell
sudo apt-get install python-pip python-pil python-requests
sudo pip install pyqrcode
```

Create a new python file `bpi.py` and start with this script. We'll use the `curses` module to draw the output to the terminal and scan for keystrokes. API calls will be handled by `requests`. Run the script with the command `python bpi.py`. You can quit the program at any time by just typing `Q`. 

```python
import requests
import curses
import pyqrcode
import atexit
import time
import sys

### default endpoints for mainnet, not using any API key
nodeurl = "http://127.0.0.1:8332/"
wallurl = "http://127.0.0.1:8334/wallet/primary/"

### set up some functions to get data from bcoin
def getInfo():
	return requests.get(nodeurl).json()

def getAddress():
	params = {"account":"default"}
	return requests.post(wallurl + 'address', json=params).json()

def getBalance():
	return requests.get(wallurl + 'balance?account=default').json()

### start the curses text-based terminal interface
# refresh rate in seconds
REFRESH = 1
stdscr = curses.initscr()
curses.noecho()
curses.cbreak()
curses.halfdelay(REFRESH * 10) # blocking value is x 0.1 seconds
# store window dimensions
MAXYX = stdscr.getmaxyx()

# automatically cleanup curses settings on exit
def cleanup():
	curses.nocbreak()
	curses.echo()
	curses.endwin()
	
	print "bye!"
atexit.register(cleanup)

# stash cursor in the bottom right corner
def hideCursor():
	stdscr.addstr(MAXYX[0]-1, MAXYX[1]-1, "")

# check for keyboard input -- also serves as the pause between REFRESH cycles
def checkKeyIn():
	keyNum = stdscr.getch()
	if keyNum == -1:
		return False
	else:
		key = chr(keyNum)

	if key in ("q", "Q"):
		sys.exit()
	if key in ("d", "D"):
		displayAddr()

### display address and QR code
def displayAddr():
	addr = getAddress()['address']
	code = pyqrcode.create(addr, 'M', version=3)
	stdscr.erase()
	stdscr.addstr(0, 0, addr)
	stdscr.addstr(2, 0, code.text())
	hideCursor()
	stdscr.refresh()
	time.sleep(5)
	
### print the text info display
def printInfo():
	# get data from servers
	info =  getInfo()
	balance = getBalance()

	progress = info['chain']['progress']
	latestHeight = info['chain']['height']
	latestHash = info['chain']['tip']
	confbal = balance['confirmed']
	unconfbal = balance['unconfirmed']

	stdscr.erase()
	stdscr.addstr(0, 0, "Progress: " + str(int(progress*100000000)/1000000.0) + "%")
	stdscr.addstr(1, 0, "Height: " + str(latestHeight))
	stdscr.addstr(2, 0, "Hash: " + str(latestHash))
	stdscr.addstr(3, 0, "Confirmed balance: " + str(confbal))
	stdscr.addstr(4, 0, "Unconfirmed balance: " + str(unconfbal))

	stdscr.addstr(5, 0, "DEBUG: " + str(time.time()))


	# print menu on bottom
	menu = "[Q]uit   [D]eposit"
	stdscr.addstr(MAXYX[0]-1, 0, menu)
	stdscr.refresh()

# loop!
while True:
	printInfo()
	hideCursor()
	checkKeyIn()
```







