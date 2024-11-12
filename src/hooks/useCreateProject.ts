import { useState } from 'react';
import { toast } from 'sonner';

export interface IDataForCreateProject {
  name: string;
  workspaceId: string;
}

const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createProject = async (requestData: IDataForCreateProject) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/project/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to application/json
        },
        body: JSON.stringify(requestData), // Stringify the data object
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProject,
    isLoading,
  };
};

export default useCreateProject;
