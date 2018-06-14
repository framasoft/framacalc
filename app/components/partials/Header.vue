<template lang="html">
  <header role="banner" id="framaheader">
    <div class="pull-right">
      <I18n/>
    </div>
    <h1 id="framasoft" class="sitename">
      <a :href="$t('msg.meta.baseURL')" v-html="$t('msg.meta.framaname')"></a>
    </h1>
    <p class="lead">{{ $t("msg.meta.lead") }}</p>
    <hr class="trait" role="presentation" />
  </header>
</template>

<script>
import I18n from './I18n.vue'
export default {
  name: 'framaheader',
  components: {
    I18n,
  }
}
</script>

