<template>
  <div>
    <img :src="model.image" />
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, onMounted, watch, unref, watchEffect, Ref, shallowRef } from "vue";
import { onMounted } from "vue";
defineProps({
  model: {
    type: Object,
    required: true,
  },
});

onMounted(async () => {
  console.log("image started");
});
</script>
