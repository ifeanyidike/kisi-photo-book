<template>
  <div>
    <div v-for="(item, index) in props.items" :key="index">
      <ImageDetail :item="item" />
    </div>
  </div>
</template>

<script setup>
import ImageDetail from '../components/ImageDetail.vue'
const props = defineProps(['items'])
</script>

<style scoped></style>
