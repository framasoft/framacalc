<template>
  <main>
    <div class="row mt-4">
      <div class="col-lg-8">
        <p class="text-center">
          <img :src="`${$t('/')}img/${$t('lang')}/screenshot.png`" alt="" class="ombre" />
        </p>

        <div class="mx-5">
          <b-card bg-variant="light" >
            <b-card-text>
              <b-form>
                <fieldset>
                  <legend v-html="$t('public.title')"></legend>
                  <b-form-group
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :label="$t('public.name')"
                    label-for="name">
                    <b-form-input id="name"
                      v-model="name"
                      type="text"
                      maxlength="50"
                      @focusout="name = $t(` ${name}`, '-L@').replace(/[.]/g, '')">
                    </b-form-input>
                  </b-form-group>
                  <div class="text-center col-sm-12">
                    <b-button
                      type="submit"
                      size="lg"
                      variant="primary"
                      @click="create">
                      <i class="fa fa-fw fa-lg fa-th" aria-hidden="true"></i>
                      <span v-html="$t('public.create')"></span> »
                    </b-button>
                  </div>
                  <p class="small text-muted mb-0 mt-3" v-html="$t('public.help')"></p>
                </fieldset>
              </b-form>
            </b-card-text>
          </b-card>
        </div>
      </div>
      <div class="col-lg-4">
        <h2 v-html="$t('what.title')"></h2>
        <div v-html="$t('what.md')"></div>
        <div v-html="$t('how', { link: `https://lite.framacalc.org/CalcDeTest` })"></div>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Help -->
      <div class="col-md-4">
        <h2 v-html="$t('help.title')"></h2>
        <i class="fa fa-3x fa-question-circle d-block text-center mb-3" aria-hidden="true"></i>

        <div v-html="$t('help.md', {link: 'https://contact.framasoft.org/faq/#framacalc'})"></div>
      </div>

      <!-- About software -->
      <div class="col-md-4">
        <h2 v-html="$t('software.title')"></h2>
        <i class="fa fa-3x fa-cloud d-block text-center mb-3" aria-hidden="true"></i>

        <div v-html="$t('software.md')">
        </div>
      </div>

      <!-- Garden -->
      <div class="col-md-4">
        <h2 v-html="$t('garden.title')"></h2>
        <i class="fa fa-3x fa-leaf d-block text-center mb-3" aria-hidden="true"></i>

        <div v-html="$t('garden.md')"></div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    /* Random alphanumeric name with 10 chars */
    const name = [...Array(10)].map(() => Math.random().toString(36)[3]).join('')
      .replace(/(.|$)/g, c => c[!Math.round(Math.random()) ? 'toString' : 'toLowerCase']());

    return {
      modal: {
        open: false,
      },
      prefix: Math.trunc((new Date).getTime() / 3600000).toString(36),
      name,
    };
  },
  methods: {
    create(event) {
      event.preventDefault();
      window.location = `https://lite.framacalc.org/${this.prefix}-${this.name}`;
    },
  },
};
</script>
