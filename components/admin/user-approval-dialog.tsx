"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  phone: string
  address?: string  // Make address optional
  role: string
  department?: string
  valid_id: string
  selfie_id: string
  created_at: string
}


interface UserApprovalDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (status: "approved" | "rejected", notes?: string) => Promise<void>
}

export default function UserApprovalDialog({ user, open, onOpenChange, onSubmit }: UserApprovalDialogProps) {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    try {
      await onSubmit("approved", notes)
    } finally {
      setLoading(false)
      setNotes("")
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      await onSubmit("rejected", notes)
    } finally {
      setLoading(false)
      setNotes("")
    }
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review User Application</DialogTitle>
          <DialogDescription>Review the user's information and documents before approval</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge className="mt-1">{user.role}</Badge>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{user.address}</p>
              </div>
              {user.department && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{user.department}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="font-semibold">Submitted Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {user.valid_id && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Valid ID</p>
                  <img
                    src={`${API_URL}/${user.valid_id}`}
                    alt="Valid ID"
                    className="w-full h-48 object-cover rounded border"
                  />
                </div>
              )}
              {user.selfie_id && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Selfie with ID</p>
                  <img
                    src={`${API_URL}/${user.selfie_id}`}
                    alt="Selfie"
                    className="w-full h-48 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Verification Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about this user's verification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Reject
          </Button>
          <Button onClick={handleApprove} disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
