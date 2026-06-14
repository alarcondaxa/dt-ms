'use server';

import { QueryFilter } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user';
import UserProtocol from '@/interfaces/userProtocol';

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
      category: item.category,
      chassi: item.chassi,
      city: item.city,
      color: item.color,
      crlvDigital: item.crlvDigital,
      expDoc: item.expDoc,
      fabricationYear: item.fabricationYear,
      licensingStatus: item.licensingStatus,
      modelCar: item.modelCar,
      modelYear: item.modelYear,
      motor: item.motor,
      observations: item.observations,
      plate: item.plate,
      licensing: item.licensing
        ? { label: item.licensing.label, value: item.licensing.value }
        : undefined,
      ipvaDebts: item.ipvaDebts.map(item => ({
        label: item.label,
        value: item.value,
      })),
      finesDebts: item.finesDebts.map(item => ({
        label: item.label,
        value: item.value,
      })),
      createdIn: item.createdIn,
    }));
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
