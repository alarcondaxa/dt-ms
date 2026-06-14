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

    const res = await fetch(process.env.API_VEHICLE as string, {
      method: 'POST',
      body: JSON.stringify({ plate, renavam }),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': realUserAgent,
      },
    });
    const dataVehicle = await res.json();

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
