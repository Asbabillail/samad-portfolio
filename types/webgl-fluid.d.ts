/**
 * Minimal typed interface for the third-party WebGL Fluid initializer.
 * This is used only for the site's decorative canvas.
 */
declare module 'webgl-fluid' {
  export default function fluid(
    canvas: HTMLCanvasElement,
    options: Record<string, unknown>,
  ): void;
}
