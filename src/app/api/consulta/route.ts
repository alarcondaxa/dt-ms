export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import encryptData from '@/actions/encryptData';

interface BodyParams {
  plate?: string;
  renavam?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: BodyParams = await req.json();
    const { plate, renavam } = body;

    // Validar parâmetros
    if (!plate || !renavam) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Placa e RENAVAM são obrigatórios',
          },
        },
        { status: 400 }
      );
    }

    // Criar token de autorização
    const authorization = await encryptData('authorized');

    // Chamar a API scrape
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const scrapeResponse = await fetch(`${baseUrl}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': authorization,
      },
      body: JSON.stringify({
        plate: plate.toUpperCase(),
        renavam: renavam.replace(/\D/g, ''),
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok || !scrapeData.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: scrapeData.error?.message || 'Erro ao consultar débitos',
          },
        },
        { status: scrapeResponse.status || 400 }
      );
    }

    // Retornar dados de débitos
    return NextResponse.json({
      success: true,
      data: scrapeData,
    });
  } catch (err) {
    console.error('Erro na consulta de débitos:', err);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
        },
      },
      { status: 400 }
    );
  }
}
