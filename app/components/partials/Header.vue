<template>
  <header role="banner" id="framaheader">
    <div class="pull-right">
      <I18n/>
    </div>
    <h1 id="framasoft" class="sitename">
      <router-link :to="'/' + $t('lang') + '/'" v-html="data.color.calc"></router-link>
    </h1>
    <p class="lead" v-html="$t('meta.lead')"></p>
    <hr class="trait" role="presentation" />
  </header>
</template>

<script>
import I18n from './I18n.vue'
export default {
  name: 'framaheader',
  components: {
    I18n,
  },
  data() {
    return {
      data: this.$i18n.messages.data,
    }
  },
}
</script>

