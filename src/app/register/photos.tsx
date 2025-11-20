"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPhotos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const smsNumber = "404-997-4217";
  const smsHref = `sms:${smsNumber.replace(/[^\d+]/g, "")}`;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState({
    selfiePhoto: false,
    idFrontPhoto: false,
    idBackPhoto: false,
  });
  // Per-photo error messages to surface precise upload issues
  const [photoErrors, setPhotoErrors] = useState<{ [K in keyof typeof photos]?: string }>({});
  const [photoWarnings, setPhotoWarnings] = useState<{ [K in keyof typeof photos]?: string }>({});
  const [photos, setPhotos] = useState({
    selfiePhoto: "",
    idFrontPhoto: "",
    idBackPhoto: "",
  });
  const [uploaded, setUploaded] = useState({
    selfiePhoto: false,
    idFrontPhoto: false,
    idBackPhoto: false,
  });
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    async function checkUserProgress() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) return;
        const user = await res.json();
        if (user) {
          if (user.selfiePhoto || user.idFrontPhoto || user.idBackPhoto) {
            setPhotos(prev => ({
              selfiePhoto: user.selfiePhoto || prev.selfiePhoto,
              idFrontPhoto: user.idFrontPhoto || prev.idFrontPhoto,
              idBackPhoto: user.idBackPhoto || prev.idBackPhoto,
            }));
            setUploaded(prev => ({
              selfiePhoto: !!user.selfiePhoto || prev.selfiePhoto,
              idFrontPhoto: !!user.idFrontPhoto || prev.idFrontPhoto,
              idBackPhoto: !!user.idBackPhoto || prev.idBackPhoto,
            }));
          }
          // Do not auto-enter review mode; require the user to press
          // "Complete Verification" to submit. This prevents surprising
          // navigation when uploads finish.
        }
      } catch (err) {
        console.error("Error checking user progress", err);
      }
    }
    checkUserProgress();
  }, [userId]);

  if (!userId) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Missing User ID</h2>
          <p className="text-gray-400 mb-8">Please start registration before uploading photos.</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold"
            onClick={() => router.replace("/register")}
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof photos;
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset any previous errors/warnings for this field
    setPhotoErrors(prev => ({ ...prev, [name]: undefined }));
    setPhotoWarnings(prev => ({ ...prev, [name]: undefined }));

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoErrors(prev => ({ ...prev, [name]: "Unsupported file type. Please upload a JPG or PNG image." }));
      return;
      setPhotoErrors(prev => ({ ...prev, [name]: `File is too large. Please use an image under ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB.` }));
      return;
    }
    if (file.name && file.name.includes(" ")) {
      setPhotoWarnings(prev => ({ ...prev, [name]: "File name contains spaces — if upload fails try renaming the file (optional)." }));
    }

    // Resize/compress large images in the browser before uploading to
    // significantly reduce upload size and server processing time.
    const resizeImage = async (file: File, maxDim = 1280, quality = 0.8): Promise<string> => {
      try {
        // Use createImageBitmap for better performance when available
        const imgBitmap = await (window as any).createImageBitmap(file);
        const width = imgBitmap.width;
        const height = imgBitmap.height;
        let targetWidth = width;
        let targetHeight = height;
        if (width > maxDim || height > maxDim) {
          const ratio = width / height;
          if (ratio > 1) {
            targetWidth = maxDim;
            targetHeight = Math.round(maxDim / ratio);
          } else {
            targetHeight = maxDim;
            targetWidth = Math.round(maxDim * ratio);
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);
        // Prefer JPEG for smaller size if the input is PNG and not transparent
        const mime = file.type === 'image/png' ? 'image/jpeg' : file.type;
        const dataUrl = canvas.toDataURL(mime, quality);
        return dataUrl;
      } catch (err) {
        // Fallback: read original file as data URL
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
    };

    // Upload the original file as binary to preserve full quality.
    // We still show the selected file as a temporary preview (not base64 here),
    // but we don't create a DataURL to send to the server to avoid JSON/base64 overhead.
    setPhotos(prev => ({ ...prev, [name]: '' }));
    uploadPhoto(name, file);
  };

  // Accept either a File (binary) or a data URL string for legacy flows.
  const uploadPhoto = async (type: keyof typeof photos, photo: File | string) => {
    setLoading(true);
    setUploading(prev => ({ ...prev, [type]: true }));
    setError("");
    // Clear previous error for this photo when starting new upload
    setPhotoErrors(prev => ({ ...prev, [type]: undefined }));
    try {
      let endpoint = "";
      if (type === "selfiePhoto") endpoint = `/api/users/${userId}/selfie`;
      if (type === "idFrontPhoto") endpoint = `/api/users/${userId}/idFront`;
      if (type === "idBackPhoto") endpoint = `/api/users/${userId}/idBack`;

      if (!endpoint) throw new Error("Unknown upload type");

      let res: Response;
      // If a File is provided, send it as binary body with the correct content-type.
      if (photo instanceof File) {
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": photo.type },
          body: photo,
        });
      } else {
        // Legacy: send data URL JSON payload
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [type]: photo }),
        });
      }

      // If response is not JSON (e.g., plain text HTML error), capture the raw text and show it
      let serverMsg: string | undefined;
      try {
        const json = await res.json();
        if (!res.ok) {
          serverMsg = json?.error || JSON.stringify(json);
        }
      } catch (parseErr) {
        // fallback to text body
        try {
          const txt = await res.text();
          if (!res.ok) {
            serverMsg = txt || `${res.status} ${res.statusText}`;
          }
          // If we got a successful 2xx but text (rare), treat as success; otherwise fallback
        } catch (textErr) {
          console.error("Error parsing server error response", textErr);
          serverMsg = `${res.status} ${res.statusText}`;
        }
      }

      if (!res.ok) {
        // Specific case: request entity too large
        if (res.status === 413) {
          setPhotoErrors(prev => ({ ...prev, [type]: `File is too large (server rejected). Please use an image under ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB.` }));
        } else {
          setPhotoErrors(prev => ({ ...prev, [type]: `Upload failed: ${serverMsg ? serverMsg.slice(0, 400) : `${res.status} ${res.statusText}`}` }));
        }
        // surface a more general error as well
        setError(prev => prev || `Upload failed for ${type}. ${serverMsg ? serverMsg.slice(0, 200) : `${res.status} ${res.statusText}`}`);
        console.error("Server upload error:", res.status, res.statusText, serverMsg);
        return;
      }

      setUploaded(prev => {
        const next = { ...prev, [type]: true };
        // Don't auto-enter review mode; user must click the button to submit.
        return next;
      });
    } catch (err: any) {
      console.error("Upload error", err);
      const msg = err?.message || "An error occurred during upload.";
      setPhotoErrors(prev => ({ ...prev, [type]: msg }));
      setError(prev => prev || msg);
    } finally {
      setLoading(false);
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const allUploaded = uploaded.selfiePhoto && uploaded.idFrontPhoto && uploaded.idBackPhoto;
  const hasPhotoErrors = Object.values(photoErrors).some(Boolean);
  const anyUploading = Object.values(uploading).some(Boolean);
  const buttonEnabled = !!allUploaded && !hasPhotoErrors && !anyUploading;

  const handleCompleteVerification = () => {
    // finalization is client-side visual; actual verification is handled server-side
    setReviewMode(true);
  };

  if (reviewMode) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Account Under Review</h2>
          <p className="text-gray-400 mb-4">Thanks — your ID and selfie have been submitted for review. Our team will verify your account shortly.</p>
          <p className="text-gray-500 mb-6 text-sm">If you&apos;d like to message live support to finish verification, use the link below.</p>
          <div className="flex flex-col gap-4 items-center">
            <a
              href={smsHref}
              aria-label={`Message Live Support at ${smsNumber}`}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold"
            >
              Message Live Support
              <span className="sr-only">{`, phone ${smsNumber}`}</span>
            </a>
            <button
              className="px-6 py-3 bg-transparent border border-purple-500/30 rounded-lg text-purple-300 font-semibold"
              onClick={() => router.push('/login')}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Upload Verification Photos</h2>
          <p className="text-gray-400 mt-2">Please upload your selfie and ID photos to complete registration. Make sure your selfie clearly shows your face and the photo ID (hold the ID next to your face).</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Selfie Photo (with ID visible)</label>
              <input
                type="file"
                name="selfiePhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full"
                  disabled={uploading.selfiePhoto}
              />
                {uploading.selfiePhoto && (
                  <div className="mt-2 flex items-center text-sm text-yellow-300">
                    <svg className="animate-spin h-4 w-4 mr-2 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Please wait — uploading...
                  </div>
                )}
                {uploaded.selfiePhoto && !uploading.selfiePhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
              {photoWarnings.selfiePhoto && <div className="mt-1 text-sm text-yellow-300">⚠ {photoWarnings.selfiePhoto}</div>}
              {photoErrors.selfiePhoto && <div className="mt-1 text-sm text-red-400">✖ {photoErrors.selfiePhoto}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">ID Front Photo</label>
              <input
                type="file"
                name="idFrontPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
                disabled={uploading.idFrontPhoto}
              />
              {uploading.idFrontPhoto && (
                <div className="mt-2 flex items-center text-sm text-yellow-300">
                  <svg className="animate-spin h-4 w-4 mr-2 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Please wait — uploading...
                </div>
              )}
              {uploaded.idFrontPhoto && !uploading.idFrontPhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
              {photoWarnings.idFrontPhoto && <div className="mt-1 text-sm text-yellow-300">⚠ {photoWarnings.idFrontPhoto}</div>}
              {photoErrors.idFrontPhoto && <div className="mt-1 text-sm text-red-400">✖ {photoErrors.idFrontPhoto}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">ID Back Photo</label>
              <input
                type="file"
                name="idBackPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
                disabled={uploading.idBackPhoto}
              />
              {uploading.idBackPhoto && (
                <div className="mt-2 flex items-center text-sm text-yellow-300">
                  <svg className="animate-spin h-4 w-4 mr-2 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Please wait — uploading...
                </div>
              )}
              {uploaded.idBackPhoto && !uploading.idBackPhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
              {photoWarnings.idBackPhoto && <div className="mt-1 text-sm text-yellow-300">⚠ {photoWarnings.idBackPhoto}</div>}
              {photoErrors.idBackPhoto && <div className="mt-1 text-sm text-red-400">✖ {photoErrors.idBackPhoto}</div>}
            </div>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
              {error}
              <div className="mt-2 text-xs text-red-200/80">
                Tips: Ensure photos are JPG/PNG and under 5MB. If you&apos;re seeing &apos;Request Entity Too Large&apos; or &apos;Unexpected token&apos; errors, try resizing and/or renaming files (remove spaces).
              </div>
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold ${!buttonEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!buttonEnabled}
              onClick={handleCompleteVerification}
            >
              Complete Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
