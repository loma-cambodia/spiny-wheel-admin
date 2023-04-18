import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useAnnouncement() {
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
      name: "title",
      label: "title",
      required: true,
      field: (row) => row.title,
      align: "center",
      sortable: true,
    },
    {
      name: "created_at",
      label: "created at",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    {
      name: "actions",
      label: "actions",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/announcements", data);
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    } finally {
      state.saving = false;
    }
  };

  const update = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/announcements/${id}`, data);
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    } finally {
      state.saving = false;
    }
  };

  const trash = async (id) => {
    try {
      state.deleting = true;
      await api.delete(`/announcements/${id}`);
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/announcements/${id}`);
      return response;
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    }
  };
  const isDeteteAble = async (id) => {
    try {
      const response = await api.get(`/announcements/${id}`);
      return response;
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    }
  };
  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/announcements/paginate", { params });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      throw Error(Utils.getErrorMessage(err));
    }
  };

  const all = async () => {
    try {
      const response = await api.get("/announcements/all");
      return response;
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
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
    isDeteteAble,
    all,
  };
}
