'use server';

import { QueryFilter } from 'mongoose';

import insightsModel, { InsightsDocumentProtocol } from '@/db/models/insights';
import InsightsProtocol from '@/interfaces/insightsProtocol';

import connectDb from '../../connect';

interface Props {
  query: QueryFilter<InsightsDocumentProtocol>;
}

export default async function getInsights({
  query,
}: Props): Promise<InsightsProtocol[]> {
  try {
    await connectDb();
    const res = await insightsModel.find(query).sort({
      createdIn: -1,
    });
    const data: InsightsProtocol[] = res.map(item => ({
      page: item.page,
      clicks: item.clicks,
      location: item.location,
      createdIn: item.createdIn,
    }));
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
