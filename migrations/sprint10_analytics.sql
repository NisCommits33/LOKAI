-- Sprint 10: Performance Analytics & User Stats

-- 1. Create user_stats table to cache aggregate performance
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    quizzes_completed INTEGER DEFAULT 0,
    average_score_percentage NUMERIC(5,2) DEFAULT 0,
    readiness_score NUMERIC(5,2) DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    weak_areas JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own stats"
    ON public.user_stats FOR SELECT
    USING (auth.uid() = user_id);

-- 2. Function to update user stats on quiz attempt
CREATE OR REPLACE FUNCTION public.refresh_user_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_total_completed INTEGER;
    v_avg_score NUMERIC;
    v_readiness NUMERIC;
BEGIN
    -- Only count institutional and GK quizzes for readiness/stats for now
    SELECT 
        COUNT(*),
        COALESCE(AVG(score_percentage), 0)
    INTO 
        v_total_completed,
        v_avg_score
    FROM public.quiz_attempts
    WHERE user_id = NEW.user_id;

    -- Readiness score logic: 70% weight on avg score, 30% weight on volume (capped at 50 quizzes)
    v_readiness := (v_avg_score * 0.7) + (LEAST(v_total_completed, 50) * 0.6);

    INSERT INTO public.user_stats (
        user_id, 
        quizzes_completed, 
        average_score_percentage, 
        readiness_score,
        last_activity_at,
        updated_at
    )
    VALUES (
        NEW.user_id,
        v_total_completed,
        v_avg_score,
        LEAST(v_readiness, 100),
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        quizzes_completed = EXCLUDED.quizzes_completed,
        average_score_percentage = EXCLUDED.average_score_percentage,
        readiness_score = EXCLUDED.readiness_score,
        last_activity_at = EXCLUDED.last_activity_at,
        updated_at = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger for quiz_attempts
DROP TRIGGER IF EXISTS trigger_refresh_user_stats ON public.quiz_attempts;
CREATE TRIGGER trigger_refresh_user_stats
AFTER INSERT ON public.quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION public.refresh_user_stats();

-- 4. Initial sync for existing users
INSERT INTO public.user_stats (user_id, quizzes_completed, average_score_percentage, readiness_score)
SELECT 
    user_id,
    COUNT(*),
    AVG(score_percentage),
    (AVG(score_percentage) * 0.7) + (LEAST(COUNT(*), 50) * 0.6)
FROM public.quiz_attempts
GROUP BY user_id
ON CONFLICT (user_id) DO NOTHING;
