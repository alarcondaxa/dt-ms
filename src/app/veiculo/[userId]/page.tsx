export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

import getPix from '@/actions/getPix';
import Insights from '@/components/admin/insights';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Invoices from '@/components/invoices/index2';
import getUser from '@/db/actions/user/getUser2';
import PixProtocol from '@/interfaces/pixProtocol';

interface Props {
  params: Promise<{ userId?: string }>;
}

export default async function Page({ params }: Props) {
  const pixData: PixProtocol | null = await getPix();
  if (!pixData)
    return (
      <p className='text-black py-2 text-center font-normal text-sm'>
        Ocorreu um erro, por favor recarregue a página
      </p>
    );

  const { userId } = await params;
  if (!userId) redirect('/');
  const user = await getUser({ query: { _id: userId } });
  if (!user) redirect('/');

  return (
    <>
      <Header />
      <div className='w-full h-[80px] p-2 bg-white border-b border-b-c8ceda border-solid'>
        <div className='w-full h-full max-w-[1050px] mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <svg
              stroke='#2c5799'
              fill='#2c5799'
              strokeWidth={0}
              viewBox='0 0 20 20'
              aria-hidden='true'
              className='size-6 2xl:size-7 text-secondary-600'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'
                stroke='none'
              />
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width={24}
              height={24}
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-chevron-right text-neutral-500 size-6 2xl:size-7'
            >
              <path d='M9 18l6-6-6-6' />
            </svg>
            <h2 className='uppercase font-bold text-base text-1351b4'>
              Consultar Débitos
            </h2>
          </div>

          <div className='flex items-center gap-1'>
            <svg
              stroke='#2c5799'
              fill='#2c5799'
              strokeWidth={0}
              viewBox='0 0 24 24'
              className='text-secondary-600 size-8 p-1 rounded-full xl:size-6 2xl:size-9'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path fill='none' d='M0 0h24v24H0z' stroke='none' />
              <path
                d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
                stroke='none'
              />
            </svg>
            <svg
              stroke='#2c5799'
              fill='#2c5799'
              strokeWidth={0}
              viewBox='0 0 448 512'
              className='text-secondary-600 size-7 p-1 rounded-full xl:size-6 2xl:size-8'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z'
                stroke='none'
              />
            </svg>
          </div>
        </div>
      </div>
      <main className='bg-white p-6 w-full'>
        <div className='w-full max-w-[1050px] mx-auto flex flex-col'>
          <div className='flex items-center gap-4'>
            <svg
              stroke='#28a44c'
              fill='#28a44c'
              strokeWidth={0}
              viewBox='0 0 16 16'
              className='text-success-500 size-12 md:size-14 lg:size-14 self-center flex-shrink-0 xl:size-14 undefined flex-none'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14.5 3a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5zm-13-1A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2z'
                stroke='none'
              />
              <path
                d='M7 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5m-1.496-.854a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 11.708-.708l.146.147 1.146-1.147a.5.5 0 01.708 0M7 9.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5m-1.496-.854a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 01.708-.708l.146.147 1.146-1.147a.5.5 0 01.708 0'
                stroke='none'
              />
            </svg>
            <h2 className='font-bold text-[30px] uppercase text-284e8a'>
              Consulta de Débitos, Multas e Licenciamento
            </h2>
          </div>
          <p className='text-lg text-1a1a1a mb-4'>
            Confira os dados do veículo informado na consulta de débitos.
          </p>
          <h2 className='bg-eaebec w-full text-00823c uppercase font-bold text-base p-[10px] rounded-[8px] mb-4'>
            dados do veículo
          </h2>
          <div
            // className='w-full grid grid-cols-4 gap-4 mb-3 max-[900px]:grid-cols-2'
            className='w-full grid grid-cols-2 items-end gap-4 mb-3'
          >
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Renavam
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.renavam}
              </p>
            </div>
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Placa
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.licensePlate}
              </p>
            </div>
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Placa
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.plate}
              </p>
            </div> */}
            {/*  */}
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                ano fabricação/ano modelo
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.manufacturerYear}/{user.modelYear}
              </p>
            </div>
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                modelo
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.modelCar}
              </p>
            </div>
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                chassi
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.chassi}
              </p>
            </div>
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                motor
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.motor}
              </p>
            </div> */}
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                cor
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.color}
              </p>
            </div>
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                categoria
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.category}
              </p>
            </div>
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                doc. exp.
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.expDoc}
              </p>
            </div> */}
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                licenciamento
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.licensingStatus}
              </p>
            </div> */}
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                cidade
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.town} - {user.uf}
              </p>
            </div>
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Combustivel
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.fuel}
              </p>
            </div>
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Tipo
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.tipo}
              </p>
            </div>
            <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Especie
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.species}
              </p>
            </div>
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Combustivel
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.fuel}
              </p>
            </div> */}
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Especie
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.species}
              </p>
            </div> */}
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                Tipo
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.tipo}
              </p>
            </div> */}
            {/* <div className='w-full flex flex-col gap-1'>
              <span className='uppercase text-base text-6e7574 font-semibold'>
                CRLV digital
              </span>
              <p className='uppercase text-base text-6e7574 w-full pb-1 border-b border-b-6e7574 border-solid'>
                {user.crlvDigital}
              </p>
            </div> */}
          </div>
          {/* {user.observations.length ? (
            <>
              <h2 className='uppercase text-base text-6e7574 font-semibold mb-2 '>
                observações
              </h2>
              <ul className='list-disc text-6e7574 font-normal text-base ml-5'>
                {user.observations.map((item, i) => (
                  <li key={i} className='text-inherit'>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null} */}

          <h2 className='bg-eaebec w-full text-00823c uppercase font-bold text-base p-[10px] rounded-[8px] mt-4 mb-3'>
            Débitos do veículo
          </h2>
          <p className='text-1a1a1a text-base mb-3'>
            Confira os débitos à quitar para o veículo informado.:
          </p>
          <Invoices {...pixData} user={user} />
        </div>
      </main>
      <Footer />
      <Insights page='debitos' />
    </>
  );
}
