
# Building web applications with the bcoin library

```post-author
Matthew Zipkin
```

```post-description
Use individual modules from the bcoin library to build web applications.
```

See the finished webpage at 


## bcoin
git clone 
npm i

## bpkg
https://github.com/chjj/bpkg
npm install -g bpkg

bpkg --browser --standalone --name HD --output ~/Desktop/work/bcoin-webapp/HD.js lib/hd/index.js
.
bpkg --browser --standalone --name KeyRing --output ~/Desktop/work/bcoin-webapp/KeyRing.js lib/primitives/keyring.js
.
## html

    <script type="text/javascript" src="HD.js"></script>

 
 ![HD object in console](../assets/images/guides/webapp-hd-console.png "HD object in console")
