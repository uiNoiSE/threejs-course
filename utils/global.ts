export const toggleFullScreen = async (canvas: HTMLElement) => {
  try {
    if (!document.fullscreenElement) {
      await canvas.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  } catch (error) {
    console.error('Error toggling fullscreen:', error);
  }
};
