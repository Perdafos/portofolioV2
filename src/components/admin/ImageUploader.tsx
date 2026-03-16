import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { UploadCloud, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseClientWithAccessToken } from "@/backend/supabase/client";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  getSupabaseAccessToken: () => Promise<string>;
  bucketName?: string;
  folderPath?: string;
}

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
  
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(blob);
      },
      "image/webp",
      0.9
    );
  });
};

export default function ImageUploader({
  value,
  onChange,
  getSupabaseAccessToken,
  bucketName = "blog-images",
  folderPath = "covers",
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMsg("");
    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileName = `${folderPath}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      
      const token = await getSupabaseAccessToken();
      const supabase = createSupabaseClientWithAccessToken(token);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, croppedBlob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/webp"
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      onChange(publicUrlData.publicUrl);
      setImageSrc(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal mengunggah gambar. Pastikan bucket 'blog-images' publik telah dibuat di Supabase.");
    } finally {
      setIsUploading(false);
    }
  };

  if (imageSrc) {
    return (
      <div className="flex flex-col gap-2">
        <div className="relative h-[300px] w-full rounded-md overflow-hidden bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={handleUpload} disabled={isUploading} className="flex-1">
            {isUploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUploading ? "Mengunggah..." : "Gunakan Gambar Ini"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setImageSrc(null)} disabled={isUploading}>
            Batal
          </Button>
        </div>
        {errorMsg && <p className="text-sm text-destructive mt-1">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-4 transition-colors ${
          dragActive ? "border-primary bg-primary/10" : "border-border hover:bg-card/50"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <UploadCloud className="mb-2 h-8 w-8 opacity-70" />
          <p className="text-sm font-medium">Klik atau drop gambar ke sini</p>
          <p className="text-xs mt-1">Resolusi direkomendasikan rasio 16:9 (Otomatis crop)</p>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Atau masukkan URL gambar..."
          />
        </div>
        {value && (
          <div className="h-10 w-10 shrink-0 rounded-md overflow-hidden border border-border">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      {errorMsg && <p className="text-sm text-destructive mt-1">{errorMsg}</p>}
    </div>
  );
}
