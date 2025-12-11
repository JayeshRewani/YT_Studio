import React from 'react';
import { Hash, Copy, Check, TrendingUp } from 'lucide-react';

interface TagResultsProps {
  tags: Array<{
    tag: string;
    competition: 'high' | 'medium' | 'low';
    trending: boolean;
  }>;
  onCopy: (text: string) => void;
  copiedText: string;
}

const TagResults: React.FC<TagResultsProps> = ({ tags, onCopy, copiedText }) => {
  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allTags = tags.map(t => t.tag).join(', ');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Hash className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tags & Hashtags</h2>
        </div>
        <button
          onClick={() => onCopy(allTags)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          {copiedText === allTags ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span>{copiedText === allTags ? 'Copied!' : 'Copy All Tags'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tagItem, index) => (
          <span
            key={index}
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getCompetitionColor(tagItem.competition)}`}
          >
            <span>#{tagItem.tag}</span>
            {tagItem.trending && <TrendingUp className="h-3 w-3" />}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-green-600 font-semibold">
            {tags.filter(t => t.competition === 'low').length}
          </div>
          <div className="text-gray-600">Low Competition</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-600 font-semibold">
            {tags.filter(t => t.competition === 'medium').length}
          </div>
          <div className="text-gray-600">Medium Competition</div>
        </div>
        <div className="text-center">
          <div className="text-red-600 font-semibold">
            {tags.filter(t => t.competition === 'high').length}
          </div>
          <div className="text-gray-600">High Competition</div>
        </div>
      </div>
    </div>
  );
};

export default TagResults;