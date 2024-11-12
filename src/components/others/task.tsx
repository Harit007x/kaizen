'use client';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';

export interface TaskProps {
  id: number;
  name: string;
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
    <div
      className={`${
        isDragging && 'opacity-30'
      } rounded-lg shadow-md p-6 relative cursor-pointer bg-gray-900 hover:bg-gray-800 flex gap-4 items-center justify`}
      ref={cardRef}
    >
      <h1 className="text-lg font-bold">{props.name}</h1>

      {closestEdge && <DropIndicator edge={closestEdge} gap="10px" />}
    </div>
  );
};

export default Task;
