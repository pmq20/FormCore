import Forms from './Forms';

export const getRouterData = () => {
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
