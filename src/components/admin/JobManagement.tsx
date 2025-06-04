import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const JobManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  
  const jobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      status: "active",
      applications: 25,
      posted: "2024-05-20",
      recruiter: "Jane Smith"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      type: "Full-time",
      status: "active",
      applications: 18,
      posted: "2024-05-22",
      recruiter: "Sarah Wilson"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "Contract",
      status: "paused",
      applications: 12,
      posted: "2024-05-15",
      recruiter: "Jane Smith"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "AI Solutions",
      location: "Boston, MA",
      type: "Full-time",
      status: "closed",
      applications: 45,
      posted: "2024-05-10",
      recruiter: "Sarah Wilson"
    }
  ];

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => { 
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => { 
    return type === "Full-time" ? (
      <Badge className="bg-blue-100 text-blue-800">Full-time</Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800">Contract</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Management</CardTitle>
        <CardDescription>Manage all job postings in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{getTypeBadge(job.type)}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {job.applications}
                    </div>
                  </TableCell>
                  <TableCell>{job.posted}</TableCell>
                  <TableCell>{job.recruiter}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Job
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          View Applications
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobManagement;