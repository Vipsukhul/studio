'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Info, AlertTriangle, CircleX } from 'lucide-react';
import { logs as mockLogs } from '@/lib/data';
import type { LogEntry } from '@/lib/types';

const levelIcons = {
  INFO: <Info className="h-4 w-4 text-blue-500" />,
  WARN: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  ERROR: <CircleX className="h-4 w-4 text-red-500" />,
};

const levelVariants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  INFO: "default",
  WARN: "secondary",
  ERROR: "destructive",
};

export default function AdminLogsPage() {
  const [logs, setLogs] = React.useState<LogEntry[]>(mockLogs);
  const [levelFilter, setLevelFilter] = React.useState('all');
  const [messageFilter, setMessageFilter] = React.useState('');

  const filteredLogs = logs
    .filter(log => levelFilter === 'all' || log.level === levelFilter)
    .filter(log => log.message.toLowerCase().includes(messageFilter.toLowerCase()));

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">System Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Logs</CardTitle>
          <CardDescription>
            View recent events from across the application.
          </CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <Input
              placeholder="Filter by message..."
              value={messageFilter}
              onChange={(e) => setMessageFilter(e.target.value)}
              className="max-w-sm"
            />
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="WARN">Warning</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant={levelVariants[log.level]} className="flex items-center gap-1.5 w-min">
                        {levelIcons[log.level as keyof typeof levelIcons]}
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.message}</TableCell>
                    <TableCell>{log.source}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
