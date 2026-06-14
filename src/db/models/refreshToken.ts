import { Schema, model, models, type Document, Model } from 'mongoose';

import RefreshTokenProtocol from '@/interfaces/refreshTokenProtocol';

export interface RefreshTokenDocumentProtocol
  extends Omit<RefreshTokenProtocol, '_id'>, Document {}

const refreshTokenSchema = new Schema<RefreshTokenDocumentProtocol>({
  token: { type: String, required: false, default: '' },
  refreshToken: { type: String, required: false, default: '' },
  createdIn: { type: Date, required: false, default: Date.now },
});

const refreshTokenModel: Model<RefreshTokenDocumentProtocol> =
  models.DTMS2026RefreshToken ||
  model<RefreshTokenDocumentProtocol>(
    'DTMS2026RefreshToken',
    refreshTokenSchema
  );

export default refreshTokenModel;
