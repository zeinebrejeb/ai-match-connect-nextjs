"use client"; 
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; 
import { FileText, Upload, Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedCVData {
  skills: string[];
  experiences: {
    company: string;
    position: string;
    duration?: string; 
  }[];
  education: {
    degree: string;
    institution: string;
    year?: string;

  }[];

}

const CVUpload: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedCVData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    setFile(null);
    setUploadState("idle");
    setUploadProgress(0);
    setExtractedData(null);

    if (selectedFile) {

      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };


  const handleUpload = async () => {
    if (!file) return;

    setUploadState("uploading");
    setUploadProgress(50); 
    setExtractedData(null);

    const formData = new FormData();
    formData.append("file", file); 

 

    try {
   
      const response = await fetch("/api/cv/upload-analyze", {
        method: "POST",
        body: formData,
  
      });

      // Directly parse the response body
      const result = await response.json();

      if (!response.ok) {
        // Use error message from backend if available
        throw new Error(result.message || `Upload failed with status: ${response.status}`);
      }

      // Assuming backend returns { extractedData: ExtractedCVData } on success
      // TODO: Adjust 'result.extractedData' based on your actual API response structure
      if (result.extractedData) {
         setExtractedData(result.extractedData);
         setUploadState("success");
         setUploadProgress(100); // Set progress to 100 on success
         toast({
           title: "CV Uploaded & Analyzed",
           description: "Successfully processed by our AI.",
         });
      } else {
          // Handle cases where response is ok but data might be missing
          throw new Error("Analysis completed, but no data was extracted.");
      }

    } catch (error: any) {
      console.error("Upload/Analysis Error:", error);
      setUploadState("error");
      setUploadProgress(0); 
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload or analyze the CV. Please try again.",
        variant: "destructive",
      });
    }

  };

  const cancelUpload = () => {
    setFile(null);
    setUploadState("idle");
    setUploadProgress(0);
    setExtractedData(null);
  };


  const getStatusIcon = () => {
    if (uploadState === "uploading") return <Upload className="animate-pulse h-5 w-5" />; 
    if (uploadState === "success") return <Check className="text-green-500 h-5 w-5" />; 
    if (uploadState === "error") return <X className="text-red-500 h-5 w-5" />; 
    return null;
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <Label htmlFor="file-upload" className="text-base font-medium mb-1 block"> {}
          Upload Your CV
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Upload your CV (PDF format). Our AI will attempt to extract key information.
        </p>

        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20"> {/* Adjusted styling */}
          {!file ? (
            <>
              <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
              <div className="mt-3">
                 <p className="text-xs text-muted-foreground mb-2">
                   Drag and drop PDF file here, or click to browse.
                 </p>
                <label htmlFor="file-upload" className="cursor-pointer">
                   <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"> {/* Mimic Button variant="outline" */}
                       Browse files
                   </span>
                  <Input
                    id="file-upload" 
                    type="file"
                    className="hidden" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium truncate">{file.name}</span>
                <span className="flex-shrink-0">{getStatusIcon()}</span>
              </div>

              {}
              {uploadState === "uploading" && (
                <div className="space-y-1 w-full max-w-sm mx-auto"> {}
                  <Progress value={uploadProgress} className="h-2" /> {}
                  <p className="text-xs text-muted-foreground">
                      Analyzing CV...
                  </p>
                </div>
              )}

              {}
              <div className="flex justify-center space-x-3 pt-2">
                {uploadState === "idle" && (
                  <Button onClick={handleUpload}>
                    <Upload className="mr-2 h-4 w-4" /> Upload & Analyze
                  </Button>
                )}
                {}
                {uploadState === "uploading" && (
                  <Button variant="outline" onClick={cancelUpload}>Cancel</Button>
                )}
                {}
                {(uploadState === "success" || uploadState === "error") && (
                  <Button variant="outline" onClick={cancelUpload}>
                      {uploadState === 'error' ? 'Try again' : 'Upload another'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {}
      {}
      {extractedData && uploadState === 'success' && (
        <div className="space-y-4 pt-4 border-t">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-base font-medium mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" /> {}
              AI Extracted Information (Review Needed)
            </h3>
            {/* ... (Display logic for extractedData.skills, .experiences, .education - seems okay, but ensure keys match interface) ... */}
            <div className="space-y-4">
               {extractedData.skills?.length > 0 && <div> <h4 className="font-medium text-sm mb-1.5">Skills</h4> <div className="flex flex-wrap gap-1.5"> {extractedData.skills.map((skill: string, index: number) => ( <div key={index} className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium"> {skill} </div> ))} </div> </div>}
               {extractedData.experiences?.length > 0 && <div> <h4 className="font-medium text-sm mb-1.5">Experience</h4> <ul className="mt-1 space-y-1.5"> {extractedData.experiences.map((exp, index: number) => ( <li key={index} className="text-xs"> <span className="font-medium">{exp.position}</span> at {exp.company} {exp.duration && `(${exp.duration})`} </li> ))} </ul> </div>}
               {extractedData.education?.length > 0 && <div> <h4 className="font-medium text-sm mb-1.5">Education</h4> <ul className="mt-1 space-y-1.5"> {extractedData.education.map((edu, index: number) => ( <li key={index} className="text-xs"> <span className="font-medium">{edu.degree}</span> from {edu.institution} {edu.year && `(${edu.year})`} </li> ))} </ul> </div>}
            </div>

            <div className="mt-4">
               {/* TODO: Implement functionality for this button */}
              <Button variant="outline" size="sm">Use/Edit Extracted Data</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUpload;