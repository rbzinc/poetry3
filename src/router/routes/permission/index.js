const permissionRoutes = [];
const routesFiles = import.meta.glob("./modules/*.js", { eager: true });

Object.entries(routesFiles).forEach(([, module]) => {
  permissionRoutes.push(module.default);
});
export default permissionRoutes;
