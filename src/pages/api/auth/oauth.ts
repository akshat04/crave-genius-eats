import { NextApiRequest, NextApiResponse } from 'next';
import { getOAuthUserInfo } from '../../../lib/oauth';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider } = req.query;
  const userInfo = await getOAuthUserInfo(req, provider as string);

  if (!userInfo?.email || !userInfo?.oauthId) {
    return res.status(400).json({ error: 'Invalid OAuth response' });
  }

  let user = await prisma.user.findUnique({ where: { email: userInfo.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name || null,
        oauthProvider: provider as string,
        oauthId: userInfo.oauthId,
      },
    });
  }

  // Set user session (implement your session logic)
  // ...

  res.status(200).json({ success: true, user });
}
