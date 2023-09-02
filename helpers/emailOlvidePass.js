import nodemailer from "nodemailer"
const recuperarPassword = async (datos) => {
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
        from: "Restablece tu password:" + `${nombre}`,
        to:email,
        subject: "Te hemos enviando un token de recuperacion",
        text: `Hola has solicitado recuperar tu password`,
        html: `<p>Da click en el siguiente enelce para recueperarla.</p>
        <p> Para fianalizar solo da click en el siguien enlace
        <a href="${process.env.FRONTEDN_URL}/olvide-password/${token}">Confirmar</a>
        </p>
        `
    })
}

export default recuperarPassword;