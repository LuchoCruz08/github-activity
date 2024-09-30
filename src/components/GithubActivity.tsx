import { useState } from "react";
import { GitBranch, GitCommit, GitPullRequest, Star, GitFork, Package, Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type GithubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    master_branch?: string;
    description?: string;
    pusher_type?: string;
  };
  created_at: string;
};

type GithubActivityProps = {
  events: GithubEvent[];
};

const eventTypeIcons: { [key: string]: React.ReactNode } = {
  PushEvent: <GitCommit className="h-4 w-4" />,
  PullRequestEvent: <GitPullRequest className="h-4 w-4" />,
  WatchEvent: <Star className="h-4 w-4" />,
  CreateEvent: <GitBranch className="h-4 w-4" />,
  ForkEvent: <GitFork className="h-4 w-4" />,
  ReleaseEvent: <Package className="h-4 w-4" />,
  IssuesEvent: <Book className="h-4 w-4" />,
};

const GithubActivity = ({ events }: GithubActivityProps) => {
  const [visibleEvents, setVisibleEvents] = useState(5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEventDescription = (event: GithubEvent) => {
    switch (event.type) {
      case "PushEvent":
        return `Pushed to ${event.payload.ref?.replace("refs/heads/", "")}`;
      case "PullRequestEvent":
        return `${event.payload.action} a pull request`;
      case "WatchEvent":
        return "Starred the repository";
      case "CreateEvent":
        return `Created ${event.payload.ref_type} ${
          event.payload.ref || event.payload.master_branch || ""
        }`;
      case "ForkEvent":
        return "Forked the repository";
      case "ReleaseEvent":
        return "Published a release";
      case "IssuesEvent":
        return `${event.payload.action} an issue`;
      default:
        return event.type;
    }
  };

  return (
    <Card className="mt-6 bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest GitHub events for this user</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-gray-400">
            No recent activity found for this user.
          </p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            {events.slice(0, visibleEvents).map((event) => (
              <div key={event.id} className="mb-4 last:mb-0">
                <div className="flex items-center space-x-2">
                  {eventTypeIcons[event.type] || (
                    <GitBranch className="h-4 w-4" />
                  )}
                  <span className="font-medium text-gray-200">
                    {event.type}
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {formatDate(event.created_at)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  {getEventDescription(event)}
                </p>
                <p className="mt-1 text-xs text-blue-400">{event.repo.name}</p>
              </div>
            ))}
          </ScrollArea>
        )}
        {events.length > visibleEvents && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setVisibleEvents((prev) => prev + 5)}
          >
            Load More
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GithubActivity;
