import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { NextFunction, Request, Response } from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const HASHED_ASSET = /-[A-Z0-9]{8}\.[a-z0-9]+$/;

app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    setHeaders: (res, filePath) => {
      res.setHeader(
        'Cache-Control',
        HASHED_ASSET.test(filePath) ? 'public, max-age=31536000, immutable' : 'no-cache',
      );
    },
  }),
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('Vary', 'Cookie');

  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  console.error('SSR render failed:', err);
  if (res.headersSent) return next(err);
  res.status(500).type('text/plain').send('Something went wrong. Please try again.');
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
