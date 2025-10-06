import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Esta magia es necesaria en ES Modules para obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Le decimos a dotenv que cargue el archivo .env que está UN NIVEL ARRIBA
dotenv.config({ path: path.resolve(__dirname, "../.env") });
