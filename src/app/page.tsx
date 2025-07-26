'use client';

import { useEffect } from 'react';
import { Twitter, ExternalLink } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount
      try {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      } catch {
        // Script might already be removed
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        {/* Twitter Feed Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Method 1: Timeline Embed */}
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Twitter className="w-5 h-5 text-blue-400" />
              Twitter Timeline
            </h2>
            <div className="twitter-embed-container">
              <a 
                className="twitter-timeline" 
                data-theme="dark"
                data-chrome="noheader nofooter noborders"
                data-tweet-limit="5"
                data-height="500"
                href="https://twitter.com/beathammer?ref_src=twsrc%5Etfw"
              >
                Tweets by @beathammer
              </a>
            </div>
          </div>

          {/* Method 2: Single Tweet Embed (if timeline fails) */}
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Latest Updates</h2>
            
            {/* Manual fallback content */}
            <div className="space-y-4">
              <div className="text-center py-8">
                <Twitter className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  @BeatHammer Feed
                </h3>
                <p className="text-slate-400 mb-4">
                  Check out the latest Beat the Hammer updates and game results
                </p>
                <div className="space-y-3">
                  <a
                    href="https://x.com/beathammer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Follow @BeatHammer
                  </a>
                  <a
                    href="https://x.com/search?q=from%3Abeathammer&src=typed_query&f=live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View All Tweets
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative: Direct embed iframe */}
        <div className="mt-8 bg-slate-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Alternative Feed</h2>
          <div className="relative w-full" style={{ height: '600px' }}>
            <iframe
              src="https://syndication.twitter.com/srv/timeline-profile/screen-name/beathammer?dnt=true&embedId=twitter-widget-0&features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3BpdmV0c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYmFja2ZpbGwiLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2xlZ2FjeV90aW1lbGluZV9zdW5zZXQiOnsiYnVja2V0Ijp0cnVlLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3R3ZWV0X2VkaXRfZnJvbnRlbmQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfX0%3D&frame=false&hideBorder=false&hideFooter=false&hideHeader=false&hideScrollBar=false&lang=en&origin=https%3A%2F%2Fbeat-the-hammer.vercel.app&sessionId=a1b2c3d4e5f6g7h8i9j0&showHeader=true&showReplies=false&transparent=false&widgetsVersion=2615f7e52b7e0%3A1702314776716"
              className="w-full h-full rounded-lg"
              style={{ 
                border: 'none',
                maxWidth: '100%',
                minHeight: '600px',
                colorScheme: 'dark'
              }}
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="lazy"
              title="Twitter Timeline for @beathammer"
            />
          </div>
        </div>

        {/* Fallback Message */}
        <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
          <div className="text-center">
            <Twitter className="w-8 h-8 mx-auto mb-3 text-blue-400" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Having trouble viewing the feed?
            </h3>
            <p className="text-slate-300 mb-4">
              Twitter embeds can sometimes have loading issues. Visit the profile directly for the most up-to-date content.
            </p>
            <a
              href="https://x.com/beathammer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open @BeatHammer on X/Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
