export default async function({ next, router, store, to }: any) {
    const routeFeatureByPermission = to.meta.permissions;
    let isAllow = true;
    if (store.state.auth.user?.permission_group && !store.state.auth.user?.is_root) {
        const allowFeauture = Object.values(store.state.auth.user.permission_group);
        isAllow = allowFeauture.some((item: any) => routeFeatureByPermission.includes(item));

        if (!isAllow) {
            if (to?.redirectedFrom?.name && router?.options.routes) {
                const checkListChildRouter = router.options.routes.find((r: any) => r.name === to?.redirectedFrom.name)
                    ?.children;
                if (checkListChildRouter != undefined && allowFeauture.length > 0 && checkListChildRouter.length > 0) {
                    checkListChildRouter.forEach((routerChild: any) => {
                        const checkAllowChildRouter = allowFeauture.some((item: any) =>
                            routerChild.meta.permissions.includes(item),
                        );
                        if (checkAllowChildRouter) {
                            next({ name: routerChild.name });
                        }
                    });
                }
            }
        }
    }
    if (!isAllow) {
        next({ name: 'ErrorAccessDenied' });
    } else next();
}
