import React, { useEffect, useState } from 'react'

export const UseProjectDetails = (workspace_id: string) => {
  const [data, setData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>('');
  async function fetchProjectDetails() {
    try {
      const res = await fetch(`/api/project/get-project-details?workspace_id=${workspace_id}`, {
        method: "GET",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch project details");
        }
        return res.json();
      })
      setProjectId(res.data.id)
      console.log('response =', res.data)
      setData(res.data.columnMap)
    } catch (err) {
      console.log('Something went wrong :', err)
    }
  }

  useEffect(() => {
    fetchProjectDetails()
  }, [])

  return {
    fetchProjectDetails,
    setData,
    data,
    projectId
  }
}
