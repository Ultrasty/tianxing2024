/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_API_PREFIX: string
}


declare module '*.vue' {
    import { Component } from 'vue'; const component: Component; export default component;
}