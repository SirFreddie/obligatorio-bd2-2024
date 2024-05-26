import nodemailer from 'nodemailer';

interface EmailOptions {
	to: string;
	subject: string;
	htmlBody: string;
	attachments?: any[];
}

export class EmailService {
	private transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.MAILER_EMAIL,
			pass: process.env.MAILER_SECRET_KEY,
		},
	});

	async sendEmail(options: EmailOptions): Promise<boolean> {
		const { to, subject, htmlBody } = options;

		try {
			const sentInformation = await this.transporter.sendMail({
				to,
				subject,
				html: htmlBody,
			});

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
