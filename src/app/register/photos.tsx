"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPhotos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
          if (user.selfiePhoto && user.idFrontPhoto && user.idBackPhoto) {
            setReviewMode(true);
          }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof photos;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoData = reader.result as string;
      setPhotos(prev => ({ ...prev, [name]: photoData }));
      uploadPhoto(name, photoData);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (type: keyof typeof photos, photoData: string) => {
    setLoading(true);
    setError("");
    try {
      let endpoint = "";
      if (type === "selfiePhoto") endpoint = `/api/users/${userId}/selfie`;
      if (type === "idFrontPhoto") endpoint = `/api/users/${userId}/idFront`;
      if (type === "idBackPhoto") endpoint = `/api/users/${userId}/idBack`;

      if (!endpoint) throw new Error("Unknown upload type");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: photoData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      setUploaded(prev => {
        const next = { ...prev, [type]: true };
        if (next.selfiePhoto && next.idFrontPhoto && next.idBackPhoto) {
          setReviewMode(true);
        }
        return next;
      });
    } catch (err: any) {
      console.error("Upload error", err);
      setError(err?.message || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  const allUploaded = uploaded.selfiePhoto && uploaded.idFrontPhoto && uploaded.idBackPhoto;
  const buttonEnabled = !!allUploaded;

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
          <p className="text-gray-500 mb-6 text-sm">You can return to the login page while we review your account.</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold"
            onClick={() => router.push("/login")}
          >
            Return to Login
          </button>
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
              />
              {uploaded.selfiePhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">ID Front Photo</label>
              <input
                type="file"
                name="idFrontPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
              />
              {uploaded.idFrontPhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">ID Back Photo</label>
              <input
                type="file"
                name="idBackPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
              />
              {uploaded.idBackPhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
            </div>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">{error}</div>
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
