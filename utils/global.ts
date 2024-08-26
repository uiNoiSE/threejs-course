import { PerspectiveCamera, WebGLRenderer } from 'three';
import type { Ref } from 'vue';

export const toggleFullScreen = async (canvas: Ref<HTMLCanvasElement | undefined>) => {
  try {
    if (!document.fullscreenElement) {
      await canvas.value?.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  } catch (error) {
    console.error('Error toggling fullscreen:', error);
  }
};

export const useSizes = () => {
  return {
    width: ref(window.innerWidth),
    height: ref(window.innerHeight),
  };
};

export const useResize = () => {
  return (camera: PerspectiveCamera, renderer: WebGLRenderer) => {
    useSizes().width.value = window.innerWidth;
    useSizes().height.value = window.innerHeight;
    camera.aspect = useSizes().width.value / useSizes().height.value;
    camera.updateProjectionMatrix();
    renderer.setSize(useSizes().width.value, useSizes().height.value);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
};

export const handleMousemove = (e: MouseEvent) => {
  const cursor = {
    x: ref(0),
    y: ref(0),
  };

  cursor.x.value = e.clientX / useSizes().width.value - 0.5;
  cursor.y.value = -(e.clientY / useSizes().height.value - 0.5);
};
