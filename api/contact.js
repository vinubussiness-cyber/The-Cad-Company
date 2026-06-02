const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  console.log("METHOD:", req.method);
  console.log("BODY:", req.body);
  console.log("EMAIL_USER =", process.env.EMAIL_USER);
  console.log("EMAIL_PASS length =", process.env.EMAIL_PASS?.length);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log(req.body)

  try {
    const { name, email, phone, company, service, description } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP connection successful");

    console.log("Sending email...");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "admin@thecadcompany.in",
      subject: "Hey S balls, you have New Website Enquiry 🙂‍↔️",
      html: `
        <h3>New Lead</h3>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Company: ${company}</p>
        <p>Service: ${service}</p>
        <p>Message: ${description}</p>
      `,
    });

    console.log("Email sent successfully");

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Full error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};