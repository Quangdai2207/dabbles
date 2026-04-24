import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import MaskedId from '../masked-id'

type Purchase = {
  id: string
  item: string
  amount: number
  date: string
  seller: string
}

interface PurchaseTableProps {
  purchases: Purchase[]
}

export default function PurchaseTable({ purchases }: PurchaseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((p) => (
          <TableRow key={p.id}>
            <TableCell className='font-medium'>
              <MaskedId id={p.id} />
            </TableCell>
            <TableCell>{p.item}</TableCell>
            <TableCell>{p.seller}</TableCell>
            <TableCell>{p.date}</TableCell>
            <TableCell className='text-right font-medium'>-${p.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
