"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = require("vue-router");

var _AdminLayout = _interopRequireDefault(require("@/components/admin/AdminLayout.vue"));

var _Movimientos = _interopRequireDefault(require("@/components/admin/Movimientos.vue"));

var _Repuestos = _interopRequireDefault(require("@/components/admin/Repuestos.vue"));

var _Usuarios = _interopRequireDefault(require("@/components/admin/Usuarios.vue"));

var _Ventas = _interopRequireDefault(require("@/components/admin/Ventas.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Puedes agregar aquí rutas públicas si lo necesitas
var routes = [{
  path: '/admin',
  component: _AdminLayout["default"],
  children: [{
    path: 'movimientos',
    component: _Movimientos["default"]
  }, {
    path: 'repuestos',
    component: _Repuestos["default"]
  }, {
    path: 'usuarios',
    component: _Usuarios["default"]
  }, {
    path: 'ventas',
    component: _Ventas["default"]
  }]
}];
var router = (0, _vueRouter.createRouter)({
  history: (0, _vueRouter.createWebHistory)(),
  routes: routes
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=index.dev.js.map
