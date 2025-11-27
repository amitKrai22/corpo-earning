import asyncio

class MockAIService:
    async def generate_image(self, prompt: str) -> str:
        # Simulate processing time
        await asyncio.sleep(2)
        # Return a placeholder image URL (using unsplash for realism)
        return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"

    async def generate_video(self, image_url: str) -> str:
        # Simulate processing time
        await asyncio.sleep(3)
        # Return a placeholder video URL
        return "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-39896-large.mp4"

ai_service = MockAIService()
