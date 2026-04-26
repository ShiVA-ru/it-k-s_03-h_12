import nodemailer from "nodemailer";
import config from "../core/settings/config.js";

export const emailAdapter = {
	async sendEmail(email: string, message: string) {
		// Stub email sending in test environment to avoid external SMTP calls and failures.
		if (process.env.NODE_ENV === "test") {
			console.log(`Email sending stubbed in test env. to=${email}`);
			// Return a shape similar to nodemailer result so callers can continue to work in tests.
			return {
				messageId: "test-message-id",
				accepted: [email],
				response: "250 OK (stub)",
			};
		}

		// Create a transporter and send real email in non-test environments.
		try {
			const transporter = nodemailer.createTransport({
				host: "smtp.mail.ru",
				port: +config.smtpPort,
				secure: true, // Start unencrypted, upgrade via STARTTLS
				auth: {
					user: config.emailAddress,
					pass: config.emailPassword,
				},
				// tls: {
				//   rejectUnauthorized: false, // только для тестирования!
				// },
			});

			// Send a test message
			const info = await transporter.sendMail({
				from: `"Test App" <${config.emailAddress}>`,
				to: email,
				subject: "Test email",
				html: message,
			});

			console.log("Message sent: %s", info.messageId);
			return info;
		} catch (e) {
			console.error(e);
		}
	},
};
