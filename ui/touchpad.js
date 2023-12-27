const MOVE_MULT = 2;
const TAP_TIME = 500;
const TAP_DISTANCE = 20;

(function () {
    console.log('Binding touchpad feature');

    const parent = document.getElementById('touchpad');
    if (!parent) throw new Error('no touchpad available');

    const { width, height } = parent.getBoundingClientRect();

    let timeStart = 0;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;

    /**
     * @param {MouseEvent} evt
     */
    const handleDown = (evt) => {
        evt.target.addEventListener('touchmove', handleMove);
        evt.target.addEventListener('touchend', handleUp);

        if (!evt.changedTouches || evt.changedTouches.length === 0) return;
        const touch = evt.changedTouches[0];

        timeStart = Date.now();
        startX = touch.clientX;
        startY = touch.clientY;

        lastX = startX;
        lastY = startY;
    };

    /**
     * @param {MouseEvent} evt
     */
    const handleMove = (evt) => {
        evt.preventDefault();

        if (!evt.changedTouches || evt.changedTouches.length === 0) return;
        const touch = evt.changedTouches[0];

        const relX = Math.ceil((touch.clientX - lastX) * MOVE_MULT);
        const relY = Math.ceil((touch.clientY - lastY) * MOVE_MULT);

        if (relX !== 0 && relY !== 0)
            window.magicRemote.send('mousemove_relative', '--', relX, relY);

        lastX = touch.clientX;
        lastY = touch.clientY;
    };

    /**
     * @param {MouseEvent} evt
     */
    const handleUp = (evt) => {
        evt.preventDefault();

        if (!evt.changedTouches || evt.changedTouches.length === 0) return;
        const touch = evt.changedTouches[0];

        const time = Date.now() - timeStart;
        const dist = Math.sqrt(
            Math.pow(startX - touch.clientX, 2) +
                Math.pow(startY - touch.clientY, 2),
        );

        if (time < TAP_TIME && dist < TAP_DISTANCE) {
            // Considered a tap
            window.magicRemote.send('click', 1);
        }

        evt.target.removeEventListener('touchmove', handleMove);
        evt.target.removeEventListener('touchend', handleUp);
    };

    parent.addEventListener('touchstart', handleDown);
})();
