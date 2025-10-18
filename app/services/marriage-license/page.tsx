"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Users, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const steps = [
  { id: 1, name: "Groom Information", icon: Users },
  { id: 2, name: "Bride Information", icon: Heart },
  { id: 3, name: "Review & Submit", icon: FileText },
]

export default function MarriageLicensePage() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    groomName: "",
    groomBirthDate: "",
    groomBirthPlace: "",
    groomCitizenship: "Filipino",
    groomCivilStatus: "",
    groomAddress: "",
    groomPhone: "",
    groomEmail: "",
    brideName: "",
    brideBirthDate: "",
    brideBirthPlace: "",
    brideCitizenship: "Filipino",
    brideCivilStatus: "",
    brideAddress: "",
    bridePhone: "",
    brideEmail: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      const response = await fetch("/api/marriage-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push("/account/applications?success=marriage-license")
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
            <h1 className="text-xl font-bold">Marriage License Application</h1>
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
              {currentStep === 1 && "Enter groom personal information"}
              {currentStep === 2 && "Enter bride personal information"}
              {currentStep === 3 && "Review application details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groomName">Full Name *</Label>
                  <Input
                    id="groomName"
                    placeholder="Enter full name"
                    value={formData.groomName}
                    onChange={(e) => updateFormData("groomName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groomBirthDate">Date of Birth *</Label>
                    <Input
                      id="groomBirthDate"
                      type="date"
                      value={formData.groomBirthDate}
                      onChange={(e) => updateFormData("groomBirthDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomBirthPlace">Place of Birth *</Label>
                    <Input
                      id="groomBirthPlace"
                      placeholder="City, Province"
                      value={formData.groomBirthPlace}
                      onChange={(e) => updateFormData("groomBirthPlace", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groomCitizenship">Citizenship *</Label>
                    <Input
                      id="groomCitizenship"
                      placeholder="Filipino"
                      value={formData.groomCitizenship}
                      onChange={(e) => updateFormData("groomCitizenship", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomCivilStatus">Civil Status *</Label>
                    <Select
                      value={formData.groomCivilStatus}
                      onValueChange={(value) => updateFormData("groomCivilStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="annulled">Annulled</SelectItem>
                        <SelectItem value="legally-separated">Legally Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomAddress">Complete Address *</Label>
                  <Input
                    id="groomAddress"
                    placeholder="Street, Barangay, City"
                    value={formData.groomAddress}
                    onChange={(e) => updateFormData("groomAddress", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groomPhone">Contact Number *</Label>
                    <Input
                      id="groomPhone"
                      placeholder="09XX XXX XXXX"
                      value={formData.groomPhone}
                      onChange={(e) => updateFormData("groomPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomEmail">Email Address *</Label>
                    <Input
                      id="groomEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.groomEmail}
                      onChange={(e) => updateFormData("groomEmail", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Full Name *</Label>
                  <Input
                    id="brideName"
                    placeholder="Enter full name"
                    value={formData.brideName}
                    onChange={(e) => updateFormData("brideName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brideBirthDate">Date of Birth *</Label>
                    <Input
                      id="brideBirthDate"
                      type="date"
                      value={formData.brideBirthDate}
                      onChange={(e) => updateFormData("brideBirthDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideBirthPlace">Place of Birth *</Label>
                    <Input
                      id="brideBirthPlace"
                      placeholder="City, Province"
                      value={formData.brideBirthPlace}
                      onChange={(e) => updateFormData("brideBirthPlace", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brideCitizenship">Citizenship *</Label>
                    <Input
                      id="brideCitizenship"
                      placeholder="Filipino"
                      value={formData.brideCitizenship}
                      onChange={(e) => updateFormData("brideCitizenship", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideCivilStatus">Civil Status *</Label>
                    <Select
                      value={formData.brideCivilStatus}
                      onValueChange={(value) => updateFormData("brideCivilStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="annulled">Annulled</SelectItem>
                        <SelectItem value="legally-separated">Legally Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideAddress">Complete Address *</Label>
                  <Input
                    id="brideAddress"
                    placeholder="Street, Barangay, City"
                    value={formData.brideAddress}
                    onChange={(e) => updateFormData("brideAddress", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bridePhone">Contact Number *</Label>
                    <Input
                      id="bridePhone"
                      placeholder="09XX XXX XXXX"
                      value={formData.bridePhone}
                      onChange={(e) => updateFormData("bridePhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideEmail">Email Address *</Label>
                    <Input
                      id="brideEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.brideEmail}
                      onChange={(e) => updateFormData("brideEmail", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Groom Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span> {formData.groomName}
                      </p>
                      <p>
                        <span className="font-medium">Birth Date:</span> {formData.groomBirthDate}
                      </p>
                      <p>
                        <span className="font-medium">Birth Place:</span> {formData.groomBirthPlace}
                      </p>
                      <p>
                        <span className="font-medium">Citizenship:</span> {formData.groomCitizenship}
                      </p>
                      <p>
                        <span className="font-medium">Civil Status:</span> {formData.groomCivilStatus}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {formData.groomAddress}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {formData.groomPhone}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {formData.groomEmail}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Bride Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span> {formData.brideName}
                      </p>
                      <p>
                        <span className="font-medium">Birth Date:</span> {formData.brideBirthDate}
                      </p>
                      <p>
                        <span className="font-medium">Birth Place:</span> {formData.brideBirthPlace}
                      </p>
                      <p>
                        <span className="font-medium">Citizenship:</span> {formData.brideCitizenship}
                      </p>
                      <p>
                        <span className="font-medium">Civil Status:</span> {formData.brideCivilStatus}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {formData.brideAddress}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {formData.bridePhone}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {formData.brideEmail}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    <strong>Note:</strong> Both parties must appear together at the Local Civil Registrar's Office for
                    the marriage license application interview.
                  </p>
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
