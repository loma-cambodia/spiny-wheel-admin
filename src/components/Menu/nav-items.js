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
      "Deal: View",
      "Deal: Create",
      "Deal: Edit/Update",
    ],
    children: [
      {
        label: "Platform",
        icon: "mdi-application",
        to: { name: "platform" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update"],
      },
      {
        label: "Configure",
        icon: "mdi-cog",
        to: { name: "members" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update"],
      },
    ],
  },
  segments: {
    label: "Game Managerment",
    icon: "mdi-segment",
    permissions: [
      "Deal: View",
      "Deal: Create",
      "Deal: Edit/Update",
    ],
    children: [
      {
        label: "game",
        icon: "mdi-gamepad-circle-outline",
        to: { name: "game" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update"],
      },
      // {
      //   label: "Segment",
      //   icon: "mdi-group",
      //   to: { name: "segment" },
      //   permissions: ["Deal: View Deal", "Deal: Edit/Update"],
      // },
      // {
      //   label: "Price",
      //   icon: "mdi-cash",
      //   to: { name: "members" },
      //   permissions: ["Deal: View Deal", "Deal: Edit/Update"],
      // },
      {
        label: "Configure",
        icon: "mdi-cog",
        to: { name: "members" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update"],
      },
    ],
  },
  rotation_managerment: {
    label: "Setting Managerment",
    icon: "mdi-crosshairs",
    permissions: [
      "Agent: View",
      "Agent: Create",
      "Agent: Edit/Update",
    ],
    children: [
      {
        label: "Rotation Speed",
        icon: "mdi-speedometer",
        to: { name: "agents" },
        permissions: ["Agent: View", "Agent: Edit/Update"],
      },
      {
        label: "Rotation Time",
        icon: "mdi-timelapse",
        to: { name: "agents" },
        permissions: ["Agent: View", "Agent: Edit/Update"],
      }
    ],
  },
  game_play_rule: {
    label: "Game Play Rule",
    icon: "mdi-gamepad-circle-left",
    permissions: [
      "Agent: View",
      "Agent: Create",
      "Agent: Edit/Update",
    ],
    children: [
      {
        label: "Point",
        icon: "mdi-star-four-points",
        to: { name: "agents" },
        permissions: ["Agent: View", "Agent: Edit/Update"],
      }
    ],
  },

  admin_management: {
    label: "Admin Management",
    icon: "mdi-chart-donut-variant",
    permissions: [
      "User: View",
      "Role: View",
      "Permission: View"
    ],
    children: [
      {
        label: "Users",
        icon: "mdi-account-multiple-outline",
        to: { name: "users" },
        permissions: ["User: View", "User: Create"],
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
      "Deal: View Deal",
      "Deal: Create Deal",
      "Deal: Edit/Update Deal",
    ],
    children: [
      {
        label: "Activity Logs",
        icon: "mdi-clipboard-pulse-outline",
        to: { name: "audit-logs" },
        permissions: ["Report: View Audit Logs"],
      },
      {
        label: "Admin Login",
        icon: "mdi-clipboard-list-outline",
        to: { name: "admin-logins" },
        permissions: ["Report: View Audit Logs"],
      },
      // {
      //   label: "Member Login",
      //   icon: "mdi-clipboard-list-outline",
      //   to: { name: "member-logins" },
      //   permissions: ["Report: View Audit Logs"],
      // },
    ],
  },
};
