import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/errorHandler.js";
import { AuthService } from "./AuthService.js";
import { env } from "../config/env.js";

export class OAuthService {
  private googleClient: OAuth2Client;
  private authService: AuthService;

  constructor() {
    this.googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    this.authService = new AuthService();
  }

  async handleGoogleLogin(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new AppError(400, "Invalid token");

      return this.handleOAuthUser({
        provider: "google",
        providerId: payload.sub,
        email: payload.email!,
        name: payload.name,
        picture: payload.picture,
      });
    } catch (error) {
      throw new AppError(401, "Failed to verify Google token");
    }
  }

  async handleAppleLogin(identityToken: string) {
    try {
      // Verify Apple identity token
      const decodedToken = jwt.decode(identityToken) as any;
      if (!decodedToken) throw new AppError(400, "Invalid token");

      return this.handleOAuthUser({
        provider: "apple",
        providerId: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
      });
    } catch (error) {
      throw new AppError(401, "Failed to verify Apple token");
    }
  }

  private async handleOAuthUser(profile: IOAuthProfile) {
    // Find user by OAuth profile
    let user = await User.findOne({
      "oauthProfiles.provider": profile.provider,
      "oauthProfiles.providerId": profile.providerId,
    });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email: profile.email });

      if (user) {
        // Link OAuth profile to existing user
        user.oauthProfiles = user.oauthProfiles || [];
        user.oauthProfiles.push(profile);
      } else {
        // Create new user
        user = await User.create({
          email: profile.email,
          firstName: profile.name?.split(" ")[0] || "",
          lastName: profile.name?.split(" ").slice(1).join(" ") || "",
          emailVerified: true,
          oauthProfiles: [profile],
        });
      }

      await user.save();
    }

    // Generate tokens
    const tokens = this.authService.generateTokens(user.id);

    return { user, tokens };
  }
}
