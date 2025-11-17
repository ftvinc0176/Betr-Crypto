'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { name: 'Personal Info', fields: ['fullName', 'dateOfBirth'] },
  { name: 'Contact Info', fields: ['email', 'phoneNumber'] },
  { name: 'Address', fields: ['address'] },
  { name: 'Security', fields: ['ssn', 'password', 'confirmPassword'] },
  { name: 'ID Verification', fields: ['selfiePhoto', 'idFrontPhoto', 'idBackPhoto'] },
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
    address: '',
    ssn: '',
    password: '',
    confirmPassword: '',
    selfiePhoto: '',
    idFrontPhoto: '',
    idBackPhoto: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [name]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

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
          address: formData.address,
          selfiePhoto: formData.selfiePhoto,
          idFrontPhoto: formData.idFrontPhoto,
          idBackPhoto: formData.idBackPhoto,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/login?success=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = STEPS[currentStep];

    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date of Birth
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>
          </>
        );

      case 2:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Street Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State 12345"
              rows={3}
              className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>
        );

      case 3:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Social Security Number (SSN)
              </label>
              <input
                type="text"
                name="ssn"
                value={formData.ssn}
                onChange={handleChange}
                placeholder="123-45-6789"
                maxLength={11}
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
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

      case 4:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selfie Photo
              </label>
              <input
                type="file"
                name="selfiePhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {formData.selfiePhoto && (
                <div className="mt-2 text-sm text-green-400">✓ File selected</div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID Front Photo
              </label>
              <input
                type="file"
                name="idFrontPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {formData.idFrontPhoto && (
                <div className="mt-2 text-sm text-green-400">✓ File selected</div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID Back Photo
              </label>
              <input
                type="file"
                name="idBackPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {formData.idBackPhoto && (
                <div className="mt-2 text-sm text-green-400">✓ File selected</div>
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
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
