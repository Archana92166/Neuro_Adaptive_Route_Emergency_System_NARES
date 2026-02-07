// src/components/neuronav/signup-form.tsx

"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SignUpCredentials } from "@/lib/types"; // Import the updated type

interface SignUpFormProps {
  onSubmit: (data: SignUpCredentials) => void;
  isLoading: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [address, setAddress] = useState<string>(''); // State for address
  const [gender, setGender] = useState<SignUpCredentials['gender']>(); // State for gender (can be undefined initially)
  const [age, setAge] = useState<number | null>(null); // State for age (can be null initially)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the SignUpCredentials object with all collected data
        const formData: SignUpCredentials = {
          name,
          email,
          password,
          // Required fields in the type: provide safe defaults
          mobile: '',
          emergencyMobile: '',
          profession: 'other',
          // Always include fields that the type expects (use empty string when not provided)
          address: address || '',
          gender: gender || '',
          // Only include optional age if it has a value
          ...(age !== null && { age }), // Add age only if it's not null
        };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div>
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Email Input */}
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Password Input */}
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Address Input */}
      <div>
        <Label htmlFor="signup-address">Address (Optional)</Label>
        <Input
          id="signup-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Gender Radio Buttons */}
      <div>
        <Label>Gender (Optional)</Label>
        <RadioGroup
          value={gender || ''} // Provide empty string for controlled component if gender is undefined
          onValueChange={(value: SignUpCredentials['gender']) => setGender(value)}
          className="flex space-x-4 mt-2"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="gender-male" />
            <Label htmlFor="gender-male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="gender-female" />
            <Label htmlFor="gender-female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Rather not say" id="gender-not-say" />
            <Label htmlFor="gender-not-say">Rather not say</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Age Input */}
      <div>
        <Label htmlFor="signup-age">Age (Optional)</Label>
        <Input
          id="signup-age"
          type="number"
          value={age === null ? '' : age} // Display empty string if age is null
          onChange={(e) => {
            const val = e.target.value;
            setAge(val === '' ? null : Number(val)); // Store null if empty, else number
          }}
          min="0"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="animate-spin h-5 w-5 mr-2" />
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};
