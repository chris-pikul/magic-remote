(function () {
    console.log('Binding general controls');

    const container = document.getElementById('buttons');
    if (!container) throw new Error('No buttons container available');

    const buttons = container.querySelectorAll('button');
    if (!buttons || buttons.length === 0)
        throw new Error('No buttons available');

    const handler = (evt) => {
        /**
         * @type {HTMLButtonElement}
         */
        const btn = evt.target;
        if (!btn) return;

        const code = btn.dataset.key || btn.innerText;
        console.log('Sending event', code);
        window.magicRemote.send('key', code);
    };

    buttons.forEach((btn) => btn.addEventListener('click', handler));
})();
