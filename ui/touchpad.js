const TAP_TIME = 500;
const TAP_DISTANCE = 20;

(function () {
    console.log('Binding touchpad feature');

    const parent = document.getElementById('touchpad');
    if (!parent) throw new Error('no touchpad available');

    let timeStart = 0;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;

    /**
     * @param {MouseEvent} evt
     */
    const handleDown = (evt) => {
        evt.target.addEventListener('mousemove', handleMove);
        evt.target.addEventListener('mouseup', handleUp);

        timeStart = Date.now();
        startX = evt.clientX;
        startY = evt.clientY;

        lastX = startX;
        lastY = startY;
    };

    /**
     * @param {MouseEvent} evt
     */
    const handleMove = (evt) => {
        const relX = evt.clientX - lastX;
        const relY = evt.clientY - lastY;

        if (relX !== 0 && relY !== 0)
            window.magicRemote.send('mouse', relX, relY);

        lastX = evt.clientX;
        lastY = evt.clientY;
    };

    /**
     * @param {MouseEvent} evt
     */
    const handleUp = (evt) => {
        const time = Date.now() - timeStart;
        const dist = Math.sqrt(
            Math.pow(startX - evt.clientX, 2) +
                Math.pow(startY - evt.clientY, 2),
        );

        if (time < TAP_TIME && dist < TAP_DISTANCE) {
            // Considered a tap
            console.log('Sending mouse tap');
        }

        evt.target.removeEventListener('mousemove', handleMove);
        evt.target.removeEventListener('mouseup', handleUp);
    };

    parent.addEventListener('mousedown', handleDown);
})();
