<template>
  <q-card
    id="cardScrolling"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '800px',
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
          <div class="col-12 col-md-12 q-pr-md d-flex">
            <q-input
              v-model="platforms.name"
              :label="$t(Utils.getKey('name'))"
              dense
              class="flex-1"
              outlined
              emit-value
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
            />
          </div>

            <!-- <div class="row"> -->
              <div
                class="col-12 col-md-6 q-pr-md"
                v-for="lang in languages"
                :key="lang.locale"
              >
                <label class="text-uppercase">{{ $t(lang.locale) }}</label>
                <q-input
                  v-model="platforms.translates[lang.locale].name"
                  :label="$t(Utils.getKey('name'))"
                  dense
                  :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
                  autogrow
                  type="textarea"
                  outlined
                />
              </div>
            <!-- </div> -->

          <div class="col-12 col-md-12 q-pr-md">
            <q-radio v-model="platforms.status" val="active" :label="$t('active')" />
          <q-radio v-model="platforms.status" val="inactive" :label="$t('inactive')" />
          </div>
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

    <Loading :loading="isLoading" />
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import usePlatfrom from "../../composables/usePlatfrom";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";
import useLanguage from "src/composables/useLanguage";

const { all } = useLanguage();

const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data:Object, languages: Array });
const emit = defineEmits(["onClose", "onUpdate"]);
const $q = useQuasar();
const { saving, update } = usePlatfrom();
const platforms = ref(props.data);
const isLoading = ref(false);
const refForm = ref(null);
const showMedia = ref(false);
const languages = ref([]);
// const languages = ref(props.languages);

getLanguages();
async function getLanguages() {
  languages.value = await (await all()).data;
  console.log(languages.value);
}

console.log(languages.value);

watch(
  () => platforms.value.name,
  () => {}
);

async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    let platformData = []
    let allFill = false;
    languages.value.forEach((lg, index) => {
      let cd = {};
      if (platforms.value.translates[lg.locale].name == "") {
        allFill = true;
      } else {
        cd.language_id = lg.id;
        cd.field_name = "name";
        cd.translation = platforms.value.translates[lg.locale].name;
      }
      platformData.push(cd);
    });

    if (allFill == true) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("please fill all translation fileld")),
      });
      return;
    }

    await update(platforms.value.id,{...platforms.value,  translation: platformData});
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
