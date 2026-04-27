import axios from 'axios';

// Instagram Graph API integration
export async function postToInstagram(imageUrl, caption, hashtags) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const businessAccountId = process.env.INSTAGRAM_BUSINESS_ID;

    if (!accessToken || !businessAccountId) {
      throw new Error('Instagram credentials not configured');
    }

    // First, create a media container
    const mediaResponse = await axios.post(
      `https://graph.instagram.com/v18.0/${businessAccountId}/media`,
      {
        image_url: imageUrl,
        caption: `${caption}\n\n${hashtags.join(' ')}`,
        access_token: accessToken,
      }
    );

    const mediaId = mediaResponse.data.id;

    // Then publish it
    const publishResponse = await axios.post(
      `https://graph.instagram.com/v18.0/${businessAccountId}/media_publish`,
      {
        creation_id: mediaId,
        access_token: accessToken,
      }
    );

    return {
      platform: 'instagram',
      postId: publishResponse.data.id,
      status: 'published',
      timestamp: new Date().toISOString(),
      url: `https://instagram.com/p/${publishResponse.data.id}`,
    };
  } catch (error) {
    console.error('Instagram posting error:', error);
    throw new Error(`Failed to post to Instagram: ${error.message}`);
  }
}

// TikTok Creator API integration
export async function postToTikTok(videoUrl, caption, hashtags) {
  try {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const videoPath = videoUrl; // Can be local file path or URL

    if (!accessToken) {
      throw new Error('TikTok credentials not configured');
    }

    // Upload video to TikTok
    const formData = new FormData();
    formData.append('video', videoPath);
    formData.append('description', `${caption}\n${hashtags.join(' ')}`);
    formData.append('title', caption.substring(0, 150));
    formData.append('access_token', accessToken);

    const response = await axios.post(
      'https://open.tiktok.com/v1/video/upload/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      platform: 'tiktok',
      videoId: response.data.video_id,
      status: 'published',
      timestamp: new Date().toISOString(),
      url: `https://tiktok.com/@${process.env.TIKTOK_USERNAME}/video/${response.data.video_id}`,
    };
  } catch (error) {
    console.error('TikTok posting error:', error);
    throw new Error(`Failed to post to TikTok: ${error.message}`);
  }
}

// Batch post to multiple platforms
export async function postToSocialMedia(content) {
  const results = [];

  try {
    // Post to Instagram if enabled
    if (process.env.INSTAGRAM_ENABLED === 'true') {
      const igResult = await postToInstagram(
        content.imageUrl,
        content.caption,
        content.hashtags
      );
      results.push(igResult);
    }

    // Post to TikTok if enabled
    if (process.env.TIKTOK_ENABLED === 'true' && content.videoUrl) {
      const ttResult = await postToTikTok(
        content.videoUrl,
        content.caption,
        content.hashtags
      );
      results.push(ttResult);
    }

    return {
      status: 'success',
      posts: results,
      totalReach: results.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Social media posting error:', error);
    throw error;
  }
}

// Schedule posts for later
export async function schedulePost(content, scheduledTime) {
  // This would typically use a job queue like Bull or AWS Lambda
  return {
    postId: `scheduled_${Date.now()}`,
    scheduledFor: scheduledTime,
    status: 'scheduled',
    content: content,
  };
}

// Get Instagram analytics
export async function getInstagramAnalytics(timeframe = '7days') {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const businessAccountId = process.env.INSTAGRAM_BUSINESS_ID;

    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${businessAccountId}/insights`,
      {
        params: {
          metric: 'impressions,reach,profile_views,follower_count',
          period: timeframe,
          access_token: accessToken,
        },
      }
    );

    return {
      platform: 'instagram',
      analytics: response.data,
      timeframe,
    };
  } catch (error) {
    console.error('Analytics fetch error:', error);
    throw error;
  }
}
