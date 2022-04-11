import { createGallery } from "./gallery.js";
import { createViewfinder } from "./viewfinder.js";
import { createShutter } from "./shutter.js";

const setupPopup = document.getElementById("setup");

// Setup file storage
const setup = async () => {
  const viewfinder = await createViewfinder({
    element: document.getElementById("viewfinder"),
  });

  const gallery = await createGallery({
    element: document.getElementById("gallery"),
  });

  await createShutter({
    element: document.getElementById("shutter"),
    viewfinder,
    gallery,
  });

  setupPopup.classList.add("close");
};

setupPopup.querySelector("button").addEventListener("click", setup);
