import Paciente from "../models/Paciente.js";

const agregarPacientes = async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario.id;
    const pacienteSave = await paciente.save();

    res.status(200).json(pacienteSave);
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find()
      .where("veterinario")
      .equals(req.veterinario);

    res.status(200).json(pacientes);
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const obtenerPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (
      !paciente &&
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.json({ msg: "Accion no valida" });
    }

    res.status(200).json(paciente);
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({ msg: "No encontrado" });
    }
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.status(404).json({ msg: "No encontrado" });
    }
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    const pacienteActulizado = await paciente.save();

    res.status(200).json(pacienteActulizado);
  } catch (error) {
    res.status(404).json({ msg: "No encontrado" });
  }
};
const eliminarPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({ msg: "No encontrado" });
    }
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.json({ msg: "Accion no valida" });
    }

    await paciente.deleteOne();
    res.status(200).json({ msg: "Paciente eliminado" });
  } catch (error) {
    const errores = new Error("La eliminacion fallo");
    res.status(404).json(errores.message);
  }
};

export {
  agregarPacientes,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
