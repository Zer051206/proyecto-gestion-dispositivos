// server/src/config/jwt.config.js
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

/**
 * Configuración de los secretos y tiempos de expiración para JWT.
 * Los secretos deben ser cadenas largas y criptográficamente seguras.
 */
const jwtConfig = {
  // Clave secreta para los Access Tokens (corta duración, para cada solicitud)
  // Es leída en jwtUtils.js
  accessSecret: process.env.JWT_SECRET,
  accessExpiresIn: "15m", // Usado como estándar en jwtUtils

  // Clave secreta para los Refresh Tokens (larga duración, para renovar el Access Token)
  // Es leída en jwtUtils.js
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: "7d", // Usado como estándar en jwtUtils
};

export default jwtConfig;
