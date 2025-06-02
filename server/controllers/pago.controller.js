const nodemailer = require('nodemailer');

const adminEmail = process.env.SMTP_USER;

exports.enviarConfirmacionPago = async (req, res) => {
  const { nombre, email, telefono, direccion, metodoPago, carrito, total } = req.body;

  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);

  const resumen = carrito.map(item =>
    `- ${item.nombre} (${item.marca || ''} ${item.modelo || ''}) x${item.cantidad} - L ${item.precio * item.cantidad}`
  ).join('\n');

  const htmlResumen = `
    <h2 style="color:#269999;">¡Gracias por tu compra en <span style='color:#ff9800;'>AutoParts</span>!</h2>
    <p>Hola <b>${nombre}</b>,</p>
    <p>Hemos recibido tu pedido y estamos procesándolo. A continuación encontrarás el resumen de tu compra:</p>
    <ul style="background:#f5faff;padding:1rem 1.5rem;border-radius:10px;">
      ${carrito.map(item => `<li><b>${item.nombre}</b> (${item.marca || ''} ${item.modelo || ''}) x${item.cantidad} - <b>L ${item.precio * item.cantidad}</b></li>`).join('')}
    </ul>
    <p><b>Total a pagar:</b> <span style='color:#269999;'>L ${total}</span></p>
    <p><b>Método de pago:</b> ${metodoPago}</p>
    <p><b>Dirección de entrega:</b> ${direccion}</p>
    <p><b>Teléfono de contacto:</b> ${telefono}</p>
    <hr style="margin:1.5rem 0;">
    <p>Pronto nos comunicaremos contigo para coordinar la entrega. Si tienes dudas, responde a este correo o contáctanos por WhatsApp.</p>
    <p style="color:#7a8ca3;font-size:0.98em;">AutoParts - Tu tienda de repuestos de confianza 🚗🔧</p>
  `;

  const htmlResumenAdmin = `
    <h2 style="color:#ff9800;">Nueva venta realizada en AutoParts</h2>
    <p><b>Cliente:</b> ${nombre}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Teléfono:</b> ${telefono}</p>
    <p><b>Dirección:</b> ${direccion}</p>
    <p><b>Método de pago:</b> ${metodoPago}</p>
    <h3>Resumen de la compra:</h3>
    <ul style="background:#f5faff;padding:1rem 1.5rem;border-radius:10px;">
      ${carrito.map(item => `<li><b>${item.nombre}</b> (${item.marca || ''} ${item.modelo || ''}) x${item.cantidad} - <b>L ${item.precio * item.cantidad}</b></li>`).join('')}
    </ul>
    <p><b>Total:</b> <span style='color:#269999;'>L ${total}</span></p>
    <hr style="margin:1.5rem 0;">
    <p>Revisar y coordinar entrega con el cliente.</p>
  `;

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

  console.log('Transporter config:', {
    host: process.env.SMTP_HOST,
    port: smtpPort,
    user: process.env.SMTP_USER
  });

  const mailOptionsCliente = {
    from: `"AutoParts" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '¡Gracias por tu compra en AutoParts! 🚗',
    html: htmlResumen
  };

  const mailOptionsAdmin = {
    from: `"AutoParts" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: 'Nueva venta realizada - AutoParts',
    html: htmlResumenAdmin
  };

  try {
    await transporter.verify();
    const infoCliente = await transporter.sendMail(mailOptionsCliente);
    const infoAdmin = await transporter.sendMail(mailOptionsAdmin);
    console.log('Correo enviado al cliente:', infoCliente.response);
    console.log('Correo enviado al admin:', infoAdmin.response);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    res.status(500).json({ error: 'No se pudo enviar el correo de confirmación.', detalle: err.message, stack: err.stack, smtpConfig: { host: process.env.SMTP_HOST, port: smtpPort, user: process.env.SMTP_USER } });
  }
};
