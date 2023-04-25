const routes = [
  {
    name: "Page: Login",
    path: "/auth/login",
    component: () => import("src/pages/Login.vue"),
  },

  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "/",
        component: () => import("src/pages/Dashboard.vue"),
        meta: { title: "Home", subtitle: "Dashboard" },
      },

      // LOG HISTORY
      {
        name: "audit-logs",
        path: "/audit-logs",
        component: () => import("src/pages/LogHistory/AuditLog.vue"),
        meta: { title: "Home", subtitle: "Activity Logs", permission: "Logs: View Activity"  },
      },
      {
        name: "admin-logins",
        path: "/admin-logins",
        component: () => import("src/pages/LogHistory/AdminLoginLog.vue"),
        meta: { title: "Home", subtitle: "Admin Login", permission: "Logs: View Login"  },
      },
      {
        name: "member-logins",
        path: "/member-logins",
        component: () => import("src/pages/LogHistory/MemberLoginLog.vue"),
        meta: { title: "Home", subtitle: "Member Login", permission: "Logs: View Activity"  },
      },

      // ACL
      {
        name: "roles",
        path: "/roles",
        component: () => import("pages/Role/Index.vue"),
        meta: { title: "Home", subtitle: "Roles", permission: "Role: View"  },
      },
      {
        name: "permissions",
        path: "/permissions",
        component: () => import("pages/Permission/Index.vue"),
        meta: { title: "Home", subtitle: "Permissions", permission: "Permission: View"  },
      },

      // MASTER DATA
      {
        name: "languages",
        path: "/languages",
        component: () => import("pages/Language/Index.vue"),
        meta: { title: "Home", subtitle: "Languages", permission: "Language: View"  },
      },
      {
        name: "whitelist-ips",
        path: "/whitelist-ips",
        component: () => import("pages/WhitelistIP/Index.vue"),
        meta: { title: "Home", subtitle: "Whitelist IPs", permission: "Whitelist IP: View"  },
      },

      // USER MANAGEMENT
      {
        name: "users",
        path: "/users",
        component: () => import("pages/User/Index.vue"),
        meta: { title: "Home", subtitle: "Users" , permission: "User: View User" },
      },

      // {
      //   name: "currencies",
      //   path: "/currencies",
      //   component: () => import("src/pages/Currency/Index.vue"),
      //   meta: { title: "Home", subtitle: "Currency" , permission: "Segment: View" },
      // },

      // {
      //   name: "country-state",
      //   path: "/country-state",
      //   component: () => import("src/pages/Country-State/Index.vue"),
      //   meta: { title: "Currency", subtitle: "Country", permission: "Segment: View"  },
      // },

      // {
      //   name: "segment",
      //   path: "/segment",
      //   component: () => import("src/pages/Segment/Index.vue"),
      //   meta: { title: "Segment", subtitle: "Segment", permission: "Segment: View" },
      // },
      {
        name: "game",
        path: "/game",
        component: () => import("src/pages/Game/Index.vue"),
        meta: { title: "game", subtitle: "game", permission: "Game: View" },
      },
      {
        name: "game-flatform",
        path: "/game-flatform",
        component: () => import("src/pages/Game/Platform.vue"),
        meta: { title: "game", subtitle: "game", permission: "Game Platform Setting: View" },
      },

      // PLATFROM MANAGEMENT
      {
        name: "platform",
        path: "/platform",
        component: () => import("src/pages/Platform/Index.vue"),
        meta: { title: "platform", subtitle: "platform", permission: "Platform: View" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
