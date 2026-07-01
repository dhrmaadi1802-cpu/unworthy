import sys
import os

PDF_PATH = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\media__1782837361780.pdf"
OUTPUT_DIR = r"c:\xampp\unworty\assets"

os.makedirs(OUTPUT_DIR, exist_ok=True)

extracted_files = []

# ── Try PyMuPDF (fitz) first ──────────────────────────────────────────────────
try:
    import fitz  # PyMuPDF
    print(f"[INFO] Using PyMuPDF {fitz.__version__}")

    doc = fitz.open(PDF_PATH)
    total_pages = len(doc)
    print(f"[INFO] PDF has {total_pages} page(s).")

    # 1. Extract embedded images from every page
    for page_num in range(total_pages):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        print(f"  Page {page_num+1}: found {len(image_list)} embedded image(s).")

        for img_idx, img_info in enumerate(image_list):
            xref = img_info[0]
            try:
                base_image = doc.extract_image(xref)
                img_bytes   = base_image["image"]
                img_ext     = base_image.get("ext", "png")

                # Always save as PNG
                out_name = f"product_img_{page_num+1}_{img_idx}.png"
                out_path = os.path.join(OUTPUT_DIR, out_name)

                if img_ext.lower() == "png":
                    with open(out_path, "wb") as f:
                        f.write(img_bytes)
                else:
                    # Convert to PNG via pixmap
                    pix = fitz.Pixmap(img_bytes)
                    if pix.n > 4:          # CMYK → RGB
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    pix.save(out_path)

                print(f"    Saved embedded image: {out_name}")
                extracted_files.append(out_path)
            except Exception as e:
                print(f"    [WARN] Could not extract image xref={xref}: {e}")

    # 2. Rasterise each page at 150 DPI
    MAT = fitz.Matrix(150 / 72, 150 / 72)   # 72 dpi is fitz default
    for page_num in range(total_pages):
        page = doc[page_num]
        pix  = page.get_pixmap(matrix=MAT, alpha=False)
        out_name = f"page_{page_num+1}.png"
        out_path = os.path.join(OUTPUT_DIR, out_name)
        pix.save(out_path)
        print(f"  Saved page screenshot: {out_name}")
        extracted_files.append(out_path)

    doc.close()

# ── Fallback: pdf2image ───────────────────────────────────────────────────────
except ImportError:
    print("[INFO] PyMuPDF not found. Trying pdf2image …")
    try:
        from pdf2image import convert_from_path

        pages = convert_from_path(PDF_PATH, dpi=150)
        print(f"[INFO] pdf2image converted {len(pages)} page(s).")

        for i, page_img in enumerate(pages):
            out_name = f"page_{i+1}.png"
            out_path = os.path.join(OUTPUT_DIR, out_name)
            page_img.save(out_path, "PNG")
            print(f"  Saved page screenshot: {out_name}")
            extracted_files.append(out_path)

        print("[WARN] pdf2image cannot extract individual embedded images.")

    except ImportError:
        print("[ERROR] Neither PyMuPDF nor pdf2image is available.")
        print("Run:  pip install PyMuPDF   or   pip install pdf2image")
        sys.exit(1)

# ── Summary ───────────────────────────────────────────────────────────────────
print("\n=== Extraction complete ===")
print(f"Total files saved: {len(extracted_files)}")
for f in extracted_files:
    size = os.path.getsize(f)
    print(f"  {os.path.basename(f)}  ({size:,} bytes)")
