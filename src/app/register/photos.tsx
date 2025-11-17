// Vercel redeploy trigger: Nov 17, 2025
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
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

  if (!userId) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Missing User ID</h2>
          <p className="text-gray-400 mb-8">Please start registration before uploading photos.</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold"
            onClick={() => router.replace('/register')}
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => ({ ...prev, [name]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (type: "selfiePhoto" | "idFrontPhoto" | "idBackPhoto") => {
    setLoading(true);
    setError("");
    let endpoint = "";
    let body: any = {};
    if (type === "selfiePhoto") {
      endpoint = `/api/users/${userId}/selfie`;
      body = { selfiePhoto: photos.selfiePhoto };
    } else if (type === "idFrontPhoto") {
      endpoint = `/api/users/${userId}/idFront`;
      body = { idFrontPhoto: photos.idFrontPhoto };
    } else if (type === "idBackPhoto") {
      endpoint = `/api/users/${userId}/idBack`;
      body = { idBackPhoto: photos.idBackPhoto };
    }
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Upload failed. Please try again.");
        return;
      }
      setUploaded(prev => ({ ...prev, [type]: true }));
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Button should be enabled if all files are uploaded, or if all files are present and marked uploaded
  const allFilesPresent = photos.selfiePhoto && photos.idFrontPhoto && photos.idBackPhoto;
  const allUploaded = uploaded.selfiePhoto && uploaded.idFrontPhoto && uploaded.idBackPhoto;
  const buttonEnabled = allUploaded || allFilesPresent;

  const handleContinue = () => {
    router.push("/login?success=true");
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Upload Verification Photos</h2>
          <p className="text-gray-400 mt-2">Please upload your selfie and ID photos to complete registration.</p>
        </div>
        <form className="space-y-6">
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Selfie Photo</label>
              <input
                type="file"
                name="selfiePhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {photos.selfiePhoto && !uploaded.selfiePhoto && (
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-purple-600 rounded-lg text-white font-semibold"
                  disabled={loading}
                  onClick={() => uploadPhoto("selfiePhoto")}
                >
                  {loading ? "Uploading..." : "Upload Selfie"}
                </button>
              )}
              {uploaded.selfiePhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">ID Front Photo</label>
              <input
                type="file"
                name="idFrontPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {photos.idFrontPhoto && !uploaded.idFrontPhoto && (
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-purple-600 rounded-lg text-white font-semibold"
                  disabled={loading}
                  onClick={() => uploadPhoto("idFrontPhoto")}
                >
                  {loading ? "Uploading..." : "Upload ID Front"}
                </button>
              )}
              {uploaded.idFrontPhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">ID Back Photo</label>
              <input
                type="file"
                name="idBackPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {photos.idBackPhoto && !uploaded.idBackPhoto && (
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-purple-600 rounded-lg text-white font-semibold"
                  disabled={loading}
                  onClick={() => uploadPhoto("idBackPhoto")}
                >
                  {loading ? "Uploading..." : "Upload ID Back"}
                </button>
              )}
              {uploaded.idBackPhoto && <div className="mt-2 text-sm text-green-400">✓ Uploaded</div>}
            </div>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold ${!buttonEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!buttonEnabled}
              onClick={handleContinue}
            >
              Continue to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
