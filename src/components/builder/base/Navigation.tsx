'use client';
import { Skeleton } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import dynamic from 'next/dynamic';
export const Navigation = dynamic(() => import('@Components/builder/nav').then(m => m.Navigation), {
  ssr: false,
  loading: () => <div style={{ padding: 16, border: '1px solid var(--foreground)', margin: 8, borderRadius: 8 }}><div>Loading menu ..</div><Skeleton animation="wave" /><Skeleton animation="wave" /><Skeleton animation="wave" /></div>,
});

