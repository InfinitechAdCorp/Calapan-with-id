"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function HealthCertificatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    age: "",
    sex: "",
    purpose: "",
    hasAllergies: false,
    allergies: "",
    hasMedications: false,
    medications: "",
    hasConditions: false,
    conditions: "",
  })

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/health-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/account/applications?success=health-certificate")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Heart className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Health Certificate Application</h1>
              <p className="text-sm text-muted-foreground">Apply for a health certificate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal & Health Information</CardTitle>
              <CardDescription>Provide your details for health certificate issuance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number *</Label>
                    <Input
                      id="phone"
                      placeholder="09XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    placeholder="Street, Barangay, City"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date of Birth *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateFormData("birthDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="0"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex *</Label>
                    <Select value={formData.sex} onValueChange={(value) => updateFormData("sex", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Select value={formData.purpose} onValueChange={(value) => updateFormData("purpose", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="school">School Requirement</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food-handling">Food Handling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">Medical History</h3>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="hasAllergies"
                        checked={formData.hasAllergies}
                        onCheckedChange={(checked) => updateFormData("hasAllergies", checked as boolean)}
                      />
                      <Label htmlFor="hasAllergies" className="font-normal">
                        I have allergies
                      </Label>
                    </div>
                    {formData.hasAllergies && (
                      <Input
                        placeholder="Please specify allergies"
                        value={formData.allergies}
                        onChange={(e) => updateFormData("allergies", e.target.value)}
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="hasMedications"
                        checked={formData.hasMedications}
                        onCheckedChange={(checked) => updateFormData("hasMedications", checked as boolean)}
                      />
                      <Label htmlFor="hasMedications" className="font-normal">
                        I am currently taking medications
                      </Label>
                    </div>
                    {formData.hasMedications && (
                      <Input
                        placeholder="Please list medications"
                        value={formData.medications}
                        onChange={(e) => updateFormData("medications", e.target.value)}
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="hasConditions"
                        checked={formData.hasConditions}
                        onCheckedChange={(checked) => updateFormData("hasConditions", checked as boolean)}
                      />
                      <Label htmlFor="hasConditions" className="font-normal">
                        I have existing medical conditions
                      </Label>
                    </div>
                    {formData.hasConditions && (
                      <Input
                        placeholder="Please specify conditions"
                        value={formData.conditions}
                        onChange={(e) => updateFormData("conditions", e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> You will need to visit the City Health Office for physical examination.
                  Processing time is 1-2 business days after examination.
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
