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
          <div class="col-12 q-pr-sm">
            <div class="row">
              <div
                v-for="lang in languages"
                :key="lang.locale"
                class="col-4 pr-3"
              >
                <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
                <q-separator />
                <div class="py-3 ml-2 mt-2">
                  <label class="pa-2 border">
                    <i class="fa fa-image"></i> {{ $t("choose_image") }}
                    <input
                      class="mt-2"
                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                      type="file"
                      id="file-input"
                      style="display: none"
                      @change="uploadChange"
                      max="10"
                      :name="lang?.locale"
                    />
                  </label>
                </div>
                <div
                  v-if="!images_url[lang.locale]"
                  class="box-2 img-result q-mr-sm"
                  style="max-height: 240px"
                >
                  <img
                    style="height: 230px; object-fit: cover; width: 100%"
                    :src="
                      game.images.filter((img) => img.purpose == lang.id)?.[0]
                        ?.path
                    "
                    alt=""
                  />
                </div>
                <div v-else>
                  <img
                    style="height: 230px; object-fit: cover; width: 100%"
                    class="cropped q-mr-sm"
                    :src="images_url[lang.locale]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6 q-pr-md q-mb-md">
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
                          :label="isUpdate ? 'update' : 'add'"
                          @click="onAddRow"
                        />
                      </div>
                    </div>
                  </div>
                </q-form>
                <!-- <div class="col-md-6 col-sm-12 col-12 padding-left-right">
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
                      outlined
                      v-if="tabLable == lang.locale"
                      v-model="groupName[lang.locale]"
                      label="Add new group"
                      dense
                    />
                  </div>
                </div>
                <div
                  class="col-md-3 col-sm-12 col-12 padding-left-right q-mt-lg"
                >
                  <div style="heigth: 12px"></div>
                  <q-input
                    class="q-mt-md"
                    style="margin-top: 20px;"
                    outlined
                    v-model="parametersGroup"
                    disable
                    :label="$t('parameters')"
                    dense
                  />
                </div>
                <div class="col-md-3 col-sm-12 col-12 padding-left-right">
                  <div class="q-gutter-md">
                    <div class="spacer-div-2"></div>
                    <q-btn
                      color="primary"
                      :label="isUpdate ? 'update' : 'add'"
                      @click="onAddRow"
                    />
                  </div>
                </div> -->

                <div
                  v-for="row in rows"
                  :key="row.id"
                  class="col-12 padding-left-right"
                >
                  <div class="groups-fields">
                    <div class="heading-fields d-flex align-items-center">
                      <h6 class="flex-1">{{ row.parameters }}</h6>
                      <div>
                        <q-btn
                          color="primary"
                          @click="onEditGroup(row)"
                          label="Edit"
                          class="ml-auto q-mx-sm"
                        />
                        <q-btn
                          color="purple"
                          @click="onRemoveGroup(row)"
                          label="Delete"
                          class="ml-auto"
                        />
                      </div>
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
                                      <a @click="onRemove(row, child)"
                                        >{{ $t("delete") }}
                                      </a>
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
                                  <div class="form-group q-mt-md">
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
                                      v-if="
                                        child.type != 'list' ||
                                        child.type != 'group'
                                      "
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
                                        'group',
                                        'date',
                                        'datetime-local',
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
        :isedit="false"
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
const { saving, update, updateImage } = useGame();
const { all } = useLanguage();
const game = ref({ ...props.data });
const translation_name = ref({});
const isLoading = ref(false);
const dialog = ref(false);
const locale = inject("locale");
const tab2 = ref(locale.value);
const tabLable = ref(locale.value);
const tabField = ref(locale.value);

const images = ref({});
const images_url = ref({});
const cropper = ref({});

const uploadChange = (e) => {
  let lang = e.target.name;
  if (e.target.files.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result) {
        images_url.value[lang] = e.target.result;
      }
    };
    images.value[lang] = e.target.files[0];

    reader.readAsDataURL(e.target.files[0]);
  }
};

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
const rows = ref(props.data?.setting?.setting || []);
const time = ref(
  props.data?.setting?.setting?.setting || {
    rotation_speed: "",
    rotation_time: "",
  }
);
const groupName = ref({});
const parametersGroup = ref("");
const groupType = ref("");
const refFormGroup = ref(null);
watch(
  () => groupName.value?.en,
  () => {
    parametersGroup.value = groupName?.value["en"]
      ?.toLocaleLowerCase()
      ?.replace(/ /g, "_");
  }
);
const isUpdate = ref("");
const onAddRow = () => {
  if (isUpdate.value) {
    rows.value.map((rw) => {
      if (rw.id == isUpdate.value) {
        rw.label = groupName.value;
        rw.parameters = parametersGroup.value;
      }
    });
    isUpdate.value = "";
    groupName.value = {};
  } else {
    let stringId = Utils.randomString(16);
    let ro = {
      id: stringId,
      label: groupName.value,
      parameters: parametersGroup.value,
      type: groupType.value,
      value: groupType.value == "list" || groupType.value == "group" ? [] : "",
    };
    rows.value.push(ro);
    // addField(ro);
    groupName.value = "";
  }
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
      if (row.type == "list" || row.type == "group") {
        r1.value.push(field);
      } else {
        r1.value = "";
      }
    }
  });
};

const languages = ref([]);

const onRemove = (row, val) => {
  rows.value.map((r1) => {
    if (r1.id == row.id) {
      r1.value = r1.value.filter((child) => child.id != val.id);
    }
    return r1;
  });
  console.log("rows", rows);
};

const onRemoveGroup = (val) => {
  console.log(rows.value, val);
  rows.value = rows.value.filter((row) => row.id != val.id);
};

const onEditGroup = (val) => {
  groupName.value = val.label;
  isUpdate.value = val.id;
};

const pAttritures = ref({});
const onShowProperty = (r) => {
  dialog.value = true;
  rows.value.map((rw) => {});
  pAttritures.value = r;

  // console.log("rows", rows.value);
};

const onParamsAdd = (emitValue) => {
  // console.log("row ==== row", rows.value);
  // console.log("emitValue", emitValue);
  // console.log("pAttritures", pAttritures.value);
  dialog.value = false;
  rows.value.map((rw) => {
    if (rw.type == "group" || rw.type == "list") {
      rw.value.map((child) => {
        if (child.id == pAttritures.value.id) {
          child.value = emitValue;
        }
        return child;
      });
    } else {
      if (rw.id == pAttritures.value.id) {
        rw.value = emitValue;
      }
    }
    return rw;
  });
  // console.log("return", rows.value);
};

getLanguages();
async function getLanguages() {
  isLoading.value = true;
  languages.value = await (await all()).data;
  languages.value.forEach((item) => {
    translation_name.value[item.id] = props.data.translates[item.locale]?.name;
  });
  isLoading.value = false;
}

const onUploadIamge = async (id) => {
  const FormData = require("form-data");
  const fomrData = new FormData();
  languages.value.forEach((lg, index) => {
    if (images.value[lg.locale]) {
      fomrData.append(`images[${lg.id}]`, images.value[lg.locale]);
    }
  });
  fomrData.append(`id`, id);
  if (Object.keys(images.value).length > 0) {
    await updateImage(fomrData);
  }
  isLoading.value = false;
};

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
    await onUploadIamge(game.value.id);
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
