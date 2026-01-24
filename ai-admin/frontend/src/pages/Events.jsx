import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, MapPin, Users, MoreVertical, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents
  });

  const bottomStats = [
    { label: "Total Active Events", value: "12", subtext: "+2 this month", icon: Calendar, color: "text-blue-500" },
    { label: "Expected Attendees", value: "2.4k", subtext: "Across all events", icon: Users, color: "text-purple-500" },
    { label: "Leads Generated", value: "184", subtext: "↑ 12% vs last Q", icon: BarChart3, color: "text-orange-500" },
  ];

  return (
    <DashboardLayout title="Event Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Event Tracking</h2>
          <p className="text-muted-foreground mt-1">Monitor investment summits, startup pitch days, and FDI promotional activities.</p>
        </div>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" /> Create New Event
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" className="bg-secondary/50 border-none text-white">List View</Button>
            <Button variant="ghost" className="text-muted-foreground">Calendar View</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-secondary/20 border-border text-xs">All Status ▼</Button>
            <Button variant="outline" className="bg-secondary/20 border-border text-xs">Last 30 Days</Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Event Name</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Date</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Location</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Organizer</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Attendees</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-semibold text-xs uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : events?.map((event) => (
                <TableRow key={event.id} className="border-border hover:bg-secondary/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        {/* Icon based on event type could go here */}
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{event.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {event.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm whitespace-pre-line">{event.date.replace(' ', '\n')}</TableCell>
                  <TableCell className="text-sm">{event.location}</TableCell>
                  <TableCell className="text-sm">{event.organizer}</TableCell>
                  <TableCell className="text-sm">{event.attendees}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`
                          ${event.status === 'Upcoming' ? 'bg-green-500/10 text-green-500' : ''}
                          ${event.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' : ''}
                          ${event.status === 'Completed' ? 'bg-gray-500/10 text-gray-400' : ''}
                          hover:bg-opacity-20 transition-colors
                      `}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Stats */}
        <div className="grid gap-4 md:grid-cols-3 pt-4">
          {bottomStats.map((stat, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
                <p className="text-xs text-green-500 mt-1">{stat.subtext}</p>
              </div>
              <div className="">
                <stat.icon className={`h-6 w-6 ${stat.color} opacity-80`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Events;
