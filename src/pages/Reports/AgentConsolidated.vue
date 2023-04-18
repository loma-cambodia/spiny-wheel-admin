<template>
  <q-page>

    <q-card style="margin-left:0px; box-shadow: none; min-height:85vh;">
      <q-card-section v-if="!showMlmTreeView">
        <q-table
          flat
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="columns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.member_ID"
              :placeholder="$t(Utils.getKey('Search member id'))"
              style="width: 300px"
            />
            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            />
            <q-space />
          </template>

          <!-- header column -->
          <template v-slot:header-cell="props">
            <q-th :props="props">
              {{
                props.col.label === "#"
                  ? props.col.label
                  : $t(Utils.getKey(props.col.label))
              }}
            </q-th>
          </template>
          <!-- no data -->
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-phone_number="props">
            <q-td class="text-left">
              {{ props.row.idd }}-{{ props.row.phone_number }}
            </q-td>
          </template>
          <template v-slot:body-cell-member_ID="props">
            <q-td class="text-left">
              {{ props.row.member_ID }}
            </q-td>
          </template>

          <template v-slot:body-cell-first_name="props">
            <q-td class="text-left">
              {{ props.row.first_name }} {{ props.row.last_name }}
            </q-td>
          </template>

          <template v-slot:body-cell-display_name="props">
            <q-td class="text-left">
              {{ props.row.display_name }}
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td class="text-left">
              {{ props.row.email }}
            </q-td>
          </template>

          <template v-slot:body-cell-referral_code="props">
            <q-td class="text-left">
              {{ props.row.referral_code }}
            </q-td>
          </template>

          <template v-slot:body-cell-parent_referral_code="props">
            <q-td class="text-left">
              {{ props.row.parent_referral_code }}
            </q-td>
          </template>

            <template v-slot:body-cell-amount="props">
            <q-td class="text-left">
              {{ props.row.amount?props.row.amount.toFixed(2):'0.00' }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['Members: Edit/Update Members'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fas fa-pen"
                @click="onEditClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>

              <q-btn
                v-if="Utils.hasPermissions(['User: Edit/Update User'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="mdi-filter-remove-outline"
                @click="onResetClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Reset Password")) }}</q-tooltip>
              </q-btn>

              <q-btn
                v-if="Utils.hasPermissions(['Members: Edit/Update Members'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fa fa-expand"
                @click="onShowMlmTreeClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("view mlm tree")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section v-else>
          <show-mlm-tree @onClose="showMlmTreeView = false" :data="selectedShowMlmTree" @onBack="onRefresh" />
      </q-card-section>
      <Loading :loading="saving" />
    </q-card>

    <q-dialog v-model="resetPassword" persistent>
      <reset
        :data="selectedMembers"
        @onClose="resetPassword = false"
        @onUpdated="resetPassword = false"
      />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-member
      :data="selectedMembers"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this Member?"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
    <!-- <q-dialog v-model="showMlmTreeView" position="top" persistent>

    </q-dialog> -->
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import useTable from "../../composables/useTable";
import useMember from "../../composables/useMember";
import Utils from "../../helpers/Utils";

import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import AddMember from "../../components/Members/Add.vue";
import EditMember from "../../components/Members/Edit.vue";
import showMlmTree from "../../components/Members/ShowMlmTree.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import Reset from "../../components/Members/Reset.vue";
import Loading from "src/components/Shared/Loading.vue";

const { loading, columns, items, trash, paginate } = useMember();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onDelete,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

const showMlmTreeView = ref(false);
const selectedMembers = ref();
const selectedShowMlmTree = ref();
const showAddLanguage = ref(false);
const resetPassword = ref(false);
const filters = reactive({
  name: "",
});

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "id",
    },
    filter: undefined,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedMembers.value = row;
};

const onShowMlmTreeClick = (row) => {
  showMlmTreeView.value = true;
  selectedShowMlmTree.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};
const onResetClick = async (row) => {
  resetPassword.value = true;
  selectedMembers.value = row;
};
const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
