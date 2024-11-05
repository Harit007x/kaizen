import React, { useEffect, useState } from 'react'

export const UseProjectDetails = () => {
  const [projectData, setProjectData] = useState<any>({
    "id": null,
    "name": null,
    "userId": null,
    "columnMap": null,
    "orderedColumnIds": [],
    "lastOperation": null
  });
  async function fetchProjectDetails(){
    try{
      const res = await fetch("/api/board/get-board-details", {
        method: "GET",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch board details");
        }
        return res.json();
      })
      setProjectData(res.data)
    }catch(err){
      console.log('Something went wrong :', err)
    }
  }

  useEffect(()=>{
    fetchProjectDetails()
  },[])

  return {
    fetchProjectDetails,
    setProjectData,
    projectData
  }
}
