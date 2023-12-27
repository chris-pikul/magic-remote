window.magicRemote = {
    socket: null,
    send: (...args) => console.log('Connection not setup', args),
};

(function () {
    console.log('Setting up socket connection');
})();
