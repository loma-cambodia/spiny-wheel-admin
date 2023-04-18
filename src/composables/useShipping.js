import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useShipping() {
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
      name: "booking_id",
      label: "Slot ID",
      required: true,
      field: (row) => row.booking_id,
      align: "left",
      sortable: true,
    },
    {
      name: "deals.deal_id",
      label: "deal id",
      required: true,
      field: (row) => row.slot_deal?.deal?.deal_id,
      align: "left",
      sortable: true,
    },
    // {
    //   name: "order_id",
    //   label: "DEAL ID",
    //   required: true,
    //   field: (row) => row.order?.order_id,
    //   align: "left",
    //   sortable: true,
    // },
    {
      name: "carrier_id",
      label: "Fright details",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    {
      name: "tracking_id",
      label: "tracking id",
      required: true,
      field: (row) => row.tracking_id,
      align: "left",
      sortable: true,
    },
    {
      name: "customer_id",
      label: "customer id",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    {
      name: "status",
      label: "status",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "created_at",
      label: "created_at",
      required: true,
      field: (row) =>  date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
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
      const response = await api.post("/shipping?lang_id=1", data);
      return response
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
      await api.patch(`/shipping/${id}?lang_id=1`, data);
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
      await api.delete(`/shipping/${id}?lang_id=1`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/shipping/${id}?lang_id=1`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getShipingByBookingID = async (booking_id) => {
    try {
      const response = await api.get(`/shipping-booking/${booking_id}?lang_id=1`);
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
      const response = await api.get("/shipping/paginate?lang_id=1", { params });
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
      const response = await api.get("/shipping/all?lang_id=1");
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
    getShipingByBookingID
  };
}
