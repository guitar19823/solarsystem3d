export const SunShader = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null },
    uNormalMap: { value: null },
    uEmissiveMap: { value: null },
    uScale: { value: 1.0 },
    uGlowIntensity: { value: 1.5 },
    uNoiseSpeed: { value: 0.3 },
    uGlowRadius: { value: 0.15 }, // Ширина свечения (15% от радиуса)
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;

    uniform sampler2D uTexture;
    uniform sampler2D uNormalMap;
    uniform sampler2D uEmissiveMap;
    uniform float uTime;
    uniform float uScale;
    uniform float uGlowIntensity;
    uniform float uNoiseSpeed;
    uniform float uGlowRadius; // Объявляем униформу для ширины свечения

    varying vec2 vUv;
    varying vec3 vNormal;

    // Генератор шума
    float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = rand(i);
        float b = rand(i + vec2(1.0, 0.0));
        float c = rand(i + vec2(0.0, 1.0));
        float d = rand(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
    }

    void main() {
        // Базовая текстура
        vec4 color = texture2D(uTexture, vUv * uScale);

        // Карта нормалей
        vec3 normalMap = texture2D(uNormalMap, vUv * uScale).rgb;
        normalMap = normalMap * 2.0 - 1.0;
        vec3 normal = normalize(vNormal + normalMap * 0.1);


        // Эмиссивная карта
        vec4 emissive = texture2D(uEmissiveMap, vUv * uScale);
        color.rgb += emissive.rgb * uGlowIntensity;
        color.rgb *= 1.0 + emissive.a * 0.5;


        // Анимация грануляции
        float noiseValue = noise(vUv * 10.0 + uTime * uNoiseSpeed);
        color.rgb *= 0.95 + noiseValue * 0.1;


        // Эффект короны (свечение по краям)
        float rim = max(0.0, 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
        rim = pow(rim, 3.0) * uGlowIntensity;
        color.rgb += vec3(1.0, 0.7, 0.3) * rim;


        // === СВЕЧЕНИЕ ВОКРУГ СОЛНЦА ===
        vec2 centerUV = vUv * 2.0 - vec2(1.0); // Нормализуем UV в [-1, 1]
        float distanceFromCenter = length(centerUV); // Расстояние от центра


        float sunEdge = 1.0;                  // Край Солнца (в нормализованных координатах)
        float glowWidth = uGlowRadius;         // Ширина свечения из униформы


        // Маска: плавный переход от края Солнца наружу
        float glowMask = smoothstep(
            sunEdge,
            sunEdge + glowWidth,
            distanceFromCenter
        );

        // Цвет свечения (можно менять под стиль)
        vec3 glowColor = vec3(1.0, 0.6, 0.2); // Тёплый оранжевый


        // Добавляем свечение к основному цвету
        color.rgb += glowColor * 2.0 * (1.0 - glowMask);


        gl_FragColor = color;
    }
  `,
};
