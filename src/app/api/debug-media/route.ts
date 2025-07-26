import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      return NextResponse.json({ 
        error: 'No Bearer Token configured',
        hasToken: false
      });
    }

    // Test the exact same API call as our main tweets endpoint
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=from:BeatHammer&max_results=10&tweet.fields=created_at,author_id,public_metrics,attachments&expansions=author_id,attachments.media_keys&user.fields=username,name&media.fields=url,preview_image_url,type,width,height`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result: Record<string, unknown> = {
      status: tweetsResponse.status,
      statusText: tweetsResponse.statusText,
      ok: tweetsResponse.ok
    };

    if (tweetsResponse.ok) {
      const data = await tweetsResponse.json();
      result.data = data;
      
      // Check specifically for media
      result.hasMedia = !!data.includes?.media;
      result.mediaCount = data.includes?.media?.length || 0;
      result.tweetsWithAttachments = data.data?.filter((tweet: any) => tweet.attachments?.media_keys?.length > 0).length || 0;
      
    } else {
      const errorText = await tweetsResponse.text();
      result.error = errorText;
    }

    return NextResponse.json({
      hasToken: true,
      apiTest: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Media debug error:', error);
    return NextResponse.json({ 
      error: 'Debug request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}