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

    // Test 1: Check if our Bearer Token works at all
    const testResponse = await fetch(
      'https://api.twitter.com/2/users/me',
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const testResult: Record<string, unknown> = {
      status: testResponse.status,
      statusText: testResponse.statusText,
      ok: testResponse.ok
    };

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      testResult.error = errorText;
    }

    // Test 2: Try to find the BeatHammer user
    const userResponse = await fetch(
      'https://api.twitter.com/2/users/by/username/BeatHammer',
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const userResult: Record<string, unknown> = {
      status: userResponse.status,
      statusText: userResponse.statusText,
      ok: userResponse.ok
    };

    if (userResponse.ok) {
      const userData = await userResponse.json();
      userResult.data = userData;
    } else {
      const errorText = await userResponse.text();
      userResult.error = errorText;
    }

    // Test 3: Try lowercase version
    const userResponse2 = await fetch(
      'https://api.twitter.com/2/users/by/username/beathammer',
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const userResult2: Record<string, unknown> = {
      status: userResponse2.status,
      statusText: userResponse2.statusText,
      ok: userResponse2.ok
    };

    if (userResponse2.ok) {
      const userData2 = await userResponse2.json();
      userResult2.data = userData2;
    } else {
      const errorText2 = await userResponse2.text();
      userResult2.error = errorText2;
    }

    return NextResponse.json({
      hasToken: true,
      tokenTest: testResult,
      userLookupBeatHammer: userResult,
      userLookupbeathammer: userResult2,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}