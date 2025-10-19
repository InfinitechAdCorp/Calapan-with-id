"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import UserApprovalDialog from "@/components/admin/user-approval-dialog"

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: "pending" | "approved" | "rejected"
  verification_status: "pending" | "verified" | "rejected"
  valid_id: string
  selfie_id: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found. Please log in.")
      }
      
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      // Map verification_status to status if status is missing
      const mappedUsers = (data.data || []).map((user: any) => ({
        ...user,
        status: user.status || user.verification_status || "pending",
      }))
      setUsers(mappedUsers)
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleApprovalSubmit = async (status: "approved" | "rejected", notes?: string) => {
    if (!selectedUser) return

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found. Please log in.")
      }
      
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          status,
          verification_status: status === "approved" ? "verified" : "rejected",
          verification_notes: notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      // Create a new array with updated user
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              status,
              verification_status: (status === "approved" ? "verified" : "rejected") as "pending" | "verified" | "rejected",
            }
          : u,
      )
      
      setUsers(updatedUsers)
      setDialogOpen(false)
      setSelectedUser(null)
    } catch (err) {
      console.error("[v0] Error updating user:", err)
      alert(err instanceof Error ? err.message : "Failed to update user")
    }
  }

  const handleApproveClick = (user: User) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage and approve user registrations</p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total: {users.length} users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Verification</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.phone}</td>
                      <td className="py-3 px-4 capitalize">{user.role}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4">{getVerificationBadge(user.verification_status)}</td>
                      <td className="py-3 px-4">
                        {user.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveClick(user)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Review
                          </Button>
                        )}
                        {user.status === "approved" && (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Approved
                          </span>
                        )}
                        {user.status === "rejected" && (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserApprovalDialog
          user={selectedUser}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleApprovalSubmit}
        />
      )}
    </div>
  )
}