export const maxDuration = 300;

import { headers as nextHeaders } from 'next/headers';
import { userAgent as userAgentNext } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

import decryptData from '@/actions/decryptData';
// import createUser from '@/db/actions/user/createUser2';
import createUser from '@/db/actions/user/createUser2';
import ScrapeError from '@/errors/scrapeError';
// import UserProtocol from '@/interfaces/userProtocol2';
import delay from '@/services/delay';

interface BodyParams {
  plate?: string;
  renavam?: string;
  idDocument?: string;
}

export async function POST(req: NextRequest) {
  const headers = await nextHeaders();
  const realUserAgent = userAgentNext({ headers }).ua;

  try {
    const authorization = req.headers.get('authorization') ?? '';
    const isAuthorized = await decryptData(authorization);
    if (!isAuthorized) {
      throw new ScrapeError('Você não tem esse poder comédia', 400);
    }

    let body: BodyParams = await req.json();
    // let { renavam, plate } = body;
    let { renavam, plate, idDocument } = body;
    if (!renavam || !plate) {
      // if (!renavam || !plate) {
      throw new ScrapeError('Parâmetros de requisição inválidos', 400);
    }
    idDocument = idDocument ? idDocument.replace(/[^\d]+/g, '') : undefined;
    console.warn(body);

    const resAuth = await fetch(
      `https://gcf.gringo.com.vc/vehicle/license-plate/${plate}/renavam/${renavam}/cpf-cnpj/${idDocument}?shouldNotSearchBlocks=true`,
      {
        method: 'get',
        headers: {
          'user-agent': realUserAgent,
          // x-gringo-transaction-id	6AaZe9cjTazDeqRDl9wpP
          'x-gringo-system-name': 'iOS',
          'x-gringo-app-version': '18.7.1',
          // baggage	sentry-environment=production,sentry-public_key=268cfcb2e1564c989059f89921c6d2de,sentry-trace_id=53c34637b09844e198c2c6b689a23c0e
          // newrelic	ewoiZCI6IHsKImFjIjogIjMyOTMyOTAiLAoiYXAiOiAiNTk0NTk4MzA2IiwKImlkIjogImY1NTQzNzM4MjU5MGFmMGUiLAoidGkiOiAxNzY5NjI1MDI4MzUyLAoidHIiOiAiYzA0YmY5ZjI2OGNlOTU5MmRkYzI1NGUwNDNhYzMxZjMiLAoidHkiOiAiTW9iaWxlIgp9LAoidiI6IFsKMCwKMgpdCn0=
          priority: '	u=3, i',
          'x-gringo-use-case': 'CHANGE_PLATE',
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIza2VnTE5mb0pxQ0FiNVMxRTAzRCIsImlhdCI6MTc2OTUzMjkyMH0.egX9UMqaaF8ZvrUDdOOLVA-vYOX5ah2OSmXmC64bOjc',
          // tracestate	3293290@nr=0-2-3293290-594598306-f55437382590af0e----1769625028352
          'x-gringo-system-version': '26.2',
          'accept-language': 'pt-BR,pt;q=0.9',
          accept: 'application/json, text/plain, */*',
          'if-none-match': 'UNKNOWN',
          // sentry-trace	53c34637b09844e198c2c6b689a23c0e-99ec9b209735b837
          'x-gringo-channel': 'APP_GRINGO',
          'accept-encoding': 'gzip, deflate, br',
          // traceparent	00-c04bf9f268ce9592ddc254e043ac31f3-f55437382590af0e-01
        },
      }
    );
    let dataAuth = await resAuth.json();
    // console.log(dataAuth);
    if (
      'message' in dataAuth &&
      dataAuth.message.toLowerCase() ===
        'os dados preenchidos não correspondem a placa selecionada'
    ) {
      // console.log(dataAuth);
      throw new ScrapeError(
        'Os dados preenchidos não correspondem a placa selecionada',
        406
      );
    }
    dataAuth = dataAuth.data;

    const handleDataDebts = async () => {
      const resDebts = await fetch(
        `https://k8s.gringo.com.vc/v3/car/license-plate/${plate}/debits/group?shouldShowInProcessDebits=true`,
        {
          method: 'get',
          headers: {
            'user-agent': realUserAgent,
            // x-gringo-transaction-id	6AaZe9cjTazDeqRDl9wpP
            'x-gringo-system-name': 'iOS',
            'x-gringo-app-version': '18.7.1',
            // baggage	sentry-environment=production,sentry-public_key=268cfcb2e1564c989059f89921c6d2de,sentry-trace_id=53c34637b09844e198c2c6b689a23c0e
            // newrelic	ewoiZCI6IHsKImFjIjogIjMyOTMyOTAiLAoiYXAiOiAiNTk0NTk4MzA2IiwKImlkIjogImY1NTQzNzM4MjU5MGFmMGUiLAoidGkiOiAxNzY5NjI1MDI4MzUyLAoidHIiOiAiYzA0YmY5ZjI2OGNlOTU5MmRkYzI1NGUwNDNhYzMxZjMiLAoidHkiOiAiTW9iaWxlIgp9LAoidiI6IFsKMCwKMgpdCn0=
            priority: '	u=3, i',
            'x-gringo-use-case': 'CHANGE_PLATE',
            authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIza2VnTE5mb0pxQ0FiNVMxRTAzRCIsImlhdCI6MTc2OTUzMjkyMH0.egX9UMqaaF8ZvrUDdOOLVA-vYOX5ah2OSmXmC64bOjc',
            // tracestate	3293290@nr=0-2-3293290-594598306-f55437382590af0e----1769625028352
            'x-gringo-system-version': '26.2',
            'accept-language': 'pt-BR,pt;q=0.9',
            accept: 'application/json, text/plain, */*',
            'if-none-match': 'UNKNOWN',
            // sentry-trace	53c34637b09844e198c2c6b689a23c0e-99ec9b209735b837
            'x-gringo-channel': 'APP_GRINGO',
            'accept-encoding': 'gzip, deflate, br',
            // traceparent	00-c04bf9f268ce9592ddc254e043ac31f3-f55437382590af0e-01
          },
        }
      );
      return await resDebts.json();
    };
    let dataDebts = await handleDataDebts();
    let hasDebitsInProcess = dataDebts.hasDebitsInProcess;
    if (hasDebitsInProcess) {
      const startTime = Date.now();
      const MAX_TIME = 60_000; // 1 minuto
      while (hasDebitsInProcess) {
        // se passou de 1 minuto, interrompe
        if (Date.now() - startTime > MAX_TIME) {
          throw new ScrapeError(
            'Tempo máximo de processamento excedido (1 minuto)',
            408
          );
        }

        await delay(5000);
        dataDebts = await handleDataDebts();
        hasDebitsInProcess = dataDebts.hasDebitsInProcess;
      }
    }

    // let cotasUnicas = dataDebts.result.total_preview.group_totals.filter(
    //   (item: any) => item.label.toLowerCase().includes('cota única')
    // );
    // cotasUnicas = cotasUnicas.map((item: any) => ({
    //   name: `${item.label}`,
    //   amount: item.price / 100,
    //   maturity: new Date().toLocaleDateString('pt-BR', {
    //     dateStyle: 'short',
    //   }),
    //   status: 'Vencido',
    // }));

    let ipva = dataDebts.result.debits_groups.find(
      (item: any) => item.type.toLowerCase() === 'current_ipva'
    );
    ipva = ipva
      ? ipva.debits.map((item: any) => ({
          name: `${ipva.title} ${item.description}`,
          amount: item.amount / 100,
          maturity: new Date(item.dueDate).toLocaleDateString('pt-BR', {
            dateStyle: 'short',
          }),
          status: item.dueDateStatus,
        }))
      : [];

    let licenciamento = dataDebts.result.debits_groups.find(
      (item: any) => item.type.toLowerCase() === 'licenciamento'
    );
    licenciamento = licenciamento
      ? licenciamento.debits.map((item: any) => ({
          name: `${licenciamento.title} ${item.ano_exercicio}`,
          amount: item.amount / 100,
          maturity: new Date(item.dueDate).toLocaleDateString('pt-BR', {
            dateStyle: 'short',
          }),
          status: item.dueDateStatus,
        }))
      : [];
    // licenciamento = licenciamento.reverse();

    let debts = dataDebts.result.debits_groups.find(
      (item: any) => item.type.toLowerCase() === 'debits'
    );
    debts = debts
      ? debts.debits.map((item: any) => ({
          name: `Débito ${item.description}`,
          amount: item.amount / 100,
          maturity: new Date(item.dueDate).toLocaleDateString('pt-BR', {
            dateStyle: 'short',
          }),
          status: item.dueDateStatus,
        }))
      : [];

    let data = {
      renavam: renavam,
      licensePlate: plate,

      color: dataAuth.color,
      brand: dataAuth.brand,
      modelCar: dataAuth.model,
      modelYear: dataAuth.modelYear,
      manufacturerYear: dataAuth.manufacturerYear,
      fuel: dataAuth.fuel,
      uf: dataAuth.uf,
      tipo: dataAuth.tipo,
      lastExecutedLicenseYear: dataAuth.lastExecutedLicenseYear,
      town: dataAuth.town,
      species: dataAuth.species,
      debts: [...ipva, ...licenciamento, ...debts],
      // debts: [...cotasUnicas, ...ipva, ...licenciamento, ...debts],
    };
    const newUserId = await createUser(data);

    return NextResponse.json({
      // redirect: false,
      success: true,
      // data,
      userId: newUserId,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ScrapeError) {
      return NextResponse.json(
        {
          success: false,
          redirect: false,
          error: {
            message: err.message,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        redirect: false,
        error: {
          message: 'Erro ao fazer a consulta, tente novamente',
        },
      },
      { status: 400 }
    );
  } finally {
    // await browser.close();
  }
}
