<template>
  <q-card
    id="cardScrolling"
    class="no_shawdow border"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '100%',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Update")) }}</span>
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
          <div class="col-12 col-md-12">
            <q-tabs
              v-model="tab2"
              dense
              class="text-grey"
              active-color="white"
              indicator-color="primary"
              align="left"
            >
              <q-tab
                v-for="lang in languages"
                :key="lang.locale"
                :name="lang.locale"
                :label="$t(lang.locale)"
              ></q-tab>
            </q-tabs>
            <!-- tabs content -->
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

          <div class="col-12 col-md-2 q-pr-md q-mb-md">
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

          <!-- <div class="col-6 col-md-6 q-pr-md">
            <q-input
              v-model="time.rotation_speed"
              :label="$t(Utils.getKey('rotation speed'))"
              dense
              :oninput="evt => Utils.numberValidation(evt, 3)"
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
              type="number"
              outlined
            />
          </div>
          <div class="col-6 col-md-6 q-pr-md">
            <q-input
              v-model="time.rotation_time"
              :label="$t(Utils.getKey('rotation time'))"
              :oninput="evt => Utils.numberValidation(evt, 3)"
              dense
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
              type="number"
              outlined
            />
          </div> -->
          <!-- setting -->
          <div class="col-12 col-md-12 q-pr-md">
            <p class="text-h6">{{ $t("attribute_setting") }}</p>
            <q-separator class="q-mb-md" />
            <q-table
              :columns="columns"
              bordered
              hide-pagination
              flat
              :rows-per-page-options="[500]"
              :rows="rows"
              row-key="name"
              :rows-per-page-label="$t(Utils.getKey('Records per page'))"
            >
              <template v-slot:body-cell-actions="props">
                <q-td class="text-center">
                  <!-- <q-btn
                    class="q-mr-sm"
                    size="xs"
                    rounded
                    padding="5px"
                    color="primary"
                    icon="fas fa-pen"
                    @click="onEditClick(props.row)"
                  >
                    <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
                  </q-btn> -->
                  <q-btn
                    class="q-mr-sm"
                    size="xs"
                    rounded
                    padding="5px"
                    color="red"
                    icon="fas fa-trash"
                    @click="onRemove(props.row)"
                  >
                    <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
                  </q-btn>
                </q-td>
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
              <template v-slot:body-cell-parameters="props">
                <q-td style="vertical-align: top">
                  <q-input
                    class="q-pt-sm"
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
                </q-td>
              </template>
              <template v-slot:body-cell-type="props">
                <q-td style="vertical-align: top">
                  <div>
                    <div class="d-flex">
                      <q-select
                        v-model="props.row.type"
                        dense
                        class="q-pt-sm flex-1"
                        outlined
                        :rules="[
                          (val) =>
                            !!val || $t(Utils.getKey('field is required')),
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
                          props.row.type == 'array' ||
                          props.row.type == 'object'
                        "
                        style="height: 40px"
                        class="q-mt-sm"
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
                      <table style="width: 100%">
                        <thead>
                          <tr>
                            <th class="text-left text-bold bt">
                              {{ $t("parameters") }}
                            </th>
                            <th class="text-left text-bold">
                              {{ $t("type") }}
                            </th>
                          </tr>
                        </thead>
                        <tr v-for="ch in props.row.value" :key="ch.id">
                          <td>
                            {{ ch.parameters }}
                          </td>
                          <td>
                            {{ ch.type }}
                            <div
                              v-if="
                                ch.type == 'object' ||
                                ch.type == 'array'
                              "
                            >
                              <table style="width: 100%">
                                <thead>
                                  <tr>
                                    <th class="text-left text-bold bt">
                                      {{ $t("parameters") }}
                                    </th>
                                    <th class="text-left text-bold">
                                      {{ $t("type") }}
                                    </th>
                                  </tr>
                                </thead>
                                <tr v-for="subC in ch.value" :key="subC.id">
                                  <td>
                                    {{ subC.parameters }}
                                  </td>
                                  <td>
                                    {{ subC.type }}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </q-td>
              </template>
            </q-table>
            <q-btn
              size="sm"
              icon="mdi-plus"
              color="primary"
              class="q-mt-sm"
              @click="onAddRow"
            >
            </q-btn>
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

    <q-dialog v-model="dialog">
      <Property
        :data="pAttritures"
        @onClose="dialog = false"
        @add="onParamsAdd"
      />
    </q-dialog>

    <Loading :loading="isLoading" />
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { useQuasar } from "quasar";
import useGame from "../../composables/useGame";
import useLanguage from "src/composables/useLanguage";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";
import Auth from "src/store/auth";
import Property from "./Property";

const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object });
console.log(props.data?.setting?.setting, "setting");
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const { saving, update } = useGame();
const { all } = useLanguage();
const game = ref({ ...props.data });
const translation_name = ref({});
const isLoading = ref(false);
const dialog = ref(false);
const locale = inject("locale");
const tab2 = ref(locale.value);
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
const rows = ref(props.data?.setting?.setting);
const time = ref(
  props.data?.setting?.setting?.setting || {
    rotation_speed: "",
    rotation_time: "",
  }
);
const incNum = ref(0);
const onAddRow = () => {
  incNum.value += 1;
  rows.value.push({
    id: incNum.value,
    parameters: "",
    type: "",
  });
};
const languages = ref([]);

const onRemove = (val) => {
  rows.value = rows.value.filter((row) => row.id != val.id);
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
  languages.value.forEach((item) => {
    translation_name.value[item.id] = props.data.translates[item.locale]?.name;
  });
}
async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
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
    await update(game.value.id, { ...game.value, translation_name: lang_data });
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    isLoading.value = false;
    emit("onUpdated");
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
