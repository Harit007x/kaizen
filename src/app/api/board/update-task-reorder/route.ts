import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Please sign in first to continue" }, { status: 401 });
    }

    const { category_id, source_column_id, destination_column_id } = await request.json();
    console.log("data =- ", category_id, source_column_id, destination_column_id)
    let source_position;

    const tasks = await prisma.task.findMany({
      where: {
        categoryId: category_id
      },
      orderBy:{
        position: 'asc'
      }
    })

    const source_task = tasks.find((task) => task.id === source_column_id)
    const destination_task = tasks.find((task) => task.id === destination_column_id)

    if(!source_task || !destination_task){
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    
    let destination_index = tasks.findIndex((task) => task.position === destination_task.position)
    // check if there is anything above the destination item
    if(destination_index === 0){
      source_position = destination_task.position / 2
    }
    
    // check if there is anything below the destination item
    if(destination_index === tasks.length - 1){
      source_position = ((destination_task.position * 2) + 10) / 2
    }

    // check if in between
    const isMovedAbove = source_task.position > destination_task.position
    if(isMovedAbove){

      // console.log('destination - - - - - - -', destination_category)
      const destination_index = tasks.findIndex((task) => task.position === destination_task.position)
      const itemAboveDestination = tasks[destination_index-1]

      if(!itemAboveDestination){
        return NextResponse.json({ message: "Invalid position" }, { status: 400 });
      }
      // console.log('ism aboe =', itemAboveDestination)
      source_position = (destination_task.position + itemAboveDestination?.position) / 2
      // console.log('source position =', source_position)
    }

    const isMovedBelow = source_task.position < destination_task.position
    if(isMovedBelow){

      const destination_index = tasks.findIndex((task) => task.position === destination_task.position)
      const itemBelowDestination = tasks[destination_index+1]
      if(!itemBelowDestination){
        return NextResponse.json({ message: "Invalid position" }, { status: 400 });
      }
      source_position = (destination_task.position + itemBelowDestination?.position) / 2
      
    }

    await prisma.task.update({
      where: { id: source_task.id},
      data: { position: source_position}
    })

    return NextResponse.json(
      { message: "Task positions updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
