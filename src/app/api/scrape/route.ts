/* eslint-disable @typescript-eslint/no-unused-vars */
export const maxDuration = 300;

import { headers as nextHeaders } from 'next/headers';
import { userAgent as userAgentNext } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

import decryptData from '@/actions/decryptData';
import createRefreshToken from '@/db/actions/refreshToken/createRefreshToken';
import deleteRefreshToken from '@/db/actions/refreshToken/deleteRefreshToken';
import getRefreshToken from '@/db/actions/refreshToken/getRefreshToken';
import createUser from '@/db/actions/user/createUser';
import ScrapeError from '@/errors/scrapeError';
import UserProtocol from '@/interfaces/userProtocol';
import delay from '@/services/delay';
import parseCurrencyFloat from '@/services/parseCurrencyFloat';

interface BodyParams {
  plate?: string;
  renavam?: string;
}

export async function POST(req: NextRequest) {
  const headers = await nextHeaders();
  const realUserAgent = userAgentNext({ headers }).ua;

  try {
    const authorization = req.headers.get('authorization') ?? '';
    const isAuthorized = await decryptData(authorization);
    if (!isAuthorized) {
      throw new ScrapeError('Você não tem esse poder comédia', 401);
    }

    let body: BodyParams = await req.json();
    let { plate, renavam } = body;
    if (!plate || !renavam) {
      throw new ScrapeError('Parâmetros de requisição inválidos', 401);
    }
    console.warn(body);
    // await createRefreshToken({
    //   token:
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6MTIyNzQxNiwidXNlcm5hbWUiOiJMVUlaIE1BVEhFVVMgQVJBVUpPIFNJTFZBIiwiY3BmIjoiMDYzODg3NjEzMzAiLCJhY2NlcHRlZFRlcm1zIjp0cnVlLCJzZXNzaW9uSWQiOiIxMTA2ZDU2MS0xODg1LTQyNDctODE0MC0yZjlmMDc1MzY2MDYifSwiZXhwIjoxNzY5OTY5NTU2LCJpYXQiOjE3Njk5Njg2NTZ9.e-JwySIfWw7afSGstSDNE1gVsm7onLsrPqo0wC7anF8',
    //   refreshToken:
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6MTIyNzQxNiwic2Vzc2lvbklkIjoiMTEwNmQ1NjEtMTg4NS00MjQ3LTgxNDAtMmY5ZjA3NTM2NjA2In0sImV4cCI6MTc3MDA1NTA1NiwiaWF0IjoxNzY5OTY4NjU2fQ.VWp4nTpeqOooP7Ez9RnHQqgIfmkT8lZqtgZrIWS38Ns',
    // });

    let resTokens = await getRefreshToken({ query: {} });
    if (!resTokens.length)
      throw new ScrapeError('Ocorreu um erro, tente novamente', 401);
    const tokens = resTokens[0];
    const resAuth = await fetch(
      'https://portal-meu-detran-api.prod.k8s.detran.ms.gov.br/refresh-token',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': realUserAgent,
          Accept: 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          Authorization: `Bearer ${tokens.token}`,
          'x-app-origin': 'app-web',
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken,
        }),
      }
    );
    let dataAuth = await resAuth.json();
    dataAuth = dataAuth.data;
    resTokens = await getRefreshToken({ query: {} });
    if (resTokens.length) await deleteRefreshToken({ query: {} });
    const token = dataAuth.token;
    const refreshToken = dataAuth.refreshToken;
    await createRefreshToken({
      token,
      refreshToken,
    });

    const resVehicle = await fetch(
      'https://portal-meu-detran-api.prod.k8s.detran.ms.gov.br/debt-consultation/check-debts',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': realUserAgent,
          Accept: 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          Authorization: `Bearer ${token}`,
          'x-app-origin': 'app-web',
        },
        body: JSON.stringify({
          plate,
          renavam,
        }),
      }
    );
    let dataVehicle = await resVehicle.json();
    dataVehicle = dataVehicle.data;

    const data: Omit<UserProtocol, '_id' | 'createdIn'> = {
      renavam: dataVehicle.vehicleData.renavam,
      category: dataVehicle.vehicleData.category,
      chassi: dataVehicle.vehicleData.chassi,
      city: dataVehicle.vehicleData.city,
      color: dataVehicle.vehicleData.color,
      crlvDigital: dataVehicle.vehicleData.crlvDigital,
      expDoc: dataVehicle.vehicleData.expDoc,
      fabricationYear: dataVehicle.vehicleData.fabricationYear,
      licensingStatus: dataVehicle.vehicleData.licensing,
      modelCar: dataVehicle.vehicleData.model,
      modelYear: dataVehicle.vehicleData.modelYear,
      motor: dataVehicle.vehicleData.motor,
      observations: dataVehicle.vehicleData.observations,
      plate: dataVehicle.vehicleData.plate,
      licensing: dataVehicle.licensing
        ? {
            label: dataVehicle.licensing.label,
            value: parseCurrencyFloat(dataVehicle.licensing.value),
          }
        : undefined,
      ipvaDebts: dataVehicle.ipva
        ? dataVehicle.ipva.debts.map((item: any) => ({
            label: item.label,
            value: parseCurrencyFloat(item.value),
          }))
        : [],
      finesDebts: dataVehicle.fines
        ? dataVehicle.fines.debts.map((item: any) => ({
            label: item.label,
            value: parseCurrencyFloat(item.value),
          }))
        : [],
    };

    const userId = await createUser(data);

    return NextResponse.json({
      success: true,
      userId,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ScrapeError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: err.message,
          },
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Erro ao fazer a consulta',
        },
      },
      { status: 400 }
    );
  }
}
