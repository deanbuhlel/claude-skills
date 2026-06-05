'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';
import { Loader2, MessageSquareText, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function SummarizerForm() {
  const [conversation, setConversation] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabaseClient
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5); // Fetch last 5 summaries

    if (error) {
      console.error('Error fetching history:', error.message);
    } else {
      setHistory(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummary('');
    setError('');

    if (!conversation.trim()) {
      setError('Please enter a conversation to summarize.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to summarize conversation.');
      }

      const data = await response.json();
      setSummary(data.summary);
      setConversation(''); // Clear input after successful summarization
      fetchHistory(); // Refresh history
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-3xl font-display font-semibold mb-6 text-primary-800 flex items-center">
          <MessageSquareText className="mr-3 text-accent" size={32} /> Summarize Conversation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="conversation" className="block text-lg font-medium text-gray-700 mb-2">
              Paste your long conversation here:
            </label>
            <textarea
              id="conversation"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-y min-h-[200px] text-gray-800 bg-gray-50"
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder="e.g., 'User: Can you explain quantum physics? AI: Quantum physics is a fundamental theory in physics...'"
              rows="10"
            ></textarea>
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Get Summary'
            )}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 flex flex-col">
        <h2 className="text-3xl font-display font-semibold mb-6 text-primary-800 flex items-center">
          <History className="mr-3 text-accent" size={32} /> Summary & History
        </h2>
        <div className="flex-grow">
          {summary ? (
            <div className="bg-primary-50 p-6 rounded-lg border border-primary-200 animate-slide-up">
              <h3 className="text-xl font-display font-medium mb-3 text-primary-700">Generated Summary:</h3>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Your summary will appear here.</p>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-display font-medium mb-4 text-primary-700">Recent Summaries:</h3>
            {history.length > 0 ? (
              <ul className="space-y-4">
                {history.map((item) => (
                  <li key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    <details className="cursor-pointer">
                      <summary className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                        View Summary
                      </summary>
                      <div className="prose max-w-none text-gray-700 mt-2 pl-4 border-l-2 border-primary-200">
                        <ReactMarkdown>{item.summary}</ReactMarkdown>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No recent summaries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
