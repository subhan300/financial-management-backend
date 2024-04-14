const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require("fs");
require("dotenv").config();
// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   secure: true,
//   auth: {
//     user: process.env.NODEMAIL_EMAIL,
//     pass: process.env.NODEMAIL_PASSWORD
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });
// const sendEmail = (mailOptions) => {
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       return error;
//     } else {
//       console.log("Email sent: " + info.response);

//       return true;
//     }
//   });
// };
function sendEmail(mailOptions) {
  sgMail
    .send(mailOptions)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
module.exports = {
  sendEmail
};
