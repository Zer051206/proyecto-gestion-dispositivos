import bcrypt from "bcrypt";
import { exit } from "process";

// Leemos la contraseña desde el argumento de la terminal
const password = process.argv[2];

if (!password) {
  console.error("Error: Debes proporcionar una contraseña.");
  console.log("Uso: node create-hash.js <tu-contraseña-aqui>");
  exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error al generar el hash:", err);
    return;
  }
  console.log(`\nLa contraseña '${password}' se ha hasheado exitosamente.\n`);
  console.log("Copia y pega el siguiente hash en tu base de datos:");
  console.log(hash);
});
