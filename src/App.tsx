import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import InputSection from './components/InputSection';
import TitleResults from './components/TitleResults';
import DescriptionResults from './components/DescriptionResults';
import TagResults from './components/TagResults';
import KeywordSuggestions from './components/KeywordSuggestions';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { generateContent } from './utils/aiGenerator';
import { useAuth } from './contexts/AuthContext';

interface GenerationResults {
  titles: Array<{
    title: string;
    score: number;
    emotional: number;
    clarity: number;
    clickbait: number;
  }>;
  description: string;
  tags: Array<{
    tag: string;
    competition: 'high' | 'medium' | 'low';
    trending: boolean;
  }>;
  keywords: Array<{
    keyword: string;
    volume: string;
    difficulty: 'easy' | 'medium' | 'hard';
    trending: boolean;
  }>;
}

const MainApp = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResults | null>(null);
  const [copiedText, setCopiedText] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (data: {
    topic: string;
    videoType: string;
    tone: string;
    maxLength: number;
    keywords: string;
  }) => {
    if (!user) return;

    setIsGenerating(true);
    setError('');
    
    try {
      // Generate content using backend API
      const generationResults = await generateContent(data);
      
      setResults(generationResults);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to generate content. Please try again.');
      } else {
        setError('Failed to generate content. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered YouTube SEO Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create engaging, SEO-optimized titles and descriptions that boost your click-through rates, 
            improve search rankings, and grow your YouTube channel faster.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InputSection onGenerate={handleGenerate} isGenerating={isGenerating} />
            
            {isGenerating && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating your SEO-optimized content...</p>
              </div>
            )}
            
            {results && !isGenerating && (
              <>
                <TitleResults 
                  titles={results.titles} 
                  onCopy={handleCopy}
                  copiedText={copiedText}
                />
                <DescriptionResults 
                  description={results.description}
                  onCopy={handleCopy}
                  copiedText={copiedText}
                />
                <TagResults 
                  tags={results.tags}
                  onCopy={handleCopy}
                  copiedText={copiedText}
                />
              </>
            )}
          </div>

          <div className="space-y-8">
            {results && !isGenerating && (
              <KeywordSuggestions 
                keywords={results.keywords}
                onCopy={handleCopy}
                copiedText={copiedText}
              />
            )}
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Pro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use power words like "Ultimate", "Complete", "Secret"</li>
                <li>• Include numbers and specific benefits</li>
                <li>• Keep titles under 60 characters for mobile</li>
                <li>• Add emotional triggers and urgency</li>
                <li>• Use relevant keywords naturally</li>
                <li>• Test different titles with A/B testing</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">🚀 Boost Your Channel</h3>
              <p className="text-sm text-red-700 mb-4">
                Want to take your YouTube growth to the next level? Our AI generates content that actually converts.
              </p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full bg-gray-100 border-t border-gray-200 py-4 mt-8 text-center">
        <span className="text-gray-600 text-sm">
          About the developer :  
          <a
            href="https://www.linkedin.com/in/jayesh-rewani-9b463632a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:underline font-semibold"
          >
            <span className="text-red-600 hover:underline font-semibold">Jayesh Rewani</span>
          </a>
        </span>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;