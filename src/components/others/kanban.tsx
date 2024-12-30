'use client';
// app/project/[project_id]/page.tsx
import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';

import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import Category from '@/components/others/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UseProjectDetails } from '@/hooks/useProjectDetails';
import { checkForPermissionAndTrigger } from '@/lib/Push';
import { cn } from '@/lib/utils';

import { Icons } from '../ui-extended/icons';

interface HandleDropProps {
  source: {
    data: {
      type: string;
      cardId?: string;
      columnId?: string;
    };
    element: ReactNode;
  };
  location: DropLocation;
}

interface ReorderColumnProps {
  sourceIndex: number;
  destinationIndex: number;
}

interface ReorderCardProps {
  columnId: string;
  startIndex: number;
  finishIndex: number;
}

interface MoveCardProps {
  movedCardIndexInSourceColumn: number;
  sourceColumnId: string;
  destinationColumnId: string;
  movedCardIndexInDestinationColumn?: number;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface IKanbanPage {
  projectId: string;
}

interface DropLocation {
  current: {
    dropTargets: Array<{
      data: {
        columnId: string;
        cardId?: string;
      };
    }>;
  };
  initial: {
    dropTargets: Array<{
      data: {
        columnId: string;
      };
    }>;
  };
}

export default function Kanban(props: IKanbanPage) {
  const { data: sessionData } = useSession();
  const user = sessionData?.user as SessionUser;

  useEffect(() => {
    if (user) {
      checkForPermissionAndTrigger();
    }
  }, [user]);

  const { projectId, projectName, columnData, setColumnData, fetchProjectDetails } = UseProjectDetails(props.projectId);

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  async function updateCategoryReorder(projectId: string, source_column_id: string, destination_column_id: string) {
    try {
      const response = await fetch('/api/project/reorder-category', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, source_column_id, destination_column_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        fetchProjectDetails();
        toast.error(errorData.message);
      } else {
        const data = await response.json();
        console.log(data.message); // "Category positions updated successfully"
      }
    } catch (error) {
      console.error('Failed to update category positions:', error);
    }
  }

  async function updateTaskReorder(category_id: string, source_task_id: string, destination_task_id: string) {
    if (!projectId) {
      return toast.error('Something went wrong');
    }

    try {
      const response = await fetch('/api/project/reorder-task', {
        method: 'PUT',
        body: JSON.stringify({
          category_id,
          source_task_id,
          destination_task_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        fetchProjectDetails();
        toast.error(errorData.message);
      } else {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.log('error :', error);
      return toast.error('Something went wrong');
    }
  }

  async function updateTasksMove(
    projectId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destination_task_id: string,
    destinationIndex: number,
    taskId: string,
    isMovedTop: boolean,
    isMovedBottom: boolean
  ) {
    try {
      const response = await fetch('/api/project/move-tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          sourceColumnId,
          destinationColumnId,
          destination_task_id,
          destinationIndex,
          taskId,
          isMovedTop,
          isMovedBottom,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        fetchProjectDetails();
        toast.error(errorData.message);
      } else {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error('Failed to update tasks positions:', error);
    }
  }

  const reorderColumn = useCallback(
    ({ sourceIndex, destinationIndex }: ReorderColumnProps) => {
      if (sourceIndex === destinationIndex) return;

      setColumnData((prevData) => {
        const newData = [...prevData];
        const [movedColumn] = newData.splice(sourceIndex, 1);
        newData.splice(destinationIndex, 0, movedColumn);
        return newData;
      });

      const source_column_id = columnData[sourceIndex].id;
      const destination_column_id = columnData[destinationIndex].id;
      updateCategoryReorder(projectId, source_column_id, destination_column_id);
    },
    [columnData, projectId, setColumnData]
  );

  const moveCard = useCallback(
    ({
      movedCardIndexInSourceColumn,
      sourceColumnId,
      destinationColumnId,
      movedCardIndexInDestinationColumn = 0,
    }: MoveCardProps) => {
      const sourceColumnData = columnData.find((column) => column.id === sourceColumnId);
      const destinationColumnData = columnData.find((column) => column.id === destinationColumnId);

      if (!sourceColumnData || !destinationColumnData) {
        console.error('Invalid source or destination column ID');
        return;
      }

      if (movedCardIndexInSourceColumn < 0 || movedCardIndexInSourceColumn >= sourceColumnData.items.length) {
        console.error('Invalid card index in source column');
        return;
      }

      const cardToMove = sourceColumnData.items[movedCardIndexInSourceColumn];

      const updatedSourceCards = [...sourceColumnData.items];
      updatedSourceCards.splice(movedCardIndexInSourceColumn, 1);

      const updatedDestinationCards = [...destinationColumnData.items];
      const destinationIndex = Math.min(movedCardIndexInDestinationColumn, updatedDestinationCards.length);
      updatedDestinationCards.splice(destinationIndex, 0, cardToMove);

      const newData = columnData.map((column) => {
        if (column.id === sourceColumnId) {
          return { ...column, items: updatedSourceCards };
        }
        if (column.id === destinationColumnId) {
          return { ...column, items: updatedDestinationCards };
        }
        return column;
      });

      const isMovedTop = destinationColumnData.items[destinationIndex] !== undefined;
      const isMovedBottom = !isMovedTop;
      const destination_task_id = isMovedTop ? destinationColumnData.items[destinationIndex].id : '';

      updateTasksMove(
        projectId,
        sourceColumnId,
        destinationColumnId,
        destination_task_id,
        destinationIndex,
        cardToMove.id,
        isMovedTop,
        isMovedBottom
      );

      setColumnData(newData);
    },
    [columnData, projectId, setColumnData]
  );

  const reorderCard = useCallback(
    ({ columnId, startIndex, finishIndex }: ReorderCardProps) => {
      if (startIndex === finishIndex) return;

      const sourceColumnData = columnData.find((column) => column.id === columnId);

      if (sourceColumnData) {
        const updatedItems = reorder({
          list: sourceColumnData.items,
          startIndex,
          finishIndex,
        });

        const updatedSourceColumn = {
          ...sourceColumnData,
          items: updatedItems,
        };

        const source_task_id = sourceColumnData.items[startIndex].id;
        const destination_task_id = sourceColumnData.items[finishIndex].id;

        updateTaskReorder(columnId, source_task_id, destination_task_id);

        const newData = columnData.map((column) => {
          if (column.id === columnId) {
            return updatedSourceColumn;
          }
          return column;
        });

        setColumnData(newData);
      }
    },
    [columnData, setColumnData]
  );

  const handleDrop = useCallback(
    ({ source, location }: HandleDropProps) => {
      const destination = location.current.dropTargets.length;
      if (!destination) return;

      if (source.data.type === 'card' && source.data.cardId) {
        const draggedCardId = source.data.cardId;
        const [, sourceColumnRecord] = location.initial.dropTargets;
        const sourceColumnId = sourceColumnRecord.data.columnId;
        const sourceColumnData = columnData.find((col) => col.id === sourceColumnId);
        const indexOfSource = sourceColumnData?.items.findIndex((card) => card.id === draggedCardId);

        if (location.current.dropTargets.length === 1) {
          const [destinationColumnRecord] = location.current.dropTargets;
          const destinationColumnId = destinationColumnRecord.data.columnId;

          if (sourceColumnId === destinationColumnId) {
            const destinationIndex = getReorderDestinationIndex({
              startIndex: indexOfSource!,
              indexOfTarget: columnData.findIndex((col) => col.id === destinationColumnId) - 1,
              closestEdgeOfTarget: null,
              axis: 'vertical',
            });

            reorderCard({
              columnId: sourceColumnId,
              startIndex: indexOfSource!,
              finishIndex: destinationIndex,
            });
            return;
          }

          const destinationIndex = getReorderDestinationIndex({
            startIndex: indexOfSource!,
            indexOfTarget: columnData.find((col) => col.id === destinationColumnId)!.items.length - 1,
            closestEdgeOfTarget: null,
            axis: 'vertical',
          });

          moveCard({
            movedCardIndexInSourceColumn: indexOfSource!,
            sourceColumnId,
            destinationColumnId,
            movedCardIndexInDestinationColumn: destinationIndex + 1,
          });
        }
        if (location.current.dropTargets.length === 2) {
          const [destinationCardRecord, destinationColumnRecord] = location.current.dropTargets;
          const destinationColumnId = destinationColumnRecord.data.columnId;
          const destinationColumn = columnData.find((col) => col.id === destinationColumnId);

          if (destinationColumn) {
            const indexOfTarget = destinationColumn.items.findIndex(
              (card) => card.id === destinationCardRecord.data.cardId
            );

            const closestEdgeOfTarget = extractClosestEdge(destinationCardRecord.data);

            if (sourceColumnId === destinationColumnId) {
              const destinationIndex = getReorderDestinationIndex({
                startIndex: indexOfSource!,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: 'vertical',
              });

              reorderCard({
                columnId: sourceColumnId,
                startIndex: indexOfSource!,
                finishIndex: destinationIndex,
              });
              return;
            }

            const destinationIndex = closestEdgeOfTarget === 'bottom' ? indexOfTarget + 1 : indexOfTarget;

            moveCard({
              movedCardIndexInSourceColumn: indexOfSource!,
              sourceColumnId,
              destinationColumnId,
              movedCardIndexInDestinationColumn: destinationIndex,
            });
          }
        }
      }

      if (source.data.type === 'column' && source.data.columnId) {
        const sourceIndex = columnData.findIndex((col) => col.id === source.data.columnId);
        const destinationIndex = columnData.findIndex(
          (col) => col.id === location.current.dropTargets[0].data.columnId
        );

        if (sourceIndex !== -1 && destinationIndex !== -1) {
          reorderColumn({ sourceIndex, destinationIndex });
        }
      }
    },
    [columnData, reorderCard, moveCard, reorderColumn]
  );

  useEffect(() => {
    return monitorForElements({
      // @ts-expect-error: yet to fix the type error
      onDrop: handleDrop,
    });
  }, [handleDrop]);

  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleCategoryCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('category_name', categoryName);
      formData.append('project_id', projectId);
      const res = await fetch('/api/category/create', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      fetchProjectDetails();
      setCategoryName('');
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }
  const { setTheme } = useTheme();

  if (!props.projectId) {
    return <div className="w-full h-screen select-none bg-background flex flex-col">Inbox not working</div>;
  }

  return (
    <div className="w-full h-screen select-none bg-background flex flex-col">
      {/* Header section */}
      <div className="w-80 flex p-4 flex-col gap-4 mb-2">
        <SidebarTrigger />
        <div className="text-xl font-extrabold">{projectName}</div>
        <form
          className={cn({
            'flex items-center gap-4': categoryName !== '',
          })}
          onSubmit={handleCategoryCreate}
        >
          <Input
            placeholder="Category"
            value={categoryName}
            onBlur={(e) => {
              if (!e.relatedTarget || e.relatedTarget.tagName !== 'BUTTON') {
                setCategoryName('');
              }
            }}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={isLoading}
          />
          {categoryName !== '' && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : 'Create'}
            </Button>
          )}
        </form>
        <Button onClick={() => setTheme('dark')}>Dark</Button>
        <Button onClick={() => setTheme('light')}>Light</Button>
      </div>

      {/* Scrollable categories container */}
      <div className="flex-1 overflow-x-auto px-4 pb-4">
        <div className="flex gap-4 h-full">
          {columnData &&
            columnData.map((column) => {
              return (
                <Category
                  key={column.id}
                  title={column.title}
                  tasks={column.items}
                  id={column.id}
                  fetchProjectDetails={fetchProjectDetails}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
