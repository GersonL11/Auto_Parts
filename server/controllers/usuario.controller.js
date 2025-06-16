const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Crear usuario
exports.crearUsuario = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    data.rol = 'cliente'; // Fuerza el rol a cliente al registrar
    const usuario = new Usuario(data);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
};

// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const data = { ...req.body };
    // Cambio de contraseña seguro desde panel admin/usuario
    if (data.passwordActual && data.nuevaPassword) {
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      const passwordOk = await bcrypt.compare(data.passwordActual, usuario.password);
      if (!passwordOk) return res.status(400).json({ error: 'Contraseña actual incorrecta' });
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(data.nuevaPassword, salt);
      await usuario.save();
      // Devuelve el usuario actualizado sin la contraseña
      const { password, ...usuarioSinPassword } = usuario.toObject();
      return res.json(usuarioSinPassword);
    }
    // Actualización normal de datos (sin cambio de contraseña)
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const updateFields = { ...data };
    if (typeof data.fotoPerfil === 'undefined') {
      delete updateFields.fotoPerfil;
    }
    // Elimina campos de cambio de contraseña para no sobreescribir
    delete updateFields.passwordActual;
    delete updateFields.nuevaPassword;
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};