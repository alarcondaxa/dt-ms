import { Schema, model, models, type Document, Model } from 'mongoose';

import UserProtocol from '@/interfaces/userProtocol';

export interface UserDocumentProtocol
  extends Omit<UserProtocol, '_id'>, Document {}

const usersSchema = new Schema<UserDocumentProtocol>({
  plate: { type: String, required: false, default: '' },
  renavam: { type: String, required: false, default: '' },
  chassi: { type: String, required: false, default: '' },
  motor: { type: String, required: false, default: '' },
  color: { type: String, required: false, default: '' },
  fabricationYear: { type: String, required: false, default: '' },
  modelYear: { type: String, required: false, default: '' },
  modelCar: { type: String, required: false, default: '' },
  expDoc: { type: String, required: false, default: '' },
  licensingStatus: { type: String, required: false, default: '' },
  city: { type: String, required: false, default: '' },
  crlvDigital: { type: String, required: false, default: '' },
  category: { type: String, required: false, default: '' },
  licensing: {
    label: { type: String, required: false, default: '' },
    value: { type: Number, required: false, default: 0 },
  },
  observations: [String],
  ipvaDebts: [
    {
      label: { type: String, required: false, default: '' },
      value: { type: Number, required: false, default: 0 },
    },
  ],
  finesDebts: [
    {
      label: { type: String, required: false, default: '' },
      value: { type: Number, required: false, default: 0 },
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
  models.DTMS2026Users ||
  model<UserDocumentProtocol>('DTMS2026Users', usersSchema);

export default usersModel;
