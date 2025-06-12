const nodemailer = require('nodemailer');
const Correo = require('../models/Correo');

exports.enviarContacto = async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;
  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Guardar en la base de datos
    await Correo.create({ nombre, correo, telefono, mensaje });

    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Correo interno para AutoParts
    await transporter.sendMail({
      from: `"Contacto Web" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: 'Nuevo mensaje de contacto desde AutoParts',
      text: `
Nombre: ${nombre}
Correo: ${correo}
Teléfono: ${telefono || 'No proporcionado'}
Mensaje: ${mensaje}
      `,
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Teléfono:</b> ${telefono || 'No proporcionado'}</p>
        <p><b>Mensaje:</b><br>${mensaje}</p>
      `
    }); // cierre de sendMail

    // Correo de confirmación para el usuario
    await transporter.sendMail({
      from: `"AutoParts" <${process.env.SMTP_USER}>`,
      to: correo,
      subject: 'Hemos recibido tu mensaje - AutoParts',
      text: `Hola ${nombre},\n\nHemos recibido tu mensaje y te atenderemos a la brevedad posible.\n\nGracias por contactarnos.\n\nAutoParts`,
      html: `
        <p>Hola <b>${nombre}</b>,</p>
        <p>Hemos recibido tu mensaje y te atenderemos a la brevedad posible.</p>
        <p><b>Resumen de tu mensaje:</b></p>
        <ul>
          <li><b>Correo:</b> ${correo}</li>
          <li><b>Teléfono:</b> ${telefono || 'No proporcionado'}</li>
          <li><b>Mensaje:</b> ${mensaje}</li>
        </ul>
        <p>Gracias por contactarnos.<br>AutoParts</p>
      `
    }); // cierre de sendMail

    res.json({ message: 'Mensaje enviado correctamente' });
  } catch (err) {
    console.error('Error al enviar mensaje de contacto:', err);
    res.status(500).json({ error: 'Error al enviar el mensaje de contacto' });
  }
};
