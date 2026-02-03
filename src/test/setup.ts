import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup après chaque test
afterEach(() => {
  cleanup();
});

