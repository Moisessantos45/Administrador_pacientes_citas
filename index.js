import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDb from "./config/db.js";
import router from "./routes/router_veterinario.js";
import routerPacientes from "./routes/router_pacientes.js";

const app = express();
app.use(express.json());
dotenv.config();
conectarDb();

const dominiosPermitidos = [process.env.FRONTEDN_URL];

const opciones = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido"));
    }
  },
};

app.use(cors(opciones));

app.use("/api/veterinarios", router);
app.use("/api/pacientes", routerPacientes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
