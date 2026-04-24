import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getAllCategoriesService = async (): Promise<TResponseStatusObject<TCategory[]>> => {
  return await handleApiService(http.get(`${ApiBeUrls.category.getAllCategories}`), 'Get categories failed')
}
export default getAllCategoriesService
