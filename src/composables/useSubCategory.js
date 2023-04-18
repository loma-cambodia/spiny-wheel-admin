import { reactive, toRefs, shallowReactive } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";
import axios from "axios";

const axoisInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: { "X-Requested-With": "XMLHttpRequest",   'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true,
});


export default function useSubCategory() {
  const state = shallowReactive({
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
      name: "sub_categoriesName",
      label: "SUB CATEGORY NAME",
      required: true,
      field: (row) => row.name,
      align: "left",
      sortable: false,
    },
    {
      name: "categoryName",
      label: "CATEGORY NAME",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    /* {
      name: "parentCategory",
      label: "PARENT CATEGORY NAME",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    }, */

    {
      name: "slug",
      label: "Slug",
      required: true,
      field: (row) => row.slug,
      align: "left",
      sortable: true,
    },
    {
      name: "description",
      label: "Description",
      required: true,
      field: (row) => row.slug,
      align: "left",
      sortable: true,
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
      await axoisInstance.post("/sub-categories?lang_id=1", data);
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
      await axoisInstance.post(`/sub-categories/${id}?lang_id=1`, data);
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
      await api.delete(`/sub-categories/${id}?lang_id=1`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/sub-categories/${id}?lang_id=1`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getByCategoryId = async (id) => {
    try {
      const response = await api.get(`/sub-by-categories/${id}?lang_id=1`);
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
      const response = await api.get("/sub-categories/paginate?lang_id=1", { params });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getUsingSub = async (id) => {
    try {
      const response = await api.get(`/sub-categories/using/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const all = async () => {
    try {
      const response = await api.get("/sub-categories/all?lang_id=1");
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
    getByCategoryId,
    getUsingSub
  };
}
