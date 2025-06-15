
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Users, Calendar, Clock, Mic, MicOff, VideoOff } from "lucide-react";

export function LiveSessions() {
  const [joinedSession, setJoinedSession] = useState<string | null>(null);

  const liveSessions = [
    {
      id: "1",
      title: "Market Analysis: Tech Earnings Week",
      host: "Sarah Chen",
      hostAvatar: "SC",
      viewers: 245,
      description: "Live analysis of this week's major tech earnings and market implications",
      category: "Market Analysis",
      startTime: "2:00 PM EST",
      duration: "45 mins",
      isLive: true
    },
    {
      id: "2", 
      title: "Portfolio Review Session",
      host: "Mike Rodriguez",
      hostAvatar: "MR",
      viewers: 189,
      description: "Community portfolio reviews and optimization strategies",
      category: "Portfolio Review",
      startTime: "3:30 PM EST",
      duration: "60 mins",
      isLive: true
    },
    {
      id: "3",
      title: "Options Trading Masterclass",
      host: "David Park",
      hostAvatar: "DP",
      viewers: 156,
      description: "Advanced options strategies for income generation",
      category: "Education",
      startTime: "5:00 PM EST",
      duration: "90 mins",
      isLive: true
    }
  ];

  const upcomingSessions = [
    {
      id: "4",
      title: "Crypto Market Deep Dive",
      host: "Alex Thompson",
      hostAvatar: "AT",
      expectedViewers: "200+",
      description: "Bitcoin, Ethereum, and altcoin analysis for the week ahead",
      category: "Crypto",
      startTime: "Tomorrow 1:00 PM EST",
      duration: "60 mins",
      isLive: false
    },
    {
      id: "5",
      title: "Dividend Stock Screening",
      host: "Jennifer Lee",
      hostAvatar: "JL",
      expectedViewers: "150+",
      description: "Live screening session for high-quality dividend stocks",
      category: "Dividend Investing",
      startTime: "Tomorrow 4:00 PM EST",
      duration: "45 mins",
      isLive: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Sessions</h2>
        <Button>
          <Video className="w-4 h-4 mr-2" />
          Start Broadcasting
        </Button>
      </div>

      {joinedSession && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
              You're in: {liveSessions.find(s => s.id === joinedSession)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Mic className="w-4 h-4 mr-2" />
                  Unmuted
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4 mr-2" />
                  Camera On
                </Button>
              </div>
              <Button variant="destructive" onClick={() => setJoinedSession(null)}>
                Leave Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Live Now</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                  <Badge variant="outline">{session.category}</Badge>
                </div>
                <CardTitle className="text-lg">{session.title}</CardTitle>
                <CardDescription>{session.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{session.hostAvatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{session.host}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {session.viewers} watching
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {session.startTime}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => setJoinedSession(session.id)}
                  disabled={joinedSession === session.id}
                >
                  {joinedSession === session.id ? "Joined" : "Join Session"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Scheduled</Badge>
                  <Badge variant="outline">{session.category}</Badge>
                </div>
                <CardTitle className="text-lg">{session.title}</CardTitle>
                <CardDescription>{session.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{session.hostAvatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{session.host}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {session.expectedViewers} expected
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {session.startTime}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Set Reminder
                  </Button>
                  <Button className="flex-1">
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
