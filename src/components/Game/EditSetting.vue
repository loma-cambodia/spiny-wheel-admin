<template>
  <q-card
    id="cardScrolling"
    class="myTb color_setting no_shadow"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '100%',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit")) }}</span>
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
          <div class="col-6">
            <q-select
              v-model="gameSelect"
              :options="games"
              :option-label="(item) => item?.translates?.[locale].name"
              option-value="id"
              :label="$t(Utils.getKey('Select Game'))"
              dense
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
              type="number"
              outlined
            />
          </div>
          <div class="col-12 col-md-2 q-pr-md q-pt-sm">
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
          <!-- setting -->
          <div
            class="col-12 col-md-12 q-pr-md"
            v-for="(setting, index) in platformSetting"
            :key="index"
          >
            <!-- for array -->
            <!-- <div v-if="setting.type == 'list'">
              <p class="font_18">
                {{ setting.parameters }}
                <q-checkbox v-model="setting.status" />
                {{ $t("type") }}: <span class="red"> {{ setting.type }} </span>
              </p>
              <table class="my_table">
                <thead>
                  <tr>
                    <th v-for="h in setting.value" :key="h.parameters">
                      {{ h.parameters }}
                    </th>
                    <th>
                      {{ $t("action") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in setting.setting_value"
                    :key="index"
                  >
                    <td v-for="h in setting.value" :key="h.parameters">
                      {{ h.type }}

                      <div v-if="h.type == 'group'">
                        <div v-for="child in h.value" :key="child.parameters">
                          <q-input
                            class="q-pt-sm"
                            v-model="
                              setting.setting_value[index][h.parameters][
                                child.parameters
                              ]
                            "
                            :label="$t(Utils.getKey(child.parameters))"
                            dense
                            outlined
                            :rules="[
                              (val) =>
                                !!val || $t(Utils.getKey('field is required')),
                            ]"
                            :type="child.type"
                            maxlength="500"
                            lazy-rules
                          />
                        </div>
                      </div>
                      <div v-else>
                        <q-input
                          class="q-pt-sm"
                          v-model="setting.setting_value[index][h.parameters]"
                          :label="$t(Utils.getKey(h.parameters))"
                          dense
                          outlined
                          :rules="[
                            (val) =>
                              !!val || $t(Utils.getKey('field is required')),
                          ]"
                          :type="h.type"
                          maxlength="500"
                          lazy-rules
                        />
                      </div>
                    </td>
                    <td class="text-center">
                      <q-btn
                        class="q-mr-sm"
                        size="xs"
                        rounded
                        padding="5px"
                        color="red"
                        icon="fas fa-trash"
                        @click="onRemoveRow(row, setting)"
                      >
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
              <q-btn
                size="sm"
                icon="mdi-plus"
                color="primary"
                class="q-mt-sm"
                @click="onAddRow(setting)"
              >
              </q-btn>
            </div> -->
            <!-- for object mapping -->
            <div v-if="setting.type == 'group' || setting.type == 'list'">
              <q-separator class="q-my-md" />
              <p class="font_18">
                <!-- {{ $t("parameter") }}: -->
                {{ setting.label[locale] }}
                <q-checkbox v-model="setting.status" />
                <!-- {{ $t("type") }}: <span class="red"> {{ setting.type }} </span> -->
              </p>
              <div v-for="groupValue in setting.value" :key="groupValue.id">
                <div v-if="groupValue.type == 'group'">
                  <table class="my_table">
                    <thead>
                      <tr>
                        <th v-for="h in groupValue.value" :key="h.parameters">
                          {{ h.parameters }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td v-for="h in groupValue.value" :key="h.parameters">
                          <q-input
                            class="q-pt-sm"
                            v-model="h.value"
                            :label="$t(Utils.getKey(h.parameters))"
                            dense
                            outlined
                            :rules="[
                              (val) =>
                                !!val || $t(Utils.getKey('field is required')),
                            ]"
                            :type="h.type"
                            maxlength="500"
                            lazy-rules
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else-if="groupValue.type == 'list'">
                  <p class="font_18">
                    <!-- <q-checkbox v-model="groupValue.status" /> -->
                    <!-- {{ $t("type") }}: -->
                    <!-- <span class="red"> {{ groupValue.type }} </span> -->
                  </p>
                  <table class="my_table">
                    <thead>
                      <tr>
                        <th v-for="h in groupValue.value" :key="h.parameters">
                          {{ h.parameters }}
                        </th>
                        <th>
                          {{ $t("action") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(row, index) in groupValue.setting_value"
                        :key="index"
                      >
                        <td v-for="hc in groupValue.value" :key="hc.parameters">
                          <div v-if="hc.type == 'group'">
                            <div
                              v-for="child in hc.value"
                              :key="child.parameters"
                            >
                              <q-input
                                class="q-pt-sm"
                                v-model="
                                  groupValue.setting_value[index][
                                    hc.parameters
                                  ][child.parameters]
                                "
                                :label="$t(Utils.getKey(child.parameters))"
                                dense
                                outlined
                                :rules="[
                                  (val) =>
                                    !!val ||
                                    $t(Utils.getKey('field is required')),
                                ]"
                                :type="child.type"
                                maxlength="500"
                                lazy-rules
                              />
                            </div>
                          </div>
                          <div v-else>
                            <q-input
                              class="q-pt-sm"
                              v-model="
                                groupValue.setting_value[index][hc.parameters]
                              "
                              :label="$t(Utils.getKey(hc.parameters))"
                              dense
                              outlined
                              :rules="[
                                (val) =>
                                  !!val ||
                                  $t(Utils.getKey('field is required')),
                              ]"
                              :type="hc.type"
                              maxlength="500"
                              lazy-rules
                            />
                          </div>
                        </td>
                        <td class="text-center">
                          <q-btn
                            class="q-mr-sm"
                            size="xs"
                            rounded
                            padding="5px"
                            color="red"
                            icon="fas fa-trash"
                            @click="onRemoveRowChild(row, groupValue, setting)"
                          >
                          </q-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <q-btn
                    size="sm"
                    icon="mdi-plus"
                    color="primary"
                    class="q-my-md"
                    @click="onAddRowListinGroup(groupValue, setting)"
                  >
                  </q-btn>
                </div>
                <div v-else>
                  <q-input
                    class="q-pt-sm"
                    v-model="groupValue.value"
                    :label="$t(Utils.getKey(groupValue.parameters))"
                    dense
                    outlined
                    :rules="[
                      (val) => !!val || $t(Utils.getKey('field is required')),
                    ]"
                    :type="groupValue.type"
                    maxlength="500"
                    lazy-rules
                  />
                </div>
              </div>
            </div>
            <div v-else>
              <q-separator class="q-my-md" />
              <p class="font_18">
                {{ $t("parameter") }}:
                {{ setting.parameters }}
                <q-checkbox v-model="setting.status" />
                {{ $t("type") }}: <span class="red"> {{ setting.type }} </span>
              </p>
              <q-input
                class="q-pt-sm"
                v-model="setting.value"
                :label="$t(Utils.getKey(setting.parameters))"
                dense
                outlined
                :rules="[
                  (val) => !!val || $t(Utils.getKey('field is required')),
                ]"
                :type="setting.type"
                maxlength="500"
                lazy-rules
              />
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
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { useQuasar } from "quasar";
import useGame from "../../composables/useGame";
import useGameSetting from "../../composables/useGameSetting";
import useLanguage from "src/composables/useLanguage";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";
import Auth from "src/store/auth";

