"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";
import { complaintsService } from "@/lib/services/complaints";
import { StatusCount } from "@/lib/types";

// Mock data for demonstration
const mockComplaints = [
  {
    id: "CMP-001",
    subject: "Broken Street Light",
    category: "Infrastructure",
    status: "pending",
    date: "2023-05-10",
    description:
      "Street light at the corner of Main St. and 5th Ave. is not working for the past week.",
  },
  {
    id: "CMP-002",
    subject: "Garbage Collection Issue",
    category: "Sanitation",
    status: "in-progress",
    date: "2023-05-12",
    description:
      "Garbage has not been collected from our neighborhood for the past two weeks.",
  },
  {
    id: "CMP-003",
    subject: "Pothole on Highway",
    category: "Infrastructure",
    status: "resolved",
    date: "2023-05-05",
    description:
      "Large pothole on Highway 101, near exit 25, causing traffic and potential vehicle damage.",
  },
  {
    id: "CMP-004",
    subject: "Water Supply Interruption",
    category: "Utilities",
    status: "pending",
    date: "2023-05-15",
    description: "No water supply in the entire block since yesterday morning.",
  },
  {
    id: "CMP-005",
    subject: "Noise Complaint",
    category: "Public Safety",
    status: "in-progress",
    date: "2023-05-14",
    description:
      "Excessive noise from construction site outside permitted hours.",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusCounts, setStatusCounts] = useState<StatusCount>({
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter and sort complaints
  const filteredComplaints = mockComplaints
    .filter((complaint) => {
      // Status filter
      if (statusFilter !== "all" && complaint.status !== statusFilter)
        return false;

      // Category filter
      if (
        categoryFilter !== "all" &&
        complaint.category.toLowerCase() !== categoryFilter
      )
        return false;

      // Search query
      if (
        searchQuery &&
        !complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "status") {
        const statusOrder = { pending: 0, "in-progress": 1, resolved: 2 };
        return sortOrder === "asc"
          ? statusOrder[a.status as keyof typeof statusOrder] -
              statusOrder[b.status as keyof typeof statusOrder]
          : statusOrder[b.status as keyof typeof statusOrder] -
              statusOrder[a.status as keyof typeof statusOrder];
      } else {
        // Default to alphabetical for other fields
        return sortOrder === "asc"
          ? a[sortBy as keyof typeof a].localeCompare(
              b[sortBy as keyof typeof b]
            )
          : b[sortBy as keyof typeof b].localeCompare(
              a[sortBy as keyof typeof a]
            );
      }
    });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const counts = await complaintsService.getStatusCounts();
        setStatusCounts(counts);
      } catch (err) {
        setError("Failed to load complaint statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertTriangle className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <a href="/complaints/new">Submit New Complaint</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Pending Complaints
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">
              {statusCounts.pending}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              In Progress
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">
              {statusCounts.inProgress}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Resolved Complaints
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              {statusCounts.resolved}
            </dd>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href="/complaints/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Submit New Complaint
            </a>
            <a
              href="/complaints"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View My Complaints
            </a>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Complaints</CardTitle>
          <CardDescription>
            View and manage all your submitted complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
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
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    title={
                      sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"
                    }
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">
                            {complaint.id}
                          </TableCell>
                          <TableCell>{complaint.subject}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell>
                            {getStatusBadge(complaint.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(complaint.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/complaints/${complaint.id}`}>View</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockComplaints
                        .filter((complaint) => complaint.status === status)
                        .map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell className="font-medium">
                              {complaint.id}
                            </TableCell>
                            <TableCell>{complaint.subject}</TableCell>
                            <TableCell>{complaint.category}</TableCell>
                            <TableCell>
                              {getStatusBadge(complaint.status)}
                            </TableCell>
                            <TableCell>
                              {new Date(complaint.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`/complaints/${complaint.id}`}>View</a>
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
    </div>
  );
}
