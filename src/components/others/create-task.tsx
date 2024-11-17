import React, { FormEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import useCreateProject from '@/hooks/useCreateProject';
import { Plus } from 'lucide-react';

interface IHandleTaskCreate {
  name: string;
  description?: string;
  priority?: string;
}

interface ICreateProject {
  category_id: string;
  fetchProjectDetails: () => Promise<void>;
}

const CreateTask = (props: ICreateProject) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [workspaceList, setWorkspaceList] = useState<{ id: string; title: string; is_personal: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleTaskCreate(payloadData: IHandleTaskCreate, category_id: string) {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/project/create-task/${category_id}`, {
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
    console.log('chekc the repso  =', data);
    if (res?.ok) {
      props.fetchProjectDetails();
    }
    form.reset();
    setIsDialogOpen(false);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      // fetchWorkspaceList();
    } else {
      form.reset();
      form.clearErrors();
    }
  }, [isDialogOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
            // onKeyDown={(e) => {
            //   if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
            //     e.preventDefault();
            //   }
            // }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
