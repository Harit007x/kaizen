import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Icons } from '../ui-extended/icons';

export interface IHandleWorkspaceCreate {
  name: string;
  description?: string;
  priority?: string;
}

interface ICreateWorkspace {
  isWorkspaceDialogOpen: boolean;
  setIsWorkspaceDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSidebarDetails: () => Promise<void>;
}

const CreateWorkspace = (props: ICreateWorkspace) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const FormSchema = z.object({
    title: z.string({
      required_error: 'Please enter a workspace title.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
    },
  });

  async function handleWorkspaceCreate(values: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      const res = await fetch('/api/workspace/create', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      const data = await res.json();
      toast.success(data.message);
      return res;
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await handleWorkspaceCreate(data);
    console.log('wow =', res);
    if (res?.ok) {
      props.fetchSidebarDetails();
      handleClose();
    }
  }

  const handleClose = () => {
    form.reset();
    props.setIsWorkspaceDialogOpen(false);
  };

  useEffect(() => {
    if (!props.isWorkspaceDialogOpen) {
      form.reset();
      form.clearErrors();
    }
  }, [props.isWorkspaceDialogOpen, form]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={props.isWorkspaceDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>Manage your team and projects in workspace.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace title</FormLabel>
                  <FormControl>
                    <Input placeholder="Workspace title" {...field} disabled={isLoading} onKeyDown={handleKeyDown} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center align-center gap-2">
              <Button type="button" className="w-fit" variant="ghost" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="w-fit" variant="default" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