const locale = inject("locale");
const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const { saving, all } = useGame();
const { update } = useGameSetting();
const games = ref([]);
const gameSelect = ref([]);
const platformSetting = ref(props.data?.setting);
const value_setting_row = ref(props.data?.setting?.setting_value);

watch(
  () => gameSelect.value,
  () => {
    platformSetting.value = gameSelect.value.setting?.setting;
    game.value.game_id = gameSelect.value.id;
    platformSetting.value.map((el, index) => {
      el.status = true;
      return el;
    });
  }
);

const game = ref({
  ...props.data,
});
const translation_name = ref({});
const time = ref({});
const isLoading = ref(false);
const columns = [
  {
    name: "segment",
    field: (row) => row.name,
    align: "left",
    label: "segment",
  },
  { name: "price", field: (row) => row.name, align: "left", label: "price" },
  {
    name: "winning_percentage",
    field: (row) => row.name,
    align: "left",
    label: "winning_percentage",
  },
  { name: "color", field: (row) => row.color, align: "center", label: "color" },

  { name: "actions", field: (row) => row, label: " Action", align: "center" },
];
const refForm = ref(null);
const rows = ref([]);
const incNum = ref(0);

const onRemoveRow = (row, parent) => {
  platformSetting.value.map((rw) => {
    if (rw.id == parent.id && rw.parameters == parent.parameters) {
      rw.setting_value = rw.setting_value.filter(
        (remove) => remove.id != row.id
      );
    }
    return rw;
  });
};

