import React from 'react';
import { Search, TrendingUp, Copy, Check } from 'lucide-react';

interface KeywordSuggestionsProps {
  keywords: Array<{
    keyword: string;
    volume: string;
    difficulty: 'easy' | 'medium' | 'hard';
    trending: boolean;
  }>;
  onCopy: (text: string) => void;
  copiedText: string;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({ keywords, onCopy, copiedText }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allKeywords = keywords.map(k => k.keyword).join(', ');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Keyword Suggestions</h2>
        </div>
        <button
          onClick={() => onCopy(allKeywords)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          {copiedText === allKeywords ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span>{copiedText === allKeywords ? 'Copied!' : 'Copy Keywords'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {keywords.map((keyword, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">{keyword.keyword}</span>
              {keyword.trending && (
                <TrendingUp className="h-4 w-4 text-red-500" title="Trending" />
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{keyword.volume}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                {keyword.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordSuggestions;