"use client";

import Link from "next/link";
import { FileText, MessageCircle, Upload, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Upload PDFs</h3>
              <p className="text-sm text-gray-600">
                Upload your PDF documents to the system
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Process & Store</h3>
              <p className="text-sm text-gray-600">
                Documents are processed and stored in Pinecone
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Chat & Query</h3>
              <p className="text-sm text-gray-600">
                Ask questions and get AI-powered answers
              </p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Upload PDFs</CardTitle>
              <CardDescription>
                Upload your PDF documents to build your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>PDF files supported</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Database className="w-4 h-4" />
                  <span>Stored in Pinecone vector database</span>
                </div>
              </div>
              <Link href="/upload">
                <Button className="w-full" size="lg">
                  Start Uploading
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Chat with PDFs</CardTitle>
              <CardDescription>
                Ask questions and get intelligent answers from your documents
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>AI-powered responses</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>Context from your PDFs</span>
                </div>
              </div>
              <Link href="/chat">
                <Button
                  className="w-full bg-transparent"
                  size="lg"
                  variant="outline"
                >
                  Start Chatting
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
