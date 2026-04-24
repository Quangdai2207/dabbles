import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import MaskedId from '../masked-id'

type Sale = {
  id: string
  item: string
  amount: number
  date: string
  buyer: string
}

interface SaleTableProps {
  sales: Sale[]
}

export default function SaleTable({ sales }: SaleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sale ID</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Buyer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((s) => (
          <TableRow key={s.id}>
            <TableCell className='font-medium'>
              <MaskedId id={s.id} />
            </TableCell>
            <TableCell>{s.item}</TableCell>
            <TableCell>{s.buyer}</TableCell>
            <TableCell>{s.date}</TableCell>
            <TableCell className='text-right font-medium text-green-600'>+${s.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
