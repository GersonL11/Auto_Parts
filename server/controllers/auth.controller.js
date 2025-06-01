const Usuario = require('../models/Usuario');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { correo, password } = req.body; 
  try {
    const usuario = await Usuario.findOne({ correo }); 
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    const { password: _, ...usuarioSinPassword } = usuario.toObject();
    res.json({ usuario: usuarioSinPassword });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Recuperar contraseña (envía correo real)
exports.forgotPassword = async (req, res) => {
  const { correo } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.json({ message: 'Recibirás instrucciones para restablecer tu contraseña.' });
    }

    // Genera un código temporal simple (en producción usa un token seguro)
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Opcional: guarda el código en el usuario (requiere campo en el modelo)
    usuario.codigoRecuperacion = codigo;
    await usuario.save();

    // Asegura que el puerto sea número
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

    // Log de configuración SMTP para depuración
    console.log('Intentando conectar SMTP:', {
      host: process.env.SMTP_HOST,
      port: smtpPort,
      user: process.env.SMTP_USER,
    });

    // Configura el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: false, // Gmail con 587 es STARTTLS, no SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Verifica conexión SMTP antes de enviar
    await transporter.verify().then(() => {
      console.log('Conexión SMTP exitosa');
    }).catch(err => {
      console.error('Error de conexión SMTP:', err);
      throw err;
    });

    // Envía el correo
    await transporter.sendMail({
      from: `"AutoParts" <${process.env.SMTP_USER}>`,
      to: correo,
      subject: 'Recuperación de contraseña - AutoParts',
      text: `Tu código de recuperación es: ${codigo}`,
      html: `<p>Tu código de recuperación es: <b>${codigo}</b></p>`
    });

    return res.json({ message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.' });
  } catch (err) {
    console.error('Error al enviar correo de recuperación:', err);
    res.status(500).json({ error: 'Error al enviar el correo de recuperación', detalle: err.message });
  }
};

// Restablecer contraseña usando el código
exports.resetPassword = async (req, res) => {
  const { correo, codigo, nuevaPassword } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    if (!usuario.codigoRecuperacion || usuario.codigoRecuperacion !== codigo) {
      return res.status(400).json({ error: 'Código de recuperación inválido' });
    }
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(nuevaPassword, salt);
    usuario.codigoRecuperacion = undefined;
    await usuario.save();
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};