import { NextApiRequest } from 'next';

export async function getOAuthUserInfo(req: NextApiRequest, provider: string) {
  // Implement fetching user info from OAuth provider using code in req
  // Return { email, name, oauthId }
  // This is highly provider-specific!
  return {
    email: 'test@example.com',
    name: 'Test User',
    oauthId: 'provider-user-id',
  };
}
