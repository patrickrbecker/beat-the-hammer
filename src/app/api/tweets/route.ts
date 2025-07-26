import { NextResponse } from 'next/server';

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
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
  };
  meta?: {
    result_count: number;
  };
}

async function fetchTweets(userId: string, bearerToken: string) {
  const tweetsResponse = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,author_id&expansions=author_id&user.fields=username,name`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!tweetsResponse.ok) {
    const errorText = await tweetsResponse.text();
    console.error('Failed to fetch tweets:', tweetsResponse.status, tweetsResponse.statusText, errorText);
    return NextResponse.json({ 
      tweets: [], 
      error: 'Failed to fetch tweets',
      debug: { status: tweetsResponse.status, message: errorText }
    });
  }

  const tweetsData: TwitterResponse = await tweetsResponse.json();

  // Transform the Twitter API response to our format
  const tweets = tweetsData.data?.map(tweet => ({
    id: tweet.id,
    text: tweet.text,
    created_at: tweet.created_at,
    author: '@beathammer'
  })) || [];

  return NextResponse.json({ tweets });
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

    // First, get the user ID for @beathammer
    const userResponse = await fetch(
      'https://api.twitter.com/2/users/by/username/beathammer',
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to fetch user:', userResponse.status, userResponse.statusText, errorText);
      
      // Try alternative usernames
      const altUserResponse = await fetch(
        'https://api.twitter.com/2/users/by/username/BeatHammer',
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!altUserResponse.ok) {
        console.error('Alt username also failed:', altUserResponse.status);
        return NextResponse.json({ 
          tweets: [], 
          error: 'User not found. Account may not exist or may be private.',
          debug: { 
            status: userResponse.status, 
            altStatus: altUserResponse.status,
            message: errorText 
          }
        });
      }
      
      const userData = await altUserResponse.json();
      const userId = userData.data?.id;
      
      if (!userId) {
        return NextResponse.json({ tweets: [], error: 'User ID not found' });
      }
      
      return await fetchTweets(userId, bearerToken);
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      console.error('User ID not found for @beathammer');
      return NextResponse.json({ tweets: [], error: 'User not found' });
    }

    return await fetchTweets(userId, bearerToken);

  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ tweets: [], error: 'Internal server error' });
  }
}