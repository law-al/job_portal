'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { useSession } from 'next-auth/react';
import { Loader2, User, Check } from 'lucide-react';
import { toast } from 'sonner';
import { assignApplicationAction } from '@/app/actions/applications.actions';
import { getInitials } from '@/lib/utils';

interface CompanyMember {
  id: string;
  role: string;
  status: string;
  user: {
    id: string;
    email: string;
  };
}

interface AssignUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  currentAssignedId?: string | null;
  onAssignSuccess?: () => void;
}

export default function AssignUserDialog({ open, onOpenChange, applicationId, currentAssignedId, onAssignSuccess }: AssignUserDialogProps) {
  const { data: session } = useSession();
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(currentAssignedId || null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!session?.user?.companyId) {
      console.log('No company ID in session');
      return;
    }

    setFetching(true);
    try {
      console.log('Fetching members for company:', session.user.companyId);
      const response = await fetchWithRetry({
        url: `company/${session.user.companyId}/members`,
        options: {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session.user as { accessToken?: string }).accessToken ?? ''}`,
          },
        },
        refreshTokenHash: (session.user as { refreshTokenHash?: string }).refreshTokenHash,
      });

      console.log('Response status:', response.status, response.ok);

      if (response.ok) {
        const data = (await response.json()) as { success: boolean; data: CompanyMember[] };
        console.log('Fetched members data:', data);
        // Filter only active members
        const activeMembers = data.data?.filter((member) => member.status === 'ACTIVE') || [];
        console.log('Active members:', activeMembers);
        setMembers(activeMembers);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch team members' }));
        console.error('Error response:', errorData);
        toast.error(errorData.message || 'Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setFetching(false);
    }
  }, [session?.user]);

  // Fetch members when dialog opens
  useEffect(() => {
    if (open && session?.user?.companyId) {
      console.log('Dialog opened, fetching members...');
      fetchMembers();
    } else if (!open) {
      // Reset members when dialog closes
      setMembers([]);
      setFetching(false);
    }
  }, [open, session?.user?.companyId, fetchMembers]);

  // Update selected member when currentAssignedId changes
  useEffect(() => {
    setSelectedMemberId(currentAssignedId || null);
  }, [currentAssignedId]);

  const handleAssign = async () => {
    if (!selectedMemberId || !session?.user?.companyId) return;

    setLoading(true);
    try {
      const result = await assignApplicationAction(applicationId, selectedMemberId);

      if (result.success) {
        toast.success(result.message || 'Application assigned successfully');
        onAssignSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Failed to assign application');
      }
    } catch (error) {
      console.error('Error assigning application:', error);
      toast.error('Failed to assign application');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!session?.user?.companyId) return;

    setLoading(true);
    try {
      const result = await assignApplicationAction(applicationId, null);

      if (result.success) {
        toast.success(result.message || 'Application unassigned successfully');
        setSelectedMemberId(null);
        onAssignSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Failed to unassign application');
      }
    } catch (error) {
      console.error('Error unassigning application:', error);
      toast.error('Failed to unassign application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Application</DialogTitle>
          <DialogDescription>Select a team member to assign this application to.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {fetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No team members available</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <button
                onClick={() => setSelectedMemberId(null)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  selectedMemberId === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Unassigned</p>
                    <p className="text-sm text-gray-500">No one assigned</p>
                  </div>
                </div>
                {selectedMemberId === null && <Check className="w-5 h-5 text-blue-600" />}
              </button>

              {members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                    selectedMemberId === member.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {getInitials({ email: member.user.email, default: 'U' })}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{member.user.email}</p>
                      <p className="text-sm text-gray-500 capitalize">{member.role.toLowerCase()}</p>
                    </div>
                  </div>
                  {selectedMemberId === member.id && <Check className="w-5 h-5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          {selectedMemberId === null ? (
            <Button onClick={handleUnassign} disabled={loading || !currentAssignedId}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Unassigning...
                </>
              ) : (
                'Unassign'
              )}
            </Button>
          ) : (
            <Button onClick={handleAssign} disabled={loading || selectedMemberId === currentAssignedId}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
