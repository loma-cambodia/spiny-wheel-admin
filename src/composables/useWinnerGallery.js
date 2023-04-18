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

export default function useWinnerGallery() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
    progress: 1,
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
      align: "left",
      sortable: false,
    },
    {
      name: "description",
      label: "description",
      required: true,
      field: (row) => row.description,
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

  const onUploadProgress = event => {
    const percentCompleted = Math.round((event.loaded * 100) / event.total);
    // console.log('event.uploadProgress', event.loaded, 'percentCompleted', percentCompleted, 'event.total', event.total);
     state.progress = percentCompleted;
}

  const add = async (data) => {
    try {
      state.saving = true;
      await axoisInstance.post("/winner-gallery", data, {onUploadProgress});
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
      await axoisInstance.post(`/winner-gallery/${id}`, data, {onUploadProgress});
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
      await api.delete(`/winner-gallery/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const getUsing = async (id) => {
    try {
      const response = await api.get(`/winner-gallery/using/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/winner-gallery/${id}`);
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
      const response = await api.get("/winner-gallery/paginate", { params });
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
      const response = await api.get("/winner-gallery/all");
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
