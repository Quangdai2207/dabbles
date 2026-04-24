import { create } from 'zustand'

interface CategoryState {
  categories: TCategory[]
  setCategories: (categories: TCategory[] | ((prev: TCategory[]) => TCategory[])) => void
  getCategoryById: (id: string) => TCategory | undefined
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  setCategories: (categories) =>
    set((state) => ({
      categories:
        typeof categories === 'function'
          ? (categories as (prev: TCategory[]) => TCategory[])(state.categories)
          : categories
    })),
  getCategoryById: (id) => get().categories.find((category) => category.id === id)
}))
