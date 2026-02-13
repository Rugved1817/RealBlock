import { generateOpenApiDocument } from 'trpc-to-openapi';
import { appRouter } from '../trpc/root.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'RealBlock KYC API',
    description: 'OpenAPI documentation for RealBlock KYC module',
    version: '1.0.0',
    baseUrl: process.env.RENDER_EXTERNAL_URL
        ? `${process.env.RENDER_EXTERNAL_URL}/api`
        : `http://localhost:${process.env.PORT || 4000}/api`,
});

export const swaggerRouter = express.Router();
swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(openApiDocument));
