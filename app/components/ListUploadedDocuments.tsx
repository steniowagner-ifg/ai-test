"use client";

import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useFetch } from "../hooks/use-fetch";
import { UploadedFile } from "../types";
import { Spinner } from "./Spinner";

export function ListUploadedDocuments() {
  const { fetch, data, isLoading, hasError } = useFetch<{
    files: UploadedFile[];
  }>("/list-documents");

  useEffect(() => {
    fetch();
  }, []);

  toast.error("Oops...", {
    description: "Something went wrong while listing the uploaded documents.",
  });
  useEffect(() => {
    if (hasError) {
    }
  }, [hasError]);

  return (
    <div className="container mt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          List Documents
        </h1>
        <p className="text-gray-600">
          Here you will find all the documents that were uploaded
        </p>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      )}
      {!isLoading && !hasError && !!data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              data?.files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>
                    {format(
                      parseISO(file.metadata.uploadedAt),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
