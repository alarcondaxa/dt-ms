// /* eslint-disable @typescript-eslint/no-unused-vars */
// export const maxDuration = 300;

// import { headers as nextHeaders } from 'next/headers';
// import { userAgent as userAgentNext } from 'next/server';
// import { NextRequest, NextResponse } from 'next/server';

// import decryptData from '@/actions/decryptData';
// import createRefreshToken from '@/db/actions/refreshToken/createRefreshToken';
// import deleteRefreshToken from '@/db/actions/refreshToken/deleteRefreshToken';
// import getRefreshToken from '@/db/actions/refreshToken/getRefreshToken';
// import createUser from '@/db/actions/user/createUser2';
// import ScrapeError from '@/errors/scrapeError';
// import UserProtocol from '@/interfaces/userProtocol2';
// import delay from '@/services/delay';
// import parseCurrencyFloat from '@/services/parseCurrencyFloat';

// interface BodyParams {
//   plate?: string;
//   renavam?: string;
// }

// export async function POST(req: NextRequest) {
//   const headers = await nextHeaders();
//   const realUserAgent = userAgentNext({ headers }).ua;

//   try {
//     const authorization = req.headers.get('authorization') ?? '';
//     const isAuthorized = await decryptData(authorization);
//     // if (!isAuthorized) {
//     //   throw new ScrapeError('Você não tem esse poder comédia', 401);
//     // }

//     let body: BodyParams = await req.json();
//     let { plate, renavam } = body;
//     if (!plate || !renavam) {
//       throw new ScrapeError('Parâmetros de requisição inválidos', 401);
//     }
//     console.warn(body);

//     const resVehicle = await fetch(
//       `https://departamentodetransito-ms.com/consulta/api_6.php?lista=${plate}|${renavam}&token=vias`,
//       {
//         method: 'get',
//         headers: {
//           'Content-Type': 'application/json',
//           'User-Agent': realUserAgent,
//           Accept: 'application/json, text/plain, */*',
//           'Accept-Encoding': 'gzip, deflate, br, zstd',
//           'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
//         },
//       }
//     );
//     let dataVehicle = await resVehicle.json();
//     // console.log(dataVehicle);

//     const data: Omit<UserProtocol, '_id' | 'createdIn'> = {
//       renavam: dataVehicle.renavam,
//       plate: dataVehicle.placa,
//       debts: dataVehicle.debitos.map((item: any) => ({
//         label: item.descricao,
//         value: item.valor,
//         maturity: item.vencimento,
//       })),
//     };

//     const userId = await createUser(data);

//     return NextResponse.json({
//       success: true,
//       userId,
//     });
//   } catch (err) {
//     console.log(err);
//     if (err instanceof ScrapeError) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: {
//             message: err.message,
//           },
//         },
//         { status: 401 }
//       );
//     }
//     return NextResponse.json(
//       {
//         success: false,
//         error: {
//           message: 'Erro ao fazer a consulta',
//         },
//       },
//       { status: 400 }
//     );
//   }
// }
