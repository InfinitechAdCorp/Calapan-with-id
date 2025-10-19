"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2, Upload, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const USER_ROLES = [
  { value: "citizen", label: "Citizen", description: "Report issues and access city services" },
  { value: "emergency_responder", label: "Emergency Responder", description: "Handle emergency calls and requests" },
  { value: "department_staff", label: "Department Staff", description: "Manage department-specific reports" },
]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
    address: "",
    validId: null as File | null,
    selfieId: null as File | null,
  })
  const [previewUrls, setPreviewUrls] = useState({
    validId: "",
    selfieId: "",
  })

  const handleValidIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, validId: file })
      const url = URL.createObjectURL(file)
      setPreviewUrls({ ...previewUrls, validId: url })
    }
  }

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, selfieId: file })
      const url = URL.createObjectURL(file)
      setPreviewUrls({ ...previewUrls, selfieId: url })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!formData.validId) {
      setError("Please upload a valid ID")
      return
    }

    if (!formData.selfieId) {
      setError("Please upload a selfie photo")
      return
    }

    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("password", formData.password)
      formDataToSend.append("password_confirmation", formData.confirmPassword)
      formDataToSend.append("role", formData.role)
      formDataToSend.append("address", formData.address)
      formDataToSend.append("valid_id", formData.validId)
      formDataToSend.append("selfie_id", formData.selfieId)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formDataToSend,
      })

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).flat().join(", ")
          throw new Error(errorMessages)
        }
        throw new Error(responseData.message || "Registration failed")
      }

      const userData = responseData.data || responseData
      const { user, token } = userData

      // Store token and user data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Show success toast
      toast({
        title: "Account Created Successfully!",
        description: "Your account has been created. Please wait for admin approval to access the platform.",
        duration: 4000,
      })

      // Fixed redirect logic - check status for all roles
      if (user.role === "citizen") {
        // Check if citizen account needs approval
        if (user.status === "pending") {
          router.push("/dashboard/pending-approval")
        } else {
          router.push("/")
        }
      } else if (user.status === "pending") {
        router.push("/dashboard/pending-approval")
      } else {
        router.push(`/dashboard/${user.role.replace("_", "-")}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">CC</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Join Calapan City Connect</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Juan Dela Cruz"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+63 912 345 6789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Complete Address</Label>
              <Input
                id="address"
                placeholder="Street, Barangay, City"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-lg mb-4">Verification Documents</h3>

              {/* Valid ID Upload */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="validId">Valid ID (Voters ID, etc.)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {previewUrls.validId ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrls.validId || "/placeholder.svg"}
                        alt="Valid ID Preview"
                        className="w-full h-40 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, validId: null })
                          setPreviewUrls({ ...previewUrls, validId: "" })
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                      </div>
                      <input
                        id="validId"
                        type="file"
                        accept="image/*"
                        onChange={handleValidIdUpload}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="selfieId">Selfie Photo</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {previewUrls.selfieId ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrls.selfieId || "/placeholder.svg"}
                        alt="Selfie Preview"
                        className="w-full h-40 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, selfieId: null })
                          setPreviewUrls({ ...previewUrls, selfieId: "" })
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                      </div>
                      <input
                        id="selfieId"
                        type="file"
                        accept="image/*"
                        onChange={handleSelfieUpload}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-700 hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}