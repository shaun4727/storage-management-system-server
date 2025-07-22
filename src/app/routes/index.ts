import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { FetchRoutes } from '../modules/fetch/fetch.route';
import { GenRoutes } from '../modules/file-folder-generation/generate.route';
import { OperationRoutes } from '../modules/operations/operation.route';
import { UserRoutes } from '../modules/user/user.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/file',
    route: GenRoutes,
  },
  {
    path: '/fetch',
    route: FetchRoutes,
  },
  {
    path: '/file-operation',
    route: OperationRoutes,
  },

  //   {
  //     path: '/meta',
  //     route: MetaRoutes,
  //   },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
