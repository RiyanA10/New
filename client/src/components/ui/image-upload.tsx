import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { uploadToObjectStorage } from "@/lib/object-storage";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

// Update image upload path to include user ID for Firebase storage security rules
export const getStoragePath = (filename: string) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid || 'anonymous';
  return `propertyImages/${userId}/${filename}`;
};

export function ImageUpload({
  onUpload,
  disabled = false,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const storage = getStorage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    uploadImage(file);
  };

  const uploadImage = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Check if Firebase storage is initialized
    if (!storage) {
      console.error("Firebase storage is not initialized");
      toast({
        title: "Upload failed",
        description: "Firebase storage is not properly initialized",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;
    // Get current user's ID for the upload path
    const storageRef = ref(storage, getStoragePath(fileName));
    try {
      console.log("Starting upload to Firebase storage...");

      // First check if user is authenticated
      const auth = getAuth();
      if (!auth.currentUser) {
        console.log("User not authenticated, using server fallback...");
        throw new Error("User not authenticated");
      }

      // Set a flag to track if Firebase upload fails
      let firebaseUploadFailed = false;
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        async (error) => {
          console.error("Firebase upload error:", error);

          // Try fallback to server upload
          try {
            console.log("Attempting fallback upload to server...");
            setUploadProgress(10); // Reset progress for new upload
            const downloadURL = await uploadToObjectStorage(file);
            onUpload(downloadURL);
            setIsUploading(false);
            toast({
              title: "Upload successful",
              description: "Image was uploaded using the backup method",
            });
          } catch (serverError) {
            console.error("Server upload error:", serverError);
            toast({
              title: "Upload failed",
              description: "Failed to upload image through both methods",
              variant: "destructive",
            });
            setIsUploading(false);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            onUpload(downloadURL);
            setIsUploading(false);
            toast({
              title: "Upload successful",
              description: "Image has been uploaded successfully",
            });
          });
        }
      );
    } catch (err) {
      console.error("Failed to initialize upload:", err);
      toast({
        title: "Upload initialization failed",
        description: "Could not start the upload process",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 h-full ${className}`}>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <div className="text-sm font-medium">Uploading...</div>
            <div className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</div>
          </div>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <div className="text-sm font-medium">Click to upload</div>
            <div className="text-xs text-muted-foreground">
              JPG, PNG, GIF (max 5MB)
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            className="mt-2"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            Select Image
          </Button>
        </label>
      )}
    </div>
  );
}