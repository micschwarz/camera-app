export const createViewfinder = async ({ element }) => {
  const constraints = { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  element.srcObject = stream;

  return {
    get element() {
      return element;
    },
    get videoTrack() {
      return stream.getVideoTracks()[0];
    },
    get dimentions() {
      const capabilities = this.videoTrack.getCapabilities();
      return {
        width: capabilities.width.max ?? 0,
        height: capabilities.height.max ?? 0,
      };
    },
  };
};
