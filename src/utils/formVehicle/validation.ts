import z from 'zod';

import validationCNPJ from '@/services/validationCNPJ';
import validationCPF from '@/services/validationCPF';

export const normalizeDocument = (value: string) => value.replace(/\D/g, '');

export const zodSchema = z
  .object({
    plate: z.string().trim().min(1, 'Placa é obrigatória'),
    renavam: z.string().trim().min(1, 'Renavam é obrigatório'),
    idDocumentIsMandatory: z.boolean(),
    idDocument: z.string().trim().transform(normalizeDocument),
  })
  .superRefine((values, ctx) => {
    const doc = values.idDocument;
    const idDocumentIsMandatory = values.idDocumentIsMandatory;
    if (idDocumentIsMandatory) {
      if (doc.length === 11) {
        if (!validationCPF(doc)) {
          ctx.addIssue({
            code: 'custom',
            message: 'CPF inválido',
            path: ['idDocument'],
            continue: false,
          });
        }
        return;
      }

      if (doc.length === 14) {
        if (!validationCNPJ(doc)) {
          ctx.addIssue({
            code: 'custom',
            message: 'CNPJ inválido',
            path: ['idDocument'],
            continue: false,
          });
        }
        return;
      }

      ctx.addIssue({
        code: 'custom',
        message: 'Informe um CPF ou CNPJ válido',
        path: ['idDocument'],
        continue: false,
      });
    }
  });

export type BodyProtocol = z.infer<typeof zodSchema>;
