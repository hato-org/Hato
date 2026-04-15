import '@testing-library/jest-dom/vitest';

// jsdom does not implement window.scrollTo
window.scrollTo = () => {};
