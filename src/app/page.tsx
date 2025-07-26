'use client';

import { useEffect, useState } from 'react';
import { Twitter, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => Promise<void>;
      };
    };
  }
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Remove any existing loading indicator after Twitter widgets load
    const hideLoading = () => {
      const loadingElement = document.getElementById('twitter-loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      setIsLoading(false);
    };

    // Check if Twitter widgets script is already loaded
    if (window.twttr) {
      window.twttr.widgets.load().then(hideLoading);
      return;
    }

    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    
    script.onload = () => {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load().then(hideLoading);
      }
    };

    script.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    document.body.appendChild(script);

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      try {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      } catch {
        // Script might already be removed
      }
    };
  }, [isLoading]);

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
          <div className="twitter-timeline-container" style={{ minHeight: '600px' }}>
            <a 
              className="twitter-timeline" 
              data-theme="dark"
              data-chrome="noheader nofooter noborders"
              data-tweet-limit="10"
              data-width="100%"
              data-height="600"
              data-dnt="true"
              href="https://twitter.com/beathammer?ref_src=twsrc%5Etfw"
            >
              Tweets by beathammer
            </a>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div id="twitter-loading" className="text-center py-8 text-slate-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading tweets...
            </div>
          )}

          {/* Error state */}
          {hasError && (
            <div className="text-center py-12">
              <Twitter className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Unable to Load Tweets
              </h3>
              <p className="text-slate-400 mb-4">
                There was an issue loading the Twitter feed. Please visit the profile directly.
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
          )}

          {/* Fallback for no JavaScript */}
          <noscript>
            <div className="text-center py-12">
              <Twitter className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                JavaScript Required
              </h3>
              <p className="text-slate-400 mb-4">
                Enable JavaScript to view the Twitter feed, or visit the profile directly.
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
      </div>
    </div>
  );
}
