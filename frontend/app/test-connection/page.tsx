"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function TestConnection() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error: string | null;
    data: any;
  }>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test the API connection
        const response = await api.get("/health");
        setStatus({
          loading: false,
          error: null,
          data: response.data,
        });
      } catch (error: any) {
        setStatus({
          loading: false,
          error: error.message || "Failed to connect to the backend",
          data: null,
        });
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            API Connection Test
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {status.loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : status.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error:</p>
              <p>{status.error}</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p className="font-medium">Success!</p>
              <p>Connected to backend successfully</p>
              <pre className="mt-2 text-sm">
                {JSON.stringify(status.data, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
