namespace NodeJS {
  interface ProcessEnv {
    // DB Connection
    DB_PORT: number;
    DB_NAME: string;
    DB_HOST: string;
    DB_PASSWORD: string;
    DB_USERNAME: string;
    // jwt
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
