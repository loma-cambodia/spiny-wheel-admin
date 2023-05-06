<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '600px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Copy")) }}</span>
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
    <q-form ref="refForm">
      <q-card-section class="q-pt-lg">
        <q-select
          v-model="languageSelect"
          :options="languages"
          :label="$t(Utils.getKey('Language'))"
          dense
          emit-value
          :loading="isLoading"
          map-options
          option-label="name"
          option-value="id"
          outlined
          lazy-rules
          :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
        >
        </q-select>
      </q-card-section>
    </q-form>

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
        style="color: var(--q-primary) !important"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
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
const emit = defineEmits(["onClose", "onAdded"]);
const $q = useQuasar();
const { add } = useGameSetting();
const platformSetting = ref([]);
const settingSelect = ref({});

const value_setting = ref({});
const lanuageHandle = useLanguage();
const game = ref({
  ...props.data,
});
const isLoading = ref(false);

const refForm = ref(null);
const rows = ref([]);
const incNum = ref(0);

const languages = ref([]);
const languageSelect = ref();


getLanguages();
async function getLanguages() {
  isLoading.value = true;
  let lang = await lanuageHandle.all();
  languages.value = lang.data.filter(lg => lg.id != props.data.language_id);
  isLoading.value = false;
}

async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    delete game.value.id;
    await add({ ...game.value, language_id: languageSelect.value });
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("added successfully")),
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
