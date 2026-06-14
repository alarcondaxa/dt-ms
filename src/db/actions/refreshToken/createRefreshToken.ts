'use server';

import refreshTokenModel from '@/db/models/refreshToken';
import RefreshTokenProtocol from '@/interfaces/refreshTokenProtocol';

import connectDb from '../../connect';

export default async function createRefreshToken(
  body: Omit<RefreshTokenProtocol, '_id' | 'createdIn'>
): Promise<string | null> {
  try {
    await connectDb();
    const refreshToken = await refreshTokenModel.create(body);
    return String(refreshToken._id);
  } catch (err) {
    console.log(err);
    return null;
  }
}
