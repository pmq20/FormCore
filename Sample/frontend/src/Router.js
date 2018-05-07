import Forms from './Forms';

const getFormName = pathname => {
  const match = pathname.match(new RegExp('^/(\\d+)'));
  if (match && match[1]) {
    return `Form #${match[1]}`;
  } else {
    return 'All';
  }
};

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
    '/:id': {
      name: getFormName,
      component: Forms,
    },
    '/:id/sections': {
      name: 'Sections',
      component: Forms,
    },
    '/:id/fields': {
      name: 'Fields',
      component: Forms,
    },
    '/:id/data': {
      name: 'Data',
      component: Forms,
    },
    '/:id/data/entry': {
      name: 'Data Entry',
      component: Forms,
    },
    '/:id/data/all': {
      name: 'All',
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
