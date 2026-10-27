import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ALL_QUIZ_QUESTIONS } from '../data/quiz';
import { TOPICS } from '../data/topics';
import { storage } from '../lib/storage';
import { QuizQuestion } from '../types/content';

interface ShuffledQuestion extends QuizQuestion {
  shuffledOptions: string[];
  shuffledAnswerIndex: number;
}

export const QuizPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] = useState<string>(slug || 'all');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Filter and shuffle questions
  const filteredQuestions: ShuffledQuestion[] = useMemo(() => {
    const raw =
      selectedTopic === 'all'
        ? ALL_QUIZ_QUESTIONS
        : ALL_QUIZ_QUESTIONS.filter((q) => q.topic === selectedTopic);

    // Shuffle options while updating answerIndex
    return raw.map((q) => {
      const originalCorrectOption = q.options[q.answerIndex];
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      const newIndex = shuffled.indexOf(originalCorrectOption);
      return {
        ...q,
        shuffledOptions: shuffled,
        shuffledAnswerIndex: newIndex,
      };
    });
  }, [selectedTopic]);

  const currentQ = filteredQuestions[currentQIndex];
  const totalQuestions = filteredQuestions.length;
  const bestScores = storage.getQuizScores();
  const currentBest = bestScores[selectedTopic]?.bestScore;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.shuffledAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < totalQuestions) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Count the last answer correctly before finishing
      const lastAnswerCorrect = selectedOption === currentQ.shuffledAnswerIndex ? 1 : 0;
      const finalScore = score + lastAnswerCorrect;
      setQuizFinished(true);
      // Update score state to reflect the last answer
      setScore(finalScore);
      storage.saveQuizScore(selectedTopic, finalScore, totalQuestions);
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const changeTopicFilter = (newTopic: string) => {
    setSelectedTopic(newTopic);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-lg text-[var(--ink)] flex items-center gap-2">
            <CheckSquare size={20} className="text-[var(--signal)]" />
            <span>Computer Networks Practice Quiz</span>
          </div>
          <div className="text-xs text-[var(--muted)] font-serif mt-0.5">
            42 strict exam-derived questions with instant explanations
          </div>
        </div>

        {/* Topic filter dropdown */}
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-[var(--muted)]" />
          <select
            value={selectedTopic}
            onChange={(e) => changeTopicFilter(e.target.value)}
            className="px-2.5 py-1 rounded border border-[var(--rule)] bg-[var(--surface)] text-xs font-sans text-[var(--ink)]"
          >
            <option value="all">All Topics (42 Questions)</option>
            {TOPICS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Finished Summary View */}
      {quizFinished ? (
        <div className="p-6 sm:p-8 rounded-lg bg-[var(--surface)] border border-[var(--rule)] text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[var(--mark)]/20 text-[#8A6D00] dark:text-[#FFD84D] flex items-center justify-center mx-auto">
            <Trophy size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)]">Quiz Completed!</h2>
            <div className="text-sm text-[var(--muted)] mt-1 font-serif">
              You scored <span className="font-bold text-[var(--ink)]">{score}</span> out of{' '}
              <span className="font-bold text-[var(--ink)]">{totalQuestions}</span> questions.
            </div>
            {currentBest !== undefined && (
              <div className="text-xs text-[var(--signal)] font-mono mt-1 font-bold">
                Saved Best Score: {Math.max(currentBest, score)} / {totalQuestions}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded bg-[var(--packet)] text-white text-xs font-sans font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90"
            >
              <RotateCcw size={14} />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded border border-[var(--rule)] text-xs font-sans font-bold text-[var(--ink)] hover:bg-[var(--paper)]"
            >
              Return Home
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* Active Question Card */
        <div className="p-5 sm:p-7 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-5">
          {/* Progress bar and counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
              <span>
                Question {currentQIndex + 1} of {totalQuestions}
              </span>
              <span>Score: {score}</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--paper)] rounded-full overflow-hidden border border-[var(--rule)]">
              <div
                className="h-full bg-[var(--signal)] transition-all duration-300"
                style={{
                  width: `${((currentQIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
              {currentQ.topic.split('-').join(' ')}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--ink)] font-sans leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* 4 Shuffled Options */}
          <div className="space-y-2.5">
            {currentQ.shuffledOptions.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.shuffledAnswerIndex;

              let optionStyle =
                'border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--packet)]';

              if (isAnswered) {
                if (isCorrect) {
                  optionStyle =
                    'border-[var(--signal)] bg-[var(--signal)]/15 text-[var(--ink)] font-bold';
                } else if (isSelected && !isCorrect) {
                  optionStyle =
                    'border-[var(--alert)] bg-[var(--alert)]/15 text-[var(--alert)] font-bold';
                } else {
                  optionStyle = 'opacity-40 border-[var(--rule)] bg-[var(--paper)]';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm font-sans transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-mono text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrect && (
                        <CheckCircle2
                          size={18}
                          className="text-[var(--signal)] shrink-0"
                        />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle size={18} className="text-[var(--alert)] shrink-0" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback & Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-2 animate-slide-up">
              <div className="flex items-center gap-2 text-xs font-bold font-sans">
                {selectedOption === currentQ.shuffledAnswerIndex ? (
                  <span className="text-[var(--signal)] flex items-center gap-1">
                    <CheckCircle2 size={15} /> Correct Answer!
                  </span>
                ) : (
                  <span className="text-[var(--alert)] flex items-center gap-1">
                    <XCircle size={15} /> Incorrect
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink)] font-serif leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded bg-[var(--packet)] text-white font-sans font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                >
                  <span>
                    {currentQIndex + 1 === totalQuestions
                      ? 'Finish Quiz'
                      : 'Next Question'}
                  </span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-[var(--muted)]">
          No questions available for this topic filter.
        </div>
      )}
    </div>
  );
};
