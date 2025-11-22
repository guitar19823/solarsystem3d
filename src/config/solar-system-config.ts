import { CelestialBody } from "../entities/celestial-body";
import { Vector3D } from "../physics/vector-3d";

// 1. Солнце
const sun = new CelestialBody({
  name: "Sun",
  color: "#FFD400", // золотисто‑жёлтый
  pos: new Vector3D(0, 0, 0),
  vel: new Vector3D(0, 0, 0),
  radius: 696340000,
  mass: 1.989e30,
  texture: "sunhigh-min.jpg",
  rotationPeriod: 25.05,
  axialTilt: 7.25,
});

// 2. Меркурий
const mercury = new CelestialBody({
  name: "Mercury",
  color: "#A5A5A5", // серо‑металлический
  pos: new Vector3D(5.791e10, 0, 0),
  vel: new Vector3D(0, 0, -47362),
  radius: 2439700,
  mass: 3.3011e23,
  texture: "mercuryhigh-min.jpg",
  rotationPeriod: 58.65,
  axialTilt: 0.01,
});

// 3. Венера
const venus = new CelestialBody({
  name: "Venus",
  color: "#C99039", // желтовато‑оранжевый (из‑за облачного покрова)
  pos: new Vector3D(1.082e11, 0, 0),
  vel: new Vector3D(0, 0, -35020),
  radius: 6051800,
  mass: 4.8675e24,
  texture: "venushigh-min.jpg",
  rotationPeriod: -243.02,
  axialTilt: 177.36,
});

// 4. Земля + Луна
const earth = new CelestialBody({
  name: "Earth",
  color: "#0047AB", // глубокий синий (океаны) с зелёными пятнами суши
  pos: new Vector3D(-4671000, 0, 0),
  vel: new Vector3D(0, 0, 12.6),
  radius: 6371000,
  mass: 5.972e24,
  texture: "earthhigh-min.jpg",
  rotationPeriod: 1.0,
  axialTilt: 23.44,
});

const moon = new CelestialBody({
  name: "Moon",
  color: "#D0D0D0", // светло‑серый (реголит)
  pos: new Vector3D(379729000, 0, 0),
  vel: new Vector3D(0, 0, -1022),
  radius: 1737000,
  mass: 7.342e22,
  texture: "moonhigh-min.jpg",
  rotationPeriod: 27.32,
  axialTilt: 6.68,
});

const earthMoonSystem = new CelestialBody({
  name: "EarthMoonSystem",
  color: "#0047AB", // глубокий синий (океаны) с зелёными пятнами суши
  pos: new Vector3D(1.496e11, 0, 0),
  vel: new Vector3D(0, 0, -29783),
  radius: 3.844e8 + 6.371e6 + 1.737e6,
  children: [earth, moon],
});

// 5. Марс + спутники
const mars = new CelestialBody({
  name: "Mars",
  color: "#AD5C4D", // красно‑коричневый (оксид железа)
  pos: new Vector3D(-9378000, 0, 0),
  vel: new Vector3D(0, 0, 0.14),
  radius: 3389500,
  mass: 6.417e23,
  texture: "marshigh-min.jpg",
  rotationPeriod: 1.026,
  axialTilt: 25.19,
});

const phobos = new CelestialBody({
  name: "Phobos",
  color: "#777777", // тёмно‑серый
  pos: new Vector3D(9284220, 0, 0),
  vel: new Vector3D(0, 0, -2138),
  radius: 11267,
  mass: 1.07e16,
  texture: "phoboshigh-min.jpg",
});

const deimos = new CelestialBody({
  name: "Deimos",
  color: "#888888", // средне‑серый
  pos: new Vector3D(23460000, 0, 0),
  vel: new Vector3D(0, 0, -1352),
  radius: 6200,
  mass: 1.48e15,
  texture: "deimoshigh-min.jpg",
});

const marsSystem = new CelestialBody({
  name: "MarsSystem",
  color: "#AD5C4D", // красно‑коричневый (оксид железа)
  pos: new Vector3D(2.279e11, 0, 0),
  vel: new Vector3D(0, 0, -24077),
  radius: 23460e3 + 6200,
  children: [mars, phobos, deimos],
});

// 6. Юпитер + галилеевы спутники
const jupiter = new CelestialBody({
  name: "Jupiter",
  color: "#C59263", // бежево‑оранжевый с полосами
  pos: new Vector3D(-1980000, 0, 0),
  vel: new Vector3D(0, 0, 2.7),
  radius: 69911000,
  mass: 1.898e27,
  texture: "jupiterhigh-min.jpg",
  rotationPeriod: 0.414,
  axialTilt: 3.13,
});

const io = new CelestialBody({
  name: "Io",
  color: "#E09000", // оранжево‑жёлтый с чёрными пятнами вулканов
  pos: new Vector3D(419720000, 0, 0),
  vel: new Vector3D(0, 0, -17334),
  radius: 1821500,
  mass: 8.93e22,
  texture: "iohigh-min.jpg",
});

