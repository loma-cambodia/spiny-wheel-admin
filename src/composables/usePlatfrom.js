import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function usePlatfrom() {
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
      field: (row) => row,
      align: "left",
      sortable: false,
    },
    {
      name: "name",
      label: "name",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "user",
      label: "user",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: false,
    },
    {
      name: "created_at",
      label: "created_at",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss") ,
      align: "center",
      sortable: true,
    },
    {
      name: "status",
      label: "Status",
      required: true,
      field: (row) => row?.status,
      align: "center",
      sortable: false,
    },
    {
      name: "actions",
      label: "ACTIONS",
      required: false,
      field: (row) => row,
      align: "center",
    },
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/platforms", data);
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
      await api.patch(`/platforms/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const trash = async (id) => {
    try {
      state.deleting = true;
      await api.delete(`/platforms/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/platforms/${id}`);
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
      const response = await api.get("/platforms/paginate", { params });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const all = async () => {
    try {
      const response = await api.get("/platforms/all");
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
    update,
    trash,
    get,
    paginate,
    all,
  };
}
