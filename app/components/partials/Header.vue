<template>
  <header role="banner">
    <div class="pull-right">
      <I18n/>
    </div>
    <h1 class="sitename">
      <router-link :to="`/${$t('lang')}/`" v-html="$t('color.calc')"></router-link>
    </h1>
    <p class="lead" v-html="$t('meta.lead')"></p>
    <hr class="trait" role="presentation" />
  </header>
</template>

<script>
import I18n from './I18n.vue';
export default {
  components: {
    I18n,
  },
}
</script>

