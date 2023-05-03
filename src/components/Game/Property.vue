<template>
  <q-card
    id="cardScrolling"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '1200px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
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

    <q-card-section class="q-pt-lg pb-0" v-if="!showMedia">
      <q-form ref="refForm">
        <div class="row">
          <div class="col-12 col-md-12 q-pr-md">
            <p class="text-h6">
              {{ $t("attribute_setting_of") }} {{ props.data.parameters }}
            </p>
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
                  <q-btn
                    class="q-mr-sm"
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
                  <q-tabs
                    dense
                    v-model="tabField"
                    active-color="white"
                    indicator-color="primary"
                    align="left"
                    bordered
                    class="text-grey q-mb-sm"
                  >
                    <q-tab
                      v-for="lang in languages"
                      :key="lang.locale"
                      :name="lang.locale"
                      :label="$t(lang.locale)"
                    ></q-tab>
                  </q-tabs>
                  <div
                    class="form-group"
                    v-for="lang in languages"
                    :key="lang.locale"
                  >
                    <div v-if="tabField == lang.locale">
                      <q-input
                        outlined
                        v-model="props.row.label[lang.locale]"
                        label="Field Label"
                        dense
                      />
                    </div>
                  </div>
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
                  <div class="d-flex">
                    <q-select
                      style="margin-top: 36px"
                      v-model="props.row.type"
                      dense
                      class="q-pt-sm flex-1"
                      outlined
                      :rules="[
                        (val) => !!val || $t(Utils.getKey('field is required')),
                      ]"
                      :options="['number', 'text', 'color', 'group']"
                      maxlength="500"
                      lazy-rules
                    />
                  </div>
                  <div
                    v-if="
                      props.row.type == 'array' || props.row.type == 'group'
                    "
                  >
                    <table style="width: 100%">
                      <thead>
                        <tr>
                          <th class="text-left text-bold bt">
                            {{ $t("parameters") }}
                          </th>
                          <th class="text-left text-bold">{{ $t("type") }}</th>
                          <th class="text-left text-bold">
                            {{ $t("action") }}
                          </th>
                        </tr>
                      </thead>
                      <tr v-for="ch in props.row.value" :key="ch.id">
                        <td>
                          <div>
                            <q-tabs
                              dense
                              v-model="tabFieldChild"
                              active-color="white"
                              indicator-color="primary"
                              align="left"
                              bordered
                              class="text-grey q-mb-sm"
                            >
                              <q-tab
                                v-for="lang in languages"
                                :key="lang.locale"
                                :name="lang.locale"
                                :label="$t(lang.locale)"
                              ></q-tab>
                            </q-tabs>
                            <div
                              class="form-group"
                              v-for="lang in languages"
                              :key="lang.locale"
                            >
                              <div v-if="tabFieldChild == lang.locale">
                                <q-input
                                  outlined
                                  v-model="ch.label[lang.locale]"
                                  label="Field Label"
                                  dense
                                />
                              </div>
                            </div>
                          </div>
                          <q-input
                            class="q-pt-sm"
                            v-model="ch.parameters"
                            :label="$t(Utils.getKey('parameters'))"
                            dense
                            :oninput="
                              (evt) => Utils.onlyLettersAndDashEvent(evt)
                            "
                            :rules="[
                              (val) =>
                                !!val || $t(Utils.getKey('field is required')),
                            ]"
                            outlined
                            maxlength="500"
                            lazy-rules
                          />
                        </td>
                        <td>
                          <q-select
                            v-model="ch.type"
                            dense
                            class="q-pt-sm flex-1"
                            outlined
                            :rules="[
                              (val) =>
                                !!val || $t(Utils.getKey('field is required')),
                            ]"
                            :options="['number', 'text', 'color']"
                            maxlength="500"
                            lazy-rules
                          />
                        </td>
                        <td>
                          <q-btn
                            class="q-mr-sm"
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
                    <q-btn
                      style="height: 40px"
                      @click="onAddSubRow(props.row)"
                      class="q-mt-sm"
                      color="primary"
                    >
                      +
                    </q-btn>
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
        color="primary"
        class="q-px-md q-ml-md"
        @click="onSaveRow"
        :disable="saving"
        >{{ $t(Utils.getKey("save")) }}</q-btn
      >
    </q-card-section>
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
const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onAdded"]);
const $q = useQuasar();
const { saving, add } = useGame();
const { all } = useLanguage();
const locale = inject("locale");
const tabField = ref(locale.value);
const tabFieldChild = ref(locale.value);
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
console.log("props", props.data.value);
const rows = ref(props.data.value ? props.data.value : []);
const incNum = ref(0);
const onAddRow = () => {
  rows.value.push({
    id: Utils.randomString(16),
    label: {
      en: "",
    },
    parameters: "",
    type: "",
  });
};

const onSaveRow = async () => {
  let validation = await refForm.value.validate();
  if (!validation) {
    return;
  }
  emit("add", rows.value);
  console.log('on AddRow', rows.value	)
};

const subRows = ref([]);
const incNum2 = ref(0);

const onAddSubRow = (inRow) => {
  rows.value.map((rw) => {
    if (rw.id == inRow.id) {
      if (rw.value == undefined) {
        rw.value = [];
      }
      rw.value.push({
        id: Utils.randomString(16),
        parameters: "",
        label: {
          en: "",
        },
        type: "",
      });
    }
    return rw;
  });
};
const languages = ref([]);

const onRemove = (val) => {
  rows.value = rows.value.filter((row) => row.id != val.id);
};

const onRemoveSub = (val, parent) => {
  rows.value.map((rw) => {
    if (rw.id == parent.id) {
      rw.value = rw.value.filter((sub) => sub.id != val.id);
    }
    return rw;
  });
};

getLanguages();
async function getLanguages() {
  languages.value = await (await all()).data;
  rows.value.map((row) => {
    console.log("typeof row.label ",   )

    if (!row.label) {
      row.label = {};
    }
    if(row.label.length == 0) {
      row.label = {};
    }
    if (row.type == "group") {
      row.value.map((rw) => {
        if (!rw.label) {
          rw.label = {};
        }
        return rw;
      });
    }
    return row;
  });
  console.log("row", rows.value);
}
</script>
