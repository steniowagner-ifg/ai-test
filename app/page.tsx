import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDocuments } from "@/app/components";

export default function Page() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 p-8">
      <Tabs defaultValue="list-documents">
        <TabsList>
          <TabsTrigger value="list-documents">List documents</TabsTrigger>
          <TabsTrigger value="upload-documents">Upload documents</TabsTrigger>
        </TabsList>
        <TabsContent value="upload-documents">
          <UploadDocuments />
        </TabsContent>
        <TabsContent value="list-documents">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
