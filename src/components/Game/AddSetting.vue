<template>
  <q-card
    id="cardScrolling"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '100%',
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
            v-for="(setting, index) in gameSelect.setting?.setting"
            :key="index"
          >
            <p class="font_18">
              {{ setting.parameters }}
              <q-checkbox v-model="settingSelect[index]" />
            </p>
          </div>

          <!-- <div class="col-12 col-md-12 q-pr-md">
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
              <template v-slot:body-cell-segment="props">
                <q-td>
                  <q-input
                    class="q-pt-sm"
                    v-model="props.row.segment"
                    :label="$t(Utils.getKey('segment'))"
                    dense
                    :rules="[
                      (val) => !!val || $t(Utils.getKey('field is required')),
                    ]"
                    outlined
                    maxlength="500"
                    lazy-rules
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-price="props">
                <q-td>
                  <q-input
                    class="q-pt-sm"
                    v-model="props.row.price"
                    :label="$t(Utils.getKey('price'))"
                    dense
                    outlined
                    :oninput="
                      (evt) => Utils.numberValidationWithDecimal(evt, 10)
                    "
                    :rules="[
                      (val) => !!val || $t(Utils.getKey('field is required')),
                    ]"
                    type="number"
                    maxlength="500"
                    lazy-rules
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-winning_percentage="props">
                <q-td class="text-center">
                  <q-input
                    class="q-pt-sm"
                    v-model="props.row.winning_percentage"
                    type="number"
                    :oninput="
                      (evt) => Utils.numberValidationWithDecimal(evt, 2)
                    "
                    :label="$t(Utils.getKey('percentage'))"
                    dense
                    :rules="[
                      (val) => !!val || $t(Utils.getKey('field is required')),
                    ]"
                    outlined
                    maxlength="500"
                    lazy-rules
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-color="props">
                <q-td>
                  <input v-model="props.row.color" type="color" />
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
          </div> -->
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="text-right q-mt-md" v-if="!showMedia">
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
    <div v-if="showMedia">
      <Media @back="(showMedia = false), onGetMedia()" />
    </div>
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

const locale = inject("locale");
const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onAdded"]);
const $q = useQuasar();
const { saving, all } = useGame();
const games = ref([]);
const gameSelect = ref({});
const settingSelect = ref({});

watch(
  () => gameSelect.value,
  () => {
    gameSelect.value.setting?.setting.forEach((element, index) => {
      settingSelect.value[index] = false;
    });
  }
);

const game = ref({
  id: "",
  type: "",
  user_id: Auth.state?.user?.id,
  setting: {
    setting: {},
    segment: [],
  },
  status: "active",
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
const onAddRow = () => {
  incNum.value += 1;
  rows.value.push({
    id: incNum.value,
    segment: "",
    price: "",
    winning_percentage: "",
    color: "#808080",
  });
};
const languages = ref([]);

const onRemove = (val) => {
  rows.value = rows.value.filter((row) => row.id != val.id);
};

const onLoadGames = async (val) => {
  let allGame = await all();
  games.value = allGame.data;
  console.log(allGame, "all games");
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
    game.value.setting.segment = rows.value;
    game.value.setting.setting = time.value;
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
