'use client';

import { useEffect } from 'react';
import { setupRepositories } from './repositories';
import { setupUseCases } from './usecases';

export function DIProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('Setting up DI on client...');
    setupRepositories();
    setupUseCases();
    console.log('DI setup complete on client');
  }, []);

  return <>{children}</>;
}