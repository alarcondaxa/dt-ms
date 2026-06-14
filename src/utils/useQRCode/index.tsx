'use client';

import { useCallback, useEffect, useState } from 'react';

import { deburr } from 'lodash';
import { QrCodePix } from 'qrcode-pix';

import createPayment from '@/db/actions/payments/createPayment';
import updatePayment from '@/db/actions/payments/updatePayment';
import getClientLocation from '@/functions/getClientLocation';
import PixProtocol from '@/interfaces/pixProtocol';

import { useToastSweetalert2Context } from '../toastSweetalert2Context/useContext';

interface Props extends PixProtocol {
  value: number;
  plate: string;
  renavam: string;
}

export default function useQRCode({
  pixKey,
  pixName,
  value,
  plate,
  renavam,
}: Props) {
  const [QRData, seQRData] = useState({
    src: '',
    name: '',
  });
  const [initialRender, setInitialRender] = useState(true);
  const [paymentId, setPaymentId] = useState('');
  const { setToast } = useToastSweetalert2Context();

  const handleQRCode = useCallback(
    async (qrCodePix: {
      payload: () => string;
      base64: (options?: any) => Promise<string>;
    }) => {
      try {
        const name = qrCodePix.payload();
        const src = await qrCodePix.base64();
        seQRData({
          name,
          src,
        });
        const clientLocation = await getClientLocation();
        const createdPaymentId = await createPayment({
          copied: false,
          location: clientLocation,
          value,
          plate,
          renavam,
        });
        if (createdPaymentId) setPaymentId(createdPaymentId);
      } catch (err) { } //eslint-disable-line
    },
    [value, plate, renavam]
  );

  useEffect(() => {
    if (initialRender) {
      const clearName = deburr(pixName.replace(/\s/g, ''));
      const qrCodePix = QrCodePix({
        version: '01',
        key: pixKey, //or any PIX key
        name: clearName,
        city: 'Campo Grande - MS',
        transactionId: Date.now().toString(), //max 25 characters
        cep: '79114901',
        value,
      });
      handleQRCode(qrCodePix);
      setInitialRender(false);
    }
  }, [initialRender, pixKey, pixName, value, handleQRCode]);

  const handleCopy = async () => {
    try {
      if (QRData) navigator.clipboard.writeText(QRData.name);
      setToast({
        icon: 'success',
        message: 'Código PIX copiado!',
      });
      await updatePayment(paymentId, { copied: true });
    } catch (err) { } // eslint-disable-line
  };

  return { QRData, handleCopy };
}
