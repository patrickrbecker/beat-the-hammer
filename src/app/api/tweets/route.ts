import { NextResponse } from 'next/server';

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  attachments?: {
    media_keys?: string[];
  };
}

interface TwitterMedia {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
  width?: number;
  height?: number;
}

interface TwitterUser {
  id: string;
  username: string;
  name: string;
}

interface TwitterResponse {
  data?: TwitterTweet[];
  includes?: {
    users?: TwitterUser[];
    media?: TwitterMedia[];
  };
  meta?: {
    result_count: number;
  };
}


export async function GET() {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.error('Twitter Bearer Token not found');
      // Return demo tweets if no token
      return NextResponse.json({ 
        tweets: [
          {
            id: '1',
            text: 'Beat the Hammer Game #1 - Victory! 🏆 The challenger couldn\'t handle the pressure!',
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

    // Use Twitter's public tweet search with media attachments
    // This searches for tweets from @BeatHammer and includes images/videos
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=from:BeatHammer&max_results=10&tweet.fields=created_at,author_id,public_metrics,attachments&expansions=author_id,attachments.media_keys&user.fields=username,name&media.fields=url,preview_image_url,type,width,height`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!tweetsResponse.ok) {
      const errorText = await tweetsResponse.text();
      console.error('Failed to search tweets from @BeatHammer:', tweetsResponse.status, tweetsResponse.statusText, errorText);
      
      // Try alternative username (lowercase)
      const altTweetsResponse = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=from:beathammer&max_results=10&tweet.fields=created_at,author_id,public_metrics,attachments&expansions=author_id,attachments.media_keys&user.fields=username,name&media.fields=url,preview_image_url,type,width,height`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!altTweetsResponse.ok) {
        const altErrorText = await altTweetsResponse.text();
        console.error('Alt username @beathammer also failed:', altTweetsResponse.status, altErrorText);
        return NextResponse.json({ 
          tweets: [], 
          error: 'No tweets found. Account may not exist, be private, or have no recent tweets.',
          debug: { 
            primaryStatus: tweetsResponse.status, 
            altStatus: altTweetsResponse.status,
            primaryMessage: errorText,
            altMessage: altErrorText
          }
        });
      }
      
      const tweetsData: TwitterResponse = await altTweetsResponse.json();
      const tweets = tweetsData.data?.map(tweet => {
        // Find media attachments for this tweet
        const mediaAttachments = tweet.attachments?.media_keys?.map(mediaKey => {
          return tweetsData.includes?.media?.find(media => media.media_key === mediaKey);
        }).filter(Boolean) || [];

        return {
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          author: '@BeatHammer',
          media: mediaAttachments
        };
      }) || [];

      return NextResponse.json({ tweets });
    }

    const tweetsData: TwitterResponse = await tweetsResponse.json();
    const tweets = tweetsData.data?.map(tweet => {
      // Find media attachments for this tweet
      const mediaAttachments = tweet.attachments?.media_keys?.map(mediaKey => {
        return tweetsData.includes?.media?.find(media => media.media_key === mediaKey);
      }).filter(Boolean) || [];

      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author: '@BeatHammer',
        media: mediaAttachments
      };
    }) || [];

    return NextResponse.json({ tweets });

  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ tweets: [], error: 'Internal server error' });
  }
}