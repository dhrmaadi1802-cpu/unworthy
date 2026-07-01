from PIL import Image, ImageDraw
import sys

def process_image(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        # Flood fill from the top-left corner (0,0) which should be the background
        # target color is white
        ImageDraw.floodfill(img, (0, 0), (255, 255, 255, 255), thresh=10)
        
        # Also flood fill from other corners just in case
        w, h = img.size
        ImageDraw.floodfill(img, (w-1, 0), (255, 255, 255, 255), thresh=10)
        ImageDraw.floodfill(img, (0, h-1), (255, 255, 255, 255), thresh=10)
        ImageDraw.floodfill(img, (w-1, h-1), (255, 255, 255, 255), thresh=10)
        
        img.save(output_path)
        print("Success! Image background changed to white.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    in_file = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\media__1782840075018.png"
    out_file = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\media_white_bg.png"
    process_image(in_file, out_file)
