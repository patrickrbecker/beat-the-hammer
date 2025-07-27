import { NextResponse } from 'next/server';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export async function GET() {
  try {
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    
    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      return NextResponse.json({ 
        error: 'OAuth credentials not found',
        hasCredentials: false
      });
    }

    const oauth = new OAuth({
      consumer: { key: apiKey, secret: apiSecret },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64')
      },
    });

    const url = 'https://api.twitter.com/2/tweets/search/recent?query=from:BeatHammer&max_results=5&tweet.fields=created_at,author_id,public_metrics,attachments&expansions=author_id,attachments.media_keys&user.fields=username,name&media.fields=url,preview_image_url,type,width,height';

    const requestData = {
      url: url,
      method: 'GET',
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData, {
      key: accessToken,
      secret: accessTokenSecret,
    }));

    const tweetsResponse = await fetch(url, {
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
    });

    const result = {
      status: tweetsResponse.status,
      statusText: tweetsResponse.statusText,
      ok: tweetsResponse.ok,
      hasCredentials: true,
    };

    if (tweetsResponse.ok) {
      const data = await tweetsResponse.json();
      
      return NextResponse.json({
        ...result,
        data: data,
        debug: {
          hasData: !!data.data,
          tweetCount: data.data?.length || 0,
          hasIncludes: !!data.includes,
          hasMedia: !!data.includes?.media,
          mediaCount: data.includes?.media?.length || 0,
          tweetsWithAttachments: data.data?.filter((tweet: { attachments?: { media_keys?: string[] } }) => 
            tweet.attachments?.media_keys?.length && tweet.attachments.media_keys.length > 0
          ).length || 0,
          firstTweetHasAttachments: data.data?.[0]?.attachments?.media_keys?.length > 0,
          allMediaKeys: data.data?.map((tweet: { attachments?: { media_keys?: string[] } }) => 
            tweet.attachments?.media_keys || []
          ).flat(),
        },
        timestamp: new Date().toISOString()
      });
    } else {
      const errorText = await tweetsResponse.text();
      return NextResponse.json({
        ...result,
        error: errorText,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Debug OAuth error:', error);
    return NextResponse.json({ 
      error: 'Debug request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}