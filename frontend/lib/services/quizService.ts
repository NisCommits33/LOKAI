import { supabase } from '../supabase/client'

export interface QuizQuestion {
    id: string | number
    question: string
    options: string[]
    correct_index: number
    explanation?: string
}

export interface GKQuiz {
    id: string
    title: string
    description: string
    category: string
    difficulty: 'easy' | 'medium' | 'hard'
    questions: QuizQuestion[]
    total_questions: number
    times_taken: number
    average_score: number
    created_at: string
}

export interface QuizAttempt {
    id?: string
    user_id: string
    source_type: 'gk' | 'personal' | 'organization'
    source_id: string
    total_questions: number
    correct_answers: number
    score_percentage: number
    time_spent_seconds: number
    questions_attempted: any // JSON structure of questions
    answers: number[] // Indices of user answers
}

export const quizService = {
    /**
     * Fetch all active GK quizzes
     */
    async getGKQuizzes() {
        const { data, error } = await supabase
            .from('gk_quizzes')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as GKQuiz[]
    },

    /**
     * Fetch a specific quiz by ID
     */
    async getQuizById(id: string) {
        const { data, error } = await supabase
            .from('gk_quizzes')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as GKQuiz
    },

    /**
     * Submit a quiz attempt
     */
    async submitAttempt(attempt: Omit<QuizAttempt, 'id'>) {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert([attempt])
            .select()
            .single()

        if (error) {
            console.error("Supabase Error in submitAttempt:", error)
            throw error
        }
        return data
    },

    /**
     * Fetch user's recent quiz history
     */
    async getUserHistory(userId: string, limit = 10) {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error("Supabase Error in getUserHistory:", error)
            throw error
        }
        return data
    }
}
