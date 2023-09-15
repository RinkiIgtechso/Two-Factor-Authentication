const nodemailer = require("nodemailer"); // email handler
const {v4: uuidv4} = require('uuid'); // unique string

require("dotenv").config(); // env variables

const SMTP_PORT = process.env.SMTP_PORT;
const HOST_SERVICE = process.env.HOST_SERVICE;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const SENDERS_EMAIL = USER_EMAIL;

const CC = [];
const BCC = [];

const transporter = nodemailer.createTransport({
  host: HOST_SERVICE,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
});

// testing success
transporter.verify((error, success) => {
    if(error){
        console.log(error, "error getting while sending mail");
    }else{
      console.log("Ready for success");
      console.log(success);
    }
})

const sendEmailVerification = (RECEIVERS_EMAIL, res) => {
  console.log("sending email verification")
  const emailOptions = {
    from: SENDERS_EMAIL,
    to: RECEIVERS_EMAIL,
    cc: CC,
    bcc: BCC,
    subject: "Login Credential for Reach",
    html: `<h1><center>Congratulations</center></h1>
        <div style="width:70%;margin:auto;background-color:#f9fafb;text-align:center;padding:20px;box-shadow:rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;">
          <h2>Get Started </h2>
          <p>Your company account has created successfully on Reach EMS. Please verify your account by clicking the link below:</p>
          <p>Click this <a href=${`http://localhost:3000/user/verify/${res._id}`}>link</a></p>
          </div>
        <div style="margin-top:35px;line-height:10px;">
          <p style="font-weight:bold;font-size:1.1rem;">Thank you</p><p>XYZ</p>
          <p style="font-weight:bold;font-size:1.1rem;">Rinki</p>
        </div>
    `,
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.error(err.message, "error getting after sending the email");
    } else {
      console.log("Email sent: " + info.response);
    }
  });

}

module.exports = { sendEmailVerification }