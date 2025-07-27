import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

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
    // Get OAuth 1.0a credentials
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    
    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      console.error('Twitter OAuth credentials not found');
      return NextResponse.json({ 
        tweets: [], 
        error: 'OAuth credentials not configured',
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

      return NextResponse.json({ 
        tweets, 
        oauth: true,
        debug: {
          tweetCount: tweets.length,
          mediaCount: tweetsData.includes?.media?.length || 0,
          tweetsWithMedia: tweets.filter(t => t.media && t.media.length > 0).length
        }
      });

    } catch (twitterError: any) {
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

        return NextResponse.json({ 
          tweets, 
          oauth: true,
          alternativeUsername: true,
          debug: {
            tweetCount: tweets.length,
            mediaCount: altTweetsData.includes?.media?.length || 0,
            tweetsWithMedia: tweets.filter(t => t.media && t.media.length > 0).length
          }
        });

      } catch (altError: any) {
        console.error('Both username attempts failed:', altError);
        return NextResponse.json({ 
          tweets: [], 
          error: 'No tweets found for either @BeatHammer or @beathammer',
          debug: {
            primaryError: twitterError.message || twitterError,
            altError: altError.message || altError
          }
        });
      }
    }

  } catch (error) {
    console.error('Error in tweets API:', error);
    return NextResponse.json({ 
      tweets: [], 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}