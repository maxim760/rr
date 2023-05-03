declare namespace NodeJS {
  export interface ProcessEnv {
    VK_CLIENT_ID: string
    VK_CLIENT_SECRET: string
    YA_CLIENT_ID: string
    YA_CLIENT_SECRET: string
    SLACK_CLIENT_ID: string
    SLACK_CLIENT_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string

    JWT_SECRET: string
    CLIENT_URL: string
    SERVER_URL: string
    ROOT_ROUTE: string
    SESSION_SECRET: string
    PORT: string
    DB_TYPE: "mysql"
    DB_CONNECT_URL: string
  }
}

declare module 'passport-slack' {
  export const Strategy: any;
}
declare module 'passport-slack-oauth2' {
  export const Strategy: any;
}