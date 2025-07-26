'use client';

import { Twitter, ExternalLink, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
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

        {/* Main Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-center">
          <Twitter className="w-12 h-12 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold text-white mb-4">
            View Live Updates on X/Twitter
          </h2>
          <p className="text-blue-100 mb-6">
            Get real-time game results, updates, and commentary directly from @BeatHammer
          </p>
          <a
            href="https://x.com/beathammer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Follow @BeatHammer
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a
            href="https://x.com/beathammer"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-800/70 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Twitter className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Profile</h3>
            </div>
            <p className="text-slate-400 group-hover:text-slate-300">
              Visit the main @BeatHammer profile to see all tweets and updates
            </p>
          </a>

          <a
            href="https://x.com/search?q=from%3Abeathammer&src=typed_query&f=live"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-800/70 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <ExternalLink className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Live Feed</h3>
            </div>
            <p className="text-slate-400 group-hover:text-slate-300">
              View real-time tweets and updates in chronological order
            </p>
          </a>
        </div>

        {/* About Section */}
        <div className="bg-slate-800/30 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">
            About Beat the Hammer
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Stay updated with the latest results, commentary, and announcements from 
            the Beat the Hammer games. Follow @BeatHammer on X/Twitter for real-time updates.
          </p>
        </div>
      </div>
    </div>
  );
}
