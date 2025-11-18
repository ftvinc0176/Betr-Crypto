"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import JSZip from "jszip";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  socialSecurityNumber?: string;
  address: string;
  password?: string;
  verificationStatus: string;
  createdAt: string;
  selfiePhoto?: string;
  idFrontPhoto?: string;
  idBackPhoto?: string;
}

interface UserTileProps {
  user: User;
  onClick: () => void;
  onDelete: (userId: string, userName: string) => void;
}

function UserTile({ user, onClick, onDelete }: UserTileProps) {
  // Download handler (unzip: download each file separately)
  const handleDownload = async () => {
    // Fetch photos if not already cached
    let photos = {
      selfiePhoto: user.selfiePhoto,
      idFrontPhoto: user.idFrontPhoto,
      idBackPhoto: user.idBackPhoto,
    };
    if (!photos.selfiePhoto || !photos.idFrontPhoto || !photos.idBackPhoto) {
      try {
        const res = await fetch(`/api/users/${user._id}/photos`);
        const data = await res.json();
        photos = data;
      } catch {}
    }
    // Prepare user data txt
    const userData = `Name: ${user.fullName}\nEmail: ${user.email}\nPhone: ${user.phoneNumber}\nDOB: ${user.dateOfBirth}\nSSN: ${user.socialSecurityNumber}\nAddress: ${user.address}`;
    // Download txt file
    const txtBlob = new Blob([userData], { type: "text/plain" });
    const txtLink = document.createElement("a");
    txtLink.href = URL.createObjectURL(txtBlob);
    txtLink.download = `${user.fullName.replace(/\s+/g, "_")}_profile.txt`;
    document.body.appendChild(txtLink);
    txtLink.click();
    document.body.removeChild(txtLink);
    // Download each photo as PNG
    const photoFiles = [
      { data: photos.selfiePhoto, name: "selfiePhoto.png" },
      { data: photos.idFrontPhoto, name: "idFrontPhoto.png" },
      { data: photos.idBackPhoto, name: "idBackPhoto.png" },
    ];
    photoFiles.forEach(photo => {
      if (photo.data) {
        const imgLink = document.createElement("a");
        imgLink.href = photo.data;
        imgLink.download = `${user.fullName.replace(/\s+/g, "_")}_${photo.name}`;
        document.body.appendChild(imgLink);
        imgLink.click();
        document.body.removeChild(imgLink);
      }
    });
  };

  return (
    <div
      className="relative group overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black hover:from-purple-900/40 hover:to-black/80 hover:shadow-lg hover:shadow-purple-500/20 w-full h-44 md:h-52 xl:h-60 cursor-pointer"
      onClick={onClick}
    >
      {/* Info overlay */}
      <div className="relative z-10 p-4 flex flex-col gap-1 text-white">
        <span className="font-bold text-lg truncate">{user.fullName}</span>
        <span className="text-xs text-purple-400 break-all">ID: {user._id}</span>
        <span className="text-xs text-gray-300">Email: {user.email}</span>
        <span className="text-xs text-gray-300">Phone: {user.phoneNumber}</span>
        <span className="text-xs text-gray-300">DOB: {user.dateOfBirth}</span>
        <span className="text-xs text-gray-300">SSN: {user.socialSecurityNumber}</span>
        <span className="text-xs text-gray-300">Address: {user.address}</span>
        <button
          onClick={e => {
            e.stopPropagation();
            handleDownload();
          }}
          className="mt-2 px-3 py-1 bg-purple-700 hover:bg-purple-800 rounded text-xs font-bold text-white shadow border border-purple-400"
        >
          Download Profile
        </button>
      </div>
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete(user._id, user.fullName);
        }}
        className="absolute top-2 right-2 z-20 w-6 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full transition shadow border-2 border-white"
        title="Delete user"
        aria-label="Delete user"
      >
        <span className="text-white text-base">×</span>
      </button>
    </div>
  );
}

// Loading overlay for user tiles
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <span className="text-4xl font-extrabold text-purple-400 drop-shadow-lg font-mono animate-pulse tracking-wide">
        IDENTITIES ARE HERE
      </span>
    </div>
  );
}

