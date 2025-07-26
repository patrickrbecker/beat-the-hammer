'use client';

import { useEffect } from 'react';
import { Twitter, ExternalLink } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Twitter className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Beat the Hammer
            </h1>
          </div>
          <p className="text-slate-300 text-lg mb-4">
            Follow @BeatHammer for the latest updates
          </p>
          <a
            href="https://x.com/beathammer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on X/Twitter
          </a>
        </div>

        {/* Twitter Feed */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="twitter-timeline-container">
            <a 
              className="twitter-timeline" 
              data-theme="dark"
              data-chrome="noheader nofooter noborders"
              data-tweet-limit="10"
              href="https://twitter.com/beathammer?ref_src=twsrc%5Etfw"
            >
              Tweets by beathammer
            </a>
          </div>
          
          {/* Fallback content */}
          <noscript>
            <div className="text-center py-12">
              <Twitter className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                JavaScript Required
              </h3>
              <p className="text-slate-400 mb-4">
                Enable JavaScript to view the Twitter feed
              </p>
              <a
                href="https://x.com/beathammer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on X/Twitter
              </a>
            </div>
          </noscript>
        </div>

        {/* Loading state */}
        <div id="twitter-loading" className="text-center py-8 text-slate-400">
          <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
          Loading tweets...
        </div>
      </div>
    </div>
  );
}
