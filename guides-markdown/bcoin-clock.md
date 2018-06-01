# Run bcoin on a Raspberry Pi Zero W and make your own Bitcoin Clock!
```post-author
Matthew Zipkin
```

```post-description
Learn how to install bcoin on a brand-new Raspberry Pi Zero W. Create scripts to interact with bcoin in SPV mode and then add some hardware to make your own Bitcoin Clock and Piggy Bank!
```

## Set up the Raspberry Pi
Get yourself a Raspberry Pi Zero W and a "class 10" MicroSD card.

### Prepare the MicroSD card using your desktop computer
Before you plug in the Pi for the first time, you need to install the OS on the MicroSD card and get a few settings ready for the Pi before it boots up for the first time.

1) [Download the latest version of Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/) (which is the "headless" version, we don't need the GUI!)
2) [UnZip the downloaded file and copy the disk image to the MicroSD card.](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)
3) Mount the MicroSD card with its new disk image on your computer again if it didn't mount automatically. We need to add two files to the `/boot` volume:
	a. [Enable SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md) by just saving a file to `/boot` called `ssh`, with no file extension. The file doesn't need to have any content (a blank text file is fine).
	b. [Add your local WiFi information](https://www.raspberrypi.org/blog/another-update-raspbian/) by saving a file to `/boot` called `wpa_supplicant.conf`. You will add the following lines to this file -- be sure to include the correct WiFi network name and password!
```bash
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
	ssid="<YOUR NETWORK NAME>"
	psk="<YOUR NETWORK PASSWORD>"
	key_mgmt=WPA-PSK
}
```

### Boot up the Raspberry Pi, connect via SSH, and finish conifguration
1) Safely eject the MicroSD card from your desktop computer and put it in the Raspberry Pi. Power it on!
2) After a few minutes, open a terminal on your dektop computer and [find the Pi on your network.](https://www.raspberrypi.org/documentation/remote-access/ip-address.md)
```bash
ssh pi@raspberrypi.local
```
The default password for all Raspberry Pis is `raspberry` :-)
3) Upgrade the OS and utilities 
```bash
sudo apt-get update && sudo apt-get upgrade
```
4) Configure options
```bash
sudo raspi-config
```
	a. Password: Change the password!
	b. Network: Change the hostname to `bpi` or anything else you like.
	c. Boot: Set the Pi to boot directly to the Console with user pi logged in
	d. Interface: Turn on SPI and GPIO! We'll need these for the hardware add-ons later
	e. Advanced: Expand File system. This will expand the filesystem from the small size of the disk image we downloaded, to use up all the available space on the MicroSD card.
	f. Exit the config tool and reboot the Pi: `sudo shutdown -r now`
	
### Install bcoin and its dependencies
1) After the Pi has had a minute or so to reboot, connect to it again via SSH. Don't forget we changed the hostname and password in step 4b above!
```shell
ssh pi@bpi.local
```
2) Install nodejs
	a. Double check your processor type (Raspberry Pi Zero is built around an ARMv6)
```shell
uname -a
```
	b. [Get the latest nodejs for 32-bit ARMv6](https://nodejs.org/en/download/).
```shell
cd ~
wget https://nodejs.org/dist/v8.11.2/node-v8.11.2-linux-armv6l.tar.xz
```
	c. Unpack the archive
```shell
tar -xvf node-v8.11.2-linux-armv6l.tar.xz
```
	d. Add node and installed packages to PATH now and for all future sessions
```shell
echo 'export PATH=$PATH:/home/pi/node-v8.11.2-linux-armv6l/bin' >> ~/.bashrc
export PATH=$PATH:/home/pi/node-v8.11.2-linux-armv6l/bin
```
	e. Update npm, using npm!
```shell
npm install -g npm
```
	f. Check versions
```shell
node --version # v8.11.2 at time of writing
npm --version  # 6.1.0 at time of writing
```
	g. Update node path (to global modules) for now and for all future sessions
```shell
echo "export NODE_PATH=`npm root --quiet -g`" >> ~/.bashrc
export NODE_PATH=`npm root --quiet -g`

3) Install bcoin from GitHub master
	a. You'll need to install `git` first, then download the bcoin repository
```shell
sudo apt-get install git
cd ~
git clone https://github.com/bcoin-org/bcoin
cd bcoin
npm install -g
```

4) Install bclient
```shell
npm install -g bclient
```

5) Test it out!
```shell
# launch the bcoin daemon in the background and start it syncing to testnet
bcoin --daemon --spv
# watch the bcoin log, make sure it looks healthy (ctrl+c to stop and return to prompt)
tail -F ~/.bcoin/debug.log
# test bclient install by requesting node info from bcoin
bcoin-cli info
```
	d. After a few minutes of loading, your output should resemble the printout below. You can repeat the command to watch bcoin sync with the network, until `progress` reaches `1`. This won't take as much time as a full node would need but it could be a while.
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