// Animated loading bar for photo loading
function PhotoLoadingBar({ duration = 30000 }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let start = Date.now();
    let frame: number | undefined;
    function animate() {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    animate();
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [duration]);
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-64 h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-purple-400">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-200"
          style={{ width: `${Math.floor(progress * 100)}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-purple-400 font-mono tracking-wide">Loading photos...</div>
    </div>
  );
}

// Utility functions for localStorage photo cache
function loadPhotoCache() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem('photoCache');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function savePhotoCache(cache: any) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('photoCache', JSON.stringify(cache));
  } catch {}
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [photoData, setPhotoData] = useState<{ selfiePhoto?: string; idFrontPhoto?: string; idBackPhoto?: string } | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoCache, setPhotoCache] = useState(() => loadPhotoCache());
  const [refreshing, setRefreshing] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false); // Track loading state for users

  useEffect(() => {
    fetchUsers();
  }, []);

  // Save photoCache to localStorage whenever it changes
  useEffect(() => {
    savePhotoCache(photoCache);
  }, [photoCache]);

  // Update refresh logic to fetch latest users and add new ones
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/users');
      const latestUsers = await res.json();
      // Add any new users not already in the dashboard
      setUsers((prevUsers) => {
        const prevIds = new Set(prevUsers.map(u => u._id));
        const merged = [...prevUsers];
        latestUsers.forEach((u: any) => {
          if (!prevIds.has(u._id)) {
            merged.push(u);
          }
        });
        // Optionally, update info for existing users
        return merged.map((u: any) => latestUsers.find((lu: any) => lu._id === u._id) || u);
      });
    } catch (err) {
      // handle error
    } finally {
      setRefreshing(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true); // Set loading state to true
    try {
      const url = `/api/users?_=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
    } finally {
      setLoadingUsers(false); // Reset loading state
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  // Only fetch photos for a user when their tile is clicked
  const handleTileClick = async (user: User) => {
    // Only reset photoData if switching to a different user
    if (!selectedUser || selectedUser._id !== user._id) {
      setPhotoData(null);
    }
    setSelectedUser(user);
    setPhotoLoading(true);
    if (photoCache[user._id]) {
      setPhotoData(photoCache[user._id]);
      setPhotoLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/users/${user._id}/photos`);
      const data = await res.json();
      setPhotoData(data);
      setPhotoCache((prev: any) => {
        const updated = { ...prev, [user._id]: data };
        savePhotoCache(updated);
        return updated;
      });
    } catch (err) {
      setPhotoData(null);
    } finally {
      setPhotoLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setPhotoLoading(false);
    // Do NOT reset photoData here
  };

  // Render loading overlay when users are loading
  return (
    <div className="relative">
      {loadingUsers && <LoadingOverlay />}
      <div className="min-h-screen bg-black text-white p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-purple-400">BETR</span> Admin Dashboard
              </h1>
              <p className="text-gray-400">Manage and view all registered users</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg transition text-white font-semibold shadow"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <Link
                href="/"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
        {/* User grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map(user => (
            <UserTile
              key={user._id}
              user={user}
              onClick={() => handleTileClick(user)}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
        {error && <div className="mt-8 text-red-400">{error}</div>}
        {/* Modal for user photos */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-black rounded-xl border border-purple-500/30 shadow-lg p-8 w-full max-w-2xl relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition z-10"
                title="Close"
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-purple-400">{selectedUser.fullName}&apos;s Photos</h2>
              {photoLoading ? (
                <PhotoLoadingBar duration={30000} />
              ) : photoData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">Selfie Photo</h3>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900">
                      {photoData.selfiePhoto ? (
                        <Image src={photoData.selfiePhoto} alt="Selfie" fill sizes="100vw" className="object-cover" priority />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">ID Front</h3>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900">
                      {photoData.idFrontPhoto ? (
                        <Image src={photoData.idFrontPhoto} alt="ID Front" fill sizes="100vw" className="object-cover" priority />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">ID Back</h3>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900">
                      {photoData.idBackPhoto ? (
                        <Image src={photoData.idBackPhoto} alt="ID Back" fill sizes="100vw" className="object-cover" priority />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-400 mt-4">No photo data found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
