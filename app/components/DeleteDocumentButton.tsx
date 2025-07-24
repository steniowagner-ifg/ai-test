import { useCallback } from "react";
import { Loader2Icon, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useFetch } from "../hooks/use-fetch";
import { UploadedFile } from "../types";

type DeleteDocumentButtonParams = {
  onDeleteDocument: (file: UploadedFile) => void;
  file: UploadedFile;
};

export const DeleteDocumentButton = (params: DeleteDocumentButtonParams) => {
  const { fetch: deleteDocument, isLoading } = useFetch(
    `/delete-document?fileId=${params.file.id}`,
    "DELETE"
  );

  const handleDeleteDocument = useCallback(async () => {
    await deleteDocument();
    params.onDeleteDocument(params.file);
  }, [deleteDocument, params]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="size-8 cursor-pointer"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            <span>Cancel</span>
          </AlertDialogCancel>
          <Button
            className="cursor-pointer"
            disabled={isLoading}
            onClick={handleDeleteDocument}
          >
            {isLoading ? (
              <>
                <span>Deleting...</span>
                <Loader2Icon className="animate-spin" />
              </>
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
