export const SIMULATION_CONFIG = {
  SIMULATION_DT: 200000, // шаг симуляции (x реального времени)
  DEFAULT_DT: 86400,
  MAX_DT: 864000, // макс. шаг симуляции (защита от фризов)

  // Сколько пикселей соответствует 1 а.е. (настраивается пользователем)
  AU_IN_PX: 500,

  _scaleDistCached: 0,

  // Масштаб для расстояний: 1 м = ? px
  get SCALE_DIST() {
    // if (!this._scaleDistCached) {
    //   this._scaleDistCached = this.AU_IN_PX / 1.496e11; // 1 а.е. = 1.496e11 м
    // }

    // return this._scaleDistCached;

    return this.AU_IN_PX / 1.496e11;
  },

  // Коэффициент для увеличения радиусов планет (по умолчанию = 1 — строго пропорционально)
  PLANET_RADIUS_SCALE: 80,
};
