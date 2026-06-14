'use client';

import { useEffect } from 'react';

import useFormVehicle from '@/utils/formVehicle/useFormVehicle';

export default function FormVehicle() {
  const {
    handleSubmit,
    register,
    errors,
    handleInputIdDocument,
    watch,
    setValue,
    handleAlphaNumericInput,
  } = useFormVehicle();
  const idDocumentIsMandatory = watch('idDocumentIsMandatory');

  useEffect(() => {
    const sessionStorageIdDocumentIsMandatory = sessionStorage.getItem(
      'idDocumentIsMandatory'
    );
    if (sessionStorageIdDocumentIsMandatory === 'true') {
      setValue('idDocumentIsMandatory', true);
      setValue('idDocument', '');
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className='self-center flex flex-col items-center gap-3 max-w-[360px] w-full'
    >
      <div className='w-full flex flex-col gap-1'>
        <label className='uppercase text-base text-black font-semibold'>
          Placa do veículo *
        </label>
        <input
          type='text'
          {...register('plate')}
          className='w-full border-b border-b-[#1a1a1a] border-solid pb-1'
          placeholder='ABC1D23'
          onInput={handleAlphaNumericInput}
        />
        {errors.plate && (
          <span className='text-sm text-red-500'>{errors.plate.message}</span>
        )}
      </div>
      <div className='w-full flex flex-col gap-1 mb-2'>
        <label className='uppercase text-base text-black font-semibold'>
          Renavam *
        </label>
        <input
          type='text'
          {...register('renavam')}
          className='w-full border-b border-b-[#1a1a1a] border-solid pb-1'
          placeholder='1234567890'
        />
        {errors.renavam && (
          <span className='text-sm text-red-500'>{errors.renavam.message}</span>
        )}
      </div>
      {idDocumentIsMandatory && (
        <div className='w-full flex flex-col gap-1 mb-2'>
          <label className='uppercase text-base text-black font-semibold'>
            CPF/CNPJ proprietário
          </label>
          <input
            type='text'
            {...register('idDocument')}
            className='w-full border-b border-b-[#1a1a1a] border-solid pb-1'
            placeholder='CPF/CNPJ'
            onInput={handleInputIdDocument}
          />
          {errors.idDocument && (
            <span className='text-sm text-red-500'>
              {errors.idDocument.message}
            </span>
          )}
        </div>
      )}

      <div className='flex items-center gap-4 max-[500px]:w-full max-[500px]:flex-col'>
        <button
          type='submit'
          className='w-[155px] max-[500px]:w-full h-10 flex items-center justify-center uppercase text-white text-base font-bold bg-00823c rounded-[32px]'
        >
          Consultar
        </button>
        <a
          href='/'
          className='w-[155px] max-[500px]:w-full h-10 flex items-center justify-center uppercase text-284e8a border border-284e8a border-solid text-base font-bold bg-transparent rounded-[32px]'
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
