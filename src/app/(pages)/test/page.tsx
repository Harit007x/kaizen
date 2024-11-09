"use client";

import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
    FormEvent,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// @ts-ignore
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import invariant from "tiny-invariant";
import { UseProjectDetails } from "@/hooks/useProjectDetails";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { checkForPermissionAndTrigger } from "@/lib/Push";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DATA: ColumnProps[] = [
    {
        "title": "todo",
        "columnId": "todo",
        "items": [
            {
                "id": "d986f564-9df9-47ca-91cc-ce643e2417e5",
                "name": "wow",
                "description": "amazing",
                "priority": "",
                "isCompleted": false,
                "itemId": "item-d986f564-9df9-47ca-91cc-ce643e2417e5"
            }
        ],
        "id": "dc146de4-56c1-43f2-8f6b-2cb41afd7536"
    },
    {
        "title": "progress",
        "columnId": "progress",
        "items": [
            {
                "id": "50831bed-472a-4ce0-ab85-46f783e69573",
                "name": "holly",
                "description": "holy",
                "priority": "",
                "isCompleted": false,
                "itemId": "item-50831bed-472a-4ce0-ab85-46f783e69573"
            }
        ],
        "id": "7c73b076-5381-4bfd-a025-bdccab7ee37e"
    },
    {
        "title": "done",
        "columnId": "done",
        "items": [
            {
                "id": "751c14a2-21a7-449b-91d8-0973c0b4c7ad",
                "name": "smokes",
                "description": "bruhhh",
                "priority": "",
                "isCompleted": false,
                "itemId": "item-751c14a2-21a7-449b-91d8-0973c0b4c7ad"
            },
            {
                "id": "367b707f-57b1-4f32-80e7-547fc8917a89",
                "name": "common",
                "description": "nigga",
                "priority": "",
                "isCompleted": false,
                "itemId": "item-367b707f-57b1-4f32-80e7-547fc8917a89"
            },
            {
                "id": "37a9cd6b-c8a2-49ff-8423-1e7b2678f289",
                "name": "worked",
                "description": "guess so",
                "priority": "",
                "isCompleted": false,
                "itemId": "item-37a9cd6b-c8a2-49ff-8423-1e7b2678f289"
            }
        ],
        "id": "32ec9748-028a-4afd-9c86-23f9730efece"
    }
]

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

interface CardProps {
  id: number;
  name: string;
}

