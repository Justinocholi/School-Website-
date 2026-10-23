'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmButtonProps {
  itemId: string;
  itemName?: string;
  itemType?: string; // 'student' | 'subject' | 'staff' | 'class' | 'result'
  onDelete: (id: string) => Promise<{ success: boolean; message: string }>;
  redirectUrl?: string;
  variant?: 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function DeleteConfirmButton({
  itemId,
  itemName = 'this item',
  itemType = 'record',
  onDelete,
  redirectUrl,
  variant = 'ghost',
  size = 'sm',
  showLabel = false,
  className = '',
}: DeleteConfirmButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = () => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await onDelete(itemId);
        if (res.success) {
          setConfirming(false);
          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            router.refresh();
          }
        } else {
          setErrorMsg(res.message);
          setConfirming(false);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Deletion failed');
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-rose-50 border border-rose-200 text-xs">
        <span className="text-[11px] font-semibold text-rose-800 hidden sm:inline">
          Delete {itemName}?
        </span>
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={handleDelete}
          className="h-7 px-2.5 text-xs bg-rose-700 hover:bg-rose-800 text-white font-bold"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            'Confirm'
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => setConfirming(false)}
          className="h-7 px-2 text-xs border-gray-300 text-gray-700 hover:bg-white"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center">
      {errorMsg && (
        <span className="text-[11px] text-rose-600 font-semibold mr-1.5">{errorMsg}</span>
      )}
      <Button
        variant={variant}
        size={size}
        disabled={isPending}
        onClick={() => setConfirming(true)}
        className={`text-rose-600 hover:text-rose-800 hover:bg-rose-50 border-rose-100 ${className}`}
        title={`Delete ${itemType}: ${itemName}`}
      >
        <Trash2 className="w-3.5 h-3.5 mr-1" />
        {showLabel && <span>Delete</span>}
      </Button>
    </div>
  );
}
