'use server';

import { QueryFilter } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user2';
import UserProtocol from '@/interfaces/userProtocol2';

import connectDb from '../../connect';

interface Props {
  query: QueryFilter<UserDocumentProtocol>;
}

export default async function getUser({ query }: Props) {
  try {
    await connectDb();
    const res = await usersModel.findOne(query).sort({
      createdIn: -1,
    });
    if (!res) throw new Error('Usuário não encontrado');

    const data: UserProtocol = {
      _id: String(res._id),
      renavam: res.renavam,
      brand: res.brand,
      color: res.color,
      fuel: res.fuel,
      lastExecutedLicenseYear: res.lastExecutedLicenseYear,
      licensePlate: res.licensePlate,
      manufacturerYear: res.manufacturerYear,
      modelCar: res.modelCar,
      modelYear: res.modelYear,
      species: res.species,
      tipo: res.tipo,
      town: res.town,
      uf: res.uf,
      debts: res.debts.map(item => ({
        amount: item.amount,
        maturity: item.maturity,
        name: item.name,
        status: item.status,
      })),
      createdIn: res.createdIn,
    };
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
