"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockComplaints = [
  {
    id: "CMP-001",
    subject: "Broken Street Light",
    category: "Infrastructure",
    status: "pending",
    date: "2023-05-10",
    description: "Street light at the corner of Main St. and 5th Ave. is not working for the past week.",
    location: "Main St. and 5th Ave.",
    responses: [],
  },
  {
    id: "CMP-002",
    subject: "Garbage Collection Issue",
    category: "Sanitation",
    status: "in-progress",
    date: "2023-05-12",
    description: "Garbage has not been collected from our neighborhood for the past two weeks.",
    location: "Maple Street, Block B",
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
    description: "Large pothole on Highway 101, near exit 25, causing traffic and potential vehicle damage.",
    location: "Highway 101, near exit 25",
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
]

export default function ComplaintDetailPage() {
  const params = useParams()
  const [complaint, setComplaint] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch complaint details
    const fetchComplaint = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        const foundComplaint = mockComplaints.find((c) => c.id === params.id)
        setComplaint(foundComplaint || null)
      } catch (error) {
        console.error("Error fetching complaint:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchComplaint()
    }
  }, [params.id])

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading complaint details...</p>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Complaint Not Found</CardTitle>
            <CardDescription>The complaint you are looking for does not exist or has been removed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{complaint.subject}</CardTitle>
              <CardDescription>
                ID: {complaint.id} | Submitted on {new Date(complaint.date).toLocaleDateString()}
              </CardDescription>
            </div>
            <div>{getStatusBadge(complaint.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Category</h3>
              <p>{complaint.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Location</h3>
              <p>{complaint.location || "Not specified"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <div className="p-4 bg-muted rounded-md">
              <p>{complaint.description}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Response History</h3>
            {complaint.responses.length > 0 ? (
              <div className="space-y-4">
                {complaint.responses.map((response: any, index: number) => (
                  <div key={index} className="p-4 bg-muted rounded-md">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{response.author}</span>
                      <span>{new Date(response.date).toLocaleDateString()}</span>
                    </div>
                    <p>{response.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-muted rounded-md">
                <p className="text-muted-foreground">No responses yet. Your complaint is being reviewed.</p>
              </div>
            )}
          </div>

          {complaint.status === "resolved" && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-700">This complaint has been resolved</h3>
              </div>
              <p className="mt-2 text-sm text-green-600">
                Thank you for your report. If you're still experiencing issues, please submit a new complaint.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
