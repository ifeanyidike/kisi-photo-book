<template>
  <div class="container">
    <header class="header">
      <h1>Connect people &amp; spaces</h1>
    </header>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ImageList :items="items" class="image-list" />
      <button>
        <input
          @change="handleUploadImage"
          type="file"
          class="file"
          accept="image/png, image/jpeg, image/jpg"
        />
        Upload image
      </button>
    </div>
  </div>
</template>

<script setup>
import ImageList from './components/ImageList.vue'
import { ref, onMounted } from 'vue'

const baseUrl = import.meta.env.VITE_BASE_URL

const items = ref([])
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    const res = await fetch(`${baseUrl}/images`)
    items.value = await res.json()
    loading.value = false
  } catch (error) {
    console.log(error)
  }
})

const handleUploadImage = async (e) => {
  try {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('img', file)
    formData.append('itemSize', items.value.length)

    const response = await fetch(`${baseUrl}/upload-image`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    items.value.push(data)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>

.container {
  margin-top: 5px;
  margin-bottom: 20px;
}
.header {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: 500;
  margin: 20px 15px;
}
.image-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
}

button {
  display: block;
  margin: 0 auto;
  width: 120px;
  height: 40px;
  position: relative;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  background-color: #4a52ff;
  color: #fff;
  font-size: 1rem;
}

input[type='file'] {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
}

@media screen and (max-width: 1024px) {
  .image-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 470px) {
  .image-list {
    grid-template-columns: 1fr;
  }
}
</style>
