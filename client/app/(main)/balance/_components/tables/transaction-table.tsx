import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { format } from 'date-fns'

import MaskedId from '../masked-id'

interface TransactionTableProps {
  transactions: TTransaction[]
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
          <TableHead className='text-right'>Fee Amount</TableHead>
          <TableHead className='text-right'>Fee Percent</TableHead>
          <TableHead className='text-right'>Net Received</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((trx) => (
          <TableRow key={trx.id}>
            <TableCell className='font-medium'>
              <MaskedId id={trx.id} />
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                {trx.type === 'DEPOSIT' || trx.type === 'SALE' ? (
                  <ArrowDownCircle className='h-4 w-4 text-green-500' />
                ) : (
                  <ArrowUpCircle className='h-4 w-4 text-red-500' />
                )}
                {trx.type}
              </div>
            </TableCell>
            <TableCell className='max-w-[200px] truncate' title={trx.description}>
              {trx.description || '-'}
            </TableCell>
            <TableCell>{format(new Date(trx.createdDate), 'dd/MM/yyyy HH:mm')}</TableCell>
            <TableCell
              className={`text-right font-medium ${
                trx.type === 'DEPOSIT' || trx.type === 'SALE' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trx.type === 'DEPOSIT' || trx.type === 'SALE' ? '+' : '-'}${trx.amount.toFixed(2)}
            </TableCell>
            <TableCell className='text-right'>${trx.feeAmount.toFixed(2)}</TableCell>
            <TableCell className='text-right'>{trx.feePercent}%</TableCell>
            <TableCell className='text-right'>${trx.netReceivedAmount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
