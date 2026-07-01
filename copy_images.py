import os
import shutil

src_black = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\black_tshirt_mockup_1782838687890.png"
src_blue = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\blue_tshirt_mockup_1782838708125.png"

dest_dir = r"c:\xampp\unworty\assets"

os.makedirs(dest_dir, exist_ok=True)
shutil.copy2(src_black, os.path.join(dest_dir, "black_tshirt.png"))
shutil.copy2(src_blue, os.path.join(dest_dir, "blue_tshirt.png"))
print("Done")
