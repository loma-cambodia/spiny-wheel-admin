export default {
  home: {
    label: "dashboard",
    icon: "mdi-shape-outline",
    to: { name: "/" },
    permissions: [],
    children: [],
  },

  intergration: {
    label: "Intergration",
    icon: "mdi-chip",
    permissions: [
      "Platform: View",
    ],
    children: [
      {
        label: "Platform",
        icon: "mdi-application",
        to: { name: "platform" },
        permissions: ["Platform: View", "Platform: Edit/Update"],
      },
    ],
  },
  segments: {
    label: "Game Managerment",
    icon: "mdi-segment",
    permissions: [
      "Game: View",
      "Game Platform Setting: View"
    ],
    children: [
      {
        label: "game",
        icon: "mdi-gamepad-circle-outline",
        to: { name: "game" },
        permissions: ["Game: View", "Game: Edit/Update"],
      },
      {
        label: "Platform Game",
        icon: "mdi-cog",
        to: { name: "game-flatform" },
        permissions: ["Game Platform Setting: View", "Game Platform Setting: Edit/Update"],
      },
    ],
  },

  game_play_rule: {
    label: "Game Play Rule",
    icon: "mdi-gamepad-circle-left",
    permissions: [
      "Game: View",
    ],
    children: [
      {
        label: "Point",
        icon: "mdi-star-four-points",
        to: { name: "" },
        permissions: ["Game: View"],
      }
    ],
  },

  admin_management: {
    label: "Admin Management",
    icon: "mdi-chart-donut-variant",
    permissions: [
      "User: View",
      "Role: View",
      "Permission: View",
      "User: View User"
    ],
    children: [
      {
        label: "Users",
        icon: "mdi-account-multiple-outline",
        to: { name: "users" },
        permissions: ["User: View", "User: Create", "User: View User"],
      },
      {
        label: "Roles",
        icon: "mdi-account-cog-outline",
        to: { name: "roles" },
        permissions: ["Role: View", "Role: Create"],
      },
      {
        label: "Permissions",
        icon: "mdi-shield-key-outline",
        to: { name: "permissions" },
        permissions: ["Permission: View"],
      },
    ],
  },
  log_history: {
    label: "Logs",
    icon: "mdi-cogs",
    permissions: [
      "Game: View",
    ],
    children: [
      {
        label: "Activity Logs",
        icon: "mdi-clipboard-pulse-outline",
        to: { name: "audit-logs" },
        permissions: ["Game: View"],
      },
      {
        label: "Admin Login",
        icon: "mdi-clipboard-list-outline",
        to: { name: "admin-logins" },
        permissions: ["Game: View"],
      },
    ],
  },
};
