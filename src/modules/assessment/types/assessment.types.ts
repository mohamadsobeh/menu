export type Rating = 1 | 2 | 3 | 4 | 5;
export type Recommendation = 'yes' | 'no' | null;

export interface AssessmentData {
    orderId: string;
    rating: Rating | null;
    recommendation: Recommendation;
    comment: string;
}

export interface AssessmentBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
    onAssessmentSubmitted: (data: AssessmentData) => void;
    onShowOrders?: () => void;
}

export interface AssessmentState {
    rating: Rating | null;
    recommendation: Recommendation;
    comment: string;
    isSubmitting: boolean;
    error: string | null;
}

export interface ThankYouAssessmentBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onShowOrders?: () => void;
}
