import BoardExample from '@/components/board-dnd/example';
import Inbox from '@/components/rocket-dnd/inbox';
import { List } from '@/components/single-list-dnd/list';
import React from 'react';

export default function InboxPage() {
  return (
    <div className="flex space-x-4 p-4 bg-gray-100 min-h-screen justify-center">
      {/* <List /> */}
      <BoardExample />
      {/* <Inbox/> */}
    </div>
  );
}
