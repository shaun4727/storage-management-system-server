import { Router } from 'express'
import { AuthRoutes } from '../modules/auth/auth.routes'
import { UserRoutes } from '../modules/user/user.routes'

const router = Router()

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },

  //   {
  //     path: '/meta',
  //     route: MetaRoutes,
  //   },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router
