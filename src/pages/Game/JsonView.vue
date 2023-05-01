<template>
      <q-card
        class="q-mt-md"
        :style="{
          width: $q.platform.is.mobile ? '100%' : '100%',
          maxWidth: '100%',
        }"
      >
        <q-bar dark class="bg-primary text-white">
          <q-space />
          <q-btn
            dense
            flat
            icon="fas fa-times"
            @click="emit('onClose')"
          >
            <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pt-lg" >
          <json-viewer
            :theme="  $q.dark.isActive ? 'dark' : 'light'"
            :value="props.data"
            :expand-depth="3"
            copyable
          ></json-viewer>
        </q-card-section>
      </q-card>
</template>

<script setup>

import { reactive } from "vue";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import Utils from "../../helpers/Utils";
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({ data: Object });
const jsonData = reactive(props.data);

</script>
