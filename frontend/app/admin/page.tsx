"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, AlertTriangle, Search, Filter, MessageSquare } from "lucide-react"

// Mock data for demonstration
const mockComplaints = [
  {
    id: "CMP-001",
    subject: "Broken Street Light",
    category: "Infrastructure",
    status: "pending",
    date: "2023-05-10",
    email: "john.doe@example.com",
    description: "Street light at the corner of Main St. and 5th Ave. is not working for the past week.",
    responses: [],
  },
  {
    id: "CMP-002",
    subject: "Garbage Collection Issue",
    category: "Sanitation",
    status: "in-progress",
    date: "2023-05-12",
    email: "jane.smith@example.com",
    description: "Garbage has not been collected from our neighborhood for the past two weeks.",
    responses: [
      {
        date: "2023-05-13",
        message: "We have notified the sanitation department about this issue.",
        author: "Admin",
      },
    ],
  },
  {
    id: "CMP-003",
    subject: "Pothole on Highway",
    category: "Infrastructure",
    status: "resolved",
    date: "2023-05-05",
    email: "robert.johnson@example.com",
    description: "Large pothole on Highway 101, near exit 25, causing traffic and potential vehicle damage.",
    responses: [
      {
        date: "2023-05-06",
        message: "We have dispatched a team to assess the damage.",
        author: "Admin",
      },
      {
        date: "2023-05-08",
        message: "The pothole has been repaired. Thank you for your report.",
        author: "Admin",
      },
    ],
  },
  {
    id: "CMP-004",
    subject: "Water Supply Interruption",
    category: "Utilities",
    status: "pending",
    date: "2023-05-15",
    email: "sarah.williams@example.com",
    description: "No water supply in the entire block since yesterday morning.",
    responses: [],
  },
  {
    id: "CMP-005",
    subject: "Noise Complaint",
    category: "Public Safety",
    status: "in-progress",
    date: "2023-05-14",
    email: "michael.brown@example.com",
    description: "Excessive noise from construction site outside permitted hours.",
    responses: [
      {
        date: "2023-05-15",
        message: "We have contacted the construction company to address this issue.",
        author: "Admin",
      },
    ],
  },
]

export default function AdminPage() {
  const [complaints, setComplaints] = useState(mockComplaints)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [responseText, setResponseText] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter((complaint) => {
      // Status filter
      if (statusFilter !== "all" && complaint.status !== statusFilter) return false

      // Category filter
      if (categoryFilter !== "all" && complaint.category.toLowerCase() !== categoryFilter) return false

      // Search query
      if (
        searchQuery &&
        !complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !complaint.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false

      return true
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "status") {
        const statusOrder = { pending: 0, "in-progress": 1, resolved: 2 }
        return sortOrder === "asc"
          ? statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
          : statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder]
      } else {
        // Default to alphabetical for other fields
        return sortOrder === "asc"
          ? a[sortBy as keyof typeof a].localeCompare(b[sortBy as keyof typeof b])
          : b[sortBy as keyof typeof b].localeCompare(a[sortBy as keyof typeof a])
      }
    })

  // Count complaints by status
  const pendingCount = complaints.filter((c) => c.status === "pending").length
  const inProgressCount = complaints.filter((c) => c.status === "in-progress").length
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewComplaint = (complaint: any) => {
    setSelectedComplaint(complaint)
    setNewStatus(complaint.status)
    setIsDialogOpen(true)
  }

  const handleAddResponse = () => {
    if (!responseText.trim()) return

    const updatedComplaints = complaints.map((c) => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: newStatus,
          responses: [
            ...c.responses,
            {
              date: new Date().toISOString().split("T")[0],
              message: responseText,
              author: "Admin",
            },
          ],
        }
      }
      return c
    })

    setComplaints(updatedComplaints)
    setResponseText("")
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Complaints awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Complaints being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">Complaints successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Complaints</CardTitle>
          <CardDescription>View, update status, and respond to citizen complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    className="pl-8 w-full md:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.id}</TableCell>
                          <TableCell>{complaint.subject}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                          <TableCell>{complaint.email}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewComplaint(complaint)}
                              className="flex items-center gap-1"
                            >
                              <MessageSquare className="h-3 w-3" />
                              Respond
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No complaints found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {["pending", "in-progress", "resolved"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints
                        .filter((complaint) => complaint.status === status)
                        .map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell className="font-medium">{complaint.id}</TableCell>
                            <TableCell>{complaint.subject}</TableCell>
                            <TableCell>{complaint.category}</TableCell>
                            <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                            <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                            <TableCell>{complaint.email}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewComplaint(complaint)}
                                className="flex items-center gap-1"
                              >
                                <MessageSquare className="h-3 w-3" />
                                Respond
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Complaint Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedComplaint.subject}</DialogTitle>
                <DialogDescription>
                  ID: {selectedComplaint.id} | Category: {selectedComplaint.category} | Submitted:{" "}
                  {new Date(selectedComplaint.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm p-3 bg-muted rounded-md">{selectedComplaint.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Contact Information</h3>
                  <p className="text-sm">Email: {selectedComplaint.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Response History</h3>
                  {selectedComplaint.responses.length > 0 ? (
                    <div className="space-y-3">
                      {selectedComplaint.responses.map((response: any, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{response.author}</span>
                            <span>{new Date(response.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No responses yet.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Add Response</h3>
                  <Textarea
                    placeholder="Type your response here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResponse} disabled={!responseText.trim()}>
                  Save Response & Update Status
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
