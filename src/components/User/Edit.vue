<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit User")) }}</span>
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
    <q-card-section class="q-pt-lg">
      <q-form ref="refForm">
        <q-input
          :autofocus="true"
          v-model="user.name"
          :label="$t(Utils.getKey('Name'))"
          dense
          outlined
          maxlength="20"
          lazy-rules
          :oninput="(evt) => Utils.containsOnlyCharacterAllLanguageEvent(evt)"
          :rules="[
            (val) => !!val || $t(Utils.getKey('Field is required')),
            (val) =>
              Utils.containsOnlyCharacterAllLanguage(val) ||
              $t(Utils.getKey('Only character, numbers and space')),
          ]"
        />

        <q-input
          :autofocus="true"
          type="email"
          readonly
          v-model="user.email"
          :label="$t(Utils.getKey('Email id'))"
          dense
          outlined
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          maxlength="20"
          @keydown.space="(event) => event.preventDefault()"
          lazy-rules
        />

        <q-select
          :autofocus="true"
          v-model="user.role_id"
          :options="roleOptions"
          :label="$t(Utils.getKey('Role'))"
          emit-value
          map-options
          option-label="name"
          option-value="id"
          dense
          outlined
          maxlength="20"
          lazy-rules
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
        />

        <q-select
          v-model="user.platform_id"
          :options="platformOptions"
          :label="$t(Utils.getKey('Platform'))"
          emit-value
          map-options
          option-label="name"
          option-value="id"
          dense
          outlined
          maxlength="20"
          lazy-rules
          :rules="[
            (val) => !!val || $t(Utils.getKey('Field is required')),
            (val) => val || $t(Utils.getKey('Please select Platform')),
          ]"
        />
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
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, inject } from "vue";
import { useQuasar } from "quasar";
import useUser from "src/composables/useUser";
import useACL from "src/composables/useACL";
import usePlatfrom from "src/composables/usePlatfrom";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const locale = inject("locale");
const { saving, update } = useUser();
const { getAllRoles } = useACL();
const { all } = usePlatfrom();
const roleOptions = ref([]);
const platformOptions = ref([]);
const user = ref({
  ...props.data,
  role_id: props.data?.roles[0]?.id,
});
const refForm = ref(null);

Promise.allSettled[fetchRoles()];

watch(
  () => user.value.role_id,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      let role = roleOptions.value.find((item) => item.id == newValue);
    }
  }
);

async function fetchRoles() {
  try {
    const response = await getAllRoles();
    const response2 = await all();
    roleOptions.value = response.data;
    response2.data.map((p) => {
      let d = {};
      d.id = p.id;
      if (p.translates[locale.value]?.name != "") {
        d.name = p.translates[locale.value]?.name;
      } else {
        d.name = p.name;
      }
      platformOptions.value.push(d);
    });
  } catch (e) {}
}

async function onSubmit() {
  let role = roleOptions.value.find((item) => item.id == user.value.role_id);

  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    if (!Utils.onlyEmail(user.value.email)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("invalid email address")),
      });
      return;
    }
    const userData = {
      name: user.value.name,
      platform_id: user.value.platform_id,
      role_id: user.value.role_id,
    };
    await update(user.value.id, { ...userData });

    emit("onUpdated");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
  } catch (err) {
    var errMessage = t(Utils.getKey(err.message.toString()));
    if (errMessage && errMessage.match("___"))
      errMessage = err.message.toString();
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: errMessage,
    });
  }
}
</script>
