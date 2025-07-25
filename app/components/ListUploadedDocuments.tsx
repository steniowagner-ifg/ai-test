"use client";

import { useCallback, useEffect, useState } from "react";
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

import { ReplaceDocumentButton } from "./ReplaceDocumentButton";
import { DeleteDocumentButton } from "./DeleteDocumentButton";
import { useFetch } from "../hooks/use-fetch";
import { UploadedFile } from "../types";
import { Spinner } from "./Spinner";

export function ListUploadedDocuments() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedFile[]>(
    []
  );

  const { fetch, data, isLoading, hasError } = useFetch<{
    files: UploadedFile[];
  }>("/list-documents");
  console.log(data);
  const handleDeleteDocument = useCallback(async (file: UploadedFile) => {
    toast.success("File deleted successfully.");
    setUploadedDocuments((previousUploadedDocuments) =>
      previousUploadedDocuments.filter(
        (previousUploadedDocument) => previousUploadedDocument.id !== file.id
      )
    );
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (data?.files.length) {
      setUploadedDocuments(data.files);
    }
  }, [data]);

  useEffect(() => {
    if (hasError) {
      toast.error("Oops...", {
        description:
          "Something went wrong while listing the uploaded documents.",
      });
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
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              uploadedDocuments.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>
                    {format(
                      parseISO(file.metadata.uploadedAt),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </TableCell>
                  <TableCell>
                    {file.metadata.updatedAt
                      ? format(
                          parseISO(file.metadata.updatedAt),
                          "dd/MM/yyyy HH:mm"
                        )
                      : ""}
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <div className="self-end flex flex gap-2">
                      <DeleteDocumentButton
                        onDeleteDocument={handleDeleteDocument}
                        file={file}
                      />
                      <ReplaceDocumentButton
                        onReplaceDocument={() => {}}
                        file={file}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
