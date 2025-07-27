import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { getCachedData, setCachedData } from '@/lib/cache';

interface MediaAttachment {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
  width?: number;
  height?: number;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: string;
  media?: MediaAttachment[];
}

export async function GET() {
  try {
    // Check cache first
    const cacheKey = 'beathammer_tweets';
    const cachedTweets = getCachedData(cacheKey);
    
    if (cachedTweets) {
      const response = NextResponse.json({ 
        tweets: cachedTweets, 
        oauth: true, 
        cached: true,
        cacheHit: true 
      });
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
      return response;
    }

    // Get OAuth 1.0a credentials
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    
    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      console.error('Twitter OAuth credentials not found');
      return NextResponse.json({ 
        tweets: [
          {
            id: '1',
            text: 'Beat the Hammer Game #1 - Victory! 🏆 The challenger could not handle the pressure!',
            created_at: new Date().toISOString(),
            author: '@BeatHammer'
          },
          {
            id: '2', 
            text: 'New challenger approaching! Game starts in 30 minutes. 🔨 Who thinks they can beat The Hammer?',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            author: '@BeatHammer'
          },
          {
            id: '3',
            text: 'Weekly stats: 12 wins, 8 losses. The Hammer remains strong! 💪 #BeatTheHammer',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            author: '@BeatHammer'
          }
        ], 
        demo: true 
      });
    }

    // Initialize Twitter API v2 client with OAuth 1.0a
    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    try {
      // Search for tweets from @BeatHammer with media expansions
      const tweetsData = await twitterClient.v2.search('from:BeatHammer', {
        max_results: 10,
        'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'attachments'],
        expansions: ['author_id', 'attachments.media_keys'],
        'user.fields': ['username', 'name'],
        'media.fields': ['url', 'preview_image_url', 'type', 'width', 'height'],
      });

      // Transform the response to match our interface
      const tweets: Tweet[] = tweetsData.data.data?.map(tweet => {
        // Find media attachments for this tweet
        const mediaAttachments: MediaAttachment[] = [];
        
        if (tweet.attachments?.media_keys && tweetsData.includes?.media) {
          for (const mediaKey of tweet.attachments.media_keys) {
            const media = tweetsData.includes.media.find(m => m.media_key === mediaKey);
            if (media) {
              mediaAttachments.push({
                media_key: media.media_key,
                type: media.type as 'photo' | 'video' | 'animated_gif',
                url: media.url,
                preview_image_url: media.preview_image_url,
                width: media.width,
                height: media.height,
              });
            }
          }
        }

        return {
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at || new Date().toISOString(),
          author: '@BeatHammer',
          media: mediaAttachments,
        };
      }) || [];

      // Cache the successful result for 1 hour (tweets only come Friday mornings)
      setCachedData(cacheKey, tweets, 60);

      const response = NextResponse.json({ tweets, oauth: true, cached: false });
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
      return response;

    } catch (twitterError: unknown) {
      console.error('Twitter API error:', twitterError);
      
      // Try alternative username (lowercase) if the first attempt fails
      try {
        const altTweetsData = await twitterClient.v2.search('from:beathammer', {
          max_results: 10,
          'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'attachments'],
          expansions: ['author_id', 'attachments.media_keys'],
          'user.fields': ['username', 'name'],
          'media.fields': ['url', 'preview_image_url', 'type', 'width', 'height'],
        });

        const tweets: Tweet[] = altTweetsData.data.data?.map(tweet => {
          const mediaAttachments: MediaAttachment[] = [];
          
          if (tweet.attachments?.media_keys && altTweetsData.includes?.media) {
            for (const mediaKey of tweet.attachments.media_keys) {
              const media = altTweetsData.includes.media.find(m => m.media_key === mediaKey);
              if (media) {
                mediaAttachments.push({
                  media_key: media.media_key,
                  type: media.type as 'photo' | 'video' | 'animated_gif',
                  url: media.url,
                  preview_image_url: media.preview_image_url,
                  width: media.width,
                  height: media.height,
                });
              }
            }
          }

          return {
            id: tweet.id,
            text: tweet.text,
            created_at: tweet.created_at || new Date().toISOString(),
            author: '@BeatHammer',
            media: mediaAttachments,
          };
        }) || [];

        // Cache the successful result for 10 minutes
        setCachedData(cacheKey, tweets, 10);

        return NextResponse.json({ tweets, oauth: true, cached: false });

      } catch (altError: unknown) {
        console.error('Both username attempts failed:', altError);
        return NextResponse.json({ 
          tweets: [], 
          error: 'No tweets found for either @BeatHammer or @beathammer',
          debug: {
            primaryError: twitterError instanceof Error ? twitterError.message : String(twitterError),
            altError: altError instanceof Error ? altError.message : String(altError)
          }
        });
      }
    }

  } catch (error) {
    console.error('Error fetching tweets with Twitter API v2:', error);
    return NextResponse.json({ tweets: [], error: 'Internal server error' });
  }
}