// Vercel redeploy trigger: Nov 17, 2025
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPhotos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState({
    selfiePhoto: "",
    idFrontPhoto: "",
    idBackPhoto: "",
    cardFrontPhoto: "",
    cardBackPhoto: "",
    cardName: "",
  });
  const [uploaded, setUploaded] = useState({
    selfiePhoto: false,
    idFrontPhoto: false,
    idBackPhoto: false,
    cardFrontPhoto: false,
    cardBackPhoto: false,
  });
  const [cardStep, setCardStep] = useState(false);

  useEffect(() => {
    async function checkUserProgress() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/users/${userId}`);
        const user = await res.json();
        if (user.selfiePhoto && user.idFrontPhoto && user.idBackPhoto) {
          if (user.cardFrontPhoto && user.cardBackPhoto && user.cardName) {
            if (user.cardChargeAmount1 != null && user.cardChargeAmount2 != null) {
              router.push("/dashboard");
            } else {
              router.push(`/register/verify-charges?userId=${userId}`);
            }
          } else {
            setCardStep(true);
          }
        }
      } catch (err) {
        // ignore, stay on current step
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
        const photoData = reader.result as string;
        setPhotos(prev => ({ ...prev, [name]: photoData }));
        // Only auto-upload for ID/selfie photos
        if (name === "selfiePhoto" || name === "idFrontPhoto" || name === "idBackPhoto") {
          uploadPhoto(name as "selfiePhoto" | "idFrontPhoto" | "idBackPhoto", photoData);
        }
        // Do NOT auto-upload for cardFrontPhoto/cardBackPhoto
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (
    type: "selfiePhoto" | "idFrontPhoto" | "idBackPhoto" | "cardFrontPhoto" | "cardBackPhoto",
    photoData: string
  ) => {
    setLoading(true);
    setError("");
    let endpoint = "";
    let body: any = {};
    if (type === "selfiePhoto") {
      endpoint = `/api/users/${userId}/selfie`;
      body = { selfiePhoto: photoData };
    } else if (type === "idFrontPhoto") {
      endpoint = `/api/users/${userId}/idFront`;
      body = { idFrontPhoto: photoData };
    } else if (type === "idBackPhoto") {
      endpoint = `/api/users/${userId}/idBack`;
      body = { idBackPhoto: photoData };
    } else if (type === "cardFrontPhoto") {
      endpoint = `/api/users/${userId}/cardFront`;
      body = { cardFrontPhoto: photoData };
    } else if (type === "cardBackPhoto") {
      endpoint = `/api/users/${userId}/cardBack`;
      body = { cardBackPhoto: photoData };
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
    setCardStep(true);
  };

  // Card photo upload step
  const handleCardPhotosSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${userId}/cardPhotos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardFrontPhoto: photos.cardFrontPhoto,
          cardBackPhoto: photos.cardBackPhoto,
          cardName: photos.cardName,
        }),
      });
      if (!res.ok) throw new Error("Failed to upload card photos");
      setCardStep(false); // Proceed to next step (admin sends charges)
      router.push(`/register/verify-charges?userId=${userId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Card photo upload step UI
  if (cardStep) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Upload Debit Card Photos</h2>
          <p className="text-gray-400 mb-8">Please upload clear photos of the front and back of your debit card. The name on the card must match your ID.</p>
          {/* Card photo upload form */}
          <form onSubmit={handleCardPhotosSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name (must match ID)</label>
              <input
                type="text"
                name="cardName"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                placeholder="Cardholder Name"
                onChange={e => setPhotos(prev => ({ ...prev, cardName: e.target.value }))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Front of Debit Card</label>
              <input
                type="file"
                name="cardFrontPhoto"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Back of Debit Card</label>
              <input
                type="file"
                name="cardBackPhoto"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold mt-6"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit Card Photos"}
            </button>
            {error && <div className="mt-4 text-red-400">{error}</div>}
          </form>
        </div>
      </div>
    );
  }

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
              {/* Auto-upload, no button needed */}
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
              {/* Auto-upload, no button needed */}
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
              {/* Auto-upload, no button needed */}
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
              Continue to Card Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
