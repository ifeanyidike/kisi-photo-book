<template>
  <div>
    <div class="item">
      <img :src="`${baseUrl}/${item.image}`" :alt="item.title" />
      <div class="detail">
        <p class="title">{{ item.title }}</p>
        <p class="description">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
const baseUrl = import.meta.env.VITE_BASE_URL
const props = defineProps(['item'])
const { item } = toRefs(props)
</script>

<style scoped>
.item {
  margin: 5px;
  width: 470px;
  position: relative;
  font-family: 'Roboto', sans-serif;
  display: inline-block;
  border-radius: 10px;
}

@media screen and (max-width: 450px) {
  .item {
    width: calc(100vw - 30px);
  }
}

img {
  width: 100%;
  border-radius: 10px;
}
.detail {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  font-weight: 400;
  padding: 10px;
  width: 100%;
  height: 100%;
}

.title,
.description {
  padding: 0 20px;
}
.title {
  font-weight: 600;
  margin-bottom: 30px;
  font-size: 1.2rem;
}
.description {
  display: none;
  line-height: 1.5;
}

.item:hover {
  background-color: #4a52ff;
}

.item:hover .description {
  display: block;
}
.item:hover img {
  opacity: 0;
}
</style>
