<template>

  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : ''">
  <!-- Add new game new layout -->
    <!-- <q-card style="box-shadow: none; border:0; margin-top: 20px;"> 
      
      <div class="row">
        <div class="col-md-4 col-sm-12 col-12 padding-left-right">
          <div class="add-game-form">
            <div class="heading-for-form"><h6>Add new game</h6></div>
            <div class="form-group">
              <q-input v-model="text" label="Game name (English)" stack-label :dense="dense" />
            </div>
            <div class="form-group">
              <q-input v-model="text" label="Game name (Chinese)" stack-label :dense="dense" />
            </div>
            <div class="form-group">
              <q-input v-model="text" label="Game name (Khmer)" stack-label :dense="dense" />
            </div>
            <div class="form-group">
              <q-input v-model="text" label="Game name (Vietnamies)" stack-label :dense="dense" />
            </div>
            <div class="form-group">
                <div class="q-gutter-sm">
                  <q-radio v-model="status" val="active" label="Active" />
                  <q-radio v-model="status" val="inactive" label="Inactive" />
                </div>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <q-btn class="q-mr-sm" color="white" text-color="black" label="Cancel" style="width:100%;" />
                </div>
                <div class="col-md-6">
                  <q-btn class="q-ml-sm" color="primary" label="Add new game" style="width:100%;" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8 col-sm-12 col-12 padding-left-right">
          <q-card style="box-shadow: none; border:0;">
            <q-card-section style="padding:0;">
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
                    v-if="Utils.hasPermissions(['Game: Create'])"
                    :disable="loading"
                    @click="showAdd = true"
                    tooltip-text="Add"
                    color="primary"
                  />
                </template>

                <template v-slot:header-cell="props">
                  <q-th :props="props">
                    {{
                      props.col.label === "#"
                        ? props.col.label
                        : $t(Utils.getKey(props.col.label))
                    }}
                  </q-th>
                </template>
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
                    {{ props.row?.translates[locale].name }}
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
                      v-if="Utils.hasPermissions(['Game: Edit/Update'])"
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
                      v-if="
                        Utils.hasPermissions([
                          'CustomerServiceSetting: Create CustomerServiceSetting',
                        ])
                      "
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
      </div>
    </q-card> -->
    
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

            <!-- <add-button
              v-if="Utils.hasPermissions(['Game: Create'])"
              :disable="loading"
              @click="showAdd = true"
              tooltip-text="Add"
              color="primary"
            /> -->
          </template>

          <template v-slot:header-cell="props">
            <q-th :props="props">
              {{
                props.col.label === "#"
                  ? props.col.label
                  : $t(Utils.getKey(props.col.label))
              }}
            </q-th>
          </template>
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
              {{ props.row?.translates[locale].name }}
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
                v-if="Utils.hasPermissions(['Game: Edit/Update'])"
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
                v-if="
                  Utils.hasPermissions([
                    'CustomerServiceSetting: Create CustomerServiceSetting',
                  ])
                "
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


  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import useGame from "../../composables/useGame";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import { store } from "../../store/store";
import AddButton from "../../components/Buttons/AddButton.vue";
import EditGame from "../../components/Game/Edit.vue";
import AddGame from "../../components/Game/Add.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import useLanguage from "src/composables/useLanguage";

const { all } = useLanguage();
const locale = inject("locale");
const { loading, columns, items, trash, paginate } = useGame();
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
const selectedCategory = ref();
const filters = reactive({
  search: "",
});

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
    filter: undefined,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCategory.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};

const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }
  return "negative";
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
