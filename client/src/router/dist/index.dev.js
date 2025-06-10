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

var _Dashboard = _interopRequireDefault(require("@/components/admin/Dashboard.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var routes = [{
  path: '/admin',
  component: _AdminLayout["default"],
  children: [{
    path: '',
    redirect: 'dashboard'
  }, // Redirige /admin a /admin/dashboard
  {
    path: 'dashboard',
    component: _Dashboard["default"]
  }, {
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
}, {
  path: '/',
  name: 'Home',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@/components/cliente/Home.vue'));
    });
  }
}];
var router = (0, _vueRouter.createRouter)({
  history: (0, _vueRouter.createWebHistory)(),
  routes: routes
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=index.dev.js.map
