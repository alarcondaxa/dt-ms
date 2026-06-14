import { NextRequest, NextResponse } from 'next/server';

interface BodyParams {
  plate?: string;
  renavam?: string;
}

// Dados simulados de veículos para teste
const mockVehicleData: Record<string, any> = {
  'HRS6J08': {
    vehicleData: {
      plate: 'HRS6J08',
      renavam: '00916663051',
      category: 'PARTICULAR',
      chassi: '9BWNE0505K5123456',
      city: 'Campo Grande',
      color: 'BRANCO',
      crlvDigital: true,
      expDoc: '2025-12-31',
      fabricationYear: 2020,
      licensing: 'ATIVO',
      model: 'HB20',
      modelYear: 2020,
      motor: '1.0',
      observations: 'Veículo em bom estado',
    },
    licensing: { label: 'Licenciamento 2025', value: '150.00' },
    ipva: { debts: [{ label: 'IPVA 2023', value: '850.00' }, { label: 'IPVA 2024', value: '900.00' }] },
    fines: { debts: [{ label: 'Multa - Excesso de velocidade', value: '293.47' }, { label: 'Multa - Estacionamento irregular', value: '130.16' }] },
  },
  'HTE5327': {
    vehicleData: { plate: 'HTE5327', renavam: '00121438481', category: 'PARTICULAR', chassi: '9BWNE0505K5234567', city: 'Dourados', color: 'PRETO', crlvDigital: true, expDoc: '2025-06-30', fabricationYear: 2019, licensing: 'ATIVO', model: 'Gol', modelYear: 2019, motor: '1.6', observations: 'Veículo regularizado' },
    licensing: null,
    ipva: { debts: [{ label: 'IPVA 2024', value: '950.00' }] },
    fines: { debts: [] },
  },
  'SMB1G32': {
    vehicleData: { plate: 'SMB1G32', renavam: '01398603080', category: 'PARTICULAR', chassi: '9BWNE0505K5345678', city: 'Três Lagoas', color: 'PRATA', crlvDigital: false, expDoc: '2024-08-15', fabricationYear: 2018, licensing: 'VENCIDO', model: 'Onix', modelYear: 2018, motor: '1.0', observations: 'Licenciamento vencido' },
    licensing: { label: 'Licenciamento 2025', value: '200.00' },
    ipva: { debts: [{ label: 'IPVA 2023', value: '800.00' }, { label: 'IPVA 2024', value: '850.00' }] },
    fines: { debts: [{ label: 'Multa - Documentação vencida', value: '293.47' }, { label: 'Multa - Falta de seguro', value: '293.47' }, { label: 'Multa - Placa ilegível', value: '130.16' }] },
  },
  'LRA8I58': {
    vehicleData: { plate: 'LRA8I58', renavam: '00598608796', category: 'PARTICULAR', chassi: '9BWNE0505K5456789', city: 'Corumbá', color: 'AZUL', crlvDigital: true, expDoc: '2026-03-20', fabricationYear: 2021, licensing: 'ATIVO', model: 'Sandero', modelYear: 2021, motor: '1.0', observations: 'Veículo novo' },
    licensing: null,
    ipva: { debts: [] },
    fines: { debts: [] },
  },
  'QAL4911': {
    vehicleData: { plate: 'QAL4911', renavam: '01160085029', category: 'COMERCIAL', chassi: '9BWNE0505K5567890', city: 'Ponta Porã', color: 'BRANCO', crlvDigital: true, expDoc: '2025-10-10', fabricationYear: 2017, licensing: 'ATIVO', model: 'Sprinter', modelYear: 2017, motor: '2.2', observations: 'Veículo comercial' },
    licensing: { label: 'Licenciamento 2025', value: '350.00' },
    ipva: { debts: [{ label: 'IPVA 2024', value: '1200.00' }] },
    fines: { debts: [{ label: 'Multa - Ultrapassagem proibida', value: '293.47' }] },
  },
  'HTR3I80': {
    vehicleData: { plate: 'HTR3I80', renavam: '00206253516', category: 'PARTICULAR', chassi: '9BWNE0505K5678901', city: 'Maracaju', color: 'VERMELHO', crlvDigital: false, expDoc: '2024-05-30', fabricationYear: 2016, licensing: 'VENCIDO', model: 'Fiesta', modelYear: 2016, motor: '1.5', observations: 'Documentação vencida' },
    licensing: { label: 'Licenciamento 2025', value: '180.00' },
    ipva: { debts: [{ label: 'IPVA 2022', value: '700.00' }, { label: 'IPVA 2023', value: '750.00' }, { label: 'IPVA 2024', value: '800.00' }] },
    fines: { debts: [{ label: 'Multa - Dirigir com habilitação vencida', value: '293.47' }, { label: 'Multa - Sem cinto de segurança', value: '195.23' }] },
  },
};

export async function POST(req: NextRequest) {
  try {
    const body: BodyParams = await req.json();
    let { plate, renavam } = body;

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

    // Normalizar a placa
    const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const vehicleData = mockVehicleData[normalizedPlate];

    if (!vehicleData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Veículo não encontrado. Use uma das placas de teste: HRS6J08, HTE5327, SMB1G32, LRA8I58, QAL4911, HTR3I80',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vehicleData,
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
      { status: 500 }
    );
  }
}
