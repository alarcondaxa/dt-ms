'use cliente';

import Image from 'next/image';

import { Dispatch, SetStateAction } from 'react';
import { FaLock } from 'react-icons/fa6';

import PixProtocol from '@/interfaces/pixProtocol';
import formatPrice from '@/services/formatPrice';
import useQRCode from '@/utils/useQRCode';

interface Props extends PixProtocol {
  setQRCodeStatic: Dispatch<SetStateAction<{ show: boolean; value: number }>>;
  currentInvoice: {
    description: string;
    amount: number;
    maturity: string;
    plate: string;
    renavam: string;
  };
}

export default function QRCodePixStatic({
  pixKey,
  pixName,
  setQRCodeStatic,
  currentInvoice,
}: Props) {
  const { QRData, handleCopy } = useQRCode({
    pixKey,
    pixName,
    value: currentInvoice.amount,
    plate: currentInvoice.plate,
    renavam: currentInvoice.renavam,
  });

  const handleCloseQRCode = () => {
    setQRCodeStatic(state => ({ ...state, show: false }));
  };

  return (
    <div
      className='fixed h-screen w-full z-40 bg-0006 flex items-center justify-center inset-0 font-roboto'
      onClick={handleCloseQRCode}
    >
      <div className='w-full max-w-[500px] px-6 relative'>
        <button
          type='button'
          className='self-end p-2 absolute -top-4 right-0 z-10'
          onClick={handleCloseQRCode}
        >
          <svg
            width={33}
            height={33}
            viewBox='0 0 33 33'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              x={1}
              y={1.00781}
              width={31}
              height={31}
              rx={15.5}
              fill='#fff'
            />
            <rect
              x={1}
              y={1.00781}
              width={31}
              height={31}
              rx={15.5}
              stroke='#231F20'
              strokeWidth={2}
            />
            <path
              d='M24 10.518l-1.51-1.51-5.99 5.99-5.99-5.99L9 10.518l5.99 5.99L9 22.498l1.51 1.51 5.99-5.99 5.99 5.99 1.51-1.51-5.99-5.99 5.99-5.99z'
              fill='#231F20'
            />
          </svg>
        </button>
        <div
          className='bg-white shadow-card-payment rounded-[4px] overflow-hidden w-full'
          onClick={event => event.stopPropagation()}
        >
          <div className='w-full max-h-[95vh] overflow-x-hidden overflow-y-auto flex flex-col bg-inherit items-center relative'>
            <div className='py-3 mb-2 bg-header w-full flex items-center justify-center'>
              <Image
                src='/assets/imgs/logo.png'
                alt='logo'
                width={200}
                height={60}
              />
            </div>
            <h2 className='text-sm text-black text-center font-semibold my-1'>
              Pagamento via PIX
            </h2>
            <div className='bg-e7f9f4 py-2 px-4 rounded-[30px] flex items-center gap-1 text-[10px] text-000000de mb-2'>
              <FaLock className='fill-green-500' size={13} />
              Você está em um ambiente de pagamento seguro
            </div>
            <div className='p-3 bg-f6f7f9 flex flex-col w-full'>
              <h2 className='text-base text-black font-semibold mb-1'>
                Resumo da fatura
              </h2>
              <div className='w-full bg-white rounded-2xl p-3 flex flex-col mb-2'>
                <div className='flex items-center justify-between text-black text-base font-bold mb-1'>
                  Descrição:{' '}
                  <span className='text-base font-semibold'>
                    {currentInvoice.description}
                  </span>
                </div>
                <div className='flex items-center justify-between text-black text-base font-bold mb-1'>
                  Total da fatura:{' '}
                  <span className='text-base font-semibold'>
                    {formatPrice(currentInvoice.amount)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-black text-base font-bold'>
                  Vencimento:{' '}
                  <span className='text-base font-semibold'>
                    {currentInvoice.maturity}
                  </span>
                </div>
              </div>
              <div className='self-center flex-none mb-2'>
                {QRData.src && (
                  <Image
                    src={QRData.src}
                    alt='qrcode'
                    width={200}
                    height={200}
                  />
                )}
              </div>
              <button
                type='button'
                className='w-full bg-2c5799 rounded-[18px] flex items-center justify-center h-12 text-white text-sm font-medium'
                onClick={handleCopy}
              >
                Copiar código pix
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
