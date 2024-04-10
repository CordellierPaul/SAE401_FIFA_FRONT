<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
</script>

<template>
  <div class="min-h-screen">
    <HeaderComponent></HeaderComponent>
    
    <div id="content">
      <RouterView />
    </div>
    
    <FooterComponent class="sticky top-[100vh]"></FooterComponent>

  </div>
</template>

<style scoped>
</style>
