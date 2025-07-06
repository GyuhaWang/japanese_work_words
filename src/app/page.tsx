'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface WordData {
  id: number;
  kanji: string;
  hiragana: string;
  korean: string;
  originalId: string;
}

export default function Home() {
  const [words, setWords] = useState<WordData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [showHiragana, setShowHiragana] = useState(false);
  const [showKorean, setShowKorean] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showHiraganaAnswer = useCallback(() => {
    setShowHiragana(true);
    setShowKorean(false);
    setCompletedWords(prev => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  const showKoreanAnswer = useCallback(() => {
    setShowKorean(true);
    setShowHiragana(false);
    setCompletedWords(prev => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  const previousWord = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev > 0) {
        setShowHiragana(false);
        setShowKorean(false);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const nextWord = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev < words.length - 1) {
        setShowHiragana(false);
        setShowKorean(false);
        return prev + 1;
      }
      return prev;
    });
  }, [words.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowLeft':
        previousWord();
        break;
      case 'ArrowRight':
        nextWord();
        break;
      case 'h':
      case 'H':
        showHiraganaAnswer();
        break;
      case 'k':
      case 'K':
        showKoreanAnswer();
        break;
    }
  }, [previousWord, nextWord, showHiraganaAnswer, showKoreanAnswer]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/words.json');
        const data: WordData[] = await response.json();
        
        setWords(data);
        setIsLoading(false);
      } catch (error) {
        console.error('데이터 로딩 중 오류:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const resetProgress = () => {
    setCurrentIndex(0);
    setCompletedWords(new Set());
    setShowHiragana(false);
    setShowKorean(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto p-5 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            한자 단어장 암기 시스템
          </h1>
          <div className="flex justify-center items-center gap-5 mb-4">
            <button
              onClick={previousWord}
              disabled={currentIndex === 0}
              className="bg-white/20 border-2 border-white/30 text-white px-5 py-2 rounded-full hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="text-white text-xl font-bold">
              {currentIndex + 1} / {words.length}
            </span>
            <button
              onClick={nextWord}
              disabled={currentIndex === words.length - 1}
              className="bg-white/20 border-2 border-white/30 text-white px-5 py-2 rounded-full hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-2xl w-full min-h-[500px] flex flex-col justify-between">
            {/* Kanji Display */}
            <div className="text-center mb-8">
              <div className="text-8xl md:text-9xl font-bold text-gray-800 mb-8 min-h-[120px] flex items-center justify-center drop-shadow-lg">
                {currentWord?.kanji || '데이터가 없습니다'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mb-8 flex-wrap">
              <button
                onClick={showHiraganaAnswer}
                disabled={showHiragana}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                히라가나 보기
              </button>
              <button
                onClick={showKoreanAnswer}
                disabled={showKorean}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                한글 보기
              </button>
            </div>

            {/* Answers */}
            <div className="mb-8">
              {showHiragana && currentWord && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-4 border-l-4 border-purple-500 animate-slideIn">
                  <h3 className="text-purple-600 text-xl font-bold mb-3">히라가나</h3>
                  <div className="text-2xl text-gray-800">{currentWord.hiragana}</div>
                </div>
              )}
              
              {showKorean && currentWord && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-4 border-l-4 border-purple-500 animate-slideIn">
                  <h3 className="text-purple-600 text-xl font-bold mb-3">한글 뜻</h3>
                  <div className="text-xl text-gray-800 leading-relaxed">{currentWord.korean}</div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="text-center">
              <button
                onClick={resetProgress}
                className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all"
              >
                다시 시작
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="bg-white/10 rounded-2xl p-4 text-white flex justify-around flex-wrap gap-4">
            <span className="text-lg font-bold">
              총 단어: {words.length}
            </span>
            <span className="text-lg font-bold">
              학습 완료: {completedWords.size}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
} 