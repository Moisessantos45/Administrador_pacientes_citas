import Veterinario from "../models/veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarId.js"
import envioEmail from "../helpers/emailRegistro.js"
import recuperarPassword from "../helpers/emailOlvidePass.js"
import enviarToken from "../helpers/envioCorreo.js"
import recuperarAcceso from "../helpers/recuperarPassword.js"

const registrar = async (req, res) => {
    const { email } = req.body
    //previnir usuarioa duplicados
    const verificarUsuario = await Veterinario.findOne({ email })
    if (verificarUsuario) {
        const error = new Error("usuario ya registrado")
        return res.status(400).json({ msg: error.message })
    }
    try {
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()
        // envioEmail({
        //     email,
        //     nombre: veterinarioGuardado.nombre,
        //     token: veterinarioGuardado.token
        // })
        console.log("datos backen",veterinario)
        enviarToken({
            email,
            nombre: veterinarioGuardado.nombre,
            token: veterinarioGuardado.token
        })
    } catch (error) {
        console.log(error)
    }
    res.json({ msg: "Resgitrando usuario" })
}

const perfil = (req, res) => {
    const { veterinario } = req
    res.json({ veterinario })
}

const confirmar = async (req, res) => {
    const { token } = req.params
     console.log("token",token)
    const usuarioConfirmar = await Veterinario.findOne({ token })
    console.log("usuario",usuarioConfirmar)
    if (!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(404).json({ msg: error.message })
    }
    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.json({ msg: "Usuario confirmando" })
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body
    const usuario = await Veterinario.findOne({ email })
    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({ msg: error.message })
    }

    if (!usuario.confirmado) {
        const error = new Error("No has confirmado tu cuenta")
        return res.status(404).json({ msg: error.message })
    }
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error("El password es incorrecto")
        return res.status(404).json({ msg: error.message })
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body
    const emainVeterinario = await Veterinario.findOne({ email })
    if (!emainVeterinario) {
        const error = new Error("El usuario no existe")
        return res.status(400).json({ msg: error.message })
    }
    try {
        emainVeterinario.token = generarId()
        await emainVeterinario.save()
        // recuperarPassword({
        //     email,
        //     nombre: emainVeterinario.nombre,
        //     token: emainVeterinario.token
        // })
        recuperarAcceso({
            email,
            nombre: emainVeterinario.nombre,
            token: emainVeterinario.token
        })
        res.json({ msg: "Hemos enviado un token a su correo" })
    } catch (error) {

    }
}


const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Veterinario.findOne({ token })
    if (tokenValido) {
        res.json({ msg: "Token valido" })
    } else {
        const error = new Error("Token no valido")
        return res.status(400).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password,nuevoPassword } = req.body
    const veterinario = await Veterinario.findOne({ token })
    if (!veterinario) {
        const error = new Error("Hubo un error")
        return res.status(400).json({ msg: error.message })
    }
    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({ msg: "Password actualizado" })
    } catch (error) {

    }
}

const actulizarVeterinario = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if (!veterinario) {
        const error = new Error("Veterinario inexistente")
        return res.status(400).json({ msg: error.message })
    }
    const {email}=req.body
    if(veterinario.email!==req.body.email){
        const existeEmail= await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error("El email ya existe")
            return res.status(400).json({ msg: error.message }) 
        }
    }
    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre
        veterinario.web = req.body.web || veterinario.web
        veterinario.email = req.body.email || veterinario.email
        veterinario.telefono = req.body.telefono || veterinario.telefono
        const veterinarioActulizado = await veterinario.save()
        res.json(veterinarioActulizado)
    } catch (error) {
        const errorr = new Error("La actulizacion fallo")
        return res.status(400).json({ msg: errorr.message })
    }
}

const actualizarPassword= async(req,res)=>{
    const {password,nuevopassword}=req.body
    console.log(req.body)
    const {id}=req.veterinario
    console.log(id)
    const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error("Veterinario inexistente")
        return res.status(400).json({ msg: error.message })
    }

    if(await veterinario.comprobarPassword(password)){
        veterinario.password=nuevopassword;
        veterinario.save()
        res.json({msg:"Password actulizado correctamente"})
    }else{
        const error = new Error("Password actual es incorrecto")
        return res.status(400).json({ msg: error.message })
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actulizarVeterinario,
    actualizarPassword
}
