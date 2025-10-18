"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, FileText, User, Home } from "lucide-react"

export default function BarangayClearancePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    age: "",
    sex: "",
    civilStatus: "",
    yearsOfResidency: "",
    barangay: "",
    purpose: "",
    validId: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, validId: e.target.files![0] }))
    }
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value)
        }
      })

      const response = await fetch("/api/barangay-clearance", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        setReferenceNumber(data.data.reference_number)
        setSubmitSuccess(true)
      } else {
        alert(data.message || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>Your barangay clearance application has been received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Reference Number</p>
              <p className="text-xl font-bold text-orange-600">{referenceNumber}</p>
            </div>
            <p className="text-sm text-gray-600">
              Please save this reference number for tracking your application status.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Residency Info", icon: Home },
    { number: 3, title: "Documents", icon: FileText },
    { number: 4, title: "Review", icon: CheckCircle2 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Barangay Clearance Application</h1>
          <p className="text-gray-600">Apply for your barangay clearance certificate</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${currentStep > step.number ? "bg-orange-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep} of 4</CardTitle>
            <CardDescription>{steps[currentStep - 1].title}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Juan Dela Cruz"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="juan@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="09123456789"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="25"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex *</Label>
                    <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">Civil Status *</Label>
                    <Select
                      value={formData.civilStatus}
                      onValueChange={(value) => handleInputChange("civilStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="House No., Street, Barangay, City, Province"
                    rows={3}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Residency Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="barangay">Barangay *</Label>
                    <Input
                      id="barangay"
                      value={formData.barangay}
                      onChange={(e) => handleInputChange("barangay", e.target.value)}
                      placeholder="Barangay name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfResidency">Years of Residency *</Label>
                    <Input
                      id="yearsOfResidency"
                      type="number"
                      value={formData.yearsOfResidency}
                      onChange={(e) => handleInputChange("yearsOfResidency", e.target.value)}
                      placeholder="5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Clearance *</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    placeholder="e.g., Employment, Business Permit, School Requirements, etc."
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="validId">Valid ID *</Label>
                  <Input id="validId" type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
                  <p className="text-sm text-gray-500">Upload a copy of your valid ID (PDF, JPG, PNG - Max 10MB)</p>
                  {formData.validId && <p className="text-sm text-orange-600">File selected: {formData.validId.name}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Full Name:</span>
                      <p className="font-medium">{formData.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Birth Date:</span>
                      <p className="font-medium">{formData.birthDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <p className="font-medium">{formData.age}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sex:</span>
                      <p className="font-medium capitalize">{formData.sex}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Civil Status:</span>
                      <p className="font-medium capitalize">{formData.civilStatus}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Address:</span>
                      <p className="font-medium">{formData.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Residency Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Barangay:</span>
                      <p className="font-medium">{formData.barangay}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Years of Residency:</span>
                      <p className="font-medium">{formData.yearsOfResidency} years</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Purpose:</span>
                      <p className="font-medium">{formData.purpose}</p>
                    </div>
                  </div>
                </div>

                {formData.validId && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Documents</h3>
                    <p className="text-sm">Valid ID: {formData.validId.name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}