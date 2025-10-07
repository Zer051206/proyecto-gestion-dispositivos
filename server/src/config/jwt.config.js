/**
 * Configuración de los secretos y tiempos de expiración para JWT.
 */
const jwtConfig = {
  accessSecret: process.env.JWT_SECRET,
  accessExpiresIn: "15m",

  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: "7d",
};

export default jwtConfig;
