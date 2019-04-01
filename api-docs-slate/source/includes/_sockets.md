# Sockets

Socket events use the socket.io protocol.

Socket IO implementations:

- JS: [https://github.com/socketio/socket.io-client](https://github.com/socketio/socket.io-client)
- Python: [https://github.com/miguelgrinberg/python-socketio](https://github.com/miguelgrinberg/python-socketio)
- Go: [https://github.com/googollee/go-socket.io](https://github.com/googollee/go-socket.io)
- C++: [https://github.com/socketio/socket.io-client-cpp](https://github.com/socketio/socket.io-client-cpp)
- bsock: [https://github.com/bcoin-org/bsock](https://github.com/bcoin-org/bsock) (recommended!)

`bsock` is a minimal websocket-only implementation of the socket.io protocol,
complete with ES6/ES7 features, developed by the bcoin team. `bsock` is used
throughout the bcoin ecosystem including
[`bclient`](https://github.com/bcoin-org/bclient) and [`bpanel`](https://github.com/bpanel-org/bpanel).
Examples below describe usage with `bsock` specifically.

For a deeper dive into events and sockets in bcoin, including a tutorial
on using `bsock` and `bclient`, see the [bcoin.io Events and Sockets Guide.](https://bcoin.io/guides/events.html)