interface ColumnProps {
  title: string;
  cards: CardProps[];
  id: string;
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

interface DropIndicatorProps {
  edge: "top" | "bottom";
  gap: string;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
}
export default function TestPage() {

  const session = useSession();
  const user = session.data?.user as SessionUser;

  useEffect(() => {
    if (user) {
      console.log(user.id);
      checkForPermissionAndTrigger();
    }
  }, [user]);

  const { projectId, data, setData, fetchProjectDetails } = UseProjectDetails()
  console.log('check the pro id =', data)
  async function updateCategoryReorder(projectId: string, source_column_id:string , destination_column_id: string) {
    try {
      const response = await fetch('/api/board/update-category-reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({projectId, source_column_id, destination_column_id})
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

  async function updateTaskReorder(
    category_id: string,
    source_column_id: string,
    destination_column_id: string,
  ) {

    if (!projectId) {
      return toast.error("Something went wrong");
    }

    try {
      const res = await fetch("/api/board/update-task-reorder", {
        method: "PUT",
        body: JSON.stringify({
          category_id,
          source_column_id,
          destination_column_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message);
      }
    } catch (error) {
      return toast.error("Something went wrong");
    }
  }

  async function updateTasksMove(
    projectId: string,
    sourceColumnId:string,
    destinationColumnId: string,
    destination_task_id: string,
    destinationIndex: number,
    taskId: string,
    isMovedTop: boolean,
    isMovedBottom: boolean
  ) {
    try {
      const response = await fetch('/api/board/update-tasks-move', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          sourceColumnId,
          destinationColumnId,
          destination_task_id,
          destinationIndex,
          taskId,
          isMovedTop,
          isMovedBottom
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        fetchProjectDetails()
        toast.error('Something wend wrong, please try again!')
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
      setData((prevData) => {
        const newData = [...prevData];
        console.log('before splice data= =', newData);
        const [movedColumn] = newData.splice(sourceIndex, 1);
        newData.splice(destinationIndex, 0, movedColumn);

        const categories: any = []

        newData.map((category) => {
          categories.push({ 'id': category.id})
        })
        console.log('indexes =', sourceIndex)
        const source_column_id = data[sourceIndex].id;
        const destination_column_id = data[destinationIndex].id;

        updateCategoryReorder(projectId, source_column_id, destination_column_id)

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
      const sourceColumnData = data.find(
        (column) => column.id === sourceColumnId
      );
      const destinationColumnData = data.find(
        (column) => column.id === destinationColumnId
      );

      if (!sourceColumnData || !destinationColumnData) {
        console.error("Invalid source or destination column ID");
        return;
      }

      // Ensure the card index in source column is valid
      if (
        movedCardIndexInSourceColumn < 0 ||
        movedCardIndexInSourceColumn >= sourceColumnData.items.length
      ) {
        console.error("Invalid card index in source column");
        return;
      }

      // Extract the card to move
      const cardToMove = sourceColumnData.items[movedCardIndexInSourceColumn];

      // Remove the card from the source column
      const updatedSourceCards = [...sourceColumnData.items];
      updatedSourceCards.splice(movedCardIndexInSourceColumn, 1);

      // Insert the card into the destination column at the specified index
      const updatedDestinationCards = [...destinationColumnData.items];
      const destinationIndex = Math.min(
        movedCardIndexInDestinationColumn,
        updatedDestinationCards.length
      );
      updatedDestinationCards.splice(destinationIndex, 0, cardToMove);

      // Update the state with the modified source and destination columns
      const newData = data.map((column) => {
        if (column.id === sourceColumnId) {
          return { ...column, items: updatedSourceCards };
        }
        if (column.id === destinationColumnId) {
          return { ...column, items: updatedDestinationCards };
        }
        return column;
      });

      console.log('chekc the items =', destinationColumnData.items[destinationIndex])
      const isMovedTop = destinationColumnData.items[destinationIndex] === undefined ? false : true
      const isMovedBottom = !isMovedTop ? true : false
      const destination_task_id = isMovedTop != false ? destinationColumnData.items[destinationIndex].id : false
      console.log('destination index =', destinationIndex)
      updateTasksMove(projectId, sourceColumnId, destinationColumnId, destination_task_id, destinationIndex, cardToMove.id, isMovedTop, isMovedBottom)

      setData(newData);
    },
    [data]
  );

  const reorderCard = useCallback(
    ({ columnId, startIndex, finishIndex, cardId }: ReorderCardProps) => {
      // Ensure the startIndex and finishIndex are different; no need to reorder if they’re the same
      if (startIndex === finishIndex) return;
      // Find the source column by ID
      const sourceColumnData = data.find((column) => column.id === columnId);

      if (sourceColumnData) {
        const updatedItems:any = reorder({
          list: sourceColumnData.items,
          startIndex,
          finishIndex,
        });

        const updatedSourceColumn = {
          ...sourceColumnData,
          items: updatedItems,
        };

        const tasks: any = []

        updatedSourceColumn.items.map((task) => {
          tasks.push({id: task.id})
        })
        
        console.log('checking the taakss =', sourceColumnData)
        const source_column_id = sourceColumnData.items[startIndex].id
        const destination_column_id = sourceColumnData.items[finishIndex].id
        console.log('check ids =', source_column_id,
          destination_column_id)
        updateTaskReorder(columnId, source_column_id, destination_column_id);
        // updateTaskPositions(projectId, tasks)
        console.log('update source col =', updatedSourceColumn)

        const newData = data.map((column) => {
          if (column.id === columnId) {
            return updatedSourceColumn;
          }
          return column;
        });
        console.log('reordered task =', newData)
        setData(newData);
      }
    },
    [data]
  );

  const handleDrop = useCallback(
    ({ source, location }: HandleDropProps) => {
      // Early return if there are no drop targets in the current location
      const destination = location.current.dropTargets.length;
      if (!destination) return;

      if (source.data.type === "card" && source.data.cardId) {
        // Retrieve the ID of the card being dragged
        const draggedCardId = source.data.cardId;

        // Get the source column from the initial drop targets
        const [, sourceColumnRecord] = location.initial.dropTargets;

        // Retrieve the ID of the source column
        const sourceColumnId = sourceColumnRecord.data.columnId;

        // Get the data of the source column
        const sourceColumnData = data.find((col) => col.id === sourceColumnId);

        // Get the index of the card in the source column
        const indexOfSource = sourceColumnData?.items.findIndex(
          (card) => card.id === draggedCardId
        );

        if (location.current.dropTargets.length === 1) {
          const [destinationColumnRecord] = location.current.dropTargets;

          // Retrieve the ID of the destination column
          const destinationColumnId = destinationColumnRecord.data.columnId;

          // Check if the source and destination columns are the same
          if (sourceColumnId === destinationColumnId) {
            const destinationIndex = getReorderDestinationIndex({
              startIndex: indexOfSource!,
              indexOfTarget:
                data.findIndex((col) => col.id === destinationColumnId) - 1,
              closestEdgeOfTarget: null,
              axis: "vertical",
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
            indexOfTarget:
              data.find((col) => col.id === destinationColumnId)!.items.length -
              1,
            closestEdgeOfTarget: null,
            axis: "vertical",
          });

          moveCard({
            movedCardIndexInSourceColumn: indexOfSource!,
            sourceColumnId,
            destinationColumnId,
            movedCardIndexInDestinationColumn: destinationIndex + 1,
          });
        }
        if (location.current.dropTargets.length === 2) {
          const [destinationCardRecord, destinationColumnRecord] =
            location.current.dropTargets;

          // Retrieve the ID of the destination column
          const destinationColumnId = destinationColumnRecord.data.columnId;

          // Retrieve the destination column data using the destination column ID
          const destinationColumn = data.find(
            (col) => col.id === destinationColumnId
          );

          if (destinationColumn) {
            // Find the index of the target card within the destination column's cards
            const indexOfTarget = destinationColumn.items.findIndex(
              (card) => card.id === destinationCardRecord.data.cardId
            );

            // Determine the closest edge of the target card: top or bottom
            const closestEdgeOfTarget = extractClosestEdge(
              destinationCardRecord.data
            );

            if (sourceColumnId === destinationColumnId) {
              const destinationIndex = getReorderDestinationIndex({
                startIndex: indexOfSource!,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              });

              reorderCard({
                columnId: sourceColumnId,
                startIndex: indexOfSource!,
                finishIndex: destinationIndex,
                cardId: draggedCardId
              });
              return;
            }

            const destinationIndex =
              closestEdgeOfTarget === "bottom"
                ? indexOfTarget + 1
                : indexOfTarget;

            moveCard({
              movedCardIndexInSourceColumn: indexOfSource!,
              sourceColumnId,
              destinationColumnId,
              movedCardIndexInDestinationColumn: destinationIndex,
            });
          }
        }
      }

      if (source.data.type === "column" && source.data.columnId) {
        const sourceIndex = data.findIndex(
          (col) => col.id === source.data.columnId
        );
        const destinationIndex = data.findIndex(
          (col) => col.id === location.current.dropTargets[0].data.columnId
        );

        console.log('source =', sourceIndex, "destination =", destinationIndex);

        if (sourceIndex !== -1 && destinationIndex !== -1) {
          reorderColumn({ sourceIndex, destinationIndex });
        }
      }
    },
    [data, reorderCard]
  );

  useEffect(() => {
    return monitorForElements({
      // @ts-ignore
      onDrop: handleDrop,
    });
  }, [handleDrop]);

  const [project_name, setProjectName] = useState<string>('');
	const [categoryName, setCategoryName] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	async function handleBoardCreate(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
	
		try {
			const formData = new FormData();
			formData.append("project_name", project_name)
			console.log('formdata =', formData)
			const res = await fetch("/api/board/create-board", {
				method: "POST",
				body: formData,
			});
	
			const data = await res.json();
			toast.success(data.message)
		} catch (error) {
		  console.error(error);
		  toast.error("Something went wrong");
		} finally {
		  setIsLoading(false);
		}
	}

	async function handleCategoryCreate(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
	
		try {
			const formData = new FormData();
			formData.append("category_name", categoryName)
			formData.append("project_id", "b0e981a5-7996-4a2b-b467-b81295f79f72")
			console.log('formdata =', formData)
			const res = await fetch("/api/board/create-category", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
            fetchProjectDetails()
			toast.success(data.message);
		} catch (error) {
		  console.error(error);
		  toast.error("Something went wrong");
		} finally {
		  setIsLoading(false);
		}
  }

  return (
    <div className="w-full overflow-x-scroll p-6 select-none bg-gray-950 flex flex-col h-screen gap-10">
        <div className="w-80 flex flex-col gap-4">
        <SidebarTrigger/>

            <form className='flex justify-center' onSubmit={handleBoardCreate}>
                <Input
                    placeholder='Board'
                    onChange={(e)=>setProjectName(e.target.value)}
                    disabled={isLoading}
                />
                <Button
                    disabled={isLoading}
                >Create</Button>
            </form>
            <form className='flex justify-center' onSubmit={handleCategoryCreate}>
                <Input
                    placeholder='Category'
                    onChange={(e)=>setCategoryName(e.target.value)}
                    disabled={isLoading}
                />
                <Button
                    disabled={isLoading}
                >Create</Button>
            </form>
        </div>
        <div className="flex gap-4">
            {data && Object.values(data).map((column) => (
                <Column
                    key={column.title}
                    title={column.title}
                    items={column.items}
                    id={column.id}
                    fetchProjectDetails={fetchProjectDetails}
                />
            ))}
        </div>
    </div>
  );
}

function Column({ items, title, id, fetchProjectDetails }: any) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    const columnEl = columnRef.current;
    invariant(columnEl);

    return combine(
      // Make the card draggable
      draggable({
        element: columnEl,
        getInitialData: () => ({ type: "column", columnId: id }),
        onDragStart: () => setIsReordering(true),
        onDrop: () => setIsReordering(false),
      }),
      // Make the column a drop target
      dropTargetForElements({
        element: columnEl,
        getData: ({ input, element }) => {
          // To attach card data to a drop target
          const data = { type: "column", columnId: id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragStart: () => setIsDraggedOver(true),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        getIsSticky: () => true,
      })
    );
  }, [id]);

  const [taskName, setTaskName] = useState<string>('');
	const [taskDescription, setTaskDescription] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function handleTaskCreate(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
	
		try {
			const formData = new FormData();
			formData.append("task_name", taskName);
			formData.append("task_description", taskDescription);
			formData.append("category_id", id);
			const res = await fetch("/api/board/create-task", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			fetchProjectDetails()
			toast.success(data.message);
		} catch (error) {
		  console.error(error);
		  toast.error("Something went wrong");
		} finally {
		  setIsLoading(false);
		}
	}

  return (
    <div
      className={`min-w-[300px] flex flex-col gap-4 text-white border-[1px] p-4 border-muted-foreground rounded-lg hover:border-border 
        ${isReordering && "opacity-30"}`}
      ref={columnRef}
    >
        <div>
            <h1 className="text-lg font-bold mb-1">{title}</h1>
            <h3 className="text-xs mb-4">{id}</h3>
        </div>

        <form className='flex flex-col justify-center' onSubmit={handleTaskCreate}>
            <Input
                placeholder='Name'
                onChange={(e)=>setTaskName(e.target.value)}
                disabled={isLoading}
            />
            <Input
                placeholder='Description'
                onChange={(e)=>setTaskDescription(e.target.value)}
                disabled={isLoading}
            />
            <Button
                type='submit'
                // disabled={isLoading}
            >Create</Button>
        </form>
      <div className="space-y-2 flex-1">
        {items.map((card: any) => (
          <Card key={card.id} id={card.id} name={card.name} />
        ))}
      </div>
    </div>
  );
}

function Card({ id, name }: CardProps) {
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
        getInitialData: () => ({ type: "card", cardId: id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      // Add dropTargetForElements to make the card a drop target
      dropTargetForElements({
        element: cardEl,
        getData: ({ input, element }) => {
          // To attach card data to a drop target
          const data = { type: "card", cardId: id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          if (args.source.data.cardId !== id) {
            // Update the closest edge when the draggable item enters the drop zone
            setClosestEdge(
              extractClosestEdge(args.self.data) as SetStateAction<null>
            );
          }
        },
        onDrag: (args) => {
          // Continuously update the closest edge while dragging over the drop zone
          if (args.source.data.cardId !== id) {
            setClosestEdge(
              extractClosestEdge(args.self.data) as SetStateAction<null>
            );
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
  }, [id]);

  return (
    <div
      className={`${
        isDragging && "opacity-30"
      } rounded-lg shadow-md p-6 relative cursor-pointer bg-gray-900 hover:bg-gray-800 flex gap-4 items-center justify`}
      ref={cardRef}
    >
      <h1  className="text-lg font-bold">{name}</h1>

      {closestEdge && <DropIndicator edge={closestEdge} gap="10px" />}
    </div>
  );
}
