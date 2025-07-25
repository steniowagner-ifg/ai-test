"use client";

import type React from "react";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadedFile {
  name: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function UploadDocuments() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      status: "uploading" as const,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileIndex = files.length + i;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === fileIndex ? { ...f, status: "success", progress: 100 } : f
            )
          );
        } else {
          const error = await response.text();
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === fileIndex
                ? { ...f, status: "error", progress: 0, error }
                : f
            )
          );
        }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex
              ? { ...f, status: "error", progress: 0, error: "Upload failed" }
              : f
          )
        );
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="container mt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Documents
        </h1>
        <p className="text-gray-600">
          Upload your documents to build your knowledge base
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Drag and drop your files or click to select
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your files here
              </p>
              <p className="text-gray-600 mb-4">or</p>
              <input
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files)
                }
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Only PDF and Word (.docx) files are supported.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Status</CardTitle>
            <CardDescription>
              Track the progress of your file uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium truncate">{file.name}</span>
                      {file.status === "success" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="mb-2" />
                    )}

                    {file.status === "error" && file.error && (
                      <p className="text-sm text-red-600">{file.error}</p>
                    )}

                    {file.status === "success" && (
                      <p className="text-sm text-green-600">
                        Successfully uploaded and processed
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
