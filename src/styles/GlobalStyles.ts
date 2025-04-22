// src/styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';
import theme from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.primary};
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  /* React Flow overrides */
  .react-flow {
    background-color: ${theme.colors.background.secondary};
  }

  .react-flow__node {
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.md};
    transition: ${theme.transitions.default};
  }

  .react-flow__node:hover {
    box-shadow: ${theme.shadows.lg};
  }

  .react-flow__edge-path {
    stroke-width: 2;
  }

  .react-flow__handle {
    background: ${theme.colors.text.primary};
    border: 2px solid ${theme.colors.background.primary};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.text.light};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.secondary};
  }
`;