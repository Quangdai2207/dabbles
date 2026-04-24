import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

const PageNumberItem = ({
  page,
  isActive,
  onClick
}: {
  page: number
  isActive: boolean
  onClick: (page: number) => void
}) => (
  <PaginationItem>
    <PaginationLink onClick={() => onClick(page)} isActive={isActive}>
      {page}
    </PaginationLink>
  </PaginationItem>
)

const Ellipsis = () => (
  <PaginationItem>
    <PaginationEllipsis />
  </PaginationItem>
)

const PaginationItems = ({ currentPage, totalPages, pageClick, prevClick, nextClick }: TPaginationProps) => {
  const items: React.ReactNode[] = []

  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, currentPage + 2)

  // Previous button
  items.push(
    <PaginationItem key='prev' aria-disabled={currentPage === 1}>
      <PaginationPrevious onClick={currentPage > 1 ? prevClick : undefined} />
    </PaginationItem>
  )

  // First page and ellipsis if necessary
  if (startPage > 2) {
    items.push(<PageNumberItem page={1} isActive={currentPage === 1} onClick={pageClick} key={1} />)
    items.push(<Ellipsis key='ellipsis-start' />)
  }

  // Directly show the first page
  if (startPage === 2) {
    items.push(<PageNumberItem page={1} isActive={currentPage === 1} onClick={pageClick} key={1} />)
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    items.push(<PageNumberItem key={i} page={i} isActive={currentPage === i} onClick={pageClick} />)
  }

  // Ellipsis and last page if necessary
  if (endPage < totalPages - 1) {
    items.push(<Ellipsis key='ellipsis-end' />)
    items.push(
      <PageNumberItem page={totalPages} isActive={currentPage === totalPages} onClick={pageClick} key={totalPages} />
    )
  }

  // Directly show the last page
  if (endPage === totalPages - 1) {
    items.push(
      <PageNumberItem page={totalPages} isActive={currentPage === totalPages} onClick={pageClick} key={totalPages} />
    )
  }

  // Next button
  items.push(
    <PaginationItem key='next' aria-disabled={currentPage === totalPages}>
      <PaginationNext onClick={currentPage < totalPages ? nextClick : undefined} />
    </PaginationItem>
  )

  return items
}

const PaginationComponent = ({ totalPages, currentPage, prevClick, nextClick, pageClick }: TPaginationProps) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItems
          currentPage={currentPage}
          totalPages={totalPages}
          pageClick={pageClick}
          prevClick={prevClick}
          nextClick={nextClick}
        />
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationComponent
