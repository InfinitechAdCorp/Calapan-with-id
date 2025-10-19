"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, User, MapPin, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const steps = [
  { id: 1, name: "Business Information", icon: Building2 },
  { id: 2, name: "Owner Information", icon: User },
  { id: 3, name: "Location Details", icon: MapPin },
  { id: 4, name: "Review & Submit", icon: FileText },
]

export default function BusinessPermitPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessCategory: "",
    businessCategoryOther: "",
    businessDescription: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAddress: "",
    businessAddress: "",
    barangay: "",
    lotNumber: "",
    floorArea: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("No authentication token found. Please log in again.")
        setIsSubmitting(false)
        return
      }

      console.log("Token from localStorage:", token.substring(0, 20) + "...")
      console.log("Submitting form data:", formData)

      const response = await fetch("/api/business-permit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      console.log("Response status:", response.status)
      console.log("Response data:", data)

      if (response.ok && data.success) {
        router.push("/account/applications?success=business-permit")
      } else {
        setError(data.message || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      setError("An unexpected error occurred. Please try again.")
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
          <div>
            <h1 className="text-xl font-bold">Business Permit Application</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? "bg-orange-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter your business details"}
              {currentStep === 2 && "Provide owner information"}
              {currentStep === 3 && "Specify business location"}
              {currentStep === 4 && "Review your application before submitting"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={(e) => updateFormData("businessName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => updateFormData("businessType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">Business Category *</Label>
                    <Select
                      value={formData.businessCategory}
                      onValueChange={(value) => updateFormData("businessCategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail Store</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="cafe">Cafe/Coffee Shop</SelectItem>
                        <SelectItem value="services">Professional Services</SelectItem>
                        <SelectItem value="salon">Salon/Spa</SelectItem>
                        <SelectItem value="automotive">Automotive Services</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="healthcare">Healthcare Services</SelectItem>
                        <SelectItem value="education">Education/Training</SelectItem>
                        <SelectItem value="technology">Technology/IT Services</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="wholesale">Wholesale/Distribution</SelectItem>
                        <SelectItem value="entertainment">Entertainment/Recreation</SelectItem>
                        <SelectItem value="hotel">Hotel/Accommodation</SelectItem>
                        <SelectItem value="transportation">Transportation Services</SelectItem>
                        <SelectItem value="agriculture">Agriculture/Farming</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.businessCategory === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="businessCategoryOther">Please specify business category *</Label>
                    <Input
                      id="businessCategoryOther"
                      placeholder="Enter your business category"
                      value={formData.businessCategoryOther}
                      onChange={(e) => updateFormData("businessCategoryOther", e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description *</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Describe your business activities"
                    rows={4}
                    value={formData.businessDescription}
                    onChange={(e) => updateFormData("businessDescription", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Full Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="Enter full name"
                    value={formData.ownerName}
                    onChange={(e) => updateFormData("ownerName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Email Address *</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.ownerEmail}
                      onChange={(e) => updateFormData("ownerEmail", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Contact Number *</Label>
                    <Input
                      id="ownerPhone"
                      placeholder="09XX XXX XXXX"
                      value={formData.ownerPhone}
                      onChange={(e) => updateFormData("ownerPhone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerAddress">Residential Address *</Label>
                  <Textarea
                    id="ownerAddress"
                    placeholder="Street, Barangay, City"
                    rows={3}
                    value={formData.ownerAddress}
                    onChange={(e) => updateFormData("ownerAddress", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    id="businessAddress"
                    placeholder="Street, Building Name/Number"
                    rows={3}
                    value={formData.businessAddress}
                    onChange={(e) => updateFormData("businessAddress", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barangay">Barangay *</Label>
                  <Input
                    id="barangay"
                    placeholder="Enter barangay"
                    value={formData.barangay}
                    onChange={(e) => updateFormData("barangay", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lotNumber">Lot Number</Label>
                    <Input
                      id="lotNumber"
                      placeholder="Enter lot number"
                      value={formData.lotNumber}
                      onChange={(e) => updateFormData("lotNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floorArea">Floor Area (sq.m) *</Label>
                    <Input
                      id="floorArea"
                      type="number"
                      placeholder="Enter floor area"
                      value={formData.floorArea}
                      onChange={(e) => updateFormData("floorArea", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Business Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Business Name:</span> {formData.businessName}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span> {formData.businessType}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span>{" "}
                        {formData.businessCategory === "other" && formData.businessCategoryOther
                          ? formData.businessCategoryOther
                          : formData.businessCategory}
                      </p>
                      <p>
                        <span className="font-medium">Description:</span> {formData.businessDescription}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Owner Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span> {formData.ownerName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {formData.ownerEmail}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {formData.ownerPhone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {formData.ownerAddress}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Location Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Business Address:</span> {formData.businessAddress}
                      </p>
                      <p>
                        <span className="font-medium">Barangay:</span> {formData.barangay}
                      </p>
                      <p>
                        <span className="font-medium">Lot Number:</span> {formData.lotNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Floor Area:</span> {formData.floorArea} sq.m
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  Back
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button onClick={handleNext} className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
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