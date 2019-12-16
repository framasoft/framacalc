<template>
  <div class="pull-right">
    <b-dropdown right variant="outline-secondary" :title="$t('nav.langChange')">
      <template v-slot:button-content>
        <i class="fa fa-lg fa-language" aria-hidden="true"></i>
        <span v-html="$t('nav.lang')"></span>
      </template>
      <b-dropdown-item v-for="lang in locales.available"
        :key="lang"
        @click="changeLanguage(lang)"
        :to="`/${lang}/${($route.path.split('/')[2] || '')}`">
        {{ locales[lang] }}
      </b-dropdown-item>
      <b-dropdown-divider v-if="$te('meta.i18n')"></b-dropdown-divider>
      <b-dropdown-item v-if="$te('meta.i18n')"
        :href="$t('meta.i18n')">
        <i class="fa fa-fw fa-plus" aria-hidden="true"></i>
        <span v-html="$t('nav.translate')"></span>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: '',
      switchLanguage: 'en',
      locales: this.$i18n.messages.locales,
    };
  },
  methods: {
    changeLanguage(lang) {
      this.switchLanguage = lang;
      this.$i18n.locale = lang;
      [this.currentComponent] = [this.$route.path.split('/')[2]];
    },
  },
};
</script>
