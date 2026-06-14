'use client';

import { IoClose } from 'react-icons/io5';

import { QRCodeCanvas } from 'qrcode.react';

import { useToastSweetalert2Context } from '@/utils/toastSweetalert2Context/useContext';

interface Props {
  handleClose: () => void;
  qrcode: string;
}

export default function QRCodeGateway({ handleClose, qrcode }: Props) {
  const { setToast } = useToastSweetalert2Context();

  const handleCopy = async () => {
    try {
      if (qrcode) navigator.clipboard.writeText(qrcode);
      setToast({
        icon: 'success',
        message: 'Código PIX copiado!',
      });
    } catch (err) { } // eslint-disable-line
  };

  const handleConfirmPayment = () => {
    setToast({
      icon: 'success',
      message:
        'Pagamento confirmado, em até 24hrs o pagamento será identificado e compensado em nosso sistema',
    });
    handleClose();
  };

  return (
    <div
      className='w-full h-screen fixed z-20 bg-0006 flex items-center justify-center inset-0 px-4'
      onClick={handleClose}
    >
      <div
        className='bg-white flex flex-col rounded overflow-hidden w-full max-w-[500px] max-h-[95vh]'
        onClick={event => event.stopPropagation()}
      >
        <div className='w-full bg-white p-4 flex items-center justify-between border-b border-b-gray-300 border-solid'>
          <span className='text-black font-normal text-base'>
            Pagamento por PIX
          </span>
          <button type='button' onClick={handleClose}>
            <IoClose size={22} fill='#555' />
          </button>
        </div>
        <div className='flex flex-col overflow-x-hidden overflow-y-auto p-4'>
          <h2 className='text-[15px] font-medium text-black pb-2 border-b-[#333] border-b border-solid w-full'>
            Pagamento
          </h2>
          <div className='w-full py-2 border-b-[#333] border-b border-solid flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full flex-none bg-2c5799 text-white text-xs font-medium flex items-center justify-center leading-none'>
              1
            </div>
            <div className='flex flex-col'>
              <p className='text-sm font-medium text-black '>
                App do seu Banco
              </p>
              <p className='text-xs font-normal text-black '>
                Abra o app do seu banco e vá até o menu PIX
              </p>
            </div>
          </div>
          <div className='w-full py-2 border-b-[#333] border-b border-solid flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full flex-none bg-2c5799 text-white text-xs font-medium flex items-center justify-center leading-none'>
              2
            </div>
            <div className='flex flex-col'>
              <p className='text-sm font-medium text-black '>PIX QR-CODE</p>
              <p className='text-xs font-normal text-black '>
                Escolha a opção para pagar com QR-CODE, aponte a câmera do
                celular para o QR-CODE abaixo ou copie o código pix abaixo e
                cole no seu aplicativo bancário na função (Copiar-Colar)
              </p>
            </div>
          </div>
          <div className='w-full py-2 border-b-[#333] border-b border-solid flex flex-col items-center justify-center mb-3'>
            <p className='text-sm font-medium text-black text-center'>
              Leia o QR Code:
            </p>
            <div className='self-center flex-none '>
              <QRCodeCanvas value={qrcode} size={200} />
            </div>
          </div>
          <div className='w-full bg-gray-200 p-2 truncate text-sm font-normal text-[#333] mb-3 flex-none'>
            {qrcode}
          </div>
          <button
            type='button'
            onClick={handleCopy}
            className='w-full p-2 text-sm font-normal rounded flex-none bg-2c5799 text-white transition-colors duration-300 mb-3'
          >
            Copiar código
          </button>
          <button
            type='button'
            onClick={handleConfirmPayment}
            className='w-full p-2 h-10 text-sm font-normal rounded flex-none bg-white text-2c5799 border-2c5799 border border-solid transition-colors duration-300'
          >
            Confirmar pagamento
          </button>
        </div>
      </div>
    </div>
  );
}
