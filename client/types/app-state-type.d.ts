type TPaginationState = {
  pageIndex: number
  pageSize: number
}

type TPaginationProps = {
  totalPages: number
  currentPage: number
  prevClick: () => void
  nextClick: () => void
  pageClick: (page: number) => void
}
