"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, User, FileText, Upload, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const steps = [
  { id: 1, name: "Project Details", icon: Home },
  { id: 2, name: "Owner Information", icon: User },
  { id: 3, name: "Documents", icon: Upload },
  { id: 4, name: "Review & Submit", icon: FileText },
]

export default function BuildingPermitPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buildingPlans, setBuildingPlans] = useState<File | null>(null)
  const [landTitle, setLandTitle] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    projectType: "",
    projectScope: "",
    projectDescription: "",
    lotArea: "",
    floorArea: "",
    numberOfFloors: "",
    estimatedCost: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAddress: "",
    propertyAddress: "",
    barangay: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBuildingPlansChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBuildingPlans(e.target.files[0])
    }
  }

  const handleLandTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLandTitle(e.target.files[0])
    }
  }

  const removeBuildingPlans = () => {
    setBuildingPlans(null)
  }

  const removeLandTitle = () => {
    setLandTitle(null)
  }

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
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

      const response = await fetch("/api/building-permit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push("/account/applications?success=building-permit")
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
            <h1 className="text-xl font-bold">Building Permit Application</h1>
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
              {currentStep === 1 && "Provide details about your construction project"}
              {currentStep === 2 && "Enter property owner information"}
              {currentStep === 3 && "Upload required documents"}
              {currentStep === 4 && "Review your application"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => updateFormData("projectType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-construction">New Construction</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="addition">Addition</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectScope">Project Scope *</Label>
                    <Select
                      value={formData.projectScope}
                      onValueChange={(value) => updateFormData("projectScope", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description *</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Describe the construction project"
                    rows={4}
                    value={formData.projectDescription}
                    onChange={(e) => updateFormData("projectDescription", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lotArea">Lot Area (sq.m)</Label>
                    <Input
                      id="lotArea"
                      type="number"
                      placeholder="0"
                      value={formData.lotArea}
                      onChange={(e) => updateFormData("lotArea", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floorArea">Floor Area (sq.m)</Label>
                    <Input
                      id="floorArea"
                      type="number"
                      placeholder="0"
                      value={formData.floorArea}
                      onChange={(e) => updateFormData("floorArea", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfFloors">Number of Floors *</Label>
                    <Input
                      id="numberOfFloors"
                      type="number"
                      placeholder="0"
                      value={formData.numberOfFloors}
                      onChange={(e) => updateFormData("numberOfFloors", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost (PHP) *</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    placeholder="0.00"
                    value={formData.estimatedCost}
                    onChange={(e) => updateFormData("estimatedCost", e.target.value)}
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
                  <Label htmlFor="ownerAddress">Owner Address *</Label>
                  <Textarea
                    id="ownerAddress"
                    placeholder="Street, Barangay, City"
                    rows={3}
                    value={formData.ownerAddress}
                    onChange={(e) => updateFormData("ownerAddress", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Property Address *</Label>
                  <Textarea
                    id="propertyAddress"
                    placeholder="Street, Barangay, City"
                    rows={3}
                    value={formData.propertyAddress}
                    onChange={(e) => updateFormData("propertyAddress", e.target.value)}
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
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Building Plans *</Label>
                  {!buildingPlans ? (
                    <label className="border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer hover:border-orange-500 transition-colors">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF, PNG, JPG (max 10MB)</p>
                      <Input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleBuildingPlansChange}
                      />
                    </label>
                  ) : (
                    <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">{buildingPlans.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(buildingPlans.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeBuildingPlans}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Land Title / Tax Declaration *</Label>
                  {!landTitle ? (
                    <label className="border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer hover:border-orange-500 transition-colors">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF, PNG, JPG (max 10MB)</p>
                      <Input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleLandTitleChange}
                      />
                    </label>
                  ) : (
                    <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">{landTitle.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(landTitle.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeLandTitle}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Project Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Type:</span> {formData.projectType}
                      </p>
                      <p>
                        <span className="font-medium">Scope:</span> {formData.projectScope}
                      </p>
                      <p>
                        <span className="font-medium">Description:</span> {formData.projectDescription}
                      </p>
                      {formData.lotArea && (
                        <p>
                          <span className="font-medium">Lot Area:</span> {formData.lotArea} sq.m
                        </p>
                      )}
                      {formData.floorArea && (
                        <p>
                          <span className="font-medium">Floor Area:</span> {formData.floorArea} sq.m
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Floors:</span> {formData.numberOfFloors}
                      </p>
                      <p>
                        <span className="font-medium">Estimated Cost:</span> PHP {formData.estimatedCost}
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
                      <p>
                        <span className="font-medium">Property Address:</span> {formData.propertyAddress}
                      </p>
                      <p>
                        <span className="font-medium">Barangay:</span> {formData.barangay}
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
