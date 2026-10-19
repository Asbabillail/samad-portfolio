'use client';

import { useEffect, useRef, useState } from 'react';
import CursorOrbit from './CursorOrbit';

const VERTEX = `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
out vec4 outputColor;

mat2 turn(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}
float sphereSdf(vec3 p, float r) { return length(p) - r; }
float torusSdf(vec3 p, vec2 shape) {
  vec2 q = vec2(length(p.xz) - shape.x, p.y);
  return length(q) - shape.y;
}
vec2 scene(vec3 p) {
  vec3 a = p;
  a.xy *= turn(0.5 + u_pointer.x * 0.34 + 0.08 * sin(u_time * 0.32));
  a.yz *= turn(0.65 + u_pointer.y * 0.36);
  float outer = torusSdf(a, vec2(1.05, 0.042));

  vec3 b = p;
  b.xy *= turn(0.85 - u_pointer.y * 0.32 - 0.13 * sin(u_time * 0.28));
  b.xz *= turn(0.33 + u_pointer.x * 0.36);
  float middle = torusSdf(b, vec2(0.79, 0.031));

  vec3 c = p;
  c.xz *= turn(0.48 + u_pointer.x * 0.3 + 0.12 * sin(u_time * 0.23));
  c.xy *= turn(1.18 + u_pointer.y * 0.25);
  float inner = torusSdf(c, vec2(0.57, 0.025));

  float core = sphereSdf(p, 0.31);
  vec2 d = vec2(outer, 1.0);
  if (middle < d.x) d = vec2(middle, 2.0);
  if (inner < d.x) d = vec2(inner, 3.0);
  if (core < d.x) d = vec2(core, 4.0);
  return d;
}
vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    scene(p + e.xyy).x - scene(p - e.xyy).x,
    scene(p + e.yxy).x - scene(p - e.yxy).x,
    scene(p + e.yyx).x - scene(p - e.yyx).x
  ));
}
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  float radius = length(uv);
  vec3 bg = mix(vec3(0.037, 0.073, 0.102), vec3(0.03, 0.13, 0.17), 0.45 * smoothstep(0.8, 0.05, radius));
  float grid = sin(uv.x * 27.0) * sin(uv.y * 27.0);
  bg += 0.012 * smoothstep(0.98, 1.0, grid) * (1.0 - smoothstep(0.30, 1.1, radius));

  vec3 ro = vec3(0.0, 0.0, 3.85);
  vec3 rd = normalize(vec3(uv, -1.7));
  float t = 0.0;
  float material = 0.0;
  bool hit = false;

  for (int i = 0; i < 76; i++) {
    vec2 sampled = scene(ro + rd * t);
    if (sampled.x < 0.002) { hit = true; material = sampled.y; break; }
    t += max(sampled.x * 0.76, 0.009);
    if (t > 7.5) break;
  }

  vec3 color = bg;
  if (hit) {
    vec3 pos = ro + rd * t;
    vec3 n = normalAt(pos);
    vec3 light = normalize(vec3(-0.54, 0.78, 1.0));
    float lambert = max(dot(n, light), 0.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.6);
    float specular = pow(max(dot(reflect(-light, n), -rd), 0.0), 28.0);

    vec3 tint = material < 1.5 ? vec3(0.23, 0.91, 0.79) :
                material < 2.5 ? vec3(0.91, 0.70, 0.45) :
                material < 3.5 ? vec3(0.42, 0.64, 1.0) :
                vec3(0.26, 0.64, 0.75);
    color = tint * (0.24 + 0.77 * lambert);
    color += tint * rim * 0.55 + vec3(1.0) * specular * 0.45;
    color += tint * 0.06 / max(0.12, abs(pos.z));
  }

  vec2 cell = floor((uv + vec2(0.17)) * 38.0);
  float star = step(0.994, hash21(cell));
  vec2 local = fract((uv + vec2(0.17)) * 38.0) - 0.5;
  float sparkle = star * (1.0 - smoothstep(0.02, 0.09, length(local)));
  if (!hit) color += vec3(0.22, 0.65, 0.68) * sparkle * 0.35;

  color *= 1.0 - smoothstep(0.52, 1.07, radius) * 0.96;
  color = color / (1.0 + color * 0.4);
  outputColor = vec4(pow(max(color, vec3(0.0)), vec3(0.92)), 1.0);
}`;

function makeShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Phase 003: real-time WebGL2 raymarched 3D sculpture.
 * Uses native WebGL to avoid a large dependency or asset download.
 * Reduced-motion, off-screen, touch, and unsupported-browser fallbacks.
 */
export default function CinematicScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
      depth: false,
      stencil: false,
    });
    if (!gl) {
      setFallback(true);
      return;
    }

    const vert = makeShader(gl, gl.VERTEX_SHADER, VERTEX);
    const frag = makeShader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vert || !frag) {
      if (vert) gl.deleteShader(vert);
      if (frag) gl.deleteShader(frag);
      setFallback(true);
      return;
    }

    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    if (!program || !buffer) {
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      setFallback(true);
      return;
    }

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      setFallback(true);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const pointerUniform = gl.getUniformLocation(program, 'u_pointer');
    const clock = gl.getUniformLocation(program, 'u_time');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    let isVisible = false;
    let raf = 0;
    let elapsed = 0;
    let lastFrame = 0;
    let x = 0;
    let y = 0;
    let goalX = 0;
    let goalY = 0;
    let alive = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      // Limit rendering work even on high-density displays.
      const scale = Math.min(window.devicePixelRatio || 1, 1.15);
      const sizeX = Math.min(Math.round(rect.width * scale), 620);
      const sizeY = Math.min(Math.round(rect.height * scale), 620);
      if (canvas.width !== sizeX || canvas.height !== sizeY) {
        canvas.width = sizeX;
        canvas.height = sizeY;
        gl.viewport(0, 0, sizeX, sizeY);
      }
    };

    const draw = (timestamp: number) => {
      if (!alive || !isVisible) { raf = 0; return; }
      // 30 FPS cap reduces GPU load for raymarched material.
      if (timestamp - lastFrame >= 32 || reducedMotion.matches) {
        const delta = Math.min(timestamp - (lastFrame || timestamp), 50);
        lastFrame = timestamp;
        if (!reducedMotion.matches) elapsed += delta * 0.001;
        x += (goalX - x) * 0.085;
        y += (goalY - y) * 0.085;
        resize();
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform2f(pointerUniform, x, y);
        gl.uniform1f(clock, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      raf = reducedMotion.matches ? 0 : window.requestAnimationFrame(draw);
    };

    const stop = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    };
    const start = () => {
      stop();
      if (isVisible) raf = window.requestAnimationFrame(draw);
    };
    const onMouse = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      goalX = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1));
      goalY = Math.max(-1, Math.min(1, 1 - event.clientY / window.innerHeight * 2));
    };

    const observer = new IntersectionObserver((entries) => {
      isVisible = !!entries[0]?.isIntersecting;
      if (isVisible) start(); else stop();
    }, { threshold: 0.04 });
    observer.observe(canvas);
    window.addEventListener('pointermove', onMouse, { passive: true });
    const onMotionChange = () => { elapsed = 0; start(); };
    const onResize = () => { resize(); if (reducedMotion.matches) start(); };
    reducedMotion.addEventListener('change', onMotionChange);
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      alive = false;
      stop();
      observer.disconnect();
      window.removeEventListener('pointermove', onMouse);
      window.removeEventListener('resize', onResize);
      reducedMotion.removeEventListener('change', onMotionChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  if (fallback) return <CursorOrbit />;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-[-2%] top-1/2 hidden aspect-square w-[min(48vw,600px)] -translate-y-1/2 select-none overflow-hidden rounded-full opacity-95 lg:block">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
