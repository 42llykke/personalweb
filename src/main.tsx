import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against duplicate createRoot dev warning in AI Studio environment
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('passed to createRoot() before')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

declare global {
  interface Window {
    __react_app_root__?: Root;
  }
}

let container = document.getElementById('root');

if (container) {
  let root: Root | null =
    (container as any).__react_root__ ||
    window.__react_app_root__ ||
    null;

  if (!root) {
    // If container was previously used by React, replace with a fresh element
    const hasExistingReact = Object.keys(container).some(
      (k) => k.startsWith('__reactContainer') || k === '_reactRootContainer'
    );

    if (hasExistingReact) {
      const freshContainer = document.createElement('div');
      freshContainer.id = 'root';
      freshContainer.className = container.className;
      container.replaceWith(freshContainer);
      container = freshContainer;
    }

    root = createRoot(container);
    (container as any).__react_root__ = root;
    window.__react_app_root__ = root;
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
