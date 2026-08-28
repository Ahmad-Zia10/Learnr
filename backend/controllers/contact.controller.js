import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mailSender from "../utils/mailSender.js";

//Escape anything the visitor typed before it goes into an HTML email.
const escapeHtml = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const contactUs = asyncHandler( async (req,res) => {
    const { firstName, lastName, email, phoneNumber, countryCode, message } = req.body;

    if(!(firstName && email && message)) {
        throw new apiError(400, "Name, email and message are required")
    }

    const fullName = `${firstName} ${lastName || ""}`.trim();
    const phone = [countryCode, phoneNumber].filter(Boolean).join(" ");

    const body = `
        <h2>New contact request</h2>
        <p><b>Name:</b> ${escapeHtml(fullName)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ""}
        <p><b>Message:</b></p>
        <p>${escapeHtml(message)}</p>
    `;

    //Goes to the platform's own inbox, never to an address from the request.
    const supportInbox = process.env.CONTACT_MAIL_TO || process.env.MAIL_USER;

    if(!supportInbox) {
        throw new apiError(500, "Contact inbox is not configured")
    }

    try {
        await mailSender(supportInbox, `Contact request from ${fullName}`, body);
    } catch (error) {
        console.log("Could not send contact email", error.message);
        throw new apiError(500, "Could not send your message. Please try again.")
    }

    return res
    .status(200)
    .json(new apiResponse(200, null, "Thanks for reaching out. We will be in touch."))
})

export {
    contactUs
}
