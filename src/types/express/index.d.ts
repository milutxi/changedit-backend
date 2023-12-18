declare global {
    namespace Express {
        export interface Request {
            userId?: string;
        }
    }
}

export {}; //ingen funtion bara en krav från typeScript