import { ColumnData } from '@/app/api/project/get-project-details/route';
import { useState } from 'react';

export const UseProjectDetails = (project_id: string) => {
  const [columnData, setColumnData] = useState<ColumnData[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  async function fetchProjectDetails() {
    try {
      const res = await fetch(`/api/project/get-project-details?project_id=${project_id}`, {
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch project details');
        }
        return res.json();
      });
      setProjectName(res.data.name);
      setProjectId(res.data.id);
      console.log('response =', res.data);
      setColumnData(res.data.columnMap);
    } catch (err) {
      console.log('Something went wrong :', err);
    }
  }

  return {
    fetchProjectDetails,
    setColumnData,
    columnData,
    projectId,
    projectName,
  };
};
