import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface LaserFlowProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  noiseScale?: number;
  intensity?: number;
  interactive?: boolean;
  className?: string;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
}

const LaserFlow: React.FC<LaserFlowProps> = ({
  color1 = "#FF0055",
  color2 = "#0055FF",
  color3 = "#55FF00",
  speed = 0.2,
  noiseScale = 2.0,
  intensity = 1.5,
  interactive = true,
  className = "",
  mixBlendMode = "screen",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const timeRef = useRef<number>(0);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebGLSupported(false);
      console.warn("WebGL is not supported in this browser");
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webGLSupported) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.error("Failed to create WebGLRenderer", e);
      setWebGLSupported(false);
      return;
    }

    const parseColor = (hex: string) => {
      const c = new THREE.Color(hex);
      return new THREE.Vector3(c.r, c.g, c.b);
    };

    // Shader material
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uSpeed;
      uniform float uNoiseScale;
      uniform float uIntensity;
      uniform bool uInteractive;
      varying vec2 vUv;

      // Simplex noise function
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        
        // Aspect ratio correction
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;
        
        // Mouse interaction
        vec2 mouse = uMouse;
        mouse.x *= aspect;
        
        float time = uTime * uSpeed;
        
        // Flow field calculation
        vec2 flow = vec2(
          snoise(uv * uNoiseScale + vec2(time, 0.0)),
          snoise(uv * uNoiseScale + vec2(0.0, time))
        );
        
        // Interactive distortion
        if (uInteractive) {
          float dist = distance(uv, mouse);
          float interaction = smoothstep(0.5, 0.0, dist);
          flow += (uv - mouse) * interaction * 2.0;
        }
        
        // Color mixing based on flow
        float pattern = snoise(uv * uNoiseScale * 2.0 + flow);
        
        vec3 color = mix(uColor1, uColor2, smoothstep(-1.0, 1.0, pattern));
        color = mix(color, uColor3, smoothstep(0.0, 1.0, pattern * flow.x));
        
        // Intensity modulation
        float glow = length(flow) * uIntensity;
        
        gl_FragColor = vec4(color * glow, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uColor1: { value: parseColor(color1) },
        uColor2: { value: parseColor(color2) },
        uColor3: { value: parseColor(color3) },
        uSpeed: { value: speed },
        uNoiseScale: { value: noiseScale },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse interaction - throttled for performance
    let mouseMoveTimeout: number | null = null;
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;

      if (mouseMoveTimeout) return;

      mouseMoveTimeout = window.setTimeout(() => {
        mouseMoveTimeout = null;
      }, 16); // ~60fps throttle

      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height;
      mouseRef.current.set(x, y);
    };

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !materialRef.current)
        return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      materialRef.current.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      if (
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current ||
        !materialRef.current
      )
        return;

      timeRef.current += 0.01;
      materialRef.current.uniforms.uTime.value = timeRef.current;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        const canvas = rendererRef.current.domElement;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      if (geometryRef.current) {
        geometryRef.current.dispose();
      }

      rendererRef.current = null;
      materialRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      geometryRef.current = null;
      rafRef.current = null;
    };
  }, [
    color1,
    color2,
    color3,
    speed,
    noiseScale,
    intensity,
    interactive,
    webGLSupported,
  ]);

  if (!webGLSupported) {
    return (
      <div
        className={`w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/10 text-gray-500 text-sm ${className}`}
        style={{ mixBlendMode }}
      >
        WebGL not supported
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full absolute top-0 left-0 ${className}`}
      style={{ mixBlendMode }}
    />
  );
};

export default LaserFlow;
