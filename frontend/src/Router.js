import pathToRegexp from 'path-to-regexp';
import Forms from './Forms';

export const getRouterData = currentUser => {
  const routerConfig = {
    '/': {
      name: 'Forms',
      component: Forms,
    },
    '/new': {
      name: 'New Form',
      component: Forms,
    },
  };
  const routerData = {};
  Object.keys(routerConfig).forEach(path => {
    const pathRegexp = pathToRegexp(path);
    let router = routerConfig[path];
    router = {
      ...router,
      name: router.name,
      authority: router.authority,
      hideInBreadcrumb: router.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
