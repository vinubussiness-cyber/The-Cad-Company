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
      subject: "Hey Team!, you have New Website Enquiry 🙂‍↔️",
      html: `
        <div style="text-align:center; margin-bottom:20px;">
            <img
              src="./TCC-logo.jpeg"
              alt="The CAD Company"
              style="max-width:220px;"
            />
        </div>
        <h3>We Got A New Lead</h3>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Company: ${company}</p>
        <p>Service: ${service}</p>
        <p>Message: ${description}</p>
      `,
    });


    // Auto-reply to sender
    await transporter.sendMail({
      from: `"The CAD Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting The CAD Company",
      html: `

        <div style="font-family: Arial, sans-serif; max-width: 600px;">

          <div style="text-align:center; margin-bottom:20px;">
            <img
              src="./TCC-logo.jpeg"
              alt="The CAD Company"
              style="max-width:220px;"
            />
          </div>
          <h2>Thank You for Contacting The CAD Company</h2>

          <p>Dear ${name},</p>

          <p>We have received your enquiry regarding <strong>${service}</strong>.</p>

          <p>Our team will review your requirements and get back to you within 24 business hours.</p>

          <p>If your requirement is urgent, feel free to contact us directly.</p>
          <a href="tel:+91 9345888899">
             +91 9345888899
          </a>

          <br>

          <p>
            Regards,<br>
            <strong>The CAD Company</strong><br>
            Engineering Design & CAD Services
          </p>

          <hr>

          <small>
            This is an automated acknowledgement email. Please do not reply to this message.
          </small>
        </div>
      `
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