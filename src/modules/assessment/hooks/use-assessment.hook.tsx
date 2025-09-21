import { useState } from 'react';
import type { AssessmentState, Rating, Recommendation } from '../types';

export const useAssessment = () => {
    const [state, setState] = useState<AssessmentState>({
        rating: null,
        recommendation: null,
        comment: '',
        isSubmitting: false,
        error: null,
    });

    const setRating = (rating: Rating | null) => {
        setState(prev => ({ ...prev, rating, error: null }));
    };

    const setRecommendation = (recommendation: Recommendation) => {
        setState(prev => ({ ...prev, recommendation, error: null }));
    };

    const setComment = (comment: string) => {
        setState(prev => ({ ...prev, comment, error: null }));
    };

    const submitAssessment = async (orderId: string, onSuccess: (data: any) => void, onThankYou: () => void) => {
        if (!state.rating) {
            setState(prev => ({ ...prev, error: 'يرجى اختيار تقييم' }));
            return;
        }

        setState(prev => ({ ...prev, isSubmitting: true, error: null }));

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const assessmentData = {
                orderId,
                rating: state.rating,
                recommendation: state.recommendation,
                comment: state.comment,
            };

            // Mock success
            console.log('Assessment submitted:', assessmentData);
            onSuccess(assessmentData);

            // Show thank you sheet
            onThankYou();

            // Reset form
            setState({
                rating: null,
                recommendation: null,
                comment: '',
                isSubmitting: false,
                error: null,
            });
        } catch (error) {
            setState(prev => ({
                ...prev,
                isSubmitting: false,
                error: 'حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.',
            }));
        }
    };

    const resetAssessment = () => {
        setState({
            rating: null,
            recommendation: null,
            comment: '',
            isSubmitting: false,
            error: null,
        });
    };

    return {
        ...state,
        setRating,
        setRecommendation,
        setComment,
        submitAssessment,
        resetAssessment,
    };
};
