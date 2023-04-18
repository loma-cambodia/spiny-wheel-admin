import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";
import axios from "axios";
const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: { "X-Requested-With": "XMLHttpRequest",   'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true,
});

export default function useProduct() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
    progress: 0.3,
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
      name: "sku",
      label: "sku",
      required: true,
      field: (row) => row.sku,
      align: "left",
      sortable: true,
    },
    {
      name: "name",
      label: "name",
      required: true,
      field: (row) => row.translation,
      align: "left",
      sortable: true,
    },
    {
      name: "category",
      label: "Category",
      required: true,
      field: (row) => row.category?.name,
      align: "center",
      sortable: false,
    },

    // {
    //   name: "view",
    //   label: "view",
    //   required: true,
    //   field: (row) => row.view,
    //   align: "center",
    // },
    {
      name: "promotion",
      label: "promotion",
      required: true,
      field: (row) => row,
      align: "center",
    },
    {
      name: "quantity",
      label: "quantity",
      required: true,
      field: (row) => row.quantity,
      align: "right",
    },
    {
      name: "slot",
      label: "slots",
      required: true,
      field: (row) => row.slot?.total_slots,
      align: "right",
    },
    {
      name: "deal_setting",
      label: "deal_setting",
      required: true,
      field: (row) => row,
      align: "right",
    },

    {
      name: "deal",
      label: "active_deal",
      required: true,
      field: (row) => row,
      align: "right",
    },


    {
      name: "price",
      label: "price",
      required: true,
      field: (row) => row,
      align: "right",
    },
    {
      name: "status",
      label: "status",
      required: true,
      field: (row) => row.status,
      align: "center",
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
      await api.post("/products?lang_id=1", data);
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
      const response = await api.patch(`/products/${id}?lang_id=1`, data);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const onUploadProgress = event => {
      const percentCompleted = Math.round((event.loaded * 100) / event.total);
      console.log('onUploadProgress', percentCompleted);
       state.progress = percentCompleted;
  }

  const uploadImages = async (id, data) => {
    try {
      state.saving = true;
      const response = await instance.post(`/products-images/${id}?lang_id=1`,data, {onUploadProgress});
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const deleteImages = async (id) => {
    try {
      state.saving = true;
      const response = await instance.delete(`/products-image-delete/${id}?lang_id=1`);
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
      const response = await api.delete(`/products/${id}?lang_id=1`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/products/${id}?lang_id=1`);
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
      const response = await api.get("/products/paginate?lang_id=1", { params });
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
      const response = await api.get("/products/all?lang_id=1");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const productSetting = async (id, data) => {
    try {
      state.saving = true;
      const response = await api.post(`/products-setting/${id}?lang_id=1`,data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const prodSatus = async (id, data) => {
    try {
      state.saving = true;
      const response = await api.post(`/products-status/${id}?lang_id=1`,data);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
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
    uploadImages,
    deleteImages,
    productSetting,
    prodSatus
  };
}
