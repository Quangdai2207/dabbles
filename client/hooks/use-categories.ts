'use client'

import useSWR from 'swr'
import getAllCategoriesService from '@/services/category/get-all-categories'
import { useCategoryStore } from '@/lib/category-store'

export const useCategories = () => {
  const setCategories = useCategoryStore((state) => state.setCategories)
  const categories = useCategoryStore((state) => state.categories)

  const fetcher = async () => {
    const response = await getAllCategoriesService()
    if (response.isSuccess) {
      return response.data!
    }
    throw new Error(response.errorMessage || 'Failed to fetch categories')
  }

  const { data, error, isLoading, mutate } = useSWR('categories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    onSuccess: (data) => {
      setCategories(data)
    }
  })

  return {
    categories: data || categories, // prioritize SWR data, fallback to store
    isLoading,
    error,
    mutate
  }
}
