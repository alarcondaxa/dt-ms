'use server';

import { QueryFilter } from 'mongoose';

import refreshTokenModel, {
  RefreshTokenDocumentProtocol,
} from '@/db/models/refreshToken';

import connectDb from '../../connect';

interface Props {
  query: QueryFilter<RefreshTokenDocumentProtocol>;
}

export default async function deleteRefreshToken({ query }: Props) {
  try {
    await connectDb();
    await refreshTokenModel.deleteMany(query);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
