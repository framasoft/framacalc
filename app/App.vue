<template>
  <div id="app" class="container ombre">
    <vue-headful
      :title="$t('meta.title')"
    />
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderComponent from './components/partials/Header.vue'
export default {
  name: 'app',
  components: {
    HeaderComponent,
  }
}
</script>
