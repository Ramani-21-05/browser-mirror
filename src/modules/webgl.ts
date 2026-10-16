import { WebGLTelemetry } from '../types/telemetry';
import { sha256 } from '../utils/crypto';
import { calculateBitsOfEntropy, EMPIRICAL_ENTROPY_WEIGHTS } from '../utils/entropy';

export async function auditWebGL(): Promise<WebGLTelemetry> {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  
  let gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
  if (!gl) {
    gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
  }

  if (!gl) {
    return {
      vendor: 'Unavailable (WebGL Disabled)',
      renderer: 'Unavailable (WebGL Disabled)',
      glVersion: 'N/A',
      shadingLanguageVersion: 'N/A',
      maxTextureSize: 0,
      maxViewportDims: [0, 0],
      maxRenderBufferSize: 0,
      extensionsCount: 0,
      extensionsList: [],
      precisionFloatBits: { high: 0, medium: 0, low: 0 },
      shaderRenderHash: 'disabled',
      aliasedLineWidthRange: [0, 0],
      aliasedPointSizeRange: [0, 0],
      entropyBits: 1.0,
      riskLevel: 'LOW',
    };
  }

  // 1. Unmask Vendor & Renderer
  let vendor = gl.getParameter(gl.VENDOR) || 'Unknown';
  let renderer = gl.getParameter(gl.RENDERER) || 'Unknown';
  const dbgExt = gl.getExtension('WEBGL_debug_renderer_info');
  if (dbgExt) {
    const unmaskedVendor = gl.getParameter(dbgExt.UNMASKED_VENDOR_WEBGL);
    const unmaskedRenderer = gl.getParameter(dbgExt.UNMASKED_RENDERER_WEBGL);
    if (unmaskedVendor) vendor = unmaskedVendor;
    if (unmaskedRenderer) renderer = unmaskedRenderer;
  }

  // 2. Hardware limits
  const glVersion = gl.getParameter(gl.VERSION) || '';
  const shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || '';
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
  const maxViewportDims = (gl.getParameter(gl.MAX_VIEWPORT_DIMS) || [0, 0]) as [number, number];
  const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0;
  const aliasedLineWidthRange = (gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE) || [1, 1]) as [number, number];
  const aliasedPointSizeRange = (gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) || [1, 1]) as [number, number];

  // 3. Extensions
  const rawExtensions = gl.getSupportedExtensions() || [];
  const extensionsList = [...rawExtensions].sort();
  const extensionsCount = extensionsList.length;

  // 4. Shader precision format
  const getPrecision = (precisionType: number): number => {
    const format = gl!.getShaderPrecisionFormat(gl!.FRAGMENT_SHADER, precisionType);
    return format ? format.precision : 0;
  };
  const precisionFloatBits = {
    high: getPrecision(gl.HIGH_FLOAT),
    medium: getPrecision(gl.MEDIUM_FLOAT),
    low: getPrecision(gl.LOW_FLOAT),
  };

  // 5. Offscreen Shader Rendering Quirks
  let shaderRenderHash = 'error';
  try {
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      void main() {
        float r = sin(vUv.x * 12.9898 + vUv.y * 78.233) * 43758.5453;
        float g = cos(atan(vUv.y, vUv.x) * 3.14159265);
        float b = fract(sin(dot(vUv, vec2(127.1, 311.7))) * 43758.5453123);
        gl_FragColor = vec4(fract(r), fract(g), fract(b), 1.0);
      }
    `;

    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();

    if (vs && fs && program) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.viewport(0, 0, 64, 64);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const pixels = new Uint8Array(64 * 64 * 4);
      gl.readPixels(0, 0, 64, 64, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      shaderRenderHash = await sha256(pixels.buffer);
    }
  } catch (err) {
    console.warn('WebGL shader rendering error:', err);
    shaderRenderHash = 'shader_render_blocked';
  }

  // Calculate entropy
  const rendererEntropy = calculateBitsOfEntropy(renderer, EMPIRICAL_ENTROPY_WEIGHTS.webglRenderer);
  const shaderEntropy = calculateBitsOfEntropy(shaderRenderHash, EMPIRICAL_ENTROPY_WEIGHTS.webglShaderHash);
  const totalEntropy = Number((rendererEntropy + shaderEntropy).toFixed(2));

  return {
    vendor,
    renderer,
    glVersion,
    shadingLanguageVersion,
    maxTextureSize,
    maxViewportDims,
    maxRenderBufferSize,
    extensionsCount,
    extensionsList,
    precisionFloatBits,
    shaderRenderHash,
    aliasedLineWidthRange,
    aliasedPointSizeRange,
    entropyBits: totalEntropy,
    riskLevel: totalEntropy > 12 ? 'HIGH' : 'MEDIUM',
  };
}
