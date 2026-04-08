import { Camera, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { generateApiMetadata } from "../../../utils/apiMetadata";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
};

function ImageUpload({ value, onChange, folder = "stores", label = "Store Logo" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select an image file.");
      return;
    }

    setIsUploading(true);
    const metadata = generateApiMetadata("ONL");
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      alert("Session expired. Please log in again.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('data.file', file);
    formData.append('data.folder', `foodios/${folder}`);
    formData.append('data.publicId', `img-${Date.now()}`);
    formData.append('requestId', metadata.requestId);
    formData.append('requestDateTime', metadata.requestDateTime);
    formData.append('channel', metadata.channel);

    try {
      const response = await fetch("http://localhost:8080/api/v1/media/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.data.secureUrl || result.data.url;
        onChange(imageUrl);
      } else {
        const result = await response.json();
        alert(`Upload failed: ${result.result?.description || response.statusText}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400">{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative h-40 w-full rounded-[32px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${
          value ? 'border-transparent' : 'border-stone-100 hover:border-orange-500 hover:bg-orange-50/30'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <div className="flex flex-col items-center gap-2">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-white text-[0.6rem] font-black uppercase tracking-widest">Change Image</span>
               </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors">
               <Upload className="w-5 h-5 text-stone-300 group-hover:text-orange-600" />
            </div>
            <div className="text-center">
               <p className="text-xs font-bold text-stone-950">Click to upload image</p>
               <p className="text-[0.6rem] text-stone-400 mt-1 uppercase tracking-widest font-black">PNG, JPG up to 10MB</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            <span className="text-[0.6rem] font-black text-orange-600 uppercase tracking-widest">Uploading...</span>
          </div>
        )}

        {value && !isUploading && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-4 right-4 h-8 w-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-500 transition-all z-30"
          >
             <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}

export default ImageUpload;
