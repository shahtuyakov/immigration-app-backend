import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError } from "../utils/errorHandler.js";

// Define the email configuration interface for better type safety
interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  // Using the definite assignment assertion (!)
  private transporter!: nodemailer.Transporter;
  private readonly from: string;
  private initialized: boolean = false;

  constructor() {
    this.from = `"Immigration App" <${env.SMTP_USER}>`;
    // Initialize immediately for synchronous initialization
    this.initialize();
  }

  private initialize(): void {
    if (env.NODE_ENV === "development") {
      // For development, create synchronous setup initially
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: "temporary-user",
          pass: "temporary-pass",
        },
      });

      // Then update it asynchronously
      this.setupDevelopmentTransport().catch((error) => {
        console.error(
          "Failed to initialize development email transport:",
          error
        );
      });
    } else {
      this.initializeProductionTransport();
    }
    this.initialized = true;
  }

  private async setupDevelopmentTransport(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Development email account created:", testAccount.user);
    } catch (error) {
      console.error("Failed to create test email account:", error);
      throw new AppError(500, "Failed to initialize email service");
    }
  }

  private initializeProductionTransport(): void {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: true,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      throw new AppError(500, "Email service not properly initialized");
    }
  }

  private async sendEmail(config: EmailConfig): Promise<void> {
    await this.ensureInitialized();

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        ...config,
      });

      if (env.NODE_ENV === "development") {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new AppError(500, "Failed to send email");
    }
  }

  async sendEmailVerification(email: string, token: string): Promise<void> {
    const verificationUrl = `${env.CLIENT_URL}/verify-email/${token}`;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Email Verification</h1>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; 
                    background-color: #4CAF50; color: white; 
                    text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
          <p style="color: #666; margin-top: 20px;">
            This link will expire in 24 hours. If you didn't request this verification,
            please ignore this email.
          </p>
        </div>
      `,
    });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetUrl = `${env.CLIENT_URL}/reset-password/${token}`;

    await this.sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Password Reset</h1>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; 
                    background-color: #4CAF50; color: white; 
                    text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
          <p style="color: #666; margin-top: 20px;">
            This link will expire in 1 hour. If you didn't request this reset,
            please ignore this email.
          </p>
        </div>
      `,
    });
  }
}
