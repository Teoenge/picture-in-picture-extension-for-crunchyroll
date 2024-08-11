let isMonitoring = false;

function removePipAttribute(video) {
    video?.removeAttribute('disablepictureinpicture');
}

function createPipControl() {
    const pipIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M96-480v-72h165L71-743l50-50 191 190v-165h72v288H96Zm72 288q-29.7 0-50.85-21.15Q96-234.3 96-264v-144h72v144h336v72H168Zm624-264v-240H456v-72h336q29.7 0 50.85 21.15Q864-725.7 864-696v240h-72ZM576-192v-192h288v192H576Z"/></svg>';
    const pipControl = document.createElement('div');
    pipControl.setAttribute('id', 'pipControl');
    pipControl.classList.add('pip-control');
    pipControl.innerHTML = pipIcon;

    return pipControl;
}

function addPipControl() {
    const settingsControl = document.getElementById('settingsControl');
    if (!settingsControl)
        return;

    const videoControlsContainer = settingsControl.parentElement;
    const pipControl = createPipControl();
    videoControlsContainer?.insertBefore(pipControl, settingsControl);

    pipControl.addEventListener('click', e => {
        e.stopImmediatePropagation();

        const video = document.getElementById('player0');
        removePipAttribute(video);

        if (!document.pictureInPictureEnabled) 
            return;

        if (document.pictureInPictureElement) 
            document.exitPictureInPicture().catch(err => console.log(err));
        else
            video?.requestPictureInPicture().catch(err => console.log(err));
    })
}

function startVideoControlsMonitor() {
    if (isMonitoring)
        return;

    const monitor = new MutationObserver(() => {
        const video = document.getElementById('player0');
        const settingsControl = document.getElementById('settingsControl');
        const pipControl = document.getElementById('pipControl');
        if (!video || !settingsControl || pipControl)
            return;

        addPipControl();
    });

    const container = document.querySelector('body');
    if (!container)
        return;

    monitor.observe(container, {
        attributes: false,
        childList: true,
        subtree: true
    });

    isMonitoring = true;
}

function init() {
    if (navigator.userAgent.indexOf("Firefox") > 0) {
        const video = document.getElementById('player0');
        removePipAttribute(video);
        return;
    }

    startVideoControlsMonitor();
}

init();