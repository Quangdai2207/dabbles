import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'
import { handleApiService } from '@/lib/api-service-helper'

const getAllPlansService = async (): Promise<TResponseStatusObject<TSubscriptionPlan[]>> => {
  return handleApiService(http.get(ApiBeUrls.subscriptionPlan.getAllPlans), 'Get all plans failed')
}

export default getAllPlansService
