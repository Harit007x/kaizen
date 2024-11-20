'use client';
import React, { FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Task, { TaskProps } from './task';
import { toast } from 'sonner';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { Plus } from 'lucide-react';
import CreateTask from './create-task';
import { ScrollArea } from '../ui/scroll-area';

export interface CategoryProps {
  tasks: TaskProps[];
  title: string;
  id: string;
  fetchProjectDetails: () => Promise<void>;
}

const Category = (props: CategoryProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [closestEdge, setClosestEdge] = useState<'left' | 'right' | null>(null);

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

  const [taskName, setTaskName] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log('closet edge data =', closestEdge);
  // In Category component
  return (
    <div
      className={`min-w-fit flex flex-col border-[1px] bg-secondary/80 rounded-md hover:border-border 
          ${isReordering && 'opacity-30'} relative`}
      ref={columnRef}
    >
      {/* Header */}
      <div className="flex align-center items-center justify-between mb-2 pt-2 px-3">
        <h1 className="text-sm font-bold">{props.title}</h1>
        <CreateTask category_id={props.id} fetchProjectDetails={props.fetchProjectDetails} />
      </div>
      {closestEdge && 'visible'}

      {/* Scrollable tasks container */}
      <ScrollArea className="flex-1" thumbClassName="bg-zinc-600/30">
        <div className="space-y-2 px-3">
          {props.tasks.map((task: TaskProps) => (
            <Task
              key={task.id}
              id={task.id}
              name={task.name}
              createdAt={task.createdAt}
              category_id={props.id}
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
