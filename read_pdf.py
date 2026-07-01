import subprocess, sys, os

pdf_path = r"C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\media__1782837361780.pdf"
out_dir = r"c:\xampp\unworty\assets"

os.makedirs(out_dir, exist_ok=True)

# Try using pdf2image if available
try:
    from pdf2image import convert_from_path
    pages = convert_from_path(pdf_path, dpi=150)
    for i, page in enumerate(pages):
        page.save(os.path.join(out_dir, f"ppt_page_{i+1}.png"), "PNG")
    print(f"Converted {len(pages)} pages using pdf2image")
except ImportError:
    print("pdf2image not available, trying pypdf...")
    try:
        import pypdf
        reader = pypdf.PdfReader(pdf_path)
        print(f"PDF has {len(reader.pages)} pages")
        for i, page in enumerate(reader.pages):
            print(f"Page {i+1}: {page.extract_text()[:200]}")
    except ImportError:
        print("pypdf not available either")
