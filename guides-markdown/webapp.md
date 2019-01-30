
# Building web applications with the bcoin library

```post-author
Matthew Zipkin
```

```post-description
Use individual modules from the bcoin library to build web applications.
```

bcoin is an awesome full node implementation, built in such a way that
each of its modules can be pulled out and reassembled in any configuration, or
run totally independently from any kind of node, wallet, or network. The developers
are also committed to maintaining browser compatibility in every module, even
adding alternative scripts for components like [databases](https://github.com/bcoin-org/bdb/blob/master/lib/level-browser.js)
and [cryptography](https://github.com/bcoin-org/bcrypto/blob/master/lib/js/sha256.js)
so every bcoin function will run properly in the browser. In a previous guide, we
illustrated [how to run a full node in the web browser](https://bcoin.io/guides/browser).
While that is an amusing novelty and intriguing proof-of-concept, its of little practical
utility... for now. But because bcoin was developed with a modular architecture, we can
build very useful web-based applications for Bitcoin using small bits of the code base,
and only importing what we need.

## Let's build a Bitcoin web-app

For this guide, we're going to build a simple website that turns
[12-word seed phrases](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
into [hierarchical-deterministic wallet accounts](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki),
generates its own random seed phrases, and outputs both legacy and
[SegWit addresses.](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki)

You can play with the finished app at [http://bcoin.io/apps/address](http://bcoin.io/apps/address),
and if you're interested you can also step through my build process
[commit-by-commit](https://github.com/pinheadmz/bcoin-webapp/commits).

## Install the bcoin library

Nothing special here, this is how all bcoin projects start. If you already have
bcoin installed somewhere, you don't have to do this again.

```command-line
git clone https://github.com/bcoin-org/bcoin
cd bcoin
npm install
```

## Install the browser-bundling tools.

There are a few popular tools out there that convert nodejs-style JavaScript for
browser compatibility. You might have already heard of [browserify](https://www.npmjs.com/package/browserify)
or [webpack](https://www.npmjs.com/package/webpack) but for this guide we are going
to use [bpkg](https://www.npmjs.com/package/bpkg). `bpkg` was created by the bcoin
developers in order to get the minimum functionality we need WITH ZERO DEPENDENCIES.
This a monumental boon for security, especially when developing applications for cryptocurrency.
Let's install it globally so we can just run it from the command line in any directory:

```
npm install -g bpkg
```

There is one other package we can install as an option and that is `uglify-es`.
This package [minifies](https://en.wikipedia.org/wiki/Minification_%28programming%29)
the code after it has been converted, to save an immense amount of space in the
final JavaScript files. For this project, `uglify-es` will save us about 40% of
the final file size! Keep in mind, this is a compromise of security for convenience.
Until the bcoin development team re-implements `uglify-es`, we have to trust that
it won't inject vulnerabilities into our code. For the purposes of this guide, we
are going to accept that risk ;-)

```
npm install -g uglify-es
```

## Compile a bcoin module for the browser

In bcoin, mnemonic seeds, HD derivation and private keys are all handled by the
[hd module](https://github.com/bcoin-org/bcoin/tree/master/lib/hd). Here's the command
to compile the hd module for our web-app:

```
mkdir <new dir for your app>
cd <wherever your bcoin repo is installed>
bpkg --browser --standalone --plugin [ uglify-es --toplevel ] --name HD --output <your new app dir>/HD.js lib/hd/index.js
```

Here's a rundown of those `bpkg` command options:

`browser` Sets the environment for the browser instead of nodejs.

`standalone` Enforces universal compatibility, allowing us to access the module
from the global scope.

`plugin` Runs our code through the minifier, explained above.

`name` This is the name of the global object created by our output.

`output` Destination for final output file.

`lib/hd/index.js` Finally, we add the target entry-point for the process.

## Initialize our webpage

Next we'll create the simplest-possible html file and import the module we just compiled.
Create this file in the same directory that `HD.js` was exported to.

`index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>bcoin webapp</title>
  </head>
  <body>
    <script type="text/javascript" src="HD.js"></script>
  </body>
</html> 
```

If you open this file in a web browser, you'll see blank page, but the JavaScript
module is loaded in there! Open up the developer console and just start typing `HD.`
In browsers like Chrome, the console will reveal to you all the methods and properties
of the `HD` object. Right away, we can see a list of awesome things we can do with
this module!

<div style='text-align: center'>
   <img src='../assets/images/guides/webapp-hd-console.png' style='width:50%'>
 </div>

