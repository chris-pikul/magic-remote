window.magicRemote = {
    socket: null,
    send: (...args) => console.log('Connection not setup', args),
};

function connect() {
    if (window.magicRemote.socket) return;

    const url = `ws://${window.location.host}/socket`;
    window.magicRemote.socket = new WebSocket(url);

    window.magicRemote.socket.onerror = console.error;
    window.magicRemote.socket.onclose = () => {
        console.log('Socket closed, retrying in 1sec');

        const scrn = document.getElementById('disabler');
        if (scrn) scrn.style.display = '';

        window.magicRemote.socket = null;
        setTimeout(connect, 3000);
    };
    window.magicRemote.socket.onopen = () => {
        console.log('Socket is open now');

        const scrn = document.getElementById('disabler');
        if (scrn) scrn.style.display = 'none';

        window.magicRemote.send = (...args) => {
            if (window.magicRemote.socket)
                window.magicRemote.socket.send(args.join(' '));
        };
    };
}

(function () {
    console.log('Setting up socket connection');
    connect();

    // Prevent keypresses from doing anything
    window.addEventListener('keydown', (evt) => {
        evt.preventDefault();
        evt.bubbles = false;
        console.log('Intercept key', evt.key);
        return false;
    });
})();
