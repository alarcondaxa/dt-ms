'use server';

import usersModel from '@/db/models/user2';
import UserProtocol from '@/interfaces/userProtocol2';

import connectDb from '../../connect';

export default async function createUser(
  body: Omit<UserProtocol, '_id' | 'createdIn'>
): Promise<string | null> {
  try {
    await connectDb();
    const user = await usersModel.create(body);
    return String(user._id);
  } catch (err) {
    console.log(err);
    return null;
  }
}
