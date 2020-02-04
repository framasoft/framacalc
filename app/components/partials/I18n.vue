<template>
  <div class="pull-right">
    <b-dropdown
      right
      variant="outline-secondary"
      :title="$t('nav.langChange', '-t')"
    >
      <template v-slot:button-content>
        <icon
          name="language"
          variant="fa-lg"
          :label="$t('nav.lang')"
        />
      </template>
      <b-dropdown-item
        v-for="lang in locales.visible"
        :key="lang"
        :to="`/${lang}/${($route.path.split('/')[2] || '')}`"
        @click="changeLanguage(lang)"
      >
        {{ locales[lang] }}
      </b-dropdown-item>
      <b-dropdown-divider v-if="$te('meta.i18n')" />
      <b-dropdown-item
        v-if="$te('meta.i18n')"
        :href="$t('meta.i18n')"
      >
        <icon
          name="plus"
          :label="$t('nav.translate')"
        />
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
