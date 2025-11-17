export const GlowShader = {
  uniforms: {
    color: { value: [1.0, 1.0, 1.0] },
    radius: { value: 0.5 },
  },

  vertexShader: `
    varying vec2 vUv;


    void main() {
      vUv = uv; // uv — встроенный атрибут Three.js
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 color;
    uniform float radius;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 distVec = vUv - center;
      float distance = length(distVec);
      float normalizedDist = distance / radius;

      float alpha = 1.0 - smoothstep(0.0, 1.0, normalizedDist);
      gl_FragColor = vec4(color, alpha);
    }
  `,
};