const europa = new CelestialBody({
  name: "Europa",
  color: "#F0F0FF", // почти белый (ледяная поверхность)
  pos: new Vector3D(671034000, 0, 0),
  vel: new Vector3D(0, 0, -13740),
  radius: 1560800,
  mass: 4.8e22,
  texture: "europahigh-min.jpg",
});

const ganymede = new CelestialBody({
  name: "Ganymede",
  color: "#A0A0A0", // серо‑коричневый (смесь льда и камня)
  pos: new Vector3D(1070400000, 0, 0),
  vel: new Vector3D(0, 0, -10880),
  radius: 2634100,
  mass: 1.5e23,
  texture: "ganymedehigh-min.jpg",
});

const callisto = new CelestialBody({
  name: "Callisto",
  color: "#D0D0D0", // светло‑серый (покрыт кратерами и льдом)
  pos: new Vector3D(1882700000, 0, 0),
  vel: new Vector3D(0, 0, -8204),
  radius: 2410300,
  mass: 1.08e23,
  texture: "callistohigh-min.jpg",
});

const jupiterSystem = new CelestialBody({
  name: "JupiterSystem",
  color: "#C59263", // бежево‑оранжевый с полосами
  pos: new Vector3D(7.785e11, 0, 0),
  vel: new Vector3D(0, 0, -13070),
  radius: 1.88e9,
  children: [jupiter, io, europa, ganymede, callisto],
});

// 7. Сатурн + Титан
const saturn = new CelestialBody({
  name: "Saturn",
  color: "#E3C48E", // бежево‑золотистый (полосы и кольца)
  pos: new Vector3D(-291000, 0, 0),
  vel: new Vector3D(0, 0, 0.4),
  radius: 58232000,
  mass: 5.683e26,
  texture: "saturnhigh-min.jpg",
  rotationPeriod: 0.444,
  axialTilt: 26.73,
});

const titan = new CelestialBody({
  name: "Titan",
  color: "#C89E6C", // оранжево‑коричневый (плотная атмосфера)
  pos: new Vector3D(1221709000, 0, 0),
  vel: new Vector3D(0, 0, -5570),
  radius: 2574700,
  mass: 1.35e23,
  texture: "titanhigh-min.jpg",
});

const saturnSystem = new CelestialBody({
  name: "SaturnSystem",
  color: "#E3C48E", // бежево‑золотистый (полосы и кольца)
  pos: new Vector3D(1.434e12, 0, 0),
  vel: new Vector3D(0, 0, -9690),
  radius: 1.22e9,
  children: [saturn, titan],
});

// 8. Уран (с системой спутников, упрощённо)
const uranus = new CelestialBody({
  name: "Uranus",
  color: "#AFE2E2", // бледно‑голубой (метан в атмосфере)
  pos: new Vector3D(0, 0, 0),
  vel: new Vector3D(0, 0, 0),
  radius: 25362000,
  mass: 8.681e25,
  texture: "uranushigh-min.jpg",
  rotationPeriod: -0.718,
  axialTilt: 97.77,
});

const uranusSystem = new CelestialBody({
  name: "UranusSystem",
  color: "#AFE2E2", // бледно‑голубой (метан в атмосфере)
  pos: new Vector3D(2.871e12, 0, 0),
  vel: new Vector3D(0, 0, -6810),
  radius: 5e8,
  children: [uranus],
});

// 9. Нептун (с системой спутников, упрощённо)
const neptune = new CelestialBody({
  name: "Neptune",
  color: "#4B70D1", // насыщенный синий (метан и другие газы)
  pos: new Vector3D(0, 0, 0),
  vel: new Vector3D(0, 0, 0),
  radius: 24622000,
  mass: 1.024e26,
  texture: "neptunehigh-min.jpg",
  rotationPeriod: 0.671,
  axialTilt: 28.32,
});

const neptuneSystem = new CelestialBody({
  name: "NeptuneSystem",
  color: "#4B70D1", // насыщенный синий (метан и другие газы)
  pos: new Vector3D(4.495e12, 0, 0),
  vel: new Vector3D(0, 0, -5430),
  radius: 4e8,
  children: [neptune],
});

const camera = new CelestialBody({
  name: "Camera",
  color: "#00ff88ff",

  pos: new Vector3D(5.791e10, 0, 0),
  vel: new Vector3D(0, 0, -47362),
  radius: 2439700,
  mass: 1e3,
  // pos: new Vector3D(1.4958e11, 0, 0),
  // vel: new Vector3D(0, 0, -29783),
  // radius: 2,
  // mass: 5.972e24 + 7.342e22,
});

// === СОЛНЕЧНАЯ СИСТЕМА (итоговый объект) ===
export const solarSystem = new CelestialBody({
  name: "SolarSystem",
  color: "#ffffffff",
  pos: new Vector3D(0, 0, 0),
  vel: new Vector3D(0, 0, 0),
  radius: 4.5e12,
  children: [
    camera,
    sun,
    mercury,
    venus,
    earthMoonSystem,
    marsSystem,
    jupiterSystem,
    saturnSystem,
    uranusSystem,
    neptuneSystem,
  ],
});
