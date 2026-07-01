import shutil, os

src = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\media__1782840075018.png"
dst_dir = r"C:\xampp\unworty\assets"
dst = os.path.join(dst_dir, "produk.png")

os.makedirs(dst_dir, exist_ok=True)
shutil.copy2(src, dst)
print("Copied:", dst)
