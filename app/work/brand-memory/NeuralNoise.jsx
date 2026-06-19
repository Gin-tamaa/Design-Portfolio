"use client";

// WebGL "Neural Noise" background, ported from the GLSL shader the
// user supplied (originally based on @zozuar's artwork, via Ksenia
// Kondrashova). Used in the Brand Memory hero in place of the
// fixed sky bg, so the hero reads as alive without committing the
// route to a baked image.
//
// Light-theme adaptation: the original draws bright neural traces on
// near-black. Here we flip it: render the noise as a faint dark
// ink with alpha driven by the same shape function, so it reads as
// soft graphite scratches over the white hero surface. Body / hero
// bg stays white; the canvas blends on top.
//
// Reduced motion → snap to a single frame, no render loop.

import { useEffect, useRef } from "react";

const VERT = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;
  void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform float u_scroll_progress;

  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }

  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;
    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.);
      sine_acc = rotate(sine_acc, 1.);
      vec2 layer = uv * scale + float(j) + sine_acc - t;
      sine_acc += sin(layer) + 2.4 * p;
      res += (.5 + .5 * cos(layer)) / scale;
      scale *= (1.2);
    }
    return res.x + res.y;
  }

  void main() {
    vec2 uv = .5 * vUv;
    uv.x *= u_ratio;

    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0., 1.);
    p = .5 * pow(1. - p, 2.);

    float t = .001 * u_time;
    float noise = neuro_shape(uv, t, p);

    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(.0, noise - .5);
    noise *= (1. - length(vUv - .5));

    // Light theme: faint dark ink, alpha driven by the noise so the
    // page bg shows through everywhere else. A subtle scroll-tied hue
    // wobble keeps the original shader's seasonal feeling.
    vec3 tint = normalize(vec3(
      .12,
      .14 + .04 * cos(3. * u_scroll_progress),
      .18 + .05 * sin(3. * u_scroll_progress)
    ));
    gl_FragColor = vec4(tint, noise * 0.85);
  }
`;

// `maxDpr` caps the canvas backing-store resolution. The full-screen hero
// wants crisp detail (default 2); the homepage thumbnail passes a lower cap
// so its per-frame shader + paint cost during scroll is much cheaper.
export default function NeuralNoise({ maxDpr = 2 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mqMotion.matches;

    const gl =
      canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true }) ||
      canvas.getContext("experimental-webgl", {
        premultipliedAlpha: false,
        alpha: true,
      });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    const compile = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("neural-noise: shader compile", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(VERT, gl.VERTEX_SHADER);
    const fs = compile(FRAG, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("neural-noise: link", gl.getProgramInfoLog(program));
      return;
    }

    const uniforms = {};
    const uCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uCount; i++) {
      const name = gl.getActiveUniform(program, i).name;
      uniforms[name] = gl.getUniformLocation(program, name);
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const pointer = { x: 0, y: 0, tX: 0, tY: 0 };

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const drawOnce = () => {
      const time = performance.now();
      pointer.x += (pointer.tX - pointer.x) * 0.2;
      pointer.y += (pointer.tY - pointer.y) * 0.2;

      gl.uniform1f(uniforms.u_time, time);
      gl.uniform2f(
        uniforms.u_pointer_position,
        canvas.offsetWidth ? pointer.x / canvas.offsetWidth : 0,
        canvas.offsetHeight ? 1 - pointer.y / canvas.offsetHeight : 1
      );
      gl.uniform1f(
        uniforms.u_scroll_progress,
        window.scrollY / (2 * window.innerHeight)
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let rafId = null;
    let running = false;
    const loop = () => {
      drawOnce();
      rafId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    };

    // Reduced motion paints a single static frame. Otherwise only animate
    // while the canvas is on-screen, so an off-screen thumbnail (or the
    // hero once you've scrolled past it) stops burning frames and doesn't
    // contend with scrolling. A static frame is drawn up front so the
    // canvas is never blank before it first scrolls into view.
    let io = null;
    if (reduced) {
      drawOnce();
    } else if ("IntersectionObserver" in window) {
      drawOnce();
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) start();
          else stop();
        },
        { rootMargin: "150px" }
      );
      io.observe(canvas);
    } else {
      start();
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tX = e.clientX - rect.left;
      pointer.tY = e.clientY - rect.top;
    };
    const onTouch = (e) => {
      const t = e.targetTouches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tX = t.clientX - rect.left;
      pointer.tY = t.clientY - rect.top;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onTouch);

    return () => {
      if (io) io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
