import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Target, Award, ChevronRight, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { generateCourseContent } from '../services/gemini';

const TOPICS = [
  "SEO (Search Engine Optimization)",
  "SEM (Search Engine Marketing)",
  "Social Media Marketing",
  "Content Marketing",
  "Email Marketing"
];

export default function CourseDashboard({ email }: { email: string }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizResults, setQuizResults] = useState<{ score: number, total: number } | null>(null);
  const [performance, setPerformance] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/performance/${email}`)
      .then(res => res.json())
      .then(setPerformance)
      .catch(console.error);
  }, [email]);

  const handleTopicSelect = async (topic: string) => {
    setSelectedTopic(topic);
    setLoading(true);
    setQuizMode(false);
    setQuizResults(null);
    
    // Adapt difficulty based on previous performance in this topic
    const topicPerformance = performance.filter(p => p.topic === topic);
    let nextDifficulty = 'Beginner';
    if (topicPerformance.length > 0) {
      const lastScore = topicPerformance[0].score;
      const lastDiff = topicPerformance[0].difficulty;
      
      if (lastScore >= 80) {
        nextDifficulty = lastDiff === 'Beginner' ? 'Intermediate' : 'Advanced';
      } else if (lastScore < 40) {
        nextDifficulty = lastDiff === 'Advanced' ? 'Intermediate' : 'Beginner';
      } else {
        nextDifficulty = lastDiff;
      }
    }
    setDifficulty(nextDifficulty);

    try {
      // Check cache first
      const cacheRes = await fetch(`/api/course-cache?topic=${encodeURIComponent(topic)}&difficulty=${nextDifficulty}`);
      const cachedData = await cacheRes.json();
      
      if (cachedData) {
        setContent(JSON.parse(cachedData.content));
      } else {
        // Generate new content if not cached
        const data = await generateCourseContent(topic, nextDifficulty);
        setContent(data);
        
        // Save to cache
        await fetch('/api/course-cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, difficulty: nextDifficulty, content: data })
        });
      }
    } catch (error) {
      console.error("Content generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = async (score: number, total: number) => {
    const percentage = (score / total) * 100;
    setQuizResults({ score, total });
    
    await fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        topic: selectedTopic,
        score: percentage,
        difficulty
      })
    });

    // Refresh performance
    const res = await fetch(`/api/performance/${email}`);
    const data = await res.json();
    setPerformance(data);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-slate-500">Welcome back, {email}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
            <Award className="text-amber-500" size={20} />
            <span className="font-bold">{performance.length} Modules Completed</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-bold text-lg mb-4">Course Modules</h2>
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicSelect(topic)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between ${
                selectedTopic === topic 
                  ? 'bg-brand text-white shadow-lg' 
                  : 'bg-white hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <span className="font-medium text-sm">{topic}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!selectedTopic ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="card p-12 text-center"
              >
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">Select a module to start learning</h3>
                <p className="text-slate-500">Our AI will generate personalized content based on your progress.</p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="card p-12 text-center"
              >
                <Loader2 size={48} className="mx-auto text-brand animate-spin mb-4" />
                <h3 className="text-xl font-bold mb-2">AI is generating your module...</h3>
                <p className="text-slate-500">Adapting content to {difficulty} level.</p>
              </motion.div>
            ) : content ? (
              <motion.div
                key={selectedTopic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="card p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {difficulty} Level
                      </span>
                      <h2 className="text-3xl font-bold mt-2">{content.title}</h2>
                    </div>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg leading-relaxed text-slate-700">{content.explanation}</p>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Target className="text-brand" size={20} />
                      Industry Trends
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-4">
                      {content.trends.map((trend: string, i: number) => (
                        <li key={i} className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="card p-6">
                    <h3 className="font-bold mb-4">Practice Exercises</h3>
                    <div className="space-y-3">
                      {content.exercises.map((ex: string, i: number) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="bg-brand/10 text-brand w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm text-slate-600">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6 bg-brand text-white">
                    <h3 className="font-bold mb-2">Case Study: {content.caseStudy.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{content.caseStudy.scenario}</p>
                    <div className="bg-white/10 p-4 rounded-xl">
                      <p className="text-xs font-bold uppercase mb-1">The Challenge</p>
                      <p className="text-sm">{content.caseStudy.challenge}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-8 border-2 border-brand/20">
                  {!quizMode ? (
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">Ready to test your knowledge?</h3>
                      <p className="text-slate-500 mb-6">Take the AI-generated quiz to complete this module.</p>
                      <button 
                        onClick={() => setQuizMode(true)}
                        className="bg-brand text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        Start Quiz
                      </button>
                    </div>
                  ) : quizResults ? (
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        {quizResults.score >= quizResults.total / 2 ? (
                          <CheckCircle2 className="text-emerald-500" size={64} />
                        ) : (
                          <XCircle className="text-red-500" size={64} />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        Quiz Result: {quizResults.score} / {quizResults.total}
                      </h3>
                      <p className="text-slate-500 mb-6">
                        {quizResults.score >= quizResults.total / 2 
                          ? "Great job! You've mastered this module." 
                          : "Keep practicing! You can retake the module to improve."}
                      </p>
                      <button 
                        onClick={() => handleTopicSelect(selectedTopic)}
                        className="bg-slate-100 text-slate-800 px-6 py-2 rounded-xl font-medium"
                      >
                        Retake Module
                      </button>
                    </div>
                  ) : (
                    <Quiz questions={content.quiz} onComplete={handleQuizSubmit} />
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Quiz({ questions, onComplete }: { questions: any[], onComplete: (score: number, total: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((acc, ans, i) => {
        return acc + (ans === questions[i].correctAnswer ? 1 : 0);
      }, 0);
      onComplete(score, questions.length);
    }
  };

  const q = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase">Question {currentQuestion + 1} of {questions.length}</span>
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand transition-all duration-300" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <h3 className="text-xl font-bold">{q.question}</h3>
      
      <div className="space-y-3">
        {q.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedOption(i)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedOption === i 
                ? 'border-brand bg-brand/5 shadow-sm' 
                : 'border-slate-100 hover:border-slate-200 bg-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={selectedOption === null}
        onClick={handleNext}
        className="w-full bg-brand disabled:opacity-50 text-white font-bold py-3 rounded-xl"
      >
        {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
}
