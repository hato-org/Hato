# Contribution Guide

## Project Structure

- `/src` - Source code
  - `main.tsx` - EntryPoint (Provider chain etc)
  - `App.tsx` - Root component
  - `/@types` - Type definitions
  - `/components` - Button, Card, Calendar, ...
  - `/hooks` - Custom hooks
  - `/modules` - API, Authentication, ...
  - `/pages` - Page components
  - `/store` - Global states
  - `/utils` - Utilities

## Libraries

- [`vitejs/vite`](https://vitejs.dev/) - Frontend buliding tool
- [`facebook/react`](https://reactjs.org/) - Main UI library
- [`remix-run/react-router`](https://reactrouter.com/en/v6.3.0) - Routing library
- [`chakra-ui/chakra-ui`](https://chakra-ui.com/) - Component library
- [`TanStack/query`](https://tanstack.com/query/v4) - Asynchronous state management library (Mainly used for data fetching)
- [`facebookexperimental/recoil`](https://recoiljs.org/) - State management library

## Other tools

- [`ESLint`](https://eslint.org/) - Linter, See [`.eslintrc.json`](https://github.com/Hato-org/Hato/blob/master/.eslintrc.json)
- [`Prettier`](https://prettier.io/) - Code Formatter, See [`.prettierrc`](https://github.com/Hato-org/Hato/blob/master/.prettierrc)
- [`okonet/lint-staged`](https://github.com/okonet/lint-staged) / [`Husky`](https://typicode.github.io/husky/) - Pre-commit linter runner

## Dev

1. `yarn install`
1. `yarn dev` or `yarn dev --host`

## Build

```bash
yarn build
```

## Links

- [Demo page](https://demo.hato.cf/)
- [Staging page](https://staging.hato.cf/)
- [Project board](https://github.com/orgs/Hato-org/projects/1)

## Reference

- [React documentation](https://reactjs.org/)
- [Chakra UI documentation](https://chakra-ui.com/)
- [Tanstack Query documentation](https://tanstack.com/query/v4)
- [React Router documentation](https://reactrouter.com/en/v6.3.0)
- [Recoil documentation](https://recoiljs.org/)
- [Vite PWA Plugin documentation](https://vite-plugin-pwa.netlify.app/)
