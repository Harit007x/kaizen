'use client';
import Kanban from '@/components/others/kanban';

interface ProjectPageProps {
  params: { project_id: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { project_id } = params;
  return <Kanban projectId={project_id} />;
}
