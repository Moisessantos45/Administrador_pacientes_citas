import express from "express"
import { 
actualizarPaciente, agregarPacientes,eliminarPaciente,obtenerPacientes,obtenerPaciente
} from "../controllers/controllerPacientes.js"
import checkAuth from "../middleware/authMiddleware.js"

const router=express.Router()

router.route("/").post(checkAuth,agregarPacientes).get(checkAuth,obtenerPacientes)
router.route("/:id").get(checkAuth,obtenerPaciente).put(checkAuth,actualizarPaciente).delete(checkAuth,eliminarPaciente)

export default router