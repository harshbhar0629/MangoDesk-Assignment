/** @format */
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let url;
if (process.env.NODE_ENV === "production") {
	url = process.env.productionUrl;
} else {
	url = process.env.localUrl || "http://localhost:5173";
}

app.use(
	cors({
		origin: url,
		credentials: true,
	})
);

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

app.post("/send-email", async (req, res) => {
	const { emails, subject, summary } = req.body;

	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		secure: false,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
	});

	try {
		const response = await transporter.sendMail({
			from: process.env.MAIL_USER,
			bcc: emails,
			subject: subject,
			html: summary,
		});

		console.log("Message sent:", response);

		return res.status(200).json({
			message: "Email sent successfully",
			data: response,
		});
	} catch (error) {
		console.error("Error sending email:", error);
		return res.status(500).json({
			message: "Email not sent",
			error: String(error),
		});
	}
});

if (
	process.env.TYPE !== "HTTPS" &&
	process.env.TYPE !== "TEST" &&
	process.env.NODE_ENV !== "production"
) {
	// Listening to the server
	app.listen(5000, () => {
		console.log(`App is listening at ${5000}`);
	});
}

module.exports = app;
