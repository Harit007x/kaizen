import React, { useEffect, useState } from 'react';
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

const CreateProject = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [workspaceList, setWorkspaceList] = useState<{ id: string; title: string; is_personal: boolean }[]>([]);
  const { createProject, isLoading } = useCreateProject();

  const fetchWorkspaceList = async () => {
    try {
      const res = await fetch('api/workspace/get-workspace-list', {
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch workspace list');
        }
        return res.json();
      });
      setWorkspaceList(res.data);
    } catch (err) {
      console.log('Something went wrong', err);
    }
  };

  const FormSchema = z.object({
    name: z.string(),
    workspaceId: z.string({
      required_error: 'Please select a workspace for the project.',
    }),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await createProject(data);
    form.reset();
    setIsDialogOpen(false);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      fetchWorkspaceList();
    } else {
      form.reset(); // Reset form when closing the dialog
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} className="h-5 w-5" variant="ghost" onClick={() => setIsDialogOpen(true)}>
          <Icons.plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add project</DialogTitle>
          <DialogDescription>Create project to maintain tasks efficiently.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
              name="workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workspace" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workspaceList.map((workspace) => {
                        return (
                          <SelectItem key={workspace.id} value={workspace.id}>
                            {workspace.title}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose>
                <Button variant={'secondary'}>Cancel</Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
