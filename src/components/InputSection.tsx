import React, { useState } from 'react';
import { Mic, Sparkles, Target } from 'lucide-react';

interface InputData {
  topic: string;
  videoType: string;
  tone: string;
  maxLength: number;
  keywords: string;
}

interface InputSectionProps {
  onGenerate: (data: InputData) => void;
  isGenerating: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [videoType, setVideoType] = useState('tutorial');
  const [tone, setTone] = useState('clickbait');
  const [maxLength, setMaxLength] = useState(60);
  const [keywords, setKeywords] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ topic, videoType, tone, maxLength, keywords });
  };

  const videoTypes = [
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'vlog', label: 'Vlog' },
    { value: 'review', label: 'Review' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'educational', label: 'Educational' }
  ];

  const tones = [
    { value: 'clickbait', label: '🔥 Clickbait', desc: 'High CTR potential' },
    { value: 'educational', label: '📚 Educational', desc: 'Informative & clear' },
    { value: 'professional', label: '💼 Professional', desc: 'Business-focused' },
    { value: 'humorous', label: '😂 Humorous', desc: 'Fun & engaging' },
    { value: 'motivational', label: '💪 Motivational', desc: 'Inspiring & uplifting' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="h-5 w-5 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-900">Content Input</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Video Topic / Main Idea
          </label>
          <div className="relative">
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How to grow your YouTube channel from 0 to 100k subscribers fast"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="videoType" className="block text-sm font-medium text-gray-700 mb-2">
              Video Type
            </label>
            <select
              id="videoType"
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {videoTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="maxLength" className="block text-sm font-medium text-gray-700 mb-2">
              Max Title Length
            </label>
            <select
              id="maxLength"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={60}>60 characters (recommended)</option>
              <option value={70}>70 characters</option>
              <option value={80}>80 characters</option>
              <option value={100}>100 characters (max)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content Tone
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tones.map((toneOption) => (
              <label
                key={toneOption.value}
                className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  tone === toneOption.value
                    ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={toneOption.value}
                  checked={tone === toneOption.value}
                  onChange={(e) => setTone(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {toneOption.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {toneOption.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Keywords (optional)
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., YouTube growth, subscriber tips, content creator"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Sparkles className="h-5 w-5" />
          <span>{isGenerating ? 'Generating...' : 'Generate Content'}</span>
        </button>
      </form>
    </div>
  );
};

export default InputSection;