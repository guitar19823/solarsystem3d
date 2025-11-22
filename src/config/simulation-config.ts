export const SIMULATION_CONFIG = {
  SIMULATION_DT: 1, // шаг симуляции (x реального времени)
  DEFAULT_DT: 86400,
  MAX_DT: 864000, // макс. шаг симуляции (защита от фризов)

  AU_IN_PX: 100, // Сколько пикселей соответствует 1 а.е. (настраивается пользователем)
  AU: 1.496e11, // 1 а.е. = 1.496e11 м

  OBJECTS_RADIUS_SCALE: 1, // Коэффициент для увеличения радиусов планет (по умолчанию = 1 — строго пропорционально)
  LABEL_SCALE_FATOR: 7,
  SPEED_FACTOR: 0.0000001,
  IMPULSE_STRENGTH: 500,
  GRAVITI_CALCULATOR_TYPE: 1, // Выбор расчета гравитации. 0 metod Эйлера, 1 метод Верле

  // Масштаб для расстояний: 1 м = ? px
  get SCALE_DIST() {
    return this.AU_IN_PX / this.AU;
  },
};
