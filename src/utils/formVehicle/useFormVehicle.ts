import { FormEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import encryptData from '@/actions/encryptData';
import UserError from '@/errors/userError';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLoadingApplicationContext } from '../loadingApplicationContext/useContext';
import { useToastSweetalert2Context } from '../toastSweetalert2Context/useContext';
import { zodSchema, BodyProtocol, normalizeDocument } from './validation';

export default function useFormVehicle() {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BodyProtocol>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      plate: '',
      renavam: '',
      idDocument: '',
      idDocumentIsMandatory: false,
    },
  });
  const { isLoading, setIsLoading } = useLoadingApplicationContext();
  const { setToast } = useToastSweetalert2Context();
  const idDocumentIsMandatory = watch('idDocumentIsMandatory');

  const handleFormSubmit: SubmitHandler<BodyProtocol> = async body => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const authorization = await encryptData(body);
      const res = await fetch('/api/scrape6', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });
      const data = await res.json();
      if (data.error || !res.ok) throw new UserError(data.error.message, 400);
      // console.log(data);
      location.href = `/veiculo/${data.userId}`;
    } catch (err) {
      console.log(err);
      if (err instanceof UserError) {
        setToast({
          icon: 'error',
          message: err.message,
        });
        if (!idDocumentIsMandatory) {
          sessionStorage.setItem('idDocumentIsMandatory', 'true');
          setValue('idDocumentIsMandatory', true);
          setValue('idDocument', '');
        }
        return;
      }
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
      });
      if (!idDocumentIsMandatory) {
        sessionStorage.setItem('idDocumentIsMandatory', 'true');
        setValue('idDocumentIsMandatory', true);
        setValue('idDocument', '');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFInput = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;
    value = value.replace(/[^\d]/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    currentTarget.value = value;
  };

  const handleCNPJInput = (event: FormEvent<HTMLInputElement>) => {
    // 12.345.678/0001-95
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;
    value = value.replace(/[^\d]/g, '');
    value = value.slice(0, 14);
    // Aplica a formatação de CNPJ usando regex em etapas
    value = value.replace(/^(\d{2})(\d)/, '$1.$2'); // Formata os dois primeiros dígitos
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Formata os próximos três dígitos
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Formata os próximos três dígitos e adiciona a barra
    value = value.replace(/(\d{4})(\d)/, '$1-$2'); // Formata os quatro dígitos e adiciona o hífen

    currentTarget.value = value;
  };

  const handleInputIdDocument = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;
    value = normalizeDocument(value);
    if (value.length <= 11) {
      handleCPFInput(event);
      return;
    }
    handleCNPJInput(event);
  };

  const handleAlphaNumericInput = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;

    // Remove tudo que não for letra ou número
    value = value.replace(/[^a-zA-Z0-9]/g, '');

    currentTarget.value = value;
  };

  return {
    handleSubmit: handleSubmit(handleFormSubmit),
    register,
    errors,
    handleInputIdDocument,
    watch,
    setValue,
    handleAlphaNumericInput,
  };
}
