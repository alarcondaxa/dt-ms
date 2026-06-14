'use server';

import { QueryFilter } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user';
import UserProtocol from '@/interfaces/userProtocol';

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
      category: res.category,
      chassi: res.chassi,
      city: res.city,
      color: res.color,
      crlvDigital: res.crlvDigital,
      expDoc: res.expDoc,
      fabricationYear: res.fabricationYear,
      licensingStatus: res.licensingStatus,
      modelCar: res.modelCar,
      modelYear: res.modelYear,
      motor: res.motor,
      observations: res.observations,
      plate: res.plate,
      licensing: res.licensing
        ? { label: res.licensing.label, value: res.licensing.value }
        : undefined,
      ipvaDebts: res.ipvaDebts.map(item => ({
        label: item.label,
        value: item.value,
      })),
      finesDebts: res.finesDebts.map(item => ({
        label: item.label,
        value: item.value,
      })),
      createdIn: res.createdIn,
    };
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
