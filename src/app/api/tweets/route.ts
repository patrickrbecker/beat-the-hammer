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

export async function GET() {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.error('Twitter Bearer Token not found');
      return NextResponse.json({ tweets: [], error: 'API configuration missing' });
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
      console.error('Failed to fetch user:', userResponse.status, userResponse.statusText);
      return NextResponse.json({ tweets: [], error: 'User not found' });
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      console.error('User ID not found for @beathammer');
      return NextResponse.json({ tweets: [], error: 'User not found' });
    }

    // Now get the tweets
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
      console.error('Failed to fetch tweets:', tweetsResponse.status, tweetsResponse.statusText);
      return NextResponse.json({ tweets: [], error: 'Failed to fetch tweets' });
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

  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ tweets: [], error: 'Internal server error' });
  }
}