<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : ''">
    <div v-if="!showResponse">
      <q-card
        class="mt-3"
        v-if="!showAdd && !showEdit"
        style="margin-left: 0px; box-shadow: none; min-height: 100vh"
      >
        <q-card-section>
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
                v-model="filters.search"
                :placeholder="$t(Utils.getKey('Search'))"
                style="width: 300px"
              />
              <q-select
                v-model="filters.language_id"
                :options="languages"
                class="q-mx-sm"
                style="width: 300px; margin-top: 20px"
                :label="$t(Utils.getKey('Language'))"
                dense
                emit-value
                map-options
                option-label="name"
                option-value="id"
                outlined
                lazy-rules
                :rules="[
                  (val) => !!val || $t(Utils.getKey('field is required')),
                ]"
              >
              </q-select>
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

              <add-button
                v-if="Utils.hasPermissions(['Game Platform Setting: Create'])"
                :disable="loading"
                @click="showAdd = true"
                tooltip-text="Add"
                color="primary"
              />
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
            <template v-slot:body-cell-name="props">
              <q-td class="text-center">
                {{ props.row?.game?.translates[locale]?.name }}
              </q-td>
            </template>
            <template v-slot:body-cell-language="props">
              <q-td class="text-center">
                {{ props.row?.language?.name }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td class="text-center">
                <q-chip
                  size="sm"
                  :label="
                    props.row.status == 'active' ? $t('active') : $t('inactive')
                  "
                  :color="getStatusColor(props)"
                  :class="'text-white'"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td class="text-center">
                <q-btn
                  class="q-mr-sm"
                  size="xs"
                  v-if="
                    Utils.hasPermissions(['Game Platform Setting: Edit/Update'])
                  "
                  rounded
                  padding="5px"
                  color="primary"
                  icon="mdi-content-copy"
                  @click="onShowCopy(props.row)"
                >
                  <q-tooltip>{{ $t(Utils.getKey("copy")) }}</q-tooltip>
                </q-btn>
                <q-btn
                  class="q-mr-sm"
                  size="xs"
                  rounded
                  padding="5px"
                  color="primary"
                  icon="mdi-code-json"
                  @click="onShowRepsone(props.row)"
                >
                  <q-tooltip>{{ $t(Utils.getKey("respone")) }}</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="
                    Utils.hasPermissions(['Game Platform Setting: Edit/Update'])
                  "
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
                  v-if="Utils.hasPermissions(['Game Platform Setting: Delete'])"
                  class="q-mr-sm"
                  size="xs"
                  rounded
                  padding="5px"
                  color="negative"
                  icon="fas fa-trash"
                  @click="onDeleteClick(props.row)"
                >
                  <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <Loading :loading="loading" />
      </q-card>
    </div>

    <div v-if="showAdd" class="q-py-lg q-px-md">
      <add-game @onClose="showAdd = false" @onAdded="onRefresh" />
    </div>

    <div v-if="showEdit" class="q-py-lg q-px-md">
      <edit-game
        :data="selectedCategory"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </div>

    <!-- <q-dialog  v-model="showResponse" position="top" persistent :no-refocus="true"> -->
    <div v-if="showResponse">
      <json-view :data="selectResponse" @onClose="showResponse = false" />
    </div>

    <!-- </q-dialog> -->

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete it"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>

    <q-dialog v-model="showCopy" position="top" persistent>
      <copy-game
        :data="selectedCategory"
        @onClose="showCopy = false"
        @onAdded="onRefresh"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import useGameSetting from "../../composables/useGameSetting";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import { store } from "../../store/store";
import AddButton from "../../components/Buttons/AddButton.vue";
import EditGame from "../../components/Game/EditSetting.vue";
import AddGame from "../../components/Game/AddSetting.vue";
import CopyGame from "../../components/Game/Copy.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import useLanguage from "src/composables/useLanguage";
import JsonView from "./JsonView";

const { all } = useLanguage();
const locale = inject("locale");
const { loading, columns, items, trash, paginate } = useGameSetting();
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
const languages = ref([]);
const languageSelect = ref(1);
const selectedCategory = ref();
const filters = reactive({
  search: "",
  language_id: 1,
});
const selectResponse = ref({});
const showResponse = ref(false);
const jsonData = reactive(selectResponse);
const showCopy = ref(false);

getData();
async function getData() {
  try {
    const response = await all();
    languages.value = response.data;
  } catch (error) {}
}

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: filters,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCategory.value = row;
};
const onShowRepsone = (row) => {
  selectResponse.value = row;
  showResponse.value = true;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};

const onShowCopy = (row) => {
  showCopy.value = true;
  selectedCategory.value = row;
};

const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }
  return "negative";
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    if (key != "language_id") {
      filters[key] = "";
    }
  }
  range.value = null;
};
</script>
