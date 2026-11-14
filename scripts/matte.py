"""Kişi kesimi (BiRefNet-lite, MIT): klipten 15 fps RGBA PNG dizisi üretir.
Kullanım: python matte.py <klip.mp4> <çıktı klasörü> <model.onnx>
- Ekran kartı (DirectML/CUDA/CoreML) varsa onu dener, bellek yetmezse işlemciye düşer.
- İşlemci düşük öncelikte çalışır; bilgisayar donmasın diye tek iş halinde kullanın.
- Kaldığı yerden devam eder (var olan kareleri atlar)."""
import os, sys, glob, subprocess, tempfile, platform
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

ort.set_default_logger_severity(3)
if platform.system() == "Windows":
    try:
        import ctypes
        ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)
    except Exception:
        pass
else:
    try:
        os.nice(10)
    except Exception:
        pass

clip, out, model = sys.argv[1], sys.argv[2], sys.argv[3]
FPS, SIZE = 15, 1024
os.makedirs(out, exist_ok=True)
tmp = tempfile.mkdtemp()
subprocess.run(["ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-i", clip, "-vf", f"fps={FPS}", os.path.join(tmp, "%04d.png")], check=True)
files = sorted(glob.glob(os.path.join(tmp, "*.png")))

def session(providers):
    so = ort.SessionOptions()
    so.log_severity_level = 3
    so.enable_mem_pattern = False
    return ort.InferenceSession(model, so, providers=providers)

avail = ort.get_available_providers()
gpu = [p for p in ["CUDAExecutionProvider", "DmlExecutionProvider", "CoreMLExecutionProvider"] if p in avail]
s = session(gpu + ["CPUExecutionProvider"]) if gpu else session(["CPUExecutionProvider"])
name = s.get_inputs()[0].name
mean, std = np.array([0.485, 0.456, 0.406]), np.array([0.229, 0.224, 0.225])

def run(a):
    global s
    try:
        return s.run(None, {name: a})[0]
    except Exception:
        if s.get_providers()[0] != "CPUExecutionProvider":
            print("ekran kartı belleği yetmedi, işlemciye geçiliyor", flush=True)
            s = session(["CPUExecutionProvider"])
            return s.run(None, {name: a})[0]
        raise

prev = None
for i, f in enumerate(files):
    dst = os.path.join(out, f"{i + 1:04d}.png")
    if os.path.exists(dst):
        prev = None
        continue
    img = Image.open(f).convert("RGB")
    a = (np.asarray(img.resize((SIZE, SIZE), Image.BILINEAR)).astype(np.float32) / 255 - mean) / std
    o = run(a.transpose(2, 0, 1)[None].astype(np.float32))
    r = o[0, 0] if o.ndim == 4 else o[0]
    m = 1 / (1 + np.exp(-r))
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize(img.size, Image.BILINEAR)).astype(np.float32) / 255
    if prev is not None:
        m = 0.65 * m + 0.35 * prev  # kenar titremesini azalt
    prev = m
    alpha = Image.fromarray((np.clip((m - 0.08) / 0.84, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = img.copy()
    rgba.putalpha(alpha)
    rgba.save(dst)
    print(f"kesim {i + 1}/{len(files)}", flush=True)
print(f"KARE={len(files)}", flush=True)
