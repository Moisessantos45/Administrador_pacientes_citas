import SibApiV3Sdk from "sib-api-v3-sdk"

const enviarToken = async (datos) => {
    console.log("datos email", datos);
    var defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_KEY;
    const { email, token, nombre } = datos;
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = {
        email: "shigatsutranslations@gmail.com",
        name: `Usuario ${nombre}`
    };

    try {
        const recivers = [{"email": email, "name": nombre}];
    console.log("url",process.env.FRONTEDN_URL/confirmar/token)
        const sendEmail = await apiInstance.sendTransacEmail({
            sender,
            to: recivers,
            subject: "Tu Token de confirmacion", // Add the subject here
            textContent: "Envío de token de confirmación",
            htmlContent:
            `<p>Hola, ¿cómo estás? Este correo es simplemente para verificar los datos del envío de tu token.</p>
            <p>Para finalizar, simplemente haz clic en el siguiente enlace:
            <a href="${process.env.FRONTEDN_URL}/confirmar/${token}">Confirmar</a>
            </p>`
        });
        
        console.log("Email sent successfully:", sendEmail);
    } catch (error) {
        console.error("Error sending email:", error.response ? error.response.text : error.message);
    }
};

export default enviarToken;

