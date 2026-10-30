import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom does not implement window.scrollTo
window.scrollTo = () => {};

// jsdom does not implement window.matchMedia (required by next-themes / Chakra v3 color-mode)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
