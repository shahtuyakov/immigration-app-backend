import { z } from 'zod';

export const oauthSchemas = {
  googleLogin: z.object({
    body: z.object({
      idToken: z.string().min(1, 'Google ID token is required')
    })
  }),

  appleLogin: z.object({
    body: z.object({
      identityToken: z.string().min(1, 'Apple identity token is required')
    })
  })
};