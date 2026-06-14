import { Schema, model, models, type Document, Model } from 'mongoose';

import InsightsProtocol from '@/interfaces/insightsProtocol';

export interface InsightsDocumentProtocol extends InsightsProtocol, Document {}

const insightsSchema = new Schema<InsightsDocumentProtocol>({
  page: { type: String, required: false },
  clicks: { type: Number, required: false },
  location: { type: String, required: false },
  createdIn: { type: Date, required: false, default: Date.now },
});

const insightsModel: Model<InsightsDocumentProtocol> =
  models.DTMS2026Insights ||
  model<InsightsDocumentProtocol>('DTMS2026Insights', insightsSchema);

export default insightsModel;
