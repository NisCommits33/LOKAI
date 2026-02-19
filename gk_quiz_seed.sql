-- Seed Data for GK Quizzes

-- 1. Nepal History Quiz
INSERT INTO gk_quizzes (title, description, category, difficulty, total_questions, questions)
VALUES (
    'Nepal History: The Unification Era',
    'Test your knowledge on the unification of Nepal and the Shah dynasty.',
    'History',
    'medium',
    5,
    '[
        {
            "id": 1,
            "question": "Who is known as the Great Unifier of Nepal?",
            "options": ["Prithvi Narayan Shah", "Jung Bahadur Rana", "Tribhuvan", "Birendra"],
            "correct_index": 0,
            "explanation": "King Prithvi Narayan Shah of Gorkha started the unification campaign of Nepal in 1744 AD."
        },
        {
            "id": 2,
            "question": "In which year was the Treaty of Sugauli signed?",
            "options": ["1814", "1815", "1816", "1817"],
            "correct_index": 2,
            "explanation": "The Treaty of Sugauli was signed in 1816 after the Anglo-Nepalese War."
        },
        {
            "id": 3,
            "question": "Who was the first Prime Minister of Nepal?",
            "options": ["Bhimsen Thapa", "Jung Bahadur Rana", "Matrika Prasad Koirala", "B.P. Koirala"],
            "correct_index": 0,
            "explanation": "Bhimsen Thapa served as the first Prime Minister of Nepal from 1806 to 1837."
        },
        {
            "id": 4,
            "question": "The Kot Massacre occurred in which year?",
            "options": ["1840", "1846", "1850", "1860"],
            "correct_index": 1,
            "explanation": "The Kot Massacre took place on September 14, 1846, marking the rise of Rana rule."
        },
        {
            "id": 5,
            "question": "Who was the last King of the Shah Dynasty?",
            "options": ["Birendra", "Dipendra", "Gyanendra", "Mahendra"],
            "correct_index": 2,
            "explanation": "King Gyanendra Shah was the last monarch of Nepal before it became a republic in 2008."
        }
    ]'::JSONB
);

-- 2. Nepal Geography Quiz
INSERT INTO gk_quizzes (title, description, category, difficulty, total_questions, questions)
VALUES (
    'Geography of Nepal: Peaks and Rivers',
    'An overview of Nepal''s unique topography, mountains, and water systems.',
    'Geography',
    'easy',
    5,
    '[
        {
            "id": 1,
            "question": "What is the height of Mount Everest as officially recognized today?",
            "options": ["8848m", "8848.86m", "8850m", "8844m"],
            "correct_index": 1,
            "explanation": "The height of Mt. Everest was updated to 8848.86m in 2020 by Nepal and China."
        },
        {
            "id": 2,
            "question": "Which is the longest river in Nepal?",
            "options": ["Koshi", "Gandaki", "Karnali", "Bagmati"],
            "correct_index": 2,
            "explanation": "Karnali is the longest river in Nepal."
        },
        {
            "id": 3,
            "question": "How many districts are there in Nepal?",
            "options": ["75", "77", "78", "80"],
            "correct_index": 1,
            "explanation": "Nepal is currently divided into 77 districts across 7 provinces."
        },
        {
            "id": 4,
            "question": "Which is the deepest lake in Nepal?",
            "options": ["Rara Lake", "Phoksundo Lake", "Fewas Lake", "Tilicho Lake"],
            "correct_index": 1,
            "explanation": "Shey-Phoksundo Lake in Dolpa is the deepest lake in Nepal."
        },
        {
            "id": 5,
            "question": "Nepal shares its southern border with which country?",
            "options": ["China", "India", "Bhutan", "Bangladesh"],
            "correct_index": 1,
            "explanation": "Nepal is bordered by India on the south, east, and west."
        }
    ]'::JSONB
);
