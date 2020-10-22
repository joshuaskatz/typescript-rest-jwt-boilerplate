declare namespace NodeJS {
  export interface ProcessEnv {
    DB_URI: string;
    JWT_SECRET: string;
  }
}

declare namespace Express {
  interface Request {
    authPayload?: AuthPayload;
  }
}
