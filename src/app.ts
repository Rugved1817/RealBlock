import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createOpenApiExpressMiddleware } from 'trpc-to-openapi';
import { appRouter } from './trpc/root.js';
import { createContext } from './trpc/trpc.js';
import { handleCashfreeWebhook } from './modules/kyc/kyc.webhook.js';
import { swaggerRouter } from './config/openapi.js';

const app = express();

// Middleware to capture raw body for webhook signature verification
app.use(express.json({
    verify: (req: any, res, buf) => {
        if (req.originalUrl.startsWith('/webhooks/cashfree')) {
            req.rawBody = buf.toString();
        }
    }
}));

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Webhook route (Must be before tRPC)
app.post('/webhooks/cashfree/kyc', handleCashfreeWebhook);

// tRPC express middleware
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

// OpenAPI express middleware
app.use('/api', createOpenApiExpressMiddleware({
    router: appRouter,
    createContext
}));

// Swagger UI for OpenAPI
app.use('/docs', swaggerRouter);

export default app;
