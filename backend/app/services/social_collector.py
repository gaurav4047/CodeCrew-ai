from typing import List, Dict, Any, Optional
from datetime import datetime
import tweepy
import praw
from app.services.base_collector import BaseCollector
from app.core.config import settings
from loguru import logger


class SocialMediaCollector(BaseCollector):
    """Collector for social media data from Twitter, Reddit, etc."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.sources = config.get("sources", ["twitter", "reddit"])
        
    async def collect(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        results = []
        
        for source in self.sources:
            if source == "twitter" and self._has_twitter_config():
                results.extend(await self._collect_twitter(keywords, since))
            elif source == "reddit" and self._has_reddit_config():
                results.extend(await self._collect_reddit(keywords, since))
                
        return results
    
    def _has_twitter_config(self) -> bool:
        """Check if Twitter API credentials are configured"""
        return all([
            settings.TWITTER_API_KEY,
            settings.TWITTER_API_SECRET,
            settings.TWITTER_ACCESS_TOKEN,
            settings.TWITTER_ACCESS_SECRET
        ])
    
    def _has_reddit_config(self) -> bool:
        """Check if Reddit API credentials are configured"""
        return all([
            settings.REDDIT_CLIENT_ID,
            settings.REDDIT_CLIENT_SECRET,
            settings.REDDIT_USER_AGENT
        ])
    
    async def _collect_twitter(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Collect tweets from Twitter"""
        try:
            # Authenticate with Twitter
            auth = tweepy.OAuthHandler(settings.TWITTER_API_KEY, settings.TWITTER_API_SECRET)
            auth.set_access_token(settings.TWITTER_ACCESS_TOKEN, settings.TWITTER_ACCESS_SECRET)
            api = tweepy.API(auth, wait_on_rate_limit=True)
            
            results = []
            query = " OR ".join(keywords)
            
            # Search for tweets
            tweets = api.search_tweets(q=query, tweet_mode='extended', count=100)
            
            for tweet in tweets:
                tweet_date = tweet.created_at
                
                # Filter by date if specified
                if since and tweet_date < since:
                    continue
                
                results.append({
                    'title': tweet.full_text[:100] + '...' if len(tweet.full_text) > 100 else tweet.full_text,
                    'content': tweet.full_text,
                    'url': f"https://twitter.com/{tweet.user.screen_name}/status/{tweet.id}",
                    'published_at': tweet.created_at,
                    'author': tweet.user.screen_name,
                    'likes': tweet.favorite_count,
                    'retweets': tweet.retweet_count,
                    'source': 'twitter'
                })
            
            logger.info(f"Collected {len(results)} tweets from Twitter")
            return results
            
        except Exception as e:
            logger.error(f"Error collecting from Twitter: {str(e)}")
            return []
    
    async def _collect_reddit(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Collect posts from Reddit"""
        try:
            # Authenticate with Reddit
            reddit = praw.Reddit(
                client_id=settings.REDDIT_CLIENT_ID,
                client_secret=settings.REDDIT_CLIENT_SECRET,
                user_agent=settings.REDDIT_USER_AGENT
            )
            
            results = []
            query = " OR ".join(keywords)
            
            # Search for posts
            for submission in reddit.subreddit("all").search(query, limit=100):
                post_date = datetime.fromtimestamp(submission.created_utc)
                
                # Filter by date if specified
                if since and post_date < since:
                    continue
                
                results.append({
                    'title': submission.title,
                    'content': submission.selftext,
                    'url': submission.url,
                    'published_at': post_date,
                    'author': str(submission.author),
                    'score': submission.score,
                    'num_comments': submission.num_comments,
                    'subreddit': str(submission.subreddit),
                    'source': 'reddit'
                })
            
            logger.info(f"Collected {len(results)} posts from Reddit")
            return results
            
        except Exception as e:
            logger.error(f"Error collecting from Reddit: {str(e)}")
            return []
    
    def normalize_data(self, raw_data: Any) -> Dict[str, Any]:
        """Normalize social media data"""
        return {
            'title': raw_data.get('title', ''),
            'summary': raw_data.get('content', '')[:200] + '...' if len(raw_data.get('content', '')) > 200 else raw_data.get('content', ''),
            'content': raw_data.get('content', ''),
            'source_url': raw_data.get('url', ''),
            'source_type': 'social_media',
            'published_at': raw_data.get('published_at'),
            'metadata': {
                'author': raw_data.get('author', ''),
                'source': raw_data.get('source', ''),
                'likes': raw_data.get('likes', 0),
                'retweets': raw_data.get('retweets', 0),
                'score': raw_data.get('score', 0),
                'subreddit': raw_data.get('subreddit', ''),
                'original_source': 'social_media'
            }
        }
