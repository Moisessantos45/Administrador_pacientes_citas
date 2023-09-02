import Paciente from "../models/Paciente.js"
import Veterinario from "../models/veterinario.js"

const agregarPacientes = async (req, res) => {
    // const { nombre, propietario, email, fecha, sintomas } = req.body
    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario.id
    // console.log(req.veterinario._id)
    console.log(paciente)
    try {
        const pacienteSave = await paciente.save()
        res.json(pacienteSave)
    } catch (error) {
        console.log(error)
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario)
    res.json(pacientes)
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)
    console.log("pacientes obtenidos",paciente)
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida" })
    }
    if (paciente) {
        res.json(paciente)
    }
}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params
    console.log("id actu",id)
    const paciente = await Paciente.findById(id)
    if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" })
    }
    console.log("paciente actulizado",paciente)
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        console.log("si entro al pacientye")
        return res.json({ msg: "Accion no valida" })
    }

    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario =req.body.propietario || paciente.propietario
    paciente.email =req.body.email || paciente.email
    paciente.fecha =req.body.fecha || paciente.fecha
    paciente.sintomas =req.body.sintomas || paciente.sintomas
    try {
        const pacienteActulizado = await paciente.save()
        res.json(pacienteActulizado)
    } catch (error) {
        const errores = new Error("La actulizacion fallo")
        res.status(404).json(errores.message)
    }
}
const eliminarPaciente = async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findById(id)
    console.log(paciente)
    if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" })
    }
    console.log(paciente.veterinario._id)
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida" })
    }

    try {
        await paciente.deleteOne()
        res.json({ msg: "paciente eliminado" })
    } catch (error) {
        const errores = new Error("La eliminacion fallo")
        res.status(404).json(errores.message)
    }
}
export {
    agregarPacientes,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}