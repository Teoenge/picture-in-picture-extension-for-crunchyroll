let isMonitoring = false;

function removePipAttribute(video) {
  video?.removeAttribute("disablepictureinpicture");
}

function createPipControl() {
  const pipIconTag =
    '<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e8eaed"><path d="M96-480v-72h165L71-743l50-50 191 190v-165h72v288H96Zm72 288q-29.7 0-50.85-21.15Q96-234.3 96-264v-144h72v144h336v72H168Zm624-264v-240H456v-72h336q29.7 0 50.85 21.15Q864-725.7 864-696v240h-72ZM576-192v-192h288v192H576Z"/></svg>';
  const parser = new DOMParser();
  const pipIconNode = parser.parseFromString(pipIconTag, "text/html");
  const pipIcon = pipIconNode.documentElement;
  const pipControl = document.createElement("div");
  pipControl.setAttribute("id", "pipControl");
  pipControl.classList.add("pip-control");
  pipControl.appendChild(pipIcon);

  return pipControl;
}

function addPipControl(controlsContainer, video) {
  if (!controlsContainer || !video) return;

  const pipControl = createPipControl();
  controlsContainer.appendChild(pipControl);
  removePipAttribute(video);

  pipControl.addEventListener("click", (e) => {
    e.stopImmediatePropagation();

    if (!document.pictureInPictureEnabled) return;

    if (document.pictureInPictureElement) document.exitPictureInPicture();
    else video.requestPictureInPicture();
  });
}

function startVideoControlsMonitor() {
  if (isMonitoring) return;

  const monitor = new MutationObserver(() => {
    const video = document.querySelector(
      "#player0, #bitmovinplayer-video-null",
    );
    if (!video) return;

    const controlsContainer = document.getElementById("vilosControlsContainer");
    if (!controlsContainer) return;

    const pipControl = document.getElementById("pipControl");
    if (pipControl) return;

    addPipControl(controlsContainer, video);
  });

  monitor.observe(document.body, {
    childList: true,
    subtree: true,
  });

  isMonitoring = true;
}

function init() {
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    const video = document.querySelector(
      "#player0, #bitmovinplayer-video-null",
    );
    removePipAttribute(video);
    return;
  }

  startVideoControlsMonitor();
}

init();
