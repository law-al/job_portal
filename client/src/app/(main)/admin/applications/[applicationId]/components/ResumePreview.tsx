'use client';
import { ArrowLeft, ArrowRight, Download, FileText, Maximize2, Minimize2 } from 'lucide-react';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumePreview({ resume }: { resume: { url: string; originalName: string; size: string } | null }) {
  console.log(resume?.url);
  const { url, originalName, size } = resume || {};
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setScale(1.0);
    setIsLoading(false);
    setError(null);
  };

  const handleDownload = async () => {
    if (!url) return;
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = originalName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!resume) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Resume Preview</h2>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-gray-600">No resume uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white  rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Resume Preview</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Prevents going below 0.5 (50%) */}
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))} className="p-2 hover:bg-gray-100 rounded" title="Zoom Out">
            <Minimize2 className="w-4 h-4 text-gray-600" />
          </button>
          {/* Prevents going above 2 (200%) */}
          <button onClick={() => setScale((s) => Math.min(2, s + 0.25))} className="p-2 hover:bg-gray-100 rounded" title="Zoom In">
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={handleDownload} disabled={isDownloading} className="p-2 hover:bg-gray-100 rounded disabled:opacity-50" title="Download">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* PDF Container */}
      <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
        {/* PDF Viewer with scroll */}
        <div className="overflow-auto max-h-[600px] flex justify-center p-4">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => setError(error.message)}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-8">
                <p className="text-red-600">Failed to load PDF. Please try again.</p>
              </div>
            }
          >
            <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} className="shadow-lg" />
          </Document>
        </div>

        {/* Controls */}
        {numPages && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>

            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Page {pageNumber} of {numPages}
              </p>
              <p className="text-sm text-gray-500">{Math.round(scale * 100)}%</p>
            </div>

            <button
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
