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
      <span class="text-body2">{{ $t(Utils.getKey("new")) }}</span>
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
          <div class="col-12 col-md-6">
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

          <div class="col-12 col-md-6 q-pr-md q-mb-md">
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

            <q-card style="box-shadow: none">
              <div class="row" style="margin-left: -15px; margin-right: -15px">
                <q-form ref="refFormGroup" class="col-12">
                  <div class="row">
                    <div class="col-md-4 col-sm-12 col-12 padding-left-right">
                      <q-tabs
                        dense
                        v-model="tabLable"
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
                      <div v-for="lang in languages" :key="lang.locale">
                        <q-input
                          v-if="tabLable == lang.locale"
                          :rules="[
                            (val) =>
                              !!val || $t(Utils.getKey('field is required')),
                          ]"
                          lazy-rules
                          outlined
                          v-model="groupName[lang.locale]"
                          :label="$t('list_or_group')"
                          dense
                        />
                      </div>
                    </div>
                    <div
                      class="col-md-3 col-sm-12 col-12 padding-left-right q-mt-lg"
                    >
                      <q-input
                        class="q-mt-md"
                        outlined
                        style="margin-top: 20px"
                        v-model="parametersGroup"
                        :label="$t('parameters')"
                        dense
                      />
                    </div>
                    <div
                      class="col-md-2 col-sm-12 col-12 padding-left-right q-mt-lg"
                    >
                      <q-select
                        v-model="groupType"
                        dense
                        :label="$t('type')"
                        style="margin-top: 20px"
                        class="flex-1"
                        outlined
                        :rules="[
                          (val) =>
                            !!val || $t(Utils.getKey('field is required')),
                        ]"
                        :options="['group', 'list']"
                        maxlength="500"
                        lazy-rules
                      />
                    </div>
                    <div class="col-md-3 col-sm-12 col-12 padding-left-right">
                      <div class="q-gutter-md">
                        <div class="spacer-div-2"></div>
                        <!-- <q-btn outline color="primary" label="Add new group" /> -->
                        <q-btn
                          color="primary"
                          label="add group"
                          @click="onAddRow"
                        />
                      </div>
                    </div>
                  </div>
                </q-form>

                <div
                  v-for="row in rows"
                  :key="row.id"
                  class="col-12 padding-left-right"
                >
                  <div class="groups-fields">
                    <div class="heading-fields d-flex align-items-center">
                      <h6>{{ row.parameters }}</h6>
                      <q-btn
                        color="purple"
                        @click="onRemoveGroup(row)"
                        label="Delete"
                        class="ml-auto"
                      />
                    </div>

                    <div class="group-fields-body q-mb-sm">
                      <div
                        :class="
                          $q.dark.isActive
                            ? 'outer-list-display_dark'
                            : 'outer-list-display'
                        "
                        style="border-bottom: 0"
                      >
                        <div class="hash-space">#</div>
                        <div class="outer-lest-div">
                          <ul class="list-in-accordian">
                            <li>
                              <div class="list-boxt">
                                <div class="heading-label">
                                  <strong>{{ $t("label") }}</strong>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="list-boxt">
                                <div class="heading-label">
                                  <strong>{{ $t("name") }}</strong>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="list-boxt">
                                <div class="heading-label">
                                  <strong>{{ $t("type") }}</strong>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <q-list bordered class="bg-light-blue2">
                        <q-expansion-item
                          switch-toggle-side
                          v-for="child in row.value"
                          default-opened
                          :key="child.value"
                        >
                          <template v-slot:header>
                            <q-item-section>
                              <ul class="list-in-accordian">
                                <li>
                                  <div class="list-boxt">
                                    <div
                                      :class="
                                        $q.dark.isActive ? 'white' : 'dark'
                                      "
                                      class="name-of-label"
                                    >
                                      {{ child.label["en"] }}
                                    </div>
                                    <div class="heading-label">
                                      <!-- <a href="#">Edit</a> -->
                                      <a @click="onRemove(child)">Delete</a>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="list-boxt">
                                    <div
                                      :class="
                                        $q.dark.isActive ? 'white' : 'dark'
                                      "
                                      class="name-of-label"
                                    >
                                      {{ child.parameters }}
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="list-boxt">
                                    <div
                                      :class="
                                        $q.dark.isActive ? 'white' : 'dark'
                                      "
                                      class="name-of-label"
                                    >
                                      {{ child.type }}
                                    </div>
                                  </div>
                                </li>
                              </ul>
                              <q-separator />
                            </q-item-section>
                          </template>
                          <q-card>
                            <q-card-section>
                              <div class="row">
                                <div class="col-md-6">
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
                                        v-model="child.label[lang.locale]"
                                        label="Field Label"
                                        dense
                                      />
                                    </div>
                                  </div>
                                  <div class="form-group">
                                    <q-input
                                      outlined
                                      :oninput="
                                        (evt) =>
                                          Utils.onlyLettersAndDashEvent(evt)
                                      "
                                      :rules="[
                                        (val) =>
                                          !!val ||
                                          $t(Utils.getKey('field is required')),
                                      ]"
                                      v-model="child.parameters"
                                      :label="$t('parameters')"
                                      dense
                                    />
                                  </div>

                                  <div class="form-group">
                                    <q-select
                                      v-model="child.type"
                                      dense
                                      class="q-pt-sm flex-1"
                                      outlined
                                      :rules="[
                                        (val) =>
                                          !!val ||
                                          $t(Utils.getKey('field is required')),
                                      ]"
                                      :options="[
                                        'number',
                                        'text',
                                        'list',
                                        'color',
                                        'group'
                                      ]"
                                      maxlength="500"
                                      lazy-rules
                                    />
                                  </div>
                                  <div class="form-group">
                                    <!-- <q-btn
                                      label="Clear"
                                      outline
                                      color="primary"
                                      no-caps
                                      class="q-mr-sm"
                                    /> -->
                                    <q-btn
                                      v-if="
                                        child.type == 'group' ||
                                        child.type == 'list'
                                      "
                                      label="Add field"
                                      @click="onShowProperty(child)"
                                      color="primary"
                                      no-caps
                                      class="q-mr-sm"
                                    />
                                    <!-- <q-btn
                                      label="Save field"
                                      color="success"
                                      no-caps
                                    /> -->
                                  </div>
                                </div>
                                <div
                                  class="col-md-6 q-pl-md q-pt-lg"
                                  v-if="
                                    child.type == 'list' ||
                                    child.type == 'group'
                                  "
                                >
                                  <table
                                    style="width: 100%; margin-top: 20px"
                                    class="my_table"
                                  >
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
                                    <tr v-for="ch in child.value" :key="ch.id">
                                      <td>
                                        {{ ch.parameters }}
                                      </td>
                                      <td>
                                        {{ ch.type }}
                                        <div
                                          v-if="
                                            ch.type == 'group' ||
                                            ch.type == 'list'
                                          "
                                        >
                                          <table
                                            style="width: 100%"
                                            class="my_table"
                                          >
                                            <thead>
                                              <tr>
                                                <th
                                                  class="text-left text-bold bt"
                                                >
                                                  {{ $t("parameters") }}
                                                </th>
                                                <th class="text-left text-bold">
                                                  {{ $t("type") }}
                                                </th>
                                              </tr>
                                            </thead>
                                            <tr
                                              v-for="subC in ch.value"
                                              :key="subC.id"
                                            >
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
                            </q-card-section>
                          </q-card>
                        </q-expansion-item>
                      </q-list>

                      <div
                        :class="
                          $q.dark.isActive
                            ? 'outer-list-display_dark'
                            : 'outer-list-display'
                        "
                        style="
                          border-top: 0;
                          border-radius: 0 0 5px 5px;
                          text-align: right;
                        "
                      >
                        <q-btn
                          @click="addField(row)"
                          unelevated
                          color="primary"
                          label="Add Field"
                          class="ml-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>

            <!-- <q-table
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
                    color="primary"
                    icon="fas fa-pen"
                    @click="onEditClick(props.row)"
                  >
                    <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
                  </q-btn>
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
            </q-btn> -->
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
const emit = defineEmits(["onClose", "onAdded"]);
const $q = useQuasar();
const { saving, add } = useGame();
const { all } = useLanguage();
const game = ref({});
const translation_name = ref({});
const isLoading = ref(false);
const dialog = ref(false);
const locale = inject("locale");
const tab2 = ref(locale.value);
const tabLable = ref(locale.value);
const tabField = ref(locale.value);
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
const refFormGroup = ref(null);
const rows = ref([]);
const time = ref(
  props.data?.setting?.setting?.setting || {
    rotation_speed: "",
    rotation_time: "",
  }
);
const groupName = ref({});
const parametersGroup = ref("");
const groupType = ref("");
watch(
  () => groupName.value?.en,
  () => {
    parametersGroup.value = groupName?.value["en"]
      ?.toLocaleLowerCase()
      ?.replace(/ /g, "_");
  }
);
const onAddRow = async () => {
  let validation = await refFormGroup.value.validate();
  if (!validation) {
    return;
  }

  let stringId = Utils.randomString(16);

  let ro = {
    id: stringId,
    label: groupName.value,
    parameters: parametersGroup.value,
    type: groupType.value,
    value: groupType.value == "list" || groupType.value == "group" ? [] : "",
  };
  rows.value.push(ro);
  addField(ro);
  groupName.value = {};
  refFormGroup.value.reset();
};

const addField = (row) => {
  console.log("row");
  let field = {
    id: Utils.randomString(16),
    label: {
      en: "",
    },
    parameters: "",
    type: "text",
    value: [],
  };
  rows.value.map((r1) => {
    if (r1.id == row.id) {
      r1.value.push(field);
    }
  });
};

const languages = ref([]);

const onRemove = (val) => {
  rows.value.map((r1) => {
    if ((r1.id = val.id)) {
      r1.value = r1.value.filter((child) => child.id != val.id);
    }
  });
};

const onRemoveGroup = (val) => {
  console.log(rows.value, val);
  rows.value = rows.value.filter((row) => row.id != val.id);
};

const pAttritures = ref({});
const onShowProperty = (r) => {
  dialog.value = true;
  rows.value.map((rw) => {});
  pAttritures.value = r;

  console.log("rows", rows.value);
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
  console.log("row ==== row", rows.value);
};

getLanguages();
async function getLanguages() {
  languages.value = await (await all()).data;
  languages.value.forEach((item) => {
    // translation_name.value[item.id] = props.data.translates[item.locale]?.name;
  });
}
async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
    await add({ ...game.value, translation_name: lang_data });
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
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
