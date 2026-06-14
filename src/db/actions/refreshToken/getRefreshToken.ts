'use server';

import { QueryFilter } from 'mongoose';

import refreshTokenModel, {
  RefreshTokenDocumentProtocol,
} from '@/db/models/refreshToken';
import RefreshTokenProtocol from '@/interfaces/refreshTokenProtocol';

import connectDb from '../../connect';

interface Props {
  query: QueryFilter<RefreshTokenDocumentProtocol>;
}

export default async function getRefreshToken({
  query,
}: Props): Promise<RefreshTokenProtocol[]> {
  try {
    await connectDb();
    const res = await refreshTokenModel.find(query).sort({
      createdIn: -1,
    });
    if (!res) throw new Error('Token não encontrado');
    return res.map(item => ({
      _id: String(item._id),
      token: item.token,
      refreshToken: item.refreshToken,
      createdIn: item.createdIn,
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
}
