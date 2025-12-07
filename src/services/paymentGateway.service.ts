import { createApiService } from './base.service'
import type { PaymentGateway } from '@/types/settings/paymentGateway'

// Response interface for payment gateways API
export interface PaymentGatewayResponse {
    data: PaymentGateway[]
}

// Create the base paymentGateways API service
const paymentGatewaysApiService = createApiService<PaymentGateway>('/payment-gateways')


/**
 * Extended Payment Gateways API with custom methods
 */
export const paymentGatewaysApi = {
    // Custom methods
    getAll: (): Promise<PaymentGatewayResponse> =>
        paymentGatewaysApiService.customGet(''),
    getById: paymentGatewaysApiService.getById.bind(paymentGatewaysApiService),
    create: paymentGatewaysApiService.create.bind(paymentGatewaysApiService),
    update: paymentGatewaysApiService.update.bind(paymentGatewaysApiService),

}
