'use client';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { Edit2, Ghost, Maximize, Trash, Ungroup } from 'lucide-react';
import { Card, CardContent, CardTitle, CardHeader, CardFooter, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { dateFormatter } from '@/lib/helper';

export interface TaskProps {
  id: number;
  name: string;
  createdAt: string;
  fetchProjectDetails: () => Promise<void>;
}

const Task = (props: TaskProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const cardEl = cardRef.current;
    invariant(cardEl);

    return combine(
      // Add draggable to make the card draggable
      draggable({
        element: cardEl,
        getInitialData: () => ({ type: 'card', cardId: props.id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      // Add dropTargetForElements to make the card a drop target
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
            // Update the closest edge when the draggable item enters the drop zone
            setClosestEdge(extractClosestEdge(args.self.data) as SetStateAction<null>);
          }
        },
        onDrag: (args) => {
          // Continuously update the closest edge while dragging over the drop zone
          if (args.source.data.cardId !== props.id) {
            setClosestEdge(extractClosestEdge(args.self.data) as SetStateAction<null>);
          }
        },
        onDragLeave: () => {
          // Reset the closest edge when the draggable item leaves the drop zone
          setClosestEdge(null);
        },
        onDrop: () => {
          // Reset the closest edge when the draggable item is dropped
          setClosestEdge(null);
        },
      })
    );
  }, [props.id]);
  console.log('closet edge data =', closestEdge);

  return (
    <Card
      ref={cardRef}
      key={props.id}
      className="relative w-[16rem] h-[10rem] flex flex-col justify-between rounded-lg"
    >
      <div>
        <CardHeader className="flex p-0 pt-2 pl-0 mx-2 flex-col gap-2">
          <div className="flex items-center justify-between border-b pb-2 border-dashed">
            <div className="flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-foreground hover:fill-secondary hover:bg-secondary">
              <Ghost className="" size={14} />
            </div>
            <div className="flex gap-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-green/90 hover:fill-green/30 hover:bg-green/10">
                <Maximize className="" size={14} />
              </div>
              <div className="flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-blue/90 hover:fill-blue/30 hover:bg-blue/10">
                <Edit2 className="" size={14} />
              </div>
              <div className="flex items-center justify-center w-7 h-7 rounded-sm cursor-pointer text-muted-foreground hover:text-red/90 hover:fill-redBackground hover:bg-red/10">
                <Trash className="" size={14} />
              </div>
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
      </div>
      <CardFooter className="flex flex-row text-start justify-between p-0 px-4 pb-4">
        <div className="flex flex-col justify-end items-center align-center">
          <Badge variant={'blue'} className="rounded-sm">
            {'wow'}
          </Badge>
        </div>
        <div className="text-xs bg-secondary rounded-sm py-0.5 px-1">{dateFormatter(props.createdAt)}</div>
      </CardFooter>
      {closestEdge && <DropIndicator edge={closestEdge} gap="10px" />}
    </Card>
  );
};

export default Task;
