'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  socialSecurityNumber?: string;
  address: string;
  password?: string;
  idFrontPhoto?: string;
  idBackPhoto?: string;
  selfiePhoto?: string;
  verificationStatus: string;
  createdAt: string;
}

interface UserTileProps {
  user: User;
  onClick: () => void;
  onDelete: (userId: string, userName: string) => void;
}

function UserTile({ user, onClick, onDelete }: UserTileProps) {
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const tileRef = useRef<HTMLButtonElement>(null);
  const isLoadingRef = useRef(false);
  const selfiePhotoRef = useRef<string | null>(null);

  const loadSelfiePhoto = useCallback(async () => {
    if (isLoadingRef.current || selfiePhotoRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setPhotoLoading(true);
      const response = await fetch(`/api/users/${user._id}/selfie`);
      if (response.ok) {
        const data = await response.json();
        selfiePhotoRef.current = data.selfiePhoto;
        setSelfiePhoto(data.selfiePhoto);
      }
    } catch (error) {
      console.error('Failed to load selfie photo:', error);
    } finally {
      setPhotoLoading(false);
      isLoadingRef.current = false;
    }
  }, [user._id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !selfiePhotoRef.current && !isLoadingRef.current) {
            loadSelfiePhoto();
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = tileRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <button
        ref={tileRef}
        onClick={onClick}
        className="group relative overflow-hidden rounded-xl border border-purple-500/30 hover:border-purple-500 transition-all duration-300 bg-gradient-to-br from-purple-900/20 to-black hover:from-purple-900/40 hover:to-black/80 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-105 w-full"
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-900 overflow-hidden">
          {selfiePhoto ? (
            <img
              src={selfiePhoto}
              alt={`${user.fullName} selfie`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-black">
              {photoLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              ) : (
                <span className="text-6xl">👤</span>
              )}
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        </div>

        {/* Info Container */}
        <div className="p-4 bg-black/50 backdrop-blur">
          <h3 className="font-bold text-lg mb-1 truncate text-white group-hover:text-purple-400 transition">
            {user.fullName}
          </h3>
          <p className="text-sm text-gray-400 truncate mb-2">{user.email}</p>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                user.verificationStatus === 'verified'
                  ? 'bg-green-500/20 text-green-400'
                  : user.verificationStatus === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {user.verificationStatus || 'pending'}
            </span>
            <span className="text-xs text-gray-500">Click to view</span>
          </div>
        </div>
      </button>

      {/* Delete Button */}
      <button
        onClick={(e) => {
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

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserLoading, setSelectedUserLoading] = useState(false);
  const [error, setError] = useState('');


  // Initial load: fetch users once and cache in state
  useEffect(() => {
    fetchUsers();
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await fetch('/api/users');
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      console.log('Users data:', data);
      setUsers(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMsg);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove user from local state
        setUsers(prev => prev.filter(user => user._id !== userId));
        alert(`${userName} has been deleted successfully.`);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      setSelectedUserLoading(true);
      console.log('Fetching user details:', userId);
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const userData = await response.json();
      setSelectedUser(userData);
    } catch (err) {
      console.error('Fetch user details error:', err);
      setError('Failed to load user details');
    } finally {
      setSelectedUserLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
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
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              href="/"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <p className="text-gray-400">Total Users: {users.length}</p>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserTile
            key={user._id}
            user={user}
            onClick={() => fetchUserDetails(user._id)}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedUser(null)}
            className="absolute inset-0"
            aria-label="Close modal"
          />
          <div className="relative bg-gradient-to-br from-black to-purple-900/30 border border-purple-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition z-10"
            >
              ✕
            </button>

            {selectedUserLoading ? (
              <div className="p-8 flex items-center justify-center min-h-96">
                <p className="text-gray-400">Loading user details...</p>
              </div>
            ) : (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">
                      Selfie Photo
                    </h3>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900">
                      {selectedUser.selfiePhoto ? (
                        <img
                          src={selectedUser.selfiePhoto}
                          alt="Selfie"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">
                      ID Front
                    </h3>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900">
                      {selectedUser.idFrontPhoto ? (
                        <img
                          src={selectedUser.idFrontPhoto}
                          alt="ID Front"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">
                      ID Back
                    </h3>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-gray-900">
                      {selectedUser.idBackPhoto ? (
                        <img
                          src={selectedUser.idBackPhoto}
                          alt="ID Back"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-3xl font-bold">{selectedUser.fullName}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Email Address</p>
                        <p className="text-white font-medium break-all">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                        <p className="text-white font-medium">{selectedUser.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Date of Birth</p>
                        <p className="text-white font-medium">{formatDate(selectedUser.dateOfBirth)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Social Security Number</p>
                        <p className="text-white font-medium">{selectedUser.socialSecurityNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Password</p>
                        <p className="text-white font-medium break-all">{selectedUser.password}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Verification Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            selectedUser.verificationStatus === 'verified'
                              ? 'bg-green-500/20 text-green-400'
                              : selectedUser.verificationStatus === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {selectedUser.verificationStatus || 'pending'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Registered On</p>
                        <p className="text-white font-medium">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-purple-500/20 pt-6">
                    <p className="text-sm text-gray-400 mb-2">Street Address</p>
                    <p className="text-white font-medium leading-relaxed">{selectedUser.address}</p>
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
