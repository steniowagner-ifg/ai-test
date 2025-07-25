import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2Icon, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useFetch } from "../hooks/use-fetch";
import { UploadedFile } from "../types";

type ReplaceDocumentButtonParams = {
  onReplaceDocument: (file: UploadedFile) => void;
  file: UploadedFile;
};

export const ReplaceDocumentButton = (params: ReplaceDocumentButtonParams) => {
  const [isDragging, setIsDragging] = useState(false);

  const {
    fetch: replaceDocument,
    isLoading,
    hasError,
  } = useFetch("/replace-document", "POST");

  const handleFileUpload = useCallback(
    async (fileList: FileList) => {
      try {
        if (!fileList || !fileList.length) {
          return;
        }
        const [file] = fileList;
        if (file.name !== params.file.name) {
          toast.error("Wrong file", {
            description: `The expected file is: ${params.file.name}`,
          });
          return;
        }
        const formData = new FormData();
        formData.append("fileId", params.file.id);
        formData.append(
          "uploadedAt",
          new Date(params.file.metadata.uploadedAt).toISOString()
        );
        formData.append("file", file);
        await replaceDocument(formData);
        toast.success("File replaced", {
          description: `${params.file.name} was replaced successfully`,
        });
        (
          document.querySelector('[data-state="open"]') as HTMLDivElement
        ).click();
      } catch (error) {
        console.error(error);
        toast.error("Oops...", {
          description: "Something went wrong while replacing document.",
        });
      }
    },
    [replaceDocument, params]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (hasError) {
      toast.error("Oops...", {
        description: "Something went wrong while replacing document.",
      });
    }
  }, [hasError]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="size-8 cursor-pointer">
          <RotateCcw />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Replace document</DialogTitle>
          <DialogDescription>
            <span className="font-bold">{params.file.name}</span>
          </DialogDescription>
          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
              Drop your file here
            </p>
            <p className="text-gray-600 mb-4">or</p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
              disabled={isLoading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              {isLoading ? (
                <Button className="cursor-pointer" disabled={isLoading}>
                  <>
                    <span>Replacing document...</span>
                    <Loader2Icon className="animate-spin" />
                  </>
                </Button>
              ) : (
                <Button asChild className="cursor-pointer" disabled={isLoading}>
                  <span>Choose file</span>
                </Button>
              )}
            </label>
          </div>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only PDF and Word (.docx) files are supported.
            </AlertDescription>
          </Alert>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
