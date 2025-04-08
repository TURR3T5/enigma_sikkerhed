/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginUnsafeImport } from './routes/LoginUnsafe'
import { Route as LoginSafeImport } from './routes/LoginSafe'
import { Route as LearnImport } from './routes/Learn'
import { Route as HomeImport } from './routes/Home'

// Create/Update Routes

const LoginUnsafeRoute = LoginUnsafeImport.update({
  id: '/LoginUnsafe',
  path: '/LoginUnsafe',
  getParentRoute: () => rootRoute,
} as any)

const LoginSafeRoute = LoginSafeImport.update({
  id: '/LoginSafe',
  path: '/LoginSafe',
  getParentRoute: () => rootRoute,
} as any)

const LearnRoute = LearnImport.update({
  id: '/Learn',
  path: '/Learn',
  getParentRoute: () => rootRoute,
} as any)

const HomeRoute = HomeImport.update({
  id: '/Home',
  path: '/Home',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/Home': {
      id: '/Home'
      path: '/Home'
      fullPath: '/Home'
      preLoaderRoute: typeof HomeImport
      parentRoute: typeof rootRoute
    }
    '/Learn': {
      id: '/Learn'
      path: '/Learn'
      fullPath: '/Learn'
      preLoaderRoute: typeof LearnImport
      parentRoute: typeof rootRoute
    }
    '/LoginSafe': {
      id: '/LoginSafe'
      path: '/LoginSafe'
      fullPath: '/LoginSafe'
      preLoaderRoute: typeof LoginSafeImport
      parentRoute: typeof rootRoute
    }
    '/LoginUnsafe': {
      id: '/LoginUnsafe'
      path: '/LoginUnsafe'
      fullPath: '/LoginUnsafe'
      preLoaderRoute: typeof LoginUnsafeImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/Home': typeof HomeRoute
  '/Learn': typeof LearnRoute
  '/LoginSafe': typeof LoginSafeRoute
  '/LoginUnsafe': typeof LoginUnsafeRoute
}

export interface FileRoutesByTo {
  '/Home': typeof HomeRoute
  '/Learn': typeof LearnRoute
  '/LoginSafe': typeof LoginSafeRoute
  '/LoginUnsafe': typeof LoginUnsafeRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/Home': typeof HomeRoute
  '/Learn': typeof LearnRoute
  '/LoginSafe': typeof LoginSafeRoute
  '/LoginUnsafe': typeof LoginUnsafeRoute
}
  
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/Home' | '/Learn' | '/LoginSafe' | '/LoginUnsafe'
  fileRoutesByTo: FileRoutesByTo
  to: '/Home' | '/Learn' | '/LoginSafe' | '/LoginUnsafe'
  id: '__root__' | '/Home' | '/Learn' | '/LoginSafe' | '/LoginUnsafe'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  HomeRoute: typeof HomeRoute
  LearnRoute: typeof LearnRoute
  LoginSafeRoute: typeof LoginSafeRoute
  LoginUnsafeRoute: typeof LoginUnsafeRoute
}

const rootRouteChildren: RootRouteChildren = {
  HomeRoute: HomeRoute,
  LearnRoute: LearnRoute,
  LoginSafeRoute: LoginSafeRoute,
  LoginUnsafeRoute: LoginUnsafeRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/Home",
        "/Learn",
        "/LoginSafe",
        "/LoginUnsafe"
      ]
    },
    "/Home": {
      "filePath": "Home.tsx"
    },
    "/Learn": {
      "filePath": "Learn.tsx"
    },
    "/LoginSafe": {
      "filePath": "LoginSafe.tsx"
    },
    "/LoginUnsafe": {
      "filePath": "LoginUnsafe.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
