'use server';

import { QueryFilter } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user2';
import UserProtocol from '@/interfaces/userProtocol2';

import connectDb from '../../connect';

interface Props {
  query: QueryFilter<UserDocumentProtocol>;
}

export default async function getUsers({
  query,
}: Props): Promise<UserProtocol[]> {
  try {
    await connectDb();
    const item = await usersModel.find(query).sort({
      createdIn: -1,
    });
    const data: UserProtocol[] = item.map(item => ({
      _id: String(item._id),
      renavam: item.renavam,
      brand: item.brand,
      color: item.color,
      fuel: item.fuel,
      lastExecutedLicenseYear: item.lastExecutedLicenseYear,
      licensePlate: item.licensePlate,
      manufacturerYear: item.manufacturerYear,
      modelCar: item.modelCar,
      modelYear: item.modelYear,
      species: item.species,
      tipo: item.tipo,
      town: item.town,
      uf: item.uf,
      debts: item.debts.map(item => ({
        amount: item.amount,
        maturity: item.maturity,
        name: item.name,
        status: item.status,
      })),
      createdIn: item.createdIn,
    }));
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
