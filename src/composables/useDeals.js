import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useDeals() {
  const state = reactive({
    loading: false,
    saving: false,
    savings:false,
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
      name: "product_id",
      label: "DEAL ID",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    {
      name: "slot_price",
      label: "SLOT PRICE",
      required: true,
      field: (row) => row,
      align: "right",
      sortable: true,
    },
    {
      name: "deal_price",
      label: "DEAL PRICE",
      required: true,
      field: (row) => row,
      align: "right",
      sortable: true,
    },
    {
      name: "total_slots",
      label: "TOTAL SLOTS",
      required: true,
      field: (row) => row.slots?.total_slots,
      align: "center",
      sortable: true,
    },
    {
      name: "booked_slots",
      label: "BOOKED SLOTS",
      required: true,
      field: (row) => row.slots?.booked_slots,
      align: "center",
      sortable: true,
    },
    {
      name: "time_period",
      label: "TIME PERIOD",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    {
      name: "created_at",
      label: "START DATE TIME",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "left",
      sortable: true,
    },
    {
      name: "deal_end_at",
      label: "END DATE TIME",
      required: true,
      field: (row) => date.formatDate(row.deal_end_at, "YYYY-MM-DD HH:mm:ss"),
      align: "left",
      sortable: true,
    },
    {
      name: "status",
      label: "STATUS",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },/*
    {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "left",
    }, */
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/deals", data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const update = async (id) => {
    try {
      state.saving = true;
      await api.patch(`/deals/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const updates = async (data) => {
    try {
      state.savings = true;
      await api.patch(`/deals/${data.id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.savings = false;
    }
  };

  const extendTime = async (data) => {
    try {
      state.saving = true;
      await api.post(`/deals/set-deal`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const winnerSelect = async (data) => {
    try {
      state.saving = true;
      return await api.post(`/winners/create`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const generateDeal = async (data ) => {
    try {
      state.saving = true;
      return await api.post(`/winners/generate-deal`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }

  }

  const trash = async (id) => {
    try {
      state.deleting = true;
      await api.delete(`/deals/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/deals/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const checkbot = async () => {
    try {
      const response = await api.get(`deals/checkbot`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };


  const getCount = async () => {
    try {
      const response = await api.get(`/deals/counts`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }

  const updateIsBoot = async (id, data) => {
    try {
      const response = await api.patch(`/deals/updatebot/${id}`,data );
      return response;
    } catch (err) {
      return err.response;
      // throw Utils.getErrorMessage(err);
    }
  }

  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/deals/paginate", { params });
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
      const response = await api.get("/deals/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getPredicted = async (data) => {
    try {
      const response = await api.post(`/winners/generate-winner`, data);
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
    extendTime,
    winnerSelect,
    updates,
    getCount,
    updateIsBoot,
    generateDeal,
    getPredicted,
    checkbot
  };
}
