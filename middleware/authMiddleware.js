import Jwt from "jsonwebtoken"
import Veterinario from "../models/veterinario.js"
const checkAuth=async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            console.log("si entreo al check")
            token=req.headers.authorization.split(" ")[1]
            const decoded=Jwt.verify(token,process.env.JWT_SECRET)
            console.log("decode",decoded)
            req.veterinario = await Veterinario.findById(decoded.id).select(
                "-password -token -confirmado"
            )
            return next()
        } catch (error) {
            const errores= new Error("Token no valida")
            res.status(403).json({msg:errores.message})
        }
    }
    if(!token){
        const error=new Error("Token inexistente")
        res.status(403).json({msg:error.message})
    }
    next()
}

export default checkAuth
