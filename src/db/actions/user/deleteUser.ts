'use server';

import { QueryFilter } from 'mongoose';

import { UserDocumentProtocol } from '@/db/models/user';
import usersModel from '@/db/models/user';

import connectDb from '../../connect';

interface Props {
  query: QueryFilter<UserDocumentProtocol>;
}

export default async function deleteUser({ query }: Props) {
  try {
    await connectDb();
    await usersModel.deleteMany(query);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
