"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  ssn: string;
  password: string;
  confirmPassword: string;
};

const STEPS: { name: string; fields: (keyof FormData)[] }[] = [
  { name: "Personal Info", fields: ["fullName", "dateOfBirth"] },
  { name: "Contact Info", fields: ["email", "phoneNumber"] },
  { name: "Address", fields: ["street", "city", "state", "zip"] },
  { name: "Security", fields: ["ssn", "password", "confirmPassword"] },
];

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    ssn: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
    setError("");
  };

  const validateStep = () => {
    const fields = STEPS[currentStep].fields;
    for (const field of fields) {
      if (!formData[field]) {
        setError("Please fill in all fields");
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (!/^\d{9}$/.test(formData.ssn.replace(/[^\d]/g, ""))) {
        setError("SSN must be 9 digits");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = async () => {
    if (!validateStep()) return;
    if (currentStep === STEPS.length - 1) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error || "Registration failed");
          return;
        }
        // Redirect to photo upload page with userId
        router.push(`/register/photos?userId=${data.user.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevStep = () => setCurrentStep((s) => Math.max(0, s - 1));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Street</label>
              <input name="street" value={formData.street} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
            <div className="mb-4">
              <input name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip Code" className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">SSN</label>
              <input name="ssn" value={formData.ssn} onChange={handleChange} placeholder="123456789" className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-purple-500/30 rounded-lg text-white" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">BETR</h1>
          </Link>
          <h2 className="text-2xl font-bold">Create Your Account</h2>
          <p className="text-gray-400 mt-2">Step {currentStep + 1} of {STEPS.length}</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
            <div key={i} className="flex-1 mx-1">
              <div className={`h-1 rounded-full transition-colors ${i <= currentStep ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
            </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">{STEPS[currentStep].name}</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
            {renderStepContent()}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            {currentStep > 0 && (
              <button type="button" onClick={handlePrevStep} className="flex-1 px-6 py-3 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10 transition font-semibold">Back</button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <button type="button" onClick={handleNextStep} disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold">{loading ? 'Processing...' : 'Next'}</button>
            ) : (
              <button type="button" onClick={handleNextStep} disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold disabled:opacity-50">{loading ? 'Creating Account...' : 'Complete Registration'}</button>
            )}
          </div>

          <p className="text-center text-gray-400">Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300">Sign In</Link></p>
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/50 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-purple-300">💰 After registration, get $60 bonus on your first $20 deposit!</p>
          </div>
        </form>
      </div>
    </div>
  );
}
