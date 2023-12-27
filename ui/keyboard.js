const codeConvert = {
    '!': 'exclam',
    '@': 'at',
    '#': 'numbersign',
    '$': 'dollar',
    '%': 'percent',
    '^': 'asciicircum',
    '&': 'ampersand',
    '*': 'asterisk',
    '(': 'parenleft',
    ')': 'parenright',
    '-': 'minus',
    '_': 'underscore',
    '+': 'plus',
    '=': 'equal',
    '[': 'bracketleft',
    ']': 'bracketright',
    '\\': 'backslash',
    '{': 'braceleft',
    '}': 'braceright',
    '|': 'bar',
    ':': 'colon',
    ';': 'semicolon',
    "'": 'apostraphe',
    '"': 'quotedbl',
    ',': 'comma',
    '.': 'period',
    '/': 'slash',
    '<': 'less',
    '>': 'greater',
    '?': 'question',
    '~': 'asciitilde',
};

(function () {
    console.log('Binding keyboard feature');
    const container = document.getElementById('keyboard');
    if (!container) throw new Error('No keyboard container available');

    const buttons = container.querySelectorAll('button');
    if (buttons.length === 0) throw new Error('No keyboard buttons detected');

    let cap = 0;
    let mode = 'alpha';

    const shift = () => {
        console.log('Shift key pressed');

        cap = cap === 0 ? 1 : 0;
        buttons.forEach((btn) => {
            const shiftSet = btn.dataset.shift;
            if (shiftSet && shiftSet.length > 0)
                btn.innerText = shiftSet.charAt(cap);
        });
    };

    const cycle = () => {
        console.log('Cycle key pressed');

        mode = mode === 'alpha' ? 'symbol' : 'alpha';
        buttons.forEach((btn) => {
            const cycleSet = btn.dataset.set;
            if (cycleSet && cycleSet.length > 0) {
                if (mode === 'alpha') {
                    const shiftSet = btn.dataset.shift;
                    if (shiftSet && shiftSet.length > 0)
                        btn.innerText = shiftSet.charAt(cap);
                    else btn.innerText = cycleSet.charAt(0);
                } else {
                    if (cycleSet.length == 2)
                        btn.innerText = cycleSet.charAt(1);
                    else btn.innerText = cycleSet.charAt(0);
                }
            }
        });

        const cycleButton = container.querySelector('[data-action="cycle"]');
        if (cycleButton) {
            if (mode === 'alpha') cycleButton.innerHTML = '!@#';
            else cycleButton.innerHTML = 'ABC';
        }
    };

    const handler = (evt) => {
        /**
         * @type {HTMLButtonElement}
         */
        const btn = evt.target;
        if (!btn) return console.error('No target for event');

        let code = '';
        if (btn.dataset.key && btn.dataset.key.length > 0)
            code = btn.dataset.key;
        else code = btn.innerText;

        if (code in codeConvert) code = codeConvert[code];

        if (code && code.length > 0) {
            console.log('Sending key event', code);
            window.magicRemote.send('key', code);
        }
    };

    buttons.forEach((btn) => {
        const action = btn.dataset.action;
        if (action && action.length > 0) {
            // This button is a special action
            switch (action) {
                case 'shift':
                    btn.onclick = shift;
                    break;
                case 'cycle':
                    btn.innerText = '!@#';
                    btn.onclick = cycle;
                    break;
                default:
                    console.warn(`Unknown action ${action} cannot be bound`);
            }
            return;
        }

        const shiftSet = btn.dataset.shift;
        if (shiftSet && shiftSet.length > 0)
            btn.innerText = shiftSet.charAt(cap);

        btn.addEventListener('click', handler);
    });
})();
