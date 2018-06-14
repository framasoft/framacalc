<template lang="html">
  <div class="pull-right">
    <dropdown ref="dropdown">
      <btn type="button" class="btn btn-default dropdown-toggle"
        aria-haspopup="true" aria-expanded="false"
        :title="$t('msg.nav.langChange')">
        <i class="fa fa-lg fa-language" aria-hidden="true"></i> {{ $t("msg.nav.lang") }} <span class="caret"></span>
      </btn>
      <template slot="dropdown">
        <li @click="changeLanguage('en')">
          <router-link :to="'/en/' + (this.$route.path.split('/')[2] || '')">
            English
          </router-link>
        </li>
        <li @click="changeLanguage('fr')">
          <router-link :to="'/fr/' + (this.$route.path.split('/')[2] || '')">
            Français
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
      currentComponent: '',
      switchLanguage: 'en',
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
