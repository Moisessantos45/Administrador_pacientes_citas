import express  from "express";
import { perfil, registrar,confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actulizarVeterinario, actualizarPassword } from "../controllers/controllerVeterinario.js";
import checkAuth from "../middleware/authMiddleware.js";
const router=express.Router()

router.post("/",registrar)
router.get("/confirmar/:token",confirmar)
router.post("/login",autenticar)
router.post("/olvide-password",olvidePassword)
// router.get("/olvide-password/:token",comprobarToken)
// router.post("/olvide-password/:token",nuevoPassword)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

router.get("/perfil",checkAuth,perfil)
router.put("/perfil/:id",checkAuth,actulizarVeterinario)
router.put("/actualizar-password",checkAuth,actualizarPassword)


export default router;