import { get, set } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

const DIR_HANDLE_KEY = "dirHandle";

const verifyPermission = async (dirHandle) => {
  const options = { mode: "readwrite" };
  if ((await dirHandle.queryPermission(options)) === "granted") {
    return;
  }
  if ((await dirHandle.requestPermission(options)) === "granted") {
    return;
  }
  // TODO error handling
};

const getDirHandle = async () => {
  let dirHandle = await get(DIR_HANDLE_KEY);

  if (!dirHandle) {
    dirHandle = await window.showDirectoryPicker();
    await set("dirHandle", dirHandle);
  }

  return dirHandle;
};

export const createGallery = async ({ element }) => {
  let dirHandle = await getDirHandle();
  await verifyPermission(dirHandle);

  if (!dirHandle) {
    dirHandle = await window.showDirectoryPicker();
    await set("dirHandle", dirHandle);
  }

  return {
    async add(blob) {
      const fileHandle = await dirHandle.getFileHandle(
        `image_${Date.now()}.jpg`,
        {
          create: true,
        }
      );

      const writable = await fileHandle.createWritable();

      await writable.write(blob);
      await writable.close();

      const image = await fileHandle.getFile();
      this.show(image);
    },
    show(image) {
      const oldImage = element.src;
      element.src = URL.createObjectURL(image);
      URL.revokeObjectURL(oldImage);
    },
  };
};
