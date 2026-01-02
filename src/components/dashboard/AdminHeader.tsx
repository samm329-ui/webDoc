"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function AdminHeader() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(format(new Date(), "do MMM yyyy"));
  }, []);

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-foreground font-headline">Admin</h1>
      {currentDate && <p className="text-muted-foreground">Today · {currentDate}</p>}
    </header>
  );
}
