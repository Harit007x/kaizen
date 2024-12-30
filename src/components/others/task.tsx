'use client';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { Edit2, Ghost, Maximize, Trash, Ungroup } from 'lucide-react';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';

import { priorityColor } from '@/constants/priority-list';
import { timezoneDateFormatter } from '@/lib/helper';
import { cn } from '@/lib/utils';

import TaskForm, { TaskFormData } from '../forms/taskForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Card, CardTitle, CardHeader, CardFooter } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
export interface TaskProps {
  id: number;
  name: string;
  description?: string;
  priorityId: 'p1' | 'p2' | 'p3' | 'p4';
  dueDate: Date;
  createdAt: string;
  category_id: string;
  fetchProjectDetails: () => Promise<void>;
}

const Task = (props: TaskProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState(null);
  // const [isDragging, setIsDragging] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cardEl = cardRef.current;
    invariant(cardEl);

    return combine(
      draggable({
        element: cardEl,
        getInitialData: () => ({ type: 'card', cardId: props.id }),
        // onDragStart: () => setIsDragging(true),
        // onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: cardEl,
        getData: ({ input, element, source }) => {
          // To attach card data to a drop target
          const data = { type: 'card', cardId: props.id };

          if (source.data.type === 'card') {
            return attachClosestEdge(data, {
              input,
              element,
              allowedEdges: ['top', 'bottom'],
            });
          }

          return data;
        },
        getIsSticky: () => true,

        onDragEnter: (args) => {
          console.log('tak dragging ');
          if (args.source.data.cardId !== props.id) {
            setClosestEdge(extractClosestEdge(args.self.data) as SetStateAction<null>);
          }
        },
        onDrag: (args) => {
          if (args.source.data.cardId !== props.id) {
            setClosestEdge(extractClosestEdge(args.self.data) as SetStateAction<null>);
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      })
    );
  }, [props.id]);

  const handleTaskUpdate = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/task/update/${props.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (res.ok) {
        await props.fetchProjectDetails();
        toast.success(responseData.message);
        setIsEditDialogOpen(false);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/task/delete/${props.id}`, {
        method: 'DELETE',
      });

      const responseData = await res.json();
      if (res.ok) {
        await props.fetchProjectDetails();
        toast.success(responseData.message);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      ref={cardRef}
      key={props.id}
      className="relative w-[16rem] h-[10rem] flex flex-col justify-between rounded-lg"
    >
      <CardHeader className="flex p-0 pt-2 pl-0 mx-2 flex-col gap-2">
        <div className={cn('flex items-center justify-between border-b pb-2 border-dashed')}>
          <div
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-foreground ',
              `hover:${priorityColor[props.priorityId].background}`
            )}
          >
            <Ghost className={cn('h-4 w-4', priorityColor[props.priorityId].text)} size={14} />
          </div>
          <div className="flex gap-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-green/90 hover:fill-green/30 hover:bg-green/10">
              <Maximize className="" size={14} />
            </div>
            <div
              onClick={() => setIsEditDialogOpen(true)}
              className="flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-blue/90 hover:fill-blue/30 hover:bg-blue/10"
            >
              <Edit2 className="" size={14} />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-red/90 hover:fill-redBackground hover:bg-red/10">
                  <Trash className="" size={14} />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The <b className="text-white">{props.name}</b> task will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isLoading}
                    onClick={() => {
                      handleTaskDelete();
                    }}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardTitle className="text-md">
          <div className="flex justify-between w-[20rem] items-center">
            <div className="flex gap-1 justify-center text-sm font-normal items-center">
              <Ungroup className="text-foreground/70" size={14} />
              {props.name}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-row text-start justify-between p-0 px-4 pb-4">
        <div className="flex flex-col justify-end items-center align-center">
          <Badge variant={priorityColor[props.priorityId].variant} className="rounded-sm">
            {props.priorityId.toUpperCase()}
          </Badge>
        </div>
        <div className="text-xs bg-secondary rounded-sm py-0.5 px-1" suppressHydrationWarning={true}>
          {timezoneDateFormatter(props.createdAt)}
        </div>
      </CardFooter>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>

          <TaskForm
            initialData={{
              name: props.name,
              description: props.description,
              priorityId: props.priorityId,
              dueDate: new Date(props.dueDate),
            }}
            onSubmit={handleTaskUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isLoading={isLoading}
            submitLabel="Update"
          />
        </DialogContent>
      </Dialog>
      {closestEdge && <DropIndicator edge={closestEdge} gap="10px" />}
    </Card>
  );
};

export default Task;
