from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import os
import requests
from typing import List, Optional
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()


class TrendingResponseVideo(BaseModel):
    id: str
    title: Optional[str]
    channelTitle: Optional[str]
    publishedAt: Optional[str]
    duration: Optional[str]
    viewCount: Optional[int]
    likeCount: Optional[int]
    commentCount: Optional[int]
    thumbnails: dict
    url: str


def safe_int(x):
    try:
        return int(x)
    except Exception:
        return None


def matches_keyword(snippet: dict, keyword: str) -> bool:
    """Simple case-insensitive substring match against title, description and channelTitle."""
    if not keyword:
        return True
    kw = keyword.lower()
    title = (snippet.get("title") or "").lower()
    desc = (snippet.get("description") or "").lower()
    channel = (snippet.get("channelTitle") or "").lower()
    return kw in title or kw in desc or kw in channel


@app.get("/trending-videos", response_model=dict)
def get_trending_videos(
    region: str = Query("IN", min_length=2, max_length=2, description="ISO 3166-1 alpha-2 country code"),
    max_results: int = Query(10, ge=1, le=10, description="Number of videos to return (1-10)"),
    keyword: Optional[str] = Query(None, description="Optional keyword/topic to filter trending videos"),
    fallback_search: bool = Query(False, description="If true and no trending match, return search results for keyword")
):
    """
    If `keyword` is provided, returns trending videos (mostPopular) that match the keyword.
    If none match and `fallback_search` is True, performs a search for the keyword and returns those results.
    """
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="YOUTUBE_API_KEY not found in environment variables")

    # Step 1: fetch trending (mostPopular)
    videos_url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,contentDetails,statistics",
        "chart": "mostPopular",
        "regionCode": region.upper(),
        "maxResults": 10,  # fetch full pool (we'll limit later to max_results)
        "key": api_key
    }

    try:
        resp = requests.get(videos_url, params=params, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Error fetching trending videos from YouTube API: {exc}")

    items = resp.json().get("items", [])

    # If keyword is provided, filter the trending list
    if keyword:
        filtered = [it for it in items if matches_keyword(it.get("snippet", {}), keyword)]
    else:
        filtered = items

    # If nothing matched and fallback_search is requested, perform a search
    if keyword and not filtered and fallback_search:
        # perform search (search.list) to get relevant videos for the keyword
        search_url = "https://www.googleapis.com/youtube/v3/search"
        search_params = {
            "part": "snippet",
            "q": keyword,
            "type": "video",
            "maxResults": min(max_results, 5),  # search API maxResults is 50 but keep it conservative
            "key": api_key
        }
        try:
            sres = requests.get(search_url, params=search_params, timeout=10)
            sres.raise_for_status()
        except requests.RequestException as exc:
            raise HTTPException(status_code=502, detail=f"Error performing fallback search: {exc}")

        search_items = sres.json().get("items", [])
        video_ids = [item["id"]["videoId"] for item in search_items if item.get("id", {}).get("videoId")]
        if not video_ids:
            return {"region": region.upper(), "keyword": keyword, "videos": []}

        # fetch full details for these IDs
        try:
            det_res = requests.get(
                videos_url,
                params={
                    "part": "snippet,contentDetails,statistics",
                    "id": ",".join(video_ids),
                    "key": api_key
                },
                timeout=10
            )
            det_res.raise_for_status()
        except requests.RequestException as exc:
            raise HTTPException(status_code=502, detail=f"Error fetching video details for search results: {exc}")

        items = det_res.json().get("items", [])
        filtered = items

    # Limit final results to user's max_results (the API call fetched up to 50 trending items earlier)
    filtered = filtered[:max_results]

    # Build response
    videos = []
    for it in filtered:
        vid_id = it.get("id")
        snippet = it.get("snippet", {})
        stats = it.get("statistics", {})
        content = it.get("contentDetails", {})

        videos.append({
            "id": vid_id,
            "title": snippet.get("title"),
            "channelTitle": snippet.get("channelTitle"),
            "publishedAt": snippet.get("publishedAt"),
            "duration": content.get("duration"),
            "viewCount": safe_int(stats.get("viewCount")),
            "likeCount": safe_int(stats.get("likeCount")),
            "commentCount": safe_int(stats.get("commentCount")),
            "thumbnails": snippet.get("thumbnails", {}),
            "url": f"https://www.youtube.com/watch?v={vid_id}"
        })

    return {
        "region": region.upper(),
        "requested_maxResults": max_results,
        "keyword": keyword,
        "fallback_search_used": bool(keyword and not filtered and fallback_search),
        "videos": videos
    }
