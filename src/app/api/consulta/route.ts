export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';

import ScrapeError from '@/errors/scrapeError';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      ...body,
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
