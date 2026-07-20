'use client';

import { Users, FileText, Briefcase, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const stats = [
  {
    title: 'Total Leads',
    value: '1,234',
    change: '+20.1% from last month',
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Total Blogs',
    value: '42',
    change: '+3 new this week',
    icon: <FileText className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Active Services',
    value: '8',
    change: 'Stable',
    icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Conversion Rate',
    value: '12.5%',
    change: '+1.2% from last month',
    icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'New Lead Generated',
    user: 'Alice Johnson',
    email: 'alice@example.com',
    date: '2026-07-20 14:23',
    status: 'New',
  },
  {
    id: 2,
    action: 'Blog Post Published',
    user: 'Admin User',
    email: 'admin@ingrowwth.com',
    date: '2026-07-19 09:12',
    status: 'Completed',
  },
  {
    id: 3,
    action: 'Service Updated',
    user: 'Admin User',
    email: 'admin@ingrowwth.com',
    date: '2026-07-18 16:45',
    status: 'Completed',
  },
  {
    id: 4,
    action: 'New Lead Generated',
    user: 'Bob Smith',
    email: 'bob@smithco.com',
    date: '2026-07-18 10:30',
    status: 'Contacted',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User / Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.action}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{activity.user}</span>
                        <span className="text-xs text-muted-foreground">{activity.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        activity.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        activity.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {activity.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
