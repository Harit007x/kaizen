// components/TaskForm.tsx
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { IHandleTaskCreate } from '../others/create-task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { priorityList } from '@/constants/priority-list';

const FormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a task name.',
  }),
  description: z.string().optional(),
  priorityId: z.string().optional(),
});

export type TaskFormData = z.infer<typeof FormSchema>;

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (payloadData: IHandleTaskCreate, category_id: string) => Promise<Response | void>;
  onCancel: () => void;
  setIsCreateDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  submitLabel?: string;
  categoryId?: string;
}

const TaskForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Submit',
  categoryId,
  setIsCreateDialogOpen,
  setIsEditDialogOpen,
}: TaskFormProps) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      priorityId: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    await onSubmit(data, categoryId as string);
    setIsCreateDialogOpen && setIsCreateDialogOpen(false);
    setIsEditDialogOpen && setIsEditDialogOpen(false);
    form.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const targetElement = e.target as HTMLElement;

    if (targetElement.closest('[role="listbox"]') || targetElement.closest('[role="combobox"]')) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4" onKeyDown={handleKeyDown}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Task name" {...field} />
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
        <FormField
          control={form.control}
          name="priorityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Set a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityList.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {' '}
                      <div className="flex items-center gap-2">
                        {workspace.icon}
                        <span>{workspace.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
