import React, { useEffect, useState } from 'react'

export const UseProjectDetails = () => {
  const [data, setData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>('');
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
      setProjectId(res.data.id)
      console.log('response =', res.data)
      setData(res.data.columnMap)
    }catch(err){
      console.log('Something went wrong :', err)
    }
  }

  useEffect(()=>{
    fetchProjectDetails()
  },[])

  return {
    fetchProjectDetails,
    setData,
    data,
    projectId
  }
}
