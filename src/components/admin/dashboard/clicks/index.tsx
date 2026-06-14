import { upperFirst } from 'lodash';
import { twMerge } from 'tailwind-merge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import InsightsProtocol from '@/interfaces/insightsProtocol';

interface Props {
  className?: string;
  insights: InsightsProtocol[];
}

export default function Clicks({ className, insights }: Props) {
  const handleFormatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'medium',
    });
  };

  return (
    <div className={twMerge('w-full flex flex-col gap-4', className)}>
      <div className='w-full overflow-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Página</TableHead>
              <TableHead>Click</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Horário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insights.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{upperFirst(item.page)}</TableCell>
                <TableCell className='whitespace-nowrap'>
                  {item.clicks || '-'}
                </TableCell>
                <TableCell className='whitespace-nowrap'>
                  {item.location || '-'}
                </TableCell>
                <TableCell className='whitespace-nowrap'>
                  {item.createdIn ? handleFormatDate(item.createdIn) : '-'} {/* eslint-disable-line */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <h2 className='text-center text-sm text-5e5e5e'>
        Uma lista de todos os pagamentos gerados na base de dados.
      </h2>
    </div>
  );
}
