import React, { useEffect, useState } from 'react';

export const UseSidebarDetails = () => {
  const [data, setData] = useState<any>(null);
  async function fetchSidebarDetails() {
    try {
      const res = await fetch(`/api/sidebar/get-sidebar-details`, {
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch project details');
        }
        return res.json();
      });
      console.log('response =', res.data);
      setData(res.data);
    } catch (err) {
      console.log('Something went wrong :', err);
    }
  }

  return {
    fetchSidebarDetails,
    setData,
    data,
  };
};
