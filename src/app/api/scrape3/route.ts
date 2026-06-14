/* eslint-disable @typescript-eslint/no-unused-vars */
export const maxDuration = 300;

import { headers as nextHeaders } from 'next/headers';
import { userAgent as userAgentNext } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

import decryptData from '@/actions/decryptData';
import createRefreshToken from '@/db/actions/refreshToken/createRefreshToken';
import deleteRefreshToken from '@/db/actions/refreshToken/deleteRefreshToken';
import getRefreshToken from '@/db/actions/refreshToken/getRefreshToken';
import createUser from '@/db/actions/user/createUser2';
import ScrapeError from '@/errors/scrapeError';
import capsolver from '@/functions/capsolver';
import UserProtocol from '@/interfaces/userProtocol2';
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
    // if (!isAuthorized) {
    //   throw new ScrapeError('Você não tem esse poder comédia', 401);
    // }

    let body: BodyParams = await req.json();
    let { plate, renavam } = body;
    if (!plate || !renavam) {
      throw new ScrapeError('Parâmetros de requisição inválidos', 401);
    }
    console.warn(body);

    const { token, userAgent } = await capsolver();

    const se = new URLSearchParams();
    se.append('placa', plate);
    se.append('renavam', renavam);
    se.append('cpfCnpj', '');
    se.append('response', token);

    const resVehicle = await fetch(
      'https://servicos.efazenda.ms.gov.br/ipvapublico/ConsultaTerceiros/MontarConsultaDebitos',
      {
        method: 'POST',
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          connection: 'keep-alive',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          cookie:
            'ASP.NET_SessionId=mev4ymyeu4kojcfry03pdfq2; AppPersist=!zx+XYnRxZYgG5WphLOIdrLfaGwdPuuq9DlFPtpVBCOV9Z0e2kOE87wTa+ysitfThY5KZY/GNrAu82w==',
          host: 'servicos.efazenda.ms.gov.br',
          origin: 'https://servicos.efazenda.ms.gov.br',
          referer:
            'https://servicos.efazenda.ms.gov.br/ipvapublico/ConsultaTerceiros/Debitos',
          'sec-ch-ua':
            '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: body.toString(),
      }
    );

    let dataVehicle = await resVehicle.text();

    return NextResponse.json({
      success: true,
      dataVehicle,
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
