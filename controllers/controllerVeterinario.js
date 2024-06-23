import mongoose from "mongoose";
import Veterinario from "../models/veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import enviarToken from "../helpers/envioCorreo.js";
import recuperarAcceso from "../helpers/recuperarPassword.js";

const registrar = async (req, res) => {
  const { email } = req.body;
  //previnir usuarioa duplicados
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const opts = { session };

    const verificarUsuario = await Veterinario.findOne({ email }).session(
      session
    );

    if (verificarUsuario) {
      await session.abortTransaction();

      const error = new Error("usuario ya registrado");
      return res.status(400).json({ msg: error.message });
    }

    const veterinario = new Veterinario(req.body, opts);

    const veterinarioGuardado = await veterinario.save(opts);

    enviarToken({
      email,
      nombre: veterinarioGuardado.nombre,
      token: veterinarioGuardado.token,
    });

    await session.commitTransaction();
    res.status(200).json({ msg: "Usuario registrado" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ msg: "Hubo un error" });
  } finally {
    session.endSession();
  }
};

const perfil = (req, res) => {
  try {
    const { veterinario } = req;

    res.status(200).json({ veterinario });
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  try {
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
      const error = new Error("Token no valido");
      return res.status(404).json({ msg: error.message });
    }

    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();

    res.status(200).json({ msg: "Usuario confirmado" });
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }

    if (!usuario.confirmado) {
      const error = new Error("No has confirmado tu cuenta");
      return res.status(404).json({ msg: error.message });
    }

    const verificarPassword = await usuario.comprobarPassword(password);

    if (!verificarPassword) {
      const error = new Error("Password incorrecto");
      return res.status(404).json({ msg: error.message });
    }
    const token = generarJWT(usuario.id);

    res.status(200).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token,
    });
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  try {
    const emainVeterinario = await Veterinario.findOne({ email });

    if (!emainVeterinario) {
      const error = new Error("El usuario no existe");
      return res.status(400).json({ msg: error.message });
    }

    emainVeterinario.token = generarId();
    await emainVeterinario.save();

    recuperarAcceso({
      email,
      nombre: emainVeterinario.nombre,
      token: emainVeterinario.token,
    });
    res.status(200).json({ msg: "Hemos enviado un token a su correo" });
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  try {
    const tokenValido = await Veterinario.findOne({ token });
    if (!tokenValido) {
      res.status(404).json({ msg: "Token invalid " });
    }

    res.status(200).json({ msg: "Token valido" });
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();

    res.status(200).json({ msg: "Password actualizado" });
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

const actulizarVeterinario = async (req, res) => {
  const { email } = req.body;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const opts = { session };

    const veterinario = await Veterinario.findById(req.params.id).session(
      session
    );

    if (!veterinario) {
      await session.abortTransaction();
      const error = new Error("Veterinario inexistente");
      return res.status(400).json({ msg: error.message });
    }

    const existeEmail = await Veterinario.findOne({ email }).session(session);

    if (existeEmail && existeEmail._id.toString() !== req.params.id) {
      await session.abortTransaction();
      const error = new Error("El email ya existe");
      return res.status(400).json({ msg: error.message });
    }

    veterinario.nombre = req.body.nombre || veterinario.nombre;
    veterinario.web = req.body.web || veterinario.web;
    veterinario.email = req.body.email || veterinario.email;
    veterinario.telefono = req.body.telefono || veterinario.telefono;

    const veterinarioActulizado = await veterinario.save(opts);

    await session.commitTransaction();
    res.status(200).json(veterinarioActulizado);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ msg: "Hubo un error" });
  } finally {
    session.endSession();
  }
};

const actualizarPassword = async (req, res) => {
  const { id } = req.veterinario;
  const { nuevopassword } = req.body;
  try {
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
      const error = new Error("Veterinario inexistente");
      return res.status(400).json({ msg: error.message });
    }

    const verificacion = await veterinario.comprobarPassword(req.body.password);
    if (!verificacion) {
      const error = new Error("Password incorrecto");
      return res.status(400).json({ msg: error.message });
    }

    veterinario.password = nuevopassword;
    veterinario.save();
    res.status(200).json({ msg: "Password actualizado" });
  } catch (error) {
    res.status(400).json({ msg: "Hubo un error" });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actulizarVeterinario,
  actualizarPassword,
};
