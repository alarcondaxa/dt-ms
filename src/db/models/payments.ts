import { Schema, model, models, type Document, Model } from 'mongoose';

import PaymentsProtocol from '@/interfaces/paymentsProtocol';

export interface PaymentsDocumentProtocol extends PaymentsProtocol, Document {}

const paymentsSchema = new Schema<PaymentsDocumentProtocol>({
  value: { type: Number, required: false },
  plate: { type: String, required: false },
  renavam: { type: String, required: false },
  location: { type: String, required: true },
  copied: { type: Boolean, required: true },
  createdIn: { type: Date, required: false, default: Date.now },
});

const paymentsModel: Model<PaymentsDocumentProtocol> =
  models.DTMS2026Payments ||
  model<PaymentsDocumentProtocol>('DTMS2026Payments', paymentsSchema);

export default paymentsModel;
