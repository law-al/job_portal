'use client';

import { ChevronLeft, ChevronRight, UserPlus, Loader2, XCircle } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import AssignUserDialog from './AssignUserDialog';
import { moveApplicationStageAction, rejectApplicationAction } from '@/app/actions/applications.actions';
import { toast } from 'sonner';

interface ApplicationActionProps {
  applicationId: string;
  pipelineStages:
    | {
        id: string;
        name: string;
        order: number;
      }[]
    | [];
  currentStage: {
    id: string;
    name: string;
    order: number;
  } | null;
  currentAssignedUser?: {
    id: string;
    email: string;
  } | null;
  userEmail?: string | null;
  status: string;
}

export default function ApplicationAction({ applicationId, pipelineStages, currentStage, currentAssignedUser, userEmail, status }: ApplicationActionProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const stagesOrderCount = pipelineStages.length;
  const currentStageOrder = currentStage?.order || 1;

  const handleMoveStage = async (stageId: string, direction: 'next' | 'previous') => {
    startTransition(async () => {
      const result = await moveApplicationStageAction(applicationId, stageId);

      if (result.success) {
        toast.success(`Application moved to ${direction === 'next' ? 'next' : 'previous'} stage successfully`);
      } else {
        toast.error(result.error || 'Failed to move application stage');
      }
    });
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this application? This action cannot be undone.')) {
      return;
    }

    startTransition(async () => {
      const result = await rejectApplicationAction(applicationId);

      if (result.success) {
        toast.success('Application rejected successfully');
      } else {
        toast.error(result.error || 'Failed to reject application');
      }
    });
  };

  const getNextStage = () => {
    if (currentStageOrder >= stagesOrderCount) return null;
    return pipelineStages.find((stage) => stage.order === currentStageOrder + 1);
  };

  const getPreviousStage = () => {
    if (currentStageOrder <= 1) return null;
    return pipelineStages.find((stage) => stage.order === currentStageOrder - 1);
  };

  const nextStage = getNextStage();
  const previousStage = getPreviousStage();

  // Show actions if: no assigned user OR current user is the assigned user
  const shouldShowActions = !currentAssignedUser?.id || currentAssignedUser?.email === userEmail;

  if (status === 'REJECTED') {
    return (
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <XCircle className="w-4 h-4" />
          Rejected Application
        </button>
      </div>
    );
  }

  return (
    <>
      {shouldShowActions && (
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={isPending}
              className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Reject
                </>
              )}
            </button>
            <button
              onClick={() => setAssignDialogOpen(true)}
              className="px-6 py-2 border border-green-200 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              {currentAssignedUser ? 'Reassign' : 'Assign to Team Member'}
              <UserPlus className="w-4 h-4" />
            </button>
            {stagesOrderCount > 1 && previousStage && (
              <button
                onClick={() => handleMoveStage(previousStage.id, 'previous')}
                disabled={isPending}
                className="px-6 py-2 border border-blue-200 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Moving...
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    Previous Stage
                  </>
                )}
              </button>
            )}
            {stagesOrderCount > 1 && nextStage && (
              <button
                onClick={() => handleMoveStage(nextStage.id, 'next')}
                disabled={isPending}
                className="px-6 py-2 border border-blue-200 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Moving...
                  </>
                ) : (
                  <>
                    Next Stage
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </>
      )}

      <AssignUserDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        applicationId={applicationId}
        currentAssignedId={currentAssignedUser?.id || null}
        onAssignSuccess={() => {
          // TODO: Refresh application data
          window.location.reload();
        }}
      />
    </>
  );
}
