// src/components/neuronav/profile-form.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserProfile } from "@/lib/types"; // Import the updated UserProfile type

interface ProfileFormProps {
  initialData: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => Promise<void>; // Submit only changed data
  onCancel: () => void;
  isLoading: boolean;
}

const NEURODIVERSITY_OPTIONS = [
  'Dyslexic',
  'ADHD',
  'Autistic',
  'Dyspraxic',
  'Tourette\'s Syndrome',
  'Other',
];

const PROFESSION_OPTIONS = [
    "student",
    "professional",
    "other",
    "unspecified"
];

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [name, setName] = useState(initialData.name || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [gender, setGender] = useState<UserProfile['gender']>(initialData.gender || 'Rather not say');
  const [age, setAge] = useState<number | null>(initialData.age === undefined ? null : initialData.age);
  const [emergencyNumber, setEmergencyNumber] = useState(initialData.emergencyNumber || '');
  const [neurodiversity, setNeurodiversity] = useState<string[]>(initialData.neurodiversity || []);
  const [profession, setProfession] = useState<UserProfile['profession']>(initialData.profession || 'unspecified');


  // useEffect to update form fields if initialData changes (e.g., after a successful update)
  useEffect(() => {
    setName(initialData.name || '');
    setAddress(initialData.address || '');
    setGender(initialData.gender || 'Rather not say');
    setAge(initialData.age === undefined ? null : initialData.age);
    setEmergencyNumber(initialData.emergencyNumber || '');
    setNeurodiversity(initialData.neurodiversity || []);
    setProfession(initialData.profession || 'unspecified');
  }, [initialData]);

  const handleNeurodiversityChange = (option: string, checked: boolean) => {
    setNeurodiversity(prev =>
      checked ? [...prev, option] : prev.filter(item => item !== option)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: Partial<UserProfile> = {
        name: name, // Name is always required
        // Only include fields that are different from initialData or are explicitly filled
        ...(address !== (initialData.address || '') && { address }),
        ...(gender !== (initialData.gender || 'Rather not say') && { gender }),
        ...(age !== (initialData.age === undefined ? null : initialData.age) && { age }),
        ...(emergencyNumber !== (initialData.emergencyNumber || '') && { emergencyNumber }),
        // Check if neurodiversity array has changed
        ...(JSON.stringify(neurodiversity) !== JSON.stringify(initialData.neurodiversity || []) && { neurodiversity }),
        ...(profession !== (initialData.profession || 'unspecified') && { profession }),
    };

    // If a field like address becomes empty, ensure it's explicitly set to an empty string/null
    if (address === '' && initialData.address !== '') updatedData.address = '';
    if (gender === 'Rather not say' && initialData.gender !== 'Rather not say') updatedData.gender = 'Rather not say';
    if (age === null && initialData.age !== null) updatedData.age = null;
    if (emergencyNumber === '' && initialData.emergencyNumber !== '') updatedData.emergencyNumber = '';
    if (neurodiversity.length === 0 && (initialData.neurodiversity && initialData.neurodiversity.length > 0)) updatedData.neurodiversity = [];


    await onSubmit(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div>
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Profession Select */}
      <div>
        <Label htmlFor="profile-profession">Profession</Label>
        <Select
            value={profession}
            onValueChange={(value: UserProfile['profession']) => setProfession(value)}
            disabled={isLoading}
        >
            <SelectTrigger id="profile-profession">
                <SelectValue placeholder="Select your profession" />
            </SelectTrigger>
            <SelectContent>
                {PROFESSION_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* Address Input */}
      <div>
        <Label htmlFor="profile-address">Address (Optional)</Label>
        <Input
          id="profile-address"
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
          value={gender || 'Rather not say'}
          onValueChange={(value: UserProfile['gender']) => setGender(value)}
          className="flex space-x-4 mt-2"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="profile-gender-male" />
            <Label htmlFor="profile-gender-male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="profile-gender-female" />
            <Label htmlFor="profile-gender-female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Rather not say" id="profile-gender-not-say" />
            <Label htmlFor="profile-gender-not-say">Rather not say</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Age Input */}
      <div>
        <Label htmlFor="profile-age">Age (Optional)</Label>
        <Input
          id="profile-age"
          type="number"
          value={age === null ? '' : age}
          onChange={(e) => {
            const val = e.target.value;
            setAge(val === '' ? null : Number(val));
          }}
          min="0"
          disabled={isLoading}
        />
      </div>

      {/* Emergency Number Input */}
      <div>
        <Label htmlFor="profile-emergency-number">Guardian or Emergency Number (Optional)</Label>
        <Input
          id="profile-emergency-number"
          type="tel"
          value={emergencyNumber}
          onChange={(e) => setEmergencyNumber(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Neurodiversity Checkboxes */}
      <div className="space-y-2">
        <Label>Neurodiversity (Optional)</Label>
        {NEURODIVERSITY_OPTIONS.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`profile-neurodiversity-${option}`}
              checked={neurodiversity.includes(option)}
              onCheckedChange={(checked) => handleNeurodiversityChange(option, !!checked)}
              disabled={isLoading}
            />
            <Label htmlFor={`profile-neurodiversity-${option}`}>{option}</Label>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin h-5 w-5 mr-2" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
};
