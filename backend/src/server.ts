import app from './app.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { openApiDocument } from './config/openapi.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 4000;

app.listen(port, async () => {
    try {
        // Write OpenAPI spec to file on start
        const specPath = path.join(__dirname, '../openapi-spec.json');
        await fs.promises.writeFile(specPath, JSON.stringify(openApiDocument, null, 2));
        console.log(`� OpenAPI spec saved to ${specPath}`);
    } catch (error) {
        console.error('❌ Failed to save OpenAPI spec:', error);
    }

    console.log(`� Server ready at http://localhost:${port}`);
    console.log(`� OpenAPI docs at http://localhost:${port}/docs`);
});
