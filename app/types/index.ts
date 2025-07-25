export type UploadedFile = {
  name: string;
  id: string;
  metadata: {
    filename: string;
    uploadedAt: string;
    updatedAt?: string;
  };
  createdOn: string;
  updatedOn: string;
  status: "Available" | "Processing" | "Failed";
  percentDone: number;
};
