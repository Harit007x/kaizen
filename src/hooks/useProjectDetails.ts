import React, { useEffect, useState } from 'react'

export const UseProjectDetails = () => {
  const [data, setData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>('');
  async function fetchProjectDetails(workspace_id: string) {
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
    const workspaceId = "e3c67c47-ee5c-4fb5-9c26-9917aac480cc";
    fetchProjectDetails(workspaceId)
  }, [])

  return {
    fetchProjectDetails,
    setData,
    data,
    projectId
  }
}
