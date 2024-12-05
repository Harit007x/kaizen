import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import TaskForm from '../forms/taskForm';

export interface IHandleTaskCreate {
  name: string;
  description?: string;
  priority?: string;
}

interface ICreateTask {
  category_id: string;
  fetchProjectDetails: () => Promise<void>;
}

const CreateTask = (props: ICreateTask) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleTaskCreate(payloadData: IHandleTaskCreate, category_id: string) {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/task/create/${category_id}`, {
        method: 'POST',
        body: JSON.stringify(payloadData),
      });

      const data = await res.json();
      props.fetchProjectDetails();
      toast.success(data.message);

      return res;
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const FormSchema = z.object({
    name: z.string({
      required_error: 'Please enter a project name.',
    }),
    description: z.string().optional(),
    priority: z.string().optional(),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await handleTaskCreate(data, props.category_id);
    if (res?.ok) {
      props.fetchProjectDetails();
    }
    form.reset();
    setIsCreateDialogOpen(false);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (isCreateDialogOpen) {
      // fetchWorkspaceList();
    } else {
      form.reset();
      form.clearErrors();
    }
  }, [isCreateDialogOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          size={'icon'}
          className="bg-secondary w-7 h-7 hover:text-foreground hover:bg-background hover:border-primary/10 border-secondary"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>Create tasks to maintain goals efficiently.</DialogDescription>
        </DialogHeader>

        <TaskForm
          onSubmit={handleTaskCreate}
          onCancel={() => setIsCreateDialogOpen(false)}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          isLoading={isLoading}
          submitLabel="Add"
          categoryId={props.category_id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
