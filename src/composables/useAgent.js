import { reactive, toRefs } from "vue";
import Utils from "../helpers/Utils";
import { api } from "../boot/axios";
import { date } from "quasar";

export default function useAgent() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
  });

  const columns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row.id,
      align: "left",
      sortable: false,
    },
    {
      name: "agent_ID",
      label: "Agent ID",
      required: true,
      field: (row) => row.agent_ID,
      align: "center",
      sortable: true,
    },
    {
      name: "name",
      label: "NAME",
      required: true,
      field: (row) => row.name,
      align: "center",
      sortable: true,
    },
    {
      name: "username",
      label: "username",
      required: true,
      field: (row) => row.username,
      align: "center",
      sortable: true,
    },
    // {
    //   name: "roles.name",
    //   label: "Roles",
    //   required: true,
    //   field: (row) => row?.roles?.map((role) => role.name).join(", "),
    //   align: "center",
    //   sortable: false,
    // },
    {
      name: "level",
      label: "level",
      required: true,
      field: (row) => row?.level,
      align: "center",
      sortable: false,
    },
    {
      name: "created_at",
      label: "CREATED AT",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    // {
    //   name: "enable_ga",
    //   label: "google authenticator",
    //   required: false,
    //   field: (row) => row.enable_ga,
    //   align: "center",
    //   sortable: false,
    // },
    {
      name: "status",
      label: "status",
      required: false,
      field: (row) => row.status,
      align: "center",
      sortable: false,
    },
    {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/agents", data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const update = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/agents/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const trash = async (id, params = "") => {
    try {
      state.deleting = true;
      await api.delete(`/agents/${id}?${params}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const resetPassword = async (data) => {
    try {
      state.saving = true;
      await api.post(`/agents/reset-password`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const updatePassword = async (id, data) => {
    try {
      state.saving = true;
      return await api.post(`/agents/reset-password/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const get = async (id) => {
    try {
      state.loading = true;
      await api.get(`/agents/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.loading = false;
    }
  };
  const isDeteteAble = async (id) => {
    try {
      const response = await api.get(`/agents/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };
  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/agents/paginate", { params });
      state.items = response.data.data;
      state.loading = false;
      // console.log(response);
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const all = async () => {
    try {
      const response = await api.get("/agents/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const verifyUser2FA = async (data) => {
    try {
      const response = await api.post("/auth/2fa/verify-user", data);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const verifyCode = async (data) => {
    try {
      const response = await api.post("/auth/2fa/verify-code", data);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const enableGa = async (data) => {
    try {
      const response = await api.post("/auth/2fa/enable-ga", data);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  return {
    ...toRefs(state),
    columns,
    add,
    get,
    update,
    trash,
    paginate,
    resetPassword,
    updatePassword,
    isDeteteAble,
    all,
    verifyUser2FA,
    verifyCode,
    enableGa
  };
}
