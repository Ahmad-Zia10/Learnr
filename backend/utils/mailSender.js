import nodemailer from "nodemailer"

const mailSender = async (email, title, body) => {
    try {
        
        const transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: 'StudyNotion || CodeHelp - by Babbar',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        return info;

    } catch (error) {
        //Swallowing this used to make a broken mail configuration look like a
        //success: signup returned "OTP sent" with no email ever leaving. Callers
        //that can carry on without the mail catch this themselves.
        console.log("Mail could not be sent:", error.message);
        throw error;
    }
}

export default mailSender