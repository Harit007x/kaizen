import { getUserData } from "@/actions/getUserData";
import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { promise } from "zod";

export async function PUT(request: Request) {
  const body = await request.json();
  const projectId = body.projectId;
  const sourceColumnId = body.sourceColumnId;
  const destinationColumnId = body.destinationColumnId;
  const destination_task_id = body.destination_task_id;
  const destinationIndex = body.destinationIndex;
  const taskId = body.taskId;
  const isMovedTop = body.isMovedTop;
  const isMovedBottom = body.isMovedBottom;

  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Please sign in first to continue" }, { status: 401 });
    }

    const destination_category_tasks = await prisma.task.findMany({
      where: {
        categoryId: destinationColumnId
      },
      orderBy: {
        position: 'asc'
      }
    })

    const total_destination_tasks = destination_category_tasks.length

    if (total_destination_tasks === 0) {
      await prisma.task.update({
        where: { id: taskId },
        data: { categoryId: destinationColumnId }
      })

      return NextResponse.json(
        { message: "Position updated successfully" },
        { status: 200 }
      );
    }
    let destination_task;
    if (destinationIndex <= total_destination_tasks && !isMovedBottom) {
      destination_task = destination_category_tasks.find((task) => task.id === destination_task_id)
    } else {
      destination_task = destination_category_tasks[destinationIndex - 1]
    }

    if (destination_task === undefined) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    let new_position: number;

    if (destinationIndex === 0) {
      console.log('moved to top')
      new_position = destination_task.position / 2
    } else if (isMovedBottom) {
      console.log('moved to bottom')
      new_position = ((destination_task.position * 2) + 10) / 2
    } else {
      console.log('moved between')
      const itemAboveDestination: any = destination_category_tasks[destinationIndex - 1]
      new_position = (destination_task.position + itemAboveDestination?.position) / 2
    }

    const reorderThresholdHit = await prisma.category.findUnique({ where: { id: destinationColumnId } })
    const conflict = destination_category_tasks.some((task) => task.position === new_position)
    if (conflict || reorderThresholdHit?.reorderThreshold === 10) {
      console.log('conflicting cases - - - - - - - - -')
      const resetTaskPositions = destination_category_tasks.map((task, index) => {
        return (
          prisma.task.update({
            where: {
              id: task.id,
              categoryId: destinationColumnId,
            },
            data: {
              position: 10 * (index + 1)
            }
          }))
      })

      await prisma.category.update({
        where: {
          id: destinationColumnId
        },
        data: { reorderThreshold: 0 }
      })

      await Promise.all(resetTaskPositions)
      return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        categoryId: destinationColumnId,
        position: new_position ? new_position : 0
      }
    })

    await prisma.category.update({
      where: {
        id: destinationColumnId
      },
      data: { reorderThreshold: { increment: 1 } }
    })

    return NextResponse.json(
      { message: "Position updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating task position" },
      { status: 500 }
    );
  }
}
