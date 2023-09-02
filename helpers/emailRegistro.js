import nodemailer from "nodemailer"
const envioEmail = async (datos) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "57377706021f02",
            pass: "99108f641c8a0b"
        }
    });
    console.log("datos", datos)
    const { nombre, email, token} = datos
    const info = await transport.sendMail({
        from: "verificacion de correo del usuario:" + `${nombre}`,
        to:email,
        subject: "envio de datos de form",
        text: `Hola como estas, gracias por registrarte`,
        html: `<p>Hola como estas este correo es simplemente para vericar los datos del envio tu token.</p>
        <p> Para fianalizar solo da click en el siguien enlace
        <a href="${process.env.FRONTEDN_URL}/confirmar/${token}">Confirmar</a>
        </p>
        `
    })
}

export default envioEmail;
