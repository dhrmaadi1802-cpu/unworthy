import shutil
import os

brain_dir = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e"
assets_dir = r"c:\xampp\unworty\assets"

os.makedirs(assets_dir, exist_ok=True)

files = [
    ("media__1782840075018.png", "produk1.png"),
    ("media__1782872518751.jpg", "produk2.jpg")
]

for src_name, dest_name in files:
    src_path = os.path.join(brain_dir, src_name)
    dest_path = os.path.join(assets_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"Copied {src_name} to {dest_name}")
    else:
        print(f"Source file not found: {src_path}")
