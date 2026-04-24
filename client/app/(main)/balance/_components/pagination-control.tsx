'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import PaginationComponent from '@/app/(main)/_components/pagination'

interface PaginationControlProps {
  totalPages: number
  currentPage: number
}

export default function PaginationControl({ totalPages, currentPage }: PaginationControlProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  if (totalPages <= 1) return null

  return (
    <PaginationComponent
      totalPages={totalPages}
      currentPage={currentPage}
      pageClick={handlePageChange}
      nextClick={handleNextClick}
      prevClick={handlePrevClick}
    />
  )
}