const onRemoveRowChild = (subChild, child, parent) => {
  platformSetting.value.map((rw) => {
    if (rw.id == parent.id) {
      rw.value.map((ch) => {
        if (ch.id == child.id) {
          ch.setting_value = ch.setting_value.filter(
            (remove) => remove.id != subChild.id
          );
        }
        return ch;
      });
    }
    return rw;
  });
};

// const onAddRow = (st) => {
//   incNum.value += 1;
//   incNum.value;
//   let objsetting = {};
//   st.value.forEach((e) => {
//     objsetting[e.parameters] = "";
//   });
//   let value_setting_row = {
//     id: incNum.value,
//     ...objsetting,
//   };
//   platformSetting.value.map((rw) => {
//     if (rw.id == st.id && rw.parameters == st.parameters) {
//       if (rw.setting_value == undefined) {
//         rw.setting_value = [];
//       }
//       rw.setting_value.push(value_setting_row);
//     }
//     return rw;
//   });
// };
const onAddRow = (st) => {
  incNum.value = Utils.randomString(16);
  let objsetting = {};
  st.value.forEach((e) => {
    if (e.type == "group") {
      objsetting[e.parameters] = {};
      e.value.forEach((chil) => {
        objsetting[e.parameters][chil.parameters] = "";
        objsetting[e.parameters]["label"] = chil.label;
      });
    } else {
      objsetting[e.parameters] = "";
      objsetting["label"] = e.label;
    }
  });
  let value_setting_row = {
    id: Utils.randomString(16),
    ...objsetting,
  };
  // console.log("value_setting_row", value_setting_row);
  platformSetting.value.map((rw) => {
    if (rw.id == st.id) {
      if (rw.setting_value == undefined) {
        rw.setting_value = [];
      }
      rw.setting_value.push(value_setting_row);
    }
    return rw;
  });
  // console.log("platformSetting", platformSetting.value);
};

const onAddRowListinGroup = (child, setting) => {
  incNum.value = Utils.randomString(16);
  let objsetting = {};
  child.value.forEach((e) => {
    // console.log("e type", e);
    if (e.type == "group") {
      objsetting[e.parameters] = {};
      e.value.forEach((chil) => {
        objsetting[e.parameters][chil.parameters] = "";
        objsetting[e.parameters]["label"] = chil.label;
      });
    } else {
      objsetting[e.parameters] = "";
      objsetting["label"] = e.label;
    }
  });
  let value_setting_row = {
    id: Utils.randomString(16),
    ...objsetting,
  };

  platformSetting.value.map((rw) => {
    if (rw.id == setting.id) {
      // console.log("row list in group", rw);
      rw.value.map((listIn) => {
        if (listIn.id == child.id) {
          if (listIn.setting_value == undefined) {
            listIn.setting_value = [];
          }
          listIn.setting_value.push(value_setting_row);
        }
      });
    }
    return rw;
  });
  console.log("all setting", platformSetting.value);
};

const languages = ref([]);

const onRemove = (val) => {
  rows.value = rows.value.filter((row) => row.id != val.id);
};

const onLoadGames = async (val) => {
  let allGame = await all();
  games.value = allGame.data;
  let checkIsnewSetting = allGame.data.filter(
    (ns) => ns.id == props.data.game_id
  );
  if (checkIsnewSetting.length > 0) {
    let oldSetting = props.data.setting.length;
    let newSetting = checkIsnewSetting[0].setting?.setting.length;
    // check is game add new parameter
    if (newSetting != oldSetting) {
      let diff = newSetting - oldSetting;
      for (let i = 0; i < diff; i++) {
        let stObj = checkIsnewSetting[0].setting?.setting[oldSetting + i];
        platformSetting.value.push(stObj);
      }
    }
  }
};
onLoadGames();

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
    game.value.setting = platformSetting;
    await update(game.value.id, { ...game.value });
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

<style scoped>
.myTb table th {
  text-align: left;
}
</style>
