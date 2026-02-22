import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(''))
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

def generate_flappy_fish_promo():
    """Generate Flappy Fish promotional video"""
    
    prompt = """A cute cartoon orange tropical fish swimming through an underwater ocean scene. 
    The fish swims playfully through green pipe obstacles, with golden coins floating and sparkling around it. 
    Vibrant turquoise and blue water with light rays streaming down from above. 
    Colorful coral reef and bubbles in the background. 
    Playful, fun, casual mobile game aesthetic with smooth animation. 
    The fish flaps its fins as it navigates through the pipes, collecting shiny coins.
    Bright, cheerful, family-friendly game promotional video style."""
    
    output_path = '/app/frontend/public/flappy_fish_promo.mp4'
    
    print("🎬 Starting Flappy Fish promo video generation...")
    print("⏳ This may take 2-5 minutes...")
    
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    # 16:9 aspect ratio, 4 seconds duration for small file size
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1280x720",  # 16:9 aspect ratio
        duration=4,       # Shortest duration for small file
        max_wait_time=600
    )
    
    if video_bytes:
        video_gen.save_video(video_bytes, output_path)
        print(f'✅ Video saved to: {output_path}')
        
        # Check file size
        file_size = os.path.getsize(output_path)
        print(f'📦 File size: {file_size / 1024:.1f} KB')
        return output_path
    else:
        print('❌ Video generation failed')
        return None

if __name__ == "__main__":
    generate_flappy_fish_promo()
