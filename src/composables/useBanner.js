import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";
import axios from "axios";

const axoisInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: { "X-Requested-With": "XMLHttpRequest",   'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true,
});

export default function useBanner() {
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
      name: "type",
      label: "type",
      required: true,
      field: (row) => row.type,
      align: "left",
      sortable: true,
    },
    {
      name: "slug",
      label: "Slug",
      required: true,
      field: (row) => row.slug,
      align: "left",
      sortable: true,
    },
    {
      name: "link",
      label: "link",
      required: true,
      field: (row) => row.link,
      align: "left",
      sortable: false,
    },
    {
      name: "position",
      label: "position",
      required: true,
      field: (row) => row.position,
      align: "left",
      sortable: false,
    },
    {
      name: "status",
      label: "Status",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
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
      await axoisInstance.post("/banners", data);
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
      await axoisInstance.post(`/banners/${id}`, data);
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
      await api.delete(`/banners/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const getUsing = async (id) => {
    try {
      const response = await api.get(`/banners/using/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/banners/${id}`);
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
      const response = await api.get("/banners/paginate", { params });
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
      const response = await api.get("/banners/all");
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
    getUsing
  };
}
