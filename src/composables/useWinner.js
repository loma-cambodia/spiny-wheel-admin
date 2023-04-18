import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";
import moment from "moment";

export default function useWinner() {
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
      name: "deal_id",
      label: "DEAL ID",
      required: true,
      field: (row) => row.deal_random_id,
      align: "center",
      sortable: true,
    },
    {
      name: "booking_id",
      label: "WINNER SLOT ID",
      required: true,
      field: (row) => row?.booking_id,
      align: "center",
      sortable: true,
    },
    {
      name: "customer_id",
      label: "MEMBER ID",
      required: true,
      field: (row) => row?.member_id,
      align: "center",
      sortable: true,
    },
    {
      name: "member_count",
      label: "MEMBER COUNT",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: false,
    },
    {
      name: "bot_count",
      label: "BOT COUNT",
      required: true,
      field: (row) => row?.bot_count,
      align: "center",
      sortable: false,
    },
    {
      name: "total",
      label: "TOTAL COUNT",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: false,
    },
    {
      name: "revenue",
      label: "REVENUE",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: false,
    },
    {
      name: "settlement_date",
      label: "settlement date",
      required: true,
      field:  (row) => moment(row?.created_at).format("YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: false,
    },
    {
      name: "shipping_status",
      label: "SHIPPING STATUS",
      required: true,
      field: (row) => row?.shipping_status,
      align: "center",
      sortable: false,
    },

  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/tags?lang_id=1", data);
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
      await api.post(`/tags/${id}?lang_id=1`, data);
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
      await api.delete(`/tags/${id}?lang_id=1`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/tags/${id}?lang_id=1`);
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
      const response = await api.get("/winners/list", { params });
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
      const response = await api.get("/tags/all?lang_id=1");
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
