'use client';

import { Twitter, ExternalLink, ArrowRight } from 'lucide-react';
import TweetFeed from '@/components/TweetFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Twitter className="w-16 h-16 text-blue-400" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Beat the Hammer
            </h1>
          </div>
          <p className="text-slate-300 text-xl mb-8">
            Follow @BeatHammer for the latest game updates and results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Call to Action & Links */}
          <div className="space-y-6">
            {/* Main Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-center">
              <Twitter className="w-10 h-10 mx-auto mb-3 text-white" />
              <h2 className="text-xl font-bold text-white mb-3">
                Follow on X/Twitter
              </h2>
              <p className="text-blue-100 mb-4 text-sm">
                Get real-time updates directly from @BeatHammer
              </p>
              <a
                href="https://x.com/beathammer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Follow @BeatHammer
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <a
                href="https://x.com/beathammer"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="font-semibold text-white">Profile</h3>
                    <p className="text-slate-400 text-sm group-hover:text-slate-300">
                      View complete profile and all tweets
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://x.com/search?q=from%3Abeathammer&src=typed_query&f=live"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-white">Live Search</h3>
                    <p className="text-slate-400 text-sm group-hover:text-slate-300">
                      Real-time chronological updates
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* About Section */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">
                About Beat the Hammer
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Stay updated with the latest results, commentary, and announcements from 
                the Beat the Hammer games.
              </p>
            </div>
          </div>

          {/* Right Column - Tweet Feed */}
          <div>
            <TweetFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
