import { get, set } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

const viewFinder = document.getElementById("viewfinder");
const gallery = document.getElementById("gallery");
const shutterRelease = document.getElementById("shutter-release");
const setupPopup = document.getElementById("setup");

// Setup file storage
const DIR_HANDLE_KEY = "dirHandle";

const verifyPermission = async () => {
  const options = { mode: "readwrite" };
  if ((await dirHandle.queryPermission(options)) === "granted") {
    return;
  }
  if ((await dirHandle.requestPermission(options)) === "granted") {
    return;
  }
  // TODO error handling
};

let dirHandle;

const getFileHandle = async () => {
  dirHandle = await get(DIR_HANDLE_KEY);

  if (dirHandle) {
    await verifyPermission();
  } else {
    dirHandle = await window.showDirectoryPicker();
    await set("dirHandle", newHandle);
  }

  setupPopup.classList.add("close");
};

setupPopup.querySelector("button").addEventListener("click", getFileHandle);

// Get camera stream and its capabilities
const constraints = { video: true };
const stream = await navigator.mediaDevices.getUserMedia(constraints);
const videoTrack = stream.getVideoTracks()[0];
const capabilities = videoTrack.getCapabilities();

// Create viewfinder
viewFinder.srcObject = stream;

// Setup gallery
gallery.width = capabilities.width.max;
gallery.height = capabilities.height.max;

// Make and save photo
const takePhoto = async () => {
  const context = gallery.getContext("2d");
  context.drawImage(viewFinder, 0, 0, gallery.width, gallery.height);
  await savePhoto(gallery);
};

const savePhoto = async (canvas) => {
  const fileHandle = await dirHandle.getFileHandle(`image_${Date.now()}.jpg`, {
    create: true,
  });

  const imageBlob = await getBlobFromCanvas(canvas);

  const writable = await fileHandle.createWritable();

  await writable.write(imageBlob);
  await writable.close();
};

const getBlobFromCanvas = (canvas) => {
  return new Promise((resolve, reject) => {
    const cb = (blob) => (blob ? resolve(blob) : reject());

    canvas.toBlob(cb, "image/jpg");
  });
};

shutterRelease.addEventListener("click", takePhoto);
