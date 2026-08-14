'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { TrendingUp, Calendar } from 'lucide-react';

interface QuizResult {
  sessionId: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      const response = await fetch(`http://localhost:8000/api/quiz/history/${userId}`);

      if (!response.ok) {
        console.error('Failed to fetch quiz history');
        setLoading(false);
        return;
      }

      const data = await response.json();
      const formattedHistory: QuizResult[] = data.history.map(
        (h: {
          session_id: string;
          score: number;
          total: number;
          percentage: number;
          created_at: string;
        }) => ({
          sessionId: h.session_id,
          score: h.score,
          total: h.total,
          percentage: h.percentage,
          date: new Date(h.created_at).toLocaleDateString(),
        })
      );

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageScore =
    history.length > 0
      ? Math.round(
          (history.reduce((sum, item) => sum + item.percentage, 0) /
            history.length) *
            100
        ) / 100
      : 0;

  const bestScore = history.length > 0 ? Math.max(...history.map((h) => h.percentage)) : 0;
  const totalQuizzes = history.length;

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Quiz History</h1>
          <p className="text-slate-400">Track your progress and improvement over time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Total Quizzes</span>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-3xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-slate-500 mt-2">Quiz sessions completed</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Average Score</span>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-xs text-slate-500 mt-2">Across all sessions</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Best Score</span>
              <div className="text-2xl">🏆</div>
            </div>
            <div className="text-3xl font-bold">{bestScore}%</div>
            <p className="text-xs text-slate-500 mt-2">Personal best</p>
          </div>
        </div>

        {/* History Table */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-6">Session History</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading quiz history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No quiz history yet. Start taking quizzes to see your progress!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Score</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Percentage</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((result, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="py-4 px-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {result.date}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-200 font-semibold">
                        {result.score}/{result.total}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                              style={{ width: `${result.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-200 w-12">
                            {result.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {result.percentage >= 80 && (
                          <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs font-semibold text-green-400">
                            Excellent
                          </span>
                        )}
                        {result.percentage >= 60 && result.percentage < 80 && (
                          <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs font-semibold text-blue-400">
                            Good
                          </span>
                        )}
                        {result.percentage < 60 && (
                          <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-semibold text-yellow-400">
                            Practice More
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
