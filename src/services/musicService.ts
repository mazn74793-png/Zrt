const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function searchGlobalMusic(query: string) {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API Key missing');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
        query + ' song'
      )}&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      audioUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      coverUrl: item.snippet.thumbnails.high.url,
      category: 'Global',
      isLocal: false,
      viewCount: 0,
      uploaderId: 'youtube',
      uploaderName: 'YouTube',
      createdAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}
