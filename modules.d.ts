declare namespace NodeJS {
  export interface ProcessEnv {
    DB_URI: string;
    JWT_SECRET: string;
    MAIL_USER: string;
    MAIL_PASS: string;
  }
}

declare namespace Express {
  interface Request {
    authPayload?: AuthPayload;
  }
}
