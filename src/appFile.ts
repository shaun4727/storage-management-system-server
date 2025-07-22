import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import path from 'path';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import { fileDestinations } from './app/utils/constants';

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    // origin: ['http://localhost:3000'],
    origin: '*',
    // credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// fetch single pdf
app.use('/files/pdf', express.static(path.join(process.cwd(), fileDestinations.pdf)));

// Serve images
app.use('/files/images', express.static(path.join(process.cwd(), fileDestinations.images)));

// Serve DOCX (notes)
app.use('/files/doc-files', express.static(path.join(process.cwd(), fileDestinations.notes)));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.end('Project running');
});

app.use(notFound);
app.use(globalErrorHandler);
export default app;
