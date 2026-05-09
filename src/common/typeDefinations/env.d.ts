namespace NodeJS {
  interface ProcessEnv {
    // DB Connection
    DB_PORT: number;
    DB_NAME: string;
    DB_HOST: string;
    DB_PASSWORD: string;
    DB_USERNAME: string;
    // bucket and storage keys
    S3_SECRET_KEY: string;
    S3_ACCESS_KEY: string;
    S3_BUCKET_NAME: string;
    S3_ENDPOINT: string;
  }
}
