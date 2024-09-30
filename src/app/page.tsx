"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import GithubActivity from "@/components/GithubActivity";
import GithubForm from "@/components/GithubForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGithubActivity = async (username: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/events`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch activity.");
      }
      const data = await res.json();
      setEvents(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Unable to fetch GitHub activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Github className="w-8 h-8" />
              GitHub Activity Viewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GithubForm onSearch={fetchGithubActivity} />
            {loading && (
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
              </div>
            )}
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <GithubActivity events={events} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
