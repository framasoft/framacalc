<template>
  <div
    id="app"
    class="container ombre"
  >
    <vue-headful
      :title="meta.title"
      :description="meta.description"
      :html="{ body: {id: $route.meta.id } }"
      :lang="$route.meta.lang"
      :head="{
        'link[rel^=shortcut]': {href: meta.favicon},
        'link[rel=apple-touch-icon]': {href: meta.appleicon},

        'link[rel=canonical]': {href: meta.url},

        'meta[property^=og][property$=title]': {content: meta.title},
        'meta[property^=og][property$=image]': {content: meta.img},
        'meta[property^=og][property$=url]': {content: meta.url},
        'meta[property^=og][property$=description]': {content: meta.description},

        'meta[name^=twitter][name$=title]': {content: meta.title},
        'meta[name^=twitter][name$=image]': {content: meta.img},
        'meta[name^=twitter][name$=description]': {content: meta.description},

        'meta[name=author]': {content: meta.author},
      }"
    />
    <header-component />
    <router-view />
  </div>
</template>

<script>
import HeaderComponent from './components/partials/Header.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
  },
  data() {
    const description = this.$te(`meta.${this.$route.meta.id}.description`)
      ? this.$t(`meta.${this.$route.meta.id}.description`)
      : this.$t('meta.description', '-t');

    let title = this.$t('meta.title', '-t'); // Main title

    if (this.$te(`${this.$route.meta.id}.title`)) {
      // Main title - Page title
      title = `${title} - ${this.$t(`${this.$route.meta.id}.title`, '-t')}`;
    }
    if (this.$te(`meta.${this.$route.meta.id}.title`)) {
      // Custom title
      title = this.$t(`meta.${this.$route.meta.id}.title`, '-t');
    }

    return {
      meta: {
        title,
        description,
        author: this.$te('meta.author') ? this.$t('meta.author') : '',
        img: `${this.$t('baseurl')}img/opengraph/${this.$route.meta.id}.jpg`,
        url: `${this.$t('meta.canonical')}${this.$route.path}`,
        favicon: `${this.$t('baseurl')}icons/favicon.png`,
        appleicon: `${this.$t('baseurl')}icons/apple-touch-icon.png`,
      },
      i18n: process.env.NODE_ENV === 'development' ? this.$i18n.messages : '',
    };
  },
  created() {
    if (this.$route.meta.lang !== undefined
      && this.$i18n.locale !== this.$route.meta.lang) {
      this.$i18n.locale = this.$route.meta.lang;
    }
  },
};
</script>
