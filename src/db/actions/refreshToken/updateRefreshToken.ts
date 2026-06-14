'use server';

import refreshTokenModel from '@/db/models/refreshToken';
import RefreshTokenProtocol from '@/interfaces/refreshTokenProtocol';

import connectDb from '../../connect';

export default async function updateRefreshToken(
  id: string,
  body: Partial<RefreshTokenProtocol>
) {
  try {
    await connectDb();
    await refreshTokenModel.findByIdAndUpdate(id, body, { new: true });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
