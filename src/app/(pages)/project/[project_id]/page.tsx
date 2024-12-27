'use client';

import React from 'react';

import Kanban from '@/components/others/kanban';

interface ProjectPageProps {
  params: Promise<{ project_id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const unwrappedParams = React.use(params); // Unwrap the params Promise

  const { project_id } = unwrappedParams;
  return <Kanban projectId={project_id} />;
}
