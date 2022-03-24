const nodemailer = require("nodemailer");


module.exports = async function sendEmail(mailTo, subject, text) {
	let transporter;
	try {
		transporter = nodemailer.createTransport({
			host: 'smtp.yandex.ru',
        	port: 465,
      		secure: true, // true for 465, false for other ports 587
		    auth: {
		        user: "bgweb@yandex.ru",
		        pass: "vgkchdyvqpzfaukh"
		    }
		})
	} catch (e) {
		console.log("error", e)
		return;
	}

 	let info = await transporter.sendMail({
		from: '"Jenis" <bgweb@yandex.ru>',
		to: mailTo, // list of receivers
		//to: 'daria@unicreate.ru',
		subject: subject, 
		html: text,
	});
  	console.log("Message sent: %s", info.messageId);
}
