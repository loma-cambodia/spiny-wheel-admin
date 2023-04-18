import { reactive, toRefs, ref, inject } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";
import moment from "moment";
export default function useorders() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
  });

  const columnsOrderDetails = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: false,
    },
    {
      name: "deal_id",
      label: "DEAL ID",
      required: true,
      field: (row) => row?.deal_id,
      align: "left",
    },
    {
      name: "product_name",
      label: "PRODUCT NAME",
      required: true,
      field: (row) => row,
      align: "left",
    },
    {
      name: "booked_slots",
      label: "BOOKED SLOTS",
      required: true,
      field: (row) => row,
      align: "center",
    },
    {
      name: "amount",
      label: "AMOUNT",
      required: true,
      field: (row) => row,
      align: "center",
    },
    {
      name: "status",
      label: "PAYMENT STATUS",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

  const columnsOrderProductSlotDetails = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: false,
    },
    {
      name: "booking_id",
      label: "SLOT BOOKING ID",
      required: true,
      field: (row) => row.booking_id,
      align: "left",
    },
    {
      name: "order_id",
      label: "ORDER ID",
      required: true,
      align: "left",
    },
    {
      name: "deal_id",
      label: "DEAL ID",
      required: true,
      field: (row) => row.deal.deal_id,
      align: "left",
    },
    {
      name: "product_name",
      label: "PRODUCT NAME",
      required: true,
      align: "left",
    },
    {
      name: "status",
      label: "PAYMENT STATUS",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

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
      name: "order_id",
      label: "ORDER ID",
      required: true,
      field: (row) => row,
      align: "left",
    },
    {
      name: "deals_count",
      label: "Deals Count",
      required: true,
      field: (row) => row.order_table_id,
      align: "left",
    },
    {
      name: "customer_id",
      label: "CUSTOMER DETAIL",
      required: true,
      field: (row) => row,
      align: "left",
    },
    {
      name: "created_at",
      label: "Order Date",
      required: true,
      field: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
      align: "left",
    },
    {
      name: "total_amount",
      label: "Order Amount",
      required: true,
      field: (row) => Utils.formatCurrency(row.total_amount),
      align: "right",
    },

    {
      name: "order_status",
      label: "Order Status",
      required: true,
      field: (row) => row,
      align: "center",
    },
    // {
    //   name: "status",
    //   label: "PAYMENT STATUS",
    //   required: true,
    //   field: (row) => row,
    //   align: "center",
    // },
    /* {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "right",
    }, */
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/orders", data);
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
      await api.patch(`/orders/${id}`, data);
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
      await api.delete(`/orders/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
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
      const response = await api.get("/orders/paginate", { params });
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
      const response = await api.get("/orders/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const dummyPayment = async (id) => {
    try {
      state.saving = true;
      await api.post(`/order-payment/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const updateStatus = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/order-status/${id}`, data);
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
    columnsOrderDetails,
    columnsOrderProductSlotDetails,
    add,
    update,
    trash,
    get,
    paginate,
    all,
    dummyPayment,
    updateStatus,
  };
}
