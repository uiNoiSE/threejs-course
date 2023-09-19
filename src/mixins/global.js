import { ref } from "vue";

export function useSizes() {
  return {
    width: ref(window.innerWidth),
    height: ref(window.innerHeight),
  };
}

export function useResize() {
  return (camera, renderer) => {
    useSizes().width.value = window.innerWidth;
    useSizes().height.value = window.innerHeight;
    camera.aspect = useSizes().width.value / useSizes().height.value;
    camera.updateProjectionMatrix();
    renderer.setSize(useSizes().width.value, useSizes().height.value);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
}

export function handleFullscreen(canvas) {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.value.requestFullscreen) {
      canvas.value.requestFullscreen();
    } else if (canvas.value.webkitRequestFullscreen) {
      canvas.value.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  return fullscreenElement;
}

export function handleMousemove(e) {
  const cursor = {
    x: ref(0),
    y: ref(0),
  };

  cursor.x.value = e.clientX / useSizes().width.value - 0.5;
  cursor.y.value = -(e.clientY / useSizes().height.value - 0.5);
}
