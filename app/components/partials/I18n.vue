<template>
  <div class="pull-right">
    <dropdown ref="dropdown" menu-right>
      <btn type="button" class="btn btn-default dropdown-toggle"
        aria-haspopup="true" aria-expanded="false"
        :title="$t('nav.langChange')">
        <i class="fa fa-lg fa-language" aria-hidden="true"></i> {{ $t("nav.lang") }} <span class="caret"></span>
      </btn>
      <template slot="dropdown">
        <li v-for="lang in locales.avalaible"
          @click="changeLanguage(lang)">
          <router-link :to="'/' + lang + '/' + ($route.path.split('/')[2] || '')">
            {{ locales[lang] }}
          </router-link>
        </li>
      </template>
    </dropdown>
  </div>
</template>

<script>
import { Btn, Dropdown } from 'uiv';

export default {
  components: {
    Btn, Dropdown,
  },
  data() {
    return {
      data: this.$i18n.messages.data,
      currentComponent: '',
      switchLanguage: 'en',
      locales: this.$i18n.messages.locales,
    };
  },
  methods: {
    changeLanguage(lang) {
      this.switchLanguage = lang;
      this.$i18n.locale = lang;
      this.currentComponent = this.$route.path.split('/')[2]; // eslint-disable-line prefer-destructuring
    },
  },
};
</script>
