'use client';
import React, { useEffect, useRef, useState } from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';

import CreateTask from './create-task';
import Task, { TaskProps } from './task';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { Icons } from '../ui-extended/icons';

export interface CategoryProps {
  tasks: TaskProps[];
  title: string;
  id: string;
  fetchProjectDetails: () => Promise<void>;
}

const Category = (props: CategoryProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [closestEdge, setClosestEdge] = useState<'left' | 'right' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const columnEl = columnRef.current;
    invariant(columnEl);

    return combine(
      draggable({
        element: columnEl,
        getInitialData: () => ({ type: 'column', columnId: props.id }),
        onDragStart: () => setIsReordering(true),
        onDrop: () => setIsReordering(false),
      }),
      dropTargetForElements({
        element: columnEl,
        getData: ({ input, element, source }) => {
          const data = { type: 'column', columnId: props.id };

          if (source.data.type === 'column') {
            return attachClosestEdge(data, {
              input,
              element,
              allowedEdges: ['left', 'right'],
            });
          }

          return data;
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          console.log('on drag enter=', args.source.data.columnId !== props.id);
          if (args.source.data.columnId !== props.id) {
            setClosestEdge(extractClosestEdge(args.self.data) as 'left' | 'right' | null);
          }
        },
        onDrag: (args) => {
          console.log('on drag', args.source.data.columnId !== props.id);
          if (args.source.data.columnId !== props.id) {
            setClosestEdge(extractClosestEdge(args.self.data) as 'left' | 'right' | null);
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

  const handleCategoryDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/category/delete/${props.id}`, {
        method: 'DELETE',
      });

      const responseData = await res.json();
      if (res.ok) {
        await props.fetchProjectDetails();
        toast.success(responseData.message);
        setShowDeleteDialog(false);
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
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <div
      className={`min-w-[280px] flex flex-col border-[1px] bg-secondary/80 rounded-md hover:border-border 
          ${isReordering && 'opacity-30'} relative`}
      ref={columnRef}
    >
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <b className="text-white">{props.tasks.length}</b> task(s) within the{' '}
              <b className="text-white">{props.title}</b> section will be wiped out permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                handleCategoryDelete();
              }}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex align-center items-center justify-between mb-2 pt-2 px-3">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-sm font-bold">{props.title}</h1>
          <CreateTask category_id={props.id} fetchProjectDetails={props.fetchProjectDetails} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              size={'icon'}
              className="w-7 h-7 hover:text-foreground hover:bg-background hover:border-primary/10 border-secondary"
            >
              <Icons.ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={'bottom'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-red hover:bg-redBackground hover:text-red"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Icons.trash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1" thumbClassName="bg-zinc-600/30">
        <div className="space-y-2 px-3">
          {props.tasks.map((task: TaskProps) => (
            <Task
              key={task.id}
              id={task.id}
              name={task.name}
              description={task.description}
              dueDate={task.dueDate}
              createdAt={task.createdAt}
              category_id={props.id}
              priorityId={task.priorityId}
              fetchProjectDetails={props.fetchProjectDetails}
            />
          ))}
        </div>
      </ScrollArea>
      {closestEdge && <DropIndicator edge={closestEdge} gap="20px" />}
    </div>
  );
};

export default Category;
