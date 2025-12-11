import React from 'react';
import { Copy, FileText, Check } from 'lucide-react';

interface DescriptionResultsProps {
  description: string;
  onCopy: (text: string) => void;
  copiedText: string;
}

const DescriptionResults: React.FC<DescriptionResultsProps> = ({ description, onCopy, copiedText }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">SEO-Optimized Description</h2>
        </div>
        <button
          onClick={() => onCopy(description)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {copiedText === description ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span>{copiedText === description ? 'Copied!' : 'Copy Description'}</span>
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
          {description}
        </pre>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>{description.length} characters</span>
        <span className="text-green-600">✓ SEO Optimized</span>
      </div>
    </div>
  );
};

export default DescriptionResults;