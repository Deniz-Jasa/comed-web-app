'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitPatientData } from '@/lib/api';
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Patient } from '@/types';

interface PatientFormProps {
  onSuccess?: () => void;
}

export function PatientForm({ onSuccess }: PatientFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    address: '',
    city: '',
    stateProvince: '',
    email: '',
    emergencyFirstName: '',
    emergencyLastName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    medicalHistory: '',
    symptoms: '',
    visitReason: '',
    triageLevel: 'level3' as Patient['triageLevel'], // Default to Level 3 - Urgent
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('patient-info');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast.error('Please agree to the consent form');
      return;
    }
    setIsSubmitting(true);

    try {
      await submitPatientData({
        name: `${formData.firstName} ${formData.lastName}`,
        age: calculateAge(formData.dateOfBirth),
        symptoms: formData.symptoms.split(',').map(s => s.trim()),
        triageLevel: formData.triageLevel,
        medicalHistory: formData.medicalHistory,
      });
      
      toast.success('Patient data submitted successfully');
      setFormData({
        firstName: '', lastName: '', dateOfBirth: '', sex: '', address: '',
        city: '', stateProvince: '', email: '', emergencyFirstName: '',
        emergencyLastName: '', emergencyPhone: '', emergencyRelationship: '',
        medicalHistory: '', symptoms: '', visitReason: '', triageLevel: 'level3',
        consent: false
      });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit patient data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 gap-1">
          <TabsTrigger value="patient-info" className="py-2.5 px-3 h-auto whitespace-normal text-center">
            Patient Info
          </TabsTrigger>
          <TabsTrigger value="emergency" className="py-2.5 px-3 h-auto whitespace-normal text-center">
            Emergency Contact
          </TabsTrigger>
          <TabsTrigger value="medical" className="py-2.5 px-3 h-auto whitespace-normal text-center">
            Medical History
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="py-2.5 px-3 h-auto whitespace-normal text-center">
            Symptoms
          </TabsTrigger>
          <TabsTrigger value="consent" className="py-2.5 px-3 h-auto whitespace-normal text-center">
            Consent
          </TabsTrigger>
        </TabsList>

        <div className="mt-8 max-h-[60vh] overflow-y-auto px-4">
          <TabsContent value="patient-info" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  required
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Sex</label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Address</label>
              <Input
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">City</label>
                <Input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">State/Province</label>
                <Input
                  required
                  value={formData.stateProvince}
                  onChange={(e) => setFormData(prev => ({ ...prev, stateProvince: e.target.value }))}
                  placeholder="State or province"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
              />
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  required
                  value={formData.emergencyFirstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyFirstName: e.target.value }))}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  required
                  value={formData.emergencyLastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyLastName: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                required
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Relationship</label>
              <Input
                required
                value={formData.emergencyRelationship}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyRelationship: e.target.value }))}
                placeholder="Relationship to patient"
              />
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Medical History</label>
              <Textarea
                value={formData.medicalHistory}
                onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                placeholder="Please list any previous medical conditions, surgeries, or ongoing health issues"
                rows={8}
                className="min-h-[200px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Current Symptoms (comma-separated)</label>
              <Input
                required
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                placeholder="E.g., fever, cough, headache"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Reason for Visit</label>
              <Textarea
                required
                value={formData.visitReason}
                onChange={(e) => setFormData(prev => ({ ...prev, visitReason: e.target.value }))}
                placeholder="Please describe why you are visiting the emergency room today"
                rows={6}
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Initial Triage Level</label>
              <Select
                value={formData.triageLevel}
                onValueChange={(value: Patient['triageLevel']) => 
                  setFormData(prev => ({ ...prev, triageLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level1">Level 1 - Immediate (Life Threatening)</SelectItem>
                  <SelectItem value="level2">Level 2 - Emergency (Could Become Life Threatening)</SelectItem>
                  <SelectItem value="level3">Level 3 - Urgent (Not Life Threatening)</SelectItem>
                  <SelectItem value="level4">Level 4 - Semi-urgent (Not Life Threatening)</SelectItem>
                  <SelectItem value="level5">Level 5 - Non-urgent (When Time Permits)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                <p className="text-base font-medium mb-4">By checking this box, I acknowledge and agree that:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>The information I have provided is accurate and complete to the best of my knowledge.</li>
                  <li>I consent to medical treatment and understand that I have the right to refuse any procedure.</li>
                  <li>I authorize the release of my medical information to other healthcare providers involved in my care.</li>
                  <li>I understand that I am responsible for any charges not covered by my insurance.</li>
                </ul>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, consent: checked as boolean }))
                  }
                />
                <label
                  htmlFor="consent"
                  className="text-sm font-medium leading-none"
                >
                  I agree to the terms and conditions
                </label>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const tabs = ['patient-info', 'emergency', 'medical', 'symptoms', 'consent'];
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex > 0) {
              setCurrentTab(tabs[currentIndex - 1]);
            }
          }}
          disabled={currentTab === 'patient-info'}
        >
          Previous
        </Button>
        {currentTab === 'consent' ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => {
              const tabs = ['patient-info', 'emergency', 'medical', 'symptoms', 'consent'];
              const currentIndex = tabs.indexOf(currentTab);
              if (currentIndex < tabs.length - 1) {
                setCurrentTab(tabs[currentIndex + 1]);
              }
            }}
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
}