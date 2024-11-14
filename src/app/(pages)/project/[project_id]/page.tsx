'use client';
// app/project/[project_id]/page.tsx
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { UseProjectDetails } from '@/hooks/useProjectDetails';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { checkForPermissionAndTrigger } from '@/lib/Push';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Category from '@/components/others/category';

interface HandleDropProps {
  source: {
    data: {
      type: string;
      cardId?: string;
      columnId?: string;
    };
    element: ReactNode;
  };
  location: any;
}

interface ReorderColumnProps {
  sourceIndex: number;
  destinationIndex: number;
}

interface ReorderCardProps {
  columnId: string;
  startIndex: number;
  finishIndex: number;
  cardId: string;
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

interface ProjectPageProps {
  params: { project_id: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { project_id } = params;

  const session = useSession();
  const user = session.data?.user as SessionUser;

  useEffect(() => {
    if (user) {
      console.log(user.id);
      checkForPermissionAndTrigger();
    }
  }, [user]);

  const { projectId, projectName, columnData, setColumnData, fetchProjectDetails } = UseProjectDetails(project_id);
  async function updateCategoryReorder(projectId: string, source_column_id: string, destination_column_id: string) {
    try {
      const response = await fetch('/api/project/update-category-reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, source_column_id, destination_column_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating category positions:', errorData.message);
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
      const res = await fetch('/api/project/update-task-reorder', {
        method: 'PUT',
        body: JSON.stringify({
          category_id,
          source_task_id,
          destination_task_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // fetchProjectDetails()
        return toast.error(data.message);
      }
    } catch (error) {
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
      const response = await fetch('/api/project/update-tasks-move', {
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
        toast.error('Something wend wrong, please try again!');
        console.error('Error updating tasks positions:', errorData.message);
      } else {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error('Failed to update tasks positions:', error);
    }
  }

  //   const [data, setData] = useState(DATA);
  const reorderColumn = useCallback(
    ({ sourceIndex, destinationIndex }: ReorderColumnProps) => {
      setColumnData((prevData) => {
        const newData = [...prevData];
        const [movedColumn] = newData.splice(sourceIndex, 1);
        newData.splice(destinationIndex, 0, movedColumn);

        const categories: any = [];

        newData.map((category) => {
          categories.push({ id: category.id });
        });
        const source_column_id = columnData[sourceIndex].id;
        const destination_column_id = columnData[destinationIndex].id;

        updateCategoryReorder(projectId, source_column_id, destination_column_id);

        return newData;
      });
    },
    [projectId]
  );

  const moveCard = useCallback(
    ({
      movedCardIndexInSourceColumn,
      sourceColumnId,
      destinationColumnId,
      movedCardIndexInDestinationColumn = 0,
    }: MoveCardProps) => {
      // Ensure source and destination columns exist
      const sourceColumnData = columnData.find((column) => column.id === sourceColumnId);
      const destinationColumnData = columnData.find((column) => column.id === destinationColumnId);

      if (!sourceColumnData || !destinationColumnData) {
        console.error('Invalid source or destination column ID');
        return;
      }

      // Ensure the card index in source column is valid
      if (movedCardIndexInSourceColumn < 0 || movedCardIndexInSourceColumn >= sourceColumnData.items.length) {
        console.error('Invalid card index in source column');
        return;
      }

      // Extract the card to move
      const cardToMove = sourceColumnData.items[movedCardIndexInSourceColumn];

      // Remove the card from the source column
      const updatedSourceCards = [...sourceColumnData.items];
      updatedSourceCards.splice(movedCardIndexInSourceColumn, 1);

      // Insert the card into the destination column at the specified index
      const updatedDestinationCards = [...destinationColumnData.items];
      const destinationIndex = Math.min(movedCardIndexInDestinationColumn, updatedDestinationCards.length);
      updatedDestinationCards.splice(destinationIndex, 0, cardToMove);

      // Update the state with the modified source and destination columns
      const newData = columnData.map((column) => {
        if (column.id === sourceColumnId) {
          return { ...column, items: updatedSourceCards };
        }
        if (column.id === destinationColumnId) {
          return { ...column, items: updatedDestinationCards };
        }
        return column;
      });

      console.log('chekc the items =', destinationColumnData.items[destinationIndex]);
      const isMovedTop = destinationColumnData.items[destinationIndex] === undefined ? false : true;
      const isMovedBottom = !isMovedTop ? true : false;
      const destination_task_id = isMovedTop != false ? destinationColumnData.items[destinationIndex].id : false;
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
    [columnData]
  );

  const reorderCard = useCallback(
    ({ columnId, startIndex, finishIndex, cardId }: ReorderCardProps) => {
      // Ensure the startIndex and finishIndex are different; no need to reorder if they’re the same
      if (startIndex === finishIndex) return;
      // Find the source column by ID
      const sourceColumnData = columnData.find((column) => column.id === columnId);

      if (sourceColumnData) {
        const updatedItems: any = reorder({
          list: sourceColumnData.items,
          startIndex,
          finishIndex,
        });

        const updatedSourceColumn = {
          ...sourceColumnData,
          items: updatedItems,
        };

        const tasks: any = [];

        updatedSourceColumn.items.map((task) => {
          tasks.push({ id: task.id });
        });

        console.log('checking the taakss =', sourceColumnData);
        const source_task_id = sourceColumnData.items[startIndex].id;
        const destination_task_id = sourceColumnData.items[finishIndex].id;
        console.log('check ids =', source_task_id, destination_task_id);
        updateTaskReorder(columnId, source_task_id, destination_task_id);
        // updateTaskPositions(projectId, tasks)
        console.log('update source col =', updatedSourceColumn);

        const newData = columnData.map((column) => {
          if (column.id === columnId) {
            return updatedSourceColumn;
          }
          return column;
        });
        console.log('reordered task =', newData);
        setColumnData(newData);
      }
    },
    [columnData]
  );

  const handleDrop = useCallback(
    ({ source, location }: HandleDropProps) => {
      // Early return if there are no drop targets in the current location
      const destination = location.current.dropTargets.length;
      if (!destination) return;

      if (source.data.type === 'card' && source.data.cardId) {
        // Retrieve the ID of the card being dragged
        const draggedCardId = source.data.cardId;

        // Get the source column from the initial drop targets
        const [, sourceColumnRecord] = location.initial.dropTargets;

        // Retrieve the ID of the source column
        const sourceColumnId = sourceColumnRecord.data.columnId;

        // Get the data of the source column
        const sourceColumnData = columnData.find((col) => col.id === sourceColumnId);

        // Get the index of the card in the source column
        const indexOfSource = sourceColumnData?.items.findIndex((card) => card.id === draggedCardId);

        if (location.current.dropTargets.length === 1) {
          const [destinationColumnRecord] = location.current.dropTargets;

          // Retrieve the ID of the destination column
          const destinationColumnId = destinationColumnRecord.data.columnId;

          // Check if the source and destination columns are the same
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
              cardId: draggedCardId,
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

          // Retrieve the ID of the destination column
          const destinationColumnId = destinationColumnRecord.data.columnId;

          // Retrieve the destination column data using the destination column ID
          const destinationColumn = columnData.find((col) => col.id === destinationColumnId);

          if (destinationColumn) {
            // Find the index of the target card within the destination column's cards
            const indexOfTarget = destinationColumn.items.findIndex(
              (card) => card.id === destinationCardRecord.data.cardId
            );

            // Determine the closest edge of the target card: top or bottom
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
                cardId: draggedCardId,
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

        console.log('source =', sourceIndex, 'destination =', destinationIndex);

        if (sourceIndex !== -1 && destinationIndex !== -1) {
          reorderColumn({ sourceIndex, destinationIndex });
        }
      }
    },
    [columnData, reorderCard]
  );

  useEffect(() => {
    return monitorForElements({
      // @ts-ignore
      onDrop: handleDrop,
    });
  }, [handleDrop]);

  const [workspaceTitle, setWorkspaceTitle] = useState<string>('');

  async function handleWorkspaceCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', workspaceTitle);
      console.log('formdata =', formData);
      const res = await fetch('/api/workspace/create-workspace', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const [project_name, setProjectName] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleBoardCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('project_name', project_name);
      formData.append('workspace_id', 'e3c67c47-ee5c-4fb5-9c26-9917aac480cc');
      console.log('formdata =', formData);
      const res = await fetch('/api/project/create-project', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCategoryCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('category_name', categoryName);
      formData.append('project_id', projectId);
      console.log('formdata =', formData);
      const res = await fetch('/api/project/create-category', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      fetchProjectDetails();
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full overflow-x-scroll p-6 select-none bg-background flex flex-col h-screen gap-10">
      <div className="w-80 flex flex-col gap-4">
        <SidebarTrigger />
        <div className="text-xl font-extrabold">{projectName}</div>
        {/* <form className="flex justify-center" onSubmit={handleWorkspaceCreate}>
          <Input placeholder="Workspace" onChange={(e) => setWorkspaceTitle(e.target.value)} disabled={isLoading} />
          <Button disabled={isLoading}>Create</Button>
        </form> */}
        {/* <form className="flex justify-center" onSubmit={handleBoardCreate}>
          <Input placeholder="Board" onChange={(e) => setProjectName(e.target.value)} disabled={isLoading} />
          <Button disabled={isLoading}>Create</Button>
        </form> */}
        <form className="flex justify-center" onSubmit={handleCategoryCreate}>
          <Input placeholder="Category" onChange={(e) => setCategoryName(e.target.value)} disabled={isLoading} />
          <Button disabled={isLoading}>Create</Button>
        </form>
      </div>
      <div className="flex gap-4">
        {columnData &&
          Object.values(columnData).map((column) => (
            <Category
              key={column.title}
              title={column.title}
              tasks={column.items}
              id={column.id}
              fetchProjectDetails={fetchProjectDetails}
            />
          ))}
      </div>
    </div>
  );
}