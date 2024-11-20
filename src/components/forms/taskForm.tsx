// components/TaskForm.tsx
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { IHandleTaskCreate } from '../others/create-task';

const FormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a task name.',
  }),
  description: z.string().optional(),
  priority: z.string().optional(),
});

export type TaskFormData = z.infer<typeof FormSchema>;

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (payloadData: IHandleTaskCreate, category_id: string) => Promise<Response | void>;
  onCancel: () => void;
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
}: TaskFormProps) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      priority: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    await onSubmit(data, categoryId);
    form.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
