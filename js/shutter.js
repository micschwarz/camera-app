const getBlobFromCanvas = (canvas) => {
  return new Promise((resolve, reject) => {
    const cb = (blob) => (blob ? resolve(blob) : reject());

    canvas.toBlob(cb, "image/jpg");
  });
};

export const createShutter = async ({ element, gallery, viewfinder }) => {
  const canvas = document.createElement("canvas");
  const dimentions = viewfinder.dimentions;
  canvas.width = dimentions.width;
  canvas.height = dimentions.height;

  element.addEventListener("click", async () => {
    try {
      const context = canvas.getContext("2d");
      context.drawImage(
        viewfinder.element,
        0,
        0,
        dimentions.width,
        dimentions.height
      );
      const image = await getBlobFromCanvas(canvas);
      await gallery.add(image);
    } catch (error) {
      console.log(error);
    }
  });
};
