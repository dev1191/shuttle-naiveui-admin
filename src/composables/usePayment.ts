import { PaymentStatus } from "@/types"


export function usePayments() {
    function getStatusColor(status: PaymentStatus) {
        switch (status) {
            case PaymentStatus.Processing:
                return 'info'
            case PaymentStatus.Completed:
                return 'success'
            case PaymentStatus.Pending:
                return 'warning'
            case PaymentStatus.Failed:
                return 'error'
            case PaymentStatus.Refunded:
                return 'primary'
            case PaymentStatus.Cancelled:
                return 'error'
        }
    }
    return {
        getStatusColor,
    }
}