'use client';

import { useEffect, useState } from 'react';
import { Twitter, Heart, MessageCircle, Repeat, ExternalLink } from 'lucide-react';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: string;
}

export default function TweetFeed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/tweets');
      const data = await response.json();
      setTweets(data.tweets || []);
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-slate-400">Loading tweets...</p>
        </div>
      </div>
    );
  }

  if (error || tweets.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="text-center py-8">
          <Twitter className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Tweets Unavailable
          </h3>
          <p className="text-slate-400 mb-4">
            Unable to load tweets at the moment. Visit the profile directly.
          </p>
          <a
            href="https://x.com/BeatHammer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on X/Twitter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Twitter className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Latest from @BeatHammer</h2>
      </div>
      
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">{tweet.author}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400 text-sm">{formatDate(tweet.created_at)}</span>
                </div>
                <p className="text-white leading-relaxed mb-3">{tweet.text}</p>
                <div className="flex items-center gap-6 text-slate-400">
                  <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Reply</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-400 transition-colors">
                    <Repeat className="w-4 h-4" />
                    <span className="text-sm">Repost</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Like</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <a
          href="https://x.com/BeatHammer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          View more on X/Twitter
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}