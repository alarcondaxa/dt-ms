import { Schema, model, models, type Document, Model } from 'mongoose';

import UserProtocol from '@/interfaces/userProtocol2';

export interface UserDocumentProtocol
  extends Omit<UserProtocol, '_id'>, Document {}

const usersSchema = new Schema<UserDocumentProtocol>({
  licensePlate: { type: String, required: false, default: '' },
  renavam: { type: String, required: false, default: '' },
  color: { type: String, required: false, default: '' },
  brand: { type: String, required: false, default: '' },
  modelCar: { type: String, required: false, default: '' },
  modelYear: { type: Number, required: false, default: 0 },
  manufacturerYear: { type: Number, required: false, default: 0 },
  fuel: { type: String, required: false, default: '' },
  uf: { type: String, required: false, default: '' },
  tipo: { type: String, required: false, default: '' },
  lastExecutedLicenseYear: { type: Number, required: false, default: 0 },
  town: { type: String, required: false, default: '' },
  species: { type: String, required: false, default: '' },
  debts: [
    {
      name: { type: String, required: false, default: '' },
      amount: { type: Number, required: false, default: 0 },
      maturity: { type: String, required: false, default: '' },
      status: { type: String, required: false, default: '' },
    },
  ],
  createdIn: {
    type: Date,
    required: false,
    default: Date.now,
    index: { expires: '24h' },
  },
});

const usersModel: Model<UserDocumentProtocol> =
  models.DTMS2026UsersModel2 ||
  model<UserDocumentProtocol>('DTMS2026UsersModel2', usersSchema);

export default usersModel;
