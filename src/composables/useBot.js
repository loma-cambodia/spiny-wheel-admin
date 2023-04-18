import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useBot() {
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
      name: "member_ID",
      label: "MEMBER ID",
      required: true,
      field: (row) => row?.member_ID,
      align: "left",
      sortable: true,
    },
    {
      name: "phone_number",
      label: "PHONE NUMBER",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    {
      name: "first_name",
      label: "NAME",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    // {
    //   name: "display_name",
    //   label: "DISPLAY NAME",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },
    {
      name: "email",
      label: "EMAIL",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    {
      name: "referral_code",
      label: " REFERRAL CODE",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: true,
    },
    {
      name: "parent_referral_code",
      label: "PARENT REFERRAL CODE",
      required: true,
      field: (row) => row,
      align: "left",
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


  const update = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/members/${id}`, data);
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
      await api.delete(`/members/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/members/${id}`);
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
      const response = await api.get("/bots/paginate", { params });
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
      const response = await api.get("/bots/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const updatePassword = async (id, data) => {
    try {
      state.saving = true;
      return await api.post(`/customers/set-new-password/${id}`, data);
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
    update,
    trash,
    get,
    paginate,
    all,
    updatePassword,
  };
}
