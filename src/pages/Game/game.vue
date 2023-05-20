<template>
  <!-- Add new attribute design -->
  <q-card style="box-shadow: none; border:0; margin-top: 20px;">

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
          <!-- <div class="col-md-8 col-sm-12 col-12 padding-left-right">
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

          </div> -->
        </div>
      </q-card>



  <!-- <div class="row">
      <div class="col-md-12">
        <q-card
            id="cardScrolling"
            class="no_shawdow border rounded-0"
            square
            :style="{
              width: $q.platform.is.mobile ? '100%' : '100%',
              maxWidth: '100%',
            }"
          >
          <q-bar dark class="bg-white text-dark border">
            <span class="text-body2">{{ $t(Utils.getKey("New")) }}</span>
            <q-space />
            <q-btn
              dense
              flat
              icon="fas fa-times"
              @click="emit('onClose')"
              :disable="saving"
            >
              <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section class="q-pt-lg pb-0">
            <q-form ref="refForm">
              <div class="row">
                <div class="col-md-6">
                  <q-tabs
                    v-model="tab2"
                    dense
                    class="text-grey bordered-tab rounded-tabs bg-light"
                    active-color="white"
                    indicator-color="primary"
                    align="left"
                    bordered
                  >
                    <q-tab
                      v-for="lang in languages"
                      :key="lang.locale"
                      :name="lang.locale"
                      :label="$t(lang.locale)"
                    ></q-tab>
                  </q-tabs>

                  <div class="mt-1" v-for="lang in languages" :key="lang.locale">
                    <div v-show="tab2 == lang.locale">
                      <q-input
                        v-model="translation_name[lang.id]"
                        :label="$t(Utils.getKey('name'))"
                        dense
                        :rules="[
                          (val) => !!val || $t(Utils.getKey('field is required')),
                        ]"
                        autogrow
                        type="textarea"
                        outlined
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="spacer-div-1"></div>
                  <q-radio
                    v-model="game.status"
                    :val="'active'"
                    :label="$t('active')"
                  />
                  <q-radio
                    v-model="game.status"
                    :val="'inactive'"
                    :label="$t('inactive')"
                  />
                </div>
                <div class="col-12 col-md-12 q-pr-md">
                  <div class="border border-light p-3">
                    <div class="d-flex align-items-center mb-3">
                        <div class="heading-part"><p class="text-h6">{{ $t("attribute_setting") }}</p></div>
                        <div class="add-btn-part ml-auto">
                            <q-btn
                            size="sm"
                            icon="mdi-plus"
                            color="primary"
                            class="squaer-btn flat-btn"
                            @click="onAddRow"
                          >
                          </q-btn>
                        </div>
                      </div>


                      <q-table
                        :columns="columns"
                        bordered
                        hide-pagination
                        flat
                        :rows-per-page-options="[500]"
                        class="bg-transparent table"
                        :rows="rows"
                        :table-header-style="{ backgroundColor: '#fff', color:'#000' }"
                        row-key="name"
                        :rows-per-page-label="$t(Utils.getKey('Records per page'))"
                      >
                        <template v-slot:body-cell-actions="props">
                          <q-td class="text-center" style="vertical-align: top">
                          <q-btn
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
                              class="q-mr-sm q-mt-sm"
                              size="xs"
                              rounded
                              padding="5px"
                              color="red"
                              icon="fas fa-trash"
                              @click="onRemove(props.row)"
                            >
                            </q-btn>
                          </q-td>
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
                        <template v-slot:body-cell-parameters="props">
                          <q-td style="vertical-align: top">
                            <q-input
                              class="pb-0"
                              v-model="props.row.parameters"
                              :label="$t(Utils.getKey('parameters'))"
                              dense
                              :oninput="(evt) => Utils.onlyLettersAndDashEvent(evt)"
                              :rules="[
                                (val) => !!val || $t(Utils.getKey('field is required')),
                              ]"
                              outlined
                              maxlength="500"
                              lazy-rules
                            />
                            <div
                              v-if="
                                props.row.type == 'array' || props.row.type == 'object'
                              "
                            >
                              <table style="width: 100%" class="parameter-type">
                                <tr>
                                  <th class="text-left text-bold">
                                    {{ $t("parameters") }}
                                  </th>

                                </tr>
                                <tr v-for="ch in props.row.value" :key="ch.id">
                                  <td>
                                    {{ ch.parameters }}
                                  </td>

                                </tr>
                              </table>
                            </div>
                          </q-td>
                        </template>
                        <template v-slot:body-cell-type="props">
                          <q-td style="vertical-align: top">
                            <div class="d-flex">
                              <q-select
                                v-model="props.row.type"
                                dense
                                class="flex-1 pb-0"
                                outlined
                                :rules="[
                                  (val) => !!val || $t(Utils.getKey('field is required')),
                                ]"
                                :options="[
                                  'interger',
                                  'number',
                                  'string',
                                  'boolean',
                                  'object',
                                  'array',
                                  'color',
                                ]"
                                maxlength="500"
                                lazy-rules
                              />
                              <q-btn
                                @click="onShowProperty(props.row)"
                                v-if="
                                  props.row.type == 'array' || props.row.type == 'object'
                                "
                                style="height: 40px"
                                class="q-ml-sm"
                                color="primary"
                              >
                                +
                              </q-btn>
                            </div>
                            <div
                              v-if="
                                props.row.type == 'array' || props.row.type == 'object'
                              "
                            >
                              <table style="width: 100%"  class="parameter-type">
                                <tr>

                                  <th colspan="2" class="text-left text-bold">{{ $t("type") }}</th>

                                </tr>
                                <tr v-for="ch in props.row.value" :key="ch.id">

                                  <td>
                                    {{ ch.type }}

                                  </td>
                                  <td>
                                    <q-btn
                                      class="q-mr-sm q-mt-sm"
                                      size="xs"
                                      rounded
                                      padding="5px"
                                      color="red"
                                      icon="fas fa-trash"
                                      @click="onRemoveSub(ch, props.row)"
                                    >
                                    </q-btn>
                                  </td>
                                </tr>
                              </table>
                            </div>

                          </q-td>
                        </template>
                      </q-table>

                  </div>

                </div>
              </div>
            </q-form>
          </q-card-section>

          <q-card-section class="text-right q-mt-md">
            <q-btn
              flat
              color="negative"
              class="q-px-md"
              @click="emit('onClose')"
              :disable="saving"
              >{{ $t(Utils.getKey("Cancel")) }}</q-btn
            >
            <q-btn
              color="accent"
              class="q-px-md q-ml-md"
              @click="onSubmit"
              style="color: var(--q-primary) !important"
              :disable="saving"
              >{{ $t(Utils.getKey("Save")) }}</q-btn
            >
          </q-card-section>
          <Loading :loading="isLoading" />

          <q-dialog v-model="dialog">
            <Property
              :data="pAttritures"
              @onClose="dialog = false"
              @add="onParamsAdd"
            />
          </q-dialog>
        </q-card>
      </div>
    </div>  -->

  </template>

  <script setup>
  import { onMounted, ref, watch } from "vue";
  import { useQuasar } from "quasar";
  import useGame from "../../composables/useGame";
  import useLanguage from "src/composables/useLanguage";
  import { useI18n } from "vue-i18n";
  import Loading from "src/components/Shared/Loading.vue";
  import Utils from "../../helpers/Utils";
  import Auth from "src/store/auth";
  import Property from "src/components/Game/Property";

  const form = ref(null);
  const { t } = useI18n();
  const props = defineProps({ data: Object });
  const emit = defineEmits(["onClose", "onAdded"]);
  const $q = useQuasar();
  const { saving, add } = useGame();
  const { all } = useLanguage();
  const tab2 = ref("en");
  const dialog = ref(false);
  const game = ref({
    name: "",
    type: "",
    user_id: Auth.state?.user?.id,
    setting: {},
    status: "active",
  });
  const translation_name = ref({});
  const time = ref({});
  const isLoading = ref(false);
  const columns = [
    {
      name: "parameters",
      field: (row) => row,
      align: "left",
      label: "parameters",
    },
    { name: "type", field: (row) => row, align: "left", label: "type" },

    { name: "actions", field: (row) => row, label: " Action", align: "center" },
  ];
  const refForm = ref(null);
  const rows = ref([]);
  const incNum = ref(0);
  const onAddRow = () => {
    incNum.value += 1;
    rows.value.push({
      id: incNum.value,
      parameters: "",
      type: "",
      value: "",
    });
  };
  const languages = ref([]);

  const onRemove = (val) => {
    rows.value = rows.value.filter((row) => row.id != val.id);
  };

  const onRemoveSub = (val, parent) => {
    rows.value.map((rw) => {
      if (rw.id == parent.id && rw.parameters == parent.parameters) {
        rw.value = rw.value.filter(
          (sub) => sub.id != val.id &&  sub.parameters != val.parameters
        );
      }
      return rw;
    });
  };

  const pAttritures = ref({});
  const onShowProperty = (r) => {
    dialog.value = true;
    rows.value.map((rw) => {});
    pAttritures.value = r;
  };

  const onParamsAdd = (emitValue) => {
    dialog.value = false;
    rows.value.map((rw) => {
      if (
        rw.id == pAttritures.value.id &&
        rw.parameters == pAttritures.value.parameters
      ) {
        rw.value = emitValue;
      }
      return rw;
    });
    console.log("e event", rows);
  };

  getLanguages();
  async function getLanguages() {
    languages.value = await (await all()).data;
    languages.value.forEach((lg) => {
      translation_name.value[lg.id] = "";
    });
  }

  async function onSubmit() {
    try {
      let validation = await refForm.value.validate();
      if (!validation) {
        for (const keyLng in translation_name.value) {
          if (translation_name.value[keyLng] == "") {
            let gLocal = languages.value.filter((l) => l.id == keyLng);
            let lolc = gLocal.length > 0 ? gLocal[0].locale : "en";
            tab2.value = lolc;
            return;
          }
        }
        return;
      }
      let lang_data = [];
      for (const key in translation_name.value) {
        lang_data.push({
          language_id: key,
          field_name: "name",
          translation: translation_name.value[key],
        });
      }
      game.value.setting = rows.value;
      for (var i = 0; i < rows.value.length; i++) {
        if (rows.value[i].type == "object" || rows.value[i].type == "array") {
          if (rows.value[i].value == "") {
            $q.notify({
              position: "top-right",
              type: "negative",
              icon: "fas fa-exclamation-triangle",
              message: t(
                Utils.getKey("attribute is required for object or array")
              ),
            });
            return;
          }
        }
      }
      await add({ ...game.value, translation_name: lang_data });
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("created successfully")),
      });
      isLoading.value = false;
      emit("onAdded");
      emit("onClose");
    } catch (err) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey(err.message.toString())),
      });
    }
  }
  onMounted(async () => {});
  </script>
