const { Resend } = require("resend");

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API);

const sendEmail = async (email, verificationCode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      html: `<strong>Your verification code is: ${verificationCode}</strong>`,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email.");
    }

    return data;
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw new Error("Error in email sending process.");
  }
};

module.exports = sendEmail;
