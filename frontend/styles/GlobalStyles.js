import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
    background: #09090b;
    scroll-behavior: smooth;
  }

  body {
    min-height: 100%;
    margin: 0;
    color: #f7f3ec;
    background:
      radial-gradient(circle at 80% -10%, rgba(133, 79, 34, 0.18), transparent 34rem),
      radial-gradient(circle at -10% 35%, rgba(107, 29, 36, 0.12), transparent 30rem),
      #09090b;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.75'/%3E%3C/svg%3E");
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea, select {
    font: inherit;
  }

  button, a {
    -webkit-tap-highlight-color: transparent;
  }

  img {
    display: block;
    max-width: 100%;
  }

  ::selection {
    color: #09090b;
    background: #d5a85a;
  }

  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: #09090b; }
  ::-webkit-scrollbar-thumb {
    background: #373236;
    border: 3px solid #09090b;
    border-radius: 999px;
  }
`;

export default GlobalStyles;
