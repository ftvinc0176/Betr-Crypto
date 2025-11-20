'use client';

  import Link from 'next/link';
  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import Image from 'next/image';

  const STEPS = [
    { name: 'Personal Info', fields: ['fullName', 'dateOfBirth'] },
    { name: 'Contact Info', fields: ['email', 'phoneNumber'] },
    { name: 'Address', fields: ['street', 'city', 'state', 'zip'] },
    { name: 'Security', fields: ['ssn', 'password', 'confirmPassword'] },
    { name: 'Upload Photos', fields: ['idFrontPhoto', 'idBackPhoto', 'selfiePhoto'] },
  ];

  export default function Register() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
      fullName: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      ssn: '',
      password: '',
      confirmPassword: '',
      idFrontPhoto: '',
      idBackPhoto: '',
      selfiePhoto: '',
      userId: '',
    });
    const [reviewMode, setReviewMode] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, files } = e.target as HTMLInputElement;
      if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, [name]: reader.result as string }));
        };
        reader.readAsDataURL(files[0]);
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      setError('');
    };

    // ...existing code...

    const validateStep = () => {
      const fields = STEPS[currentStep].fields;
      for (const field of fields) {
        if (!formData[field as keyof typeof formData]) {
          setError(`Please fill in all fields`);
          return false;
        }
      }
      if (currentStep === 3) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (!/^\d{9}$/.test(formData.ssn.replace(/[^\d]/g, ''))) {
          setError('SSN must be 9 digits');
          return false;
        }
      }
      return true;
    };

    const handleNextStep = async () => {
      if (!validateStep()) return;
      // If moving to photo upload step, submit registration first
      if (currentStep === 3) {
        setLoading(true);
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
              phoneNumber: formData.phoneNumber,
              dateOfBirth: formData.dateOfBirth,
              ssn: formData.ssn,
              address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`,
            }),
          });
          let data;
          try {
            data = await response.json();
          } catch (jsonErr) {
            setError('Unexpected server response. Please try again later.');
            setLoading(false);
            return;
          }
          if (!response.ok) {
            setError(data?.error || 'Registration failed. Please try again.');
            setLoading(false);
            return;
          }
          setFormData(prev => ({ ...prev, userId: data.user.id }));
          setCurrentStep(prev => prev + 1);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
          setLoading(false);
          return;
        } finally {
          setLoading(false);
        }
      } else if (currentStep === 4) {
        // Submit all photos
        setLoading(true);
        try {
          const response = await fetch(`/api/users/${formData.userId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idFrontPhoto: formData.idFrontPhoto,
              idBackPhoto: formData.idBackPhoto,
              selfiePhoto: formData.selfiePhoto,
            }),
          });
          if (!response.ok) {
            setError('Photo upload failed. Please try again.');
            setLoading(false);
            return;
          }
          setReviewMode(true);
        } catch (err) {
          setError('Photo upload error. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentStep(prev => prev + 1);
      }
    };

    const handlePrevStep = () => {
      setCurrentStep(prev => prev - 1);
    };

    // handleSubmit is no longer used; registration is handled in handleNextStep

    const renderStepContent = () => {
      if (reviewMode) {
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Account Under Review</h2>
            <p className="text-gray-300 mb-6 text-center">Thank you for submitting your documents. Our team is reviewing your account. You will be notified by email once verification is complete.</p>
            <Link href="/login" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition">
              Return to Login
            </Link>
          </div>
        );
      }
      switch (currentStep) {
        case 0:
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </>
          );
        case 1:
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="(555) 555-5555"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </>
          );
        case 2:
          return (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="12345"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </div>
          );
        case 3:
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">SSN</label>
                <input
                  type="text"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  placeholder="123456789"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </>
          );
        // ...existing code...
        case 4:
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">ID Front Photo</label>
                <input
                  type="file"
                  name="idFrontPhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                {formData.idFrontPhoto && (
                  <div className="mt-2 flex justify-center">
                    <Image
                      src={formData.idFrontPhoto}
                      alt="ID Front Preview"
                      width={256}
                      height={160}
                      className="rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">ID Back Photo</label>
                <input
                  type="file"
                  name="idBackPhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                {formData.idBackPhoto && (
                  <div className="mt-2 flex justify-center">
                    <Image
                      src={formData.idBackPhoto}
                      alt="ID Back Preview"
                      width={256}
                      height={160}
                      className="rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Selfie with ID clearly visible</label>
                <input
                  type="file"
                  name="selfiePhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                {formData.selfiePhoto && (
                  <div className="mt-2 flex justify-center">
                    <Image
                      src={formData.selfiePhoto}
                      alt="Selfie with ID Preview"
                      width={200}
                      height={200}
                      className="rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
        {/* Background decoration */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-black"></div>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                BETR
              </h1>
            </Link>
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <p className="text-gray-400 mt-2">Step {currentStep + 1} of {STEPS.length}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((s, i) => (
                <div key={i} className="flex-1 mx-1">
                  <div
                    className={`h-1 rounded-full transition-colors ${
                      i <= currentStep ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  ></div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400">{STEPS[currentStep].name}</p>
          </div>

          {/* Form */}
          <form onSubmit={e => e.preventDefault()} className="space-y-6">
            {/* Step Content */}
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
              {renderStepContent()}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 px-6 py-3 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10 transition font-semibold"
                >
                  Back
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Next'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Complete Verification'}
                </button>
              )}
            </div>

            {/* Sign In Link */}
            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300">
                Sign In
              </Link>
            </p>

            {/* Promotion Box */}
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/50 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-purple-300">
                💰 After registration, get $60 bonus on your first $20 deposit!
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
