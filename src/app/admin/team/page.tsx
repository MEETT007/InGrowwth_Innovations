'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, Link, MessageCircle, Code, UserPlus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTable } from '@/components/ui/data-table';
import { TeamMemberEditor } from './components/TeamMemberEditor';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
  bio: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
  photo: string | null;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/team');
      const res = await response.json();
      if (res.success) {
        setTeamMembers(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch team members.');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to connect to team members API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeamMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      const toastId = toast.loading('Removing member...');
      try {
        const response = await fetch(`/api/admin/team/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        if (res.success) {
          toast.success(res.message, { id: toastId });
          fetchTeamMembers();
        } else {
          toast.error(res.message || 'Failed to remove member.', { id: toastId });
        }
      } catch (error) {
        console.error('Error removing member:', error);
        toast.error('An error occurred.', { id: toastId });
      }
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditorOpen(true);
  };

  // Helper to get initials for Avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            {row.original.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.original.photo} alt={row.original.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(row.original.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium hover:text-indigo-500 transition-colors">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate block max-w-[200px]">
          {row.original.email || '—'}
        </span>
      ),
    },
    {
      id: 'socials',
      header: 'Socials',
      cell: ({ row }) => {
        const { linkedin, twitter, github } = row.original;
        return (
          <div className="flex items-center space-x-2">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <Link className="h-4 w-4" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-sky-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Code className="h-4 w-4" />
              </a>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(member);
              }}
              className="cursor-pointer hover:bg-indigo-500/10 hover:text-indigo-500"
            >
              <span className="sr-only">Edit</span>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(member.id);
              }}
              className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <span className="sr-only">Delete</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground mt-1">
            Manage employees, roles, and social profiles.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingMember(null);
            setIsEditorOpen(true);
          }}
          className="shadow-sm cursor-pointer"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>Roster</CardTitle>
          <CardDescription>A list of all team members.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-1">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">
                Loading team members...
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={teamMembers}
                searchKey="name"
                searchPlaceholder="Search members..."
                onRowClick={(row) => handleEdit(row)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <TeamMemberEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={editingMember}
        onSuccess={fetchTeamMembers}
      />
    </div>
  );
}
