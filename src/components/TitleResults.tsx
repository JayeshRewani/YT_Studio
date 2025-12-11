import React from 'react';
import { Copy, Star, TrendingUp, Check } from 'lucide-react';

interface TitleResultsProps {
  titles: Array<{
    title: string;
    score: number;
    emotional: number;
    clarity: number;
    clickbait: number;
  }>;
  onCopy: (text: string) => void;
  copiedText: string;
}

const TitleResults: React.FC<TitleResultsProps> = ({ titles, onCopy, copiedText }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Star className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900">Generated Titles</h2>
      </div>

      <div className="space-y-4">
        {titles.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2 leading-relaxed">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(item.score)}`}>
                    {item.score}/100 - {getScoreText(item.score)}
                  </span>
                  <span>{item.title.length} chars</span>
                </div>
              </div>
              <button
                onClick={() => onCopy(item.title)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg transition-colors"
              >
                {copiedText === item.title ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copiedText === item.title ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Emotional: {item.emotional}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Clarity: {item.clarity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span className="text-gray-600">CTR Potential: {item.clickbait}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleResults;