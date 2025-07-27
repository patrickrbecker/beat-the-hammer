import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

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
        max_results: 5,
        'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'attachments'],
        expansions: ['author_id', 'attachments.media_keys'],
        'user.fields': ['username', 'name'],
        'media.fields': ['url', 'preview_image_url', 'type', 'width', 'height'],
      });

      return NextResponse.json({
        status: 'success',
        hasCredentials: true,
        library: 'twitter-api-v2',
        data: {
          tweetCount: tweetsData.data.data?.length || 0,
          hasIncludes: !!tweetsData.includes,
          hasMedia: !!tweetsData.includes?.media,
          mediaCount: tweetsData.includes?.media?.length || 0,
          tweetsWithAttachments: tweetsData.data.data?.filter(tweet => 
            tweet.attachments?.media_keys?.length && tweet.attachments.media_keys.length > 0
          ).length || 0,
          firstTweet: tweetsData.data.data?.[0] ? {
            id: tweetsData.data.data[0].id,
            text: tweetsData.data.data[0].text?.substring(0, 100) + '...',
            hasAttachments: !!tweetsData.data.data[0].attachments?.media_keys?.length,
            mediaKeys: tweetsData.data.data[0].attachments?.media_keys || [],
          } : null,
          mediaItems: tweetsData.includes?.media?.map(media => ({
            media_key: media.media_key,
            type: media.type,
            hasUrl: !!media.url,
            hasPreviewUrl: !!media.preview_image_url,
          })) || [],
        },
        timestamp: new Date().toISOString()
      });

    } catch (twitterError: unknown) {
      return NextResponse.json({
        status: 'error',
        hasCredentials: true,
        library: 'twitter-api-v2',
        error: twitterError instanceof Error ? twitterError.message : String(twitterError),
        errorCode: twitterError instanceof Error && 'code' in twitterError ? (twitterError as Error & { code?: string }).code : undefined,
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