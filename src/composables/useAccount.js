import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useAccount() {
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
      name: "transaction_ID",
      label: "Transaction Id",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "member_id",
      label: "Member Id",
      required: true,
      field: (row) => row?.customer?.member_ID,
      align: "center",
      sortable: true,
    },
    {
      name: "transaction_type",
      label: "transaction type",
      required: true,
      field: (row) => row?.transaction_type,
      align: "center",
      sortable: true,
    },
    {
      name: "amount",
      label: "Amount",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "message",
      label: "Message",
      required: true,
      field: (row) => row?.message,
      align: "center",
      sortable: false,
    },

    {
      name: "status",
      label: "Status",
      required: true,
      field: (row) => row?.status,
      align: "center",
      sortable: false,
    },

    /*
    {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "center",
    }, */
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/transactions", data);
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
      await api.patch(`/transactions/${id}`, data);
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
      await api.delete(`/transactions/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
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
      const response = await api.get("/transactions/paginate", { params });
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
      const response = await api.get("/transactions/all");
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
