<template lang="html">
  <main id="classic">

    <div class="row">
      <div class="col-md-8" id="classic">
        <p class="text-center"><img :src="`${data['/img/']}screenshot-fr.png`" alt="" class="ombre" /></p>

        <!-- <div class="col-md-10 col-md-offset-1 alert alert-danger alert-dismissible">
          <button type="button" class="close" data-dismiss="alert" :aria-label="$t('warning.close')">
            <span aria-hidden="true">&times;</span>
          </button>
          <p><strong v-html="$t('warning.title')"></strong></p>
          <p v-html="$t('warning.text1')"></p>
          <p v-html="$t('warning.text2')"></p>
          <p v-html="$t('warning.text3')"></p>
          <p v-html="$t('warning.text4')"></p>
        </div> -->
        <div class="col-md-10 col-md-offset-1 well calc-options">
          <form class="form-horizontal" id="create-calc">
            <fieldset>
              <legend v-html="$t('public.title')"></legend>
              <div class="form-group">
                <label for="classic-calc-name" class="col-md-5" v-html="$t('public.name')"></label>
                <div class="col-sm-7">
                  <input
                    id="classic-calc-name"
                    v-model="name"
                    type="text"
                    class="form-control calc-name"
                    maxlength="50"
                    aria-describedby="#name-help"
                    @focusout="sanitizeName"
                  />
                  <span id="name-help" class="help-block small">
                    <strong>
                      <i
                        class="fa fa-lg fa-warning"
                        aria-hidden="true"></i>
                      <span v-html="$t('public.warning')"></span>
                    </strong><br>
                    <span v-html="$t('public.samename')"></span>
                  </span>
                </div>
              </div>
              <div class="text-center col-sm-12">
                  <button class="btn btn-lg btn-primary calc-create"
                    type="submit" aria-describeby="#expiration-help"
                    @click="createCalc">
                    <i class="fa fa-fw fa-lg fa-th" aria-hidden="true"></i>
                    <span v-html="$t('public.create')"></span> »
                  </button>
                  <a id="calc-url" href="https://lite.framacalc.org/" class="hidden" rel="nofollow"></a>
              </div>
              <p class="help-block small col-sm-12" id="expiration-help" v-html="$t('public.help')"></p>

            </fieldset>
          </form>
        </div>

      </div>
      <div
        id="howitworks"
        class="col-md-4">
        <h2 class="h3" v-html="$t('what.title')"></h2>
          <p v-html="$t('what.desc')"></p>
          <p v-html="$t('what.desc2')"></p>
        <h2 class="h3" v-html="$t('how.title')"></h2>
        <ul>
          <li v-html="$t('how.collab')"></li>
          <li v-html="$t('how.func')"></li>
          <li v-html="$t('how.comment')"></li>
          <li v-html="$t('how.autosave')"></li>
          <li v-html="$t('how.graph')"></li>
          <li v-html="$t('how.export')"></li>
          <li v-html="$t('how.size')"></li>
        </ul>
        <p v-html="$t('how.share')"></p>
        <p v-html="$t('how.demo')"></p>
      </div>
    </div>

    <hr role="presentation" />

    <div class="row">

      <div
        class="col-md-4"
        id="tuto-video">
        <h2 v-html="$t('help.title')"></h2>
        <p class="text-center" role="presentation">
          <i class="fa fa-question-circle" aria-hidden="true"></i>
        </p>
        <p v-html="$t('help.desc')"></p>
        <p v-html="$t('help.desc2')"></p>
        <p class="text-center">
          <a
            href="https://contact.framasoft.org/foire-aux-questions/#framacalc"
            class="btn btn-primary"
            v-html="$t('help.faq')"
          ></a>
        </p>
        <p v-html="$t('help.desc3')"></p>
      </div>

      <div
        class="col-md-4"
        id="le-logiciel">
        <h2 v-html="$t('software.title')"></h2>
        <p class="text-center" role="presentation">
          <i class="fa fa-cloud" aria-hiden="true"></i>
        </p>
        <p><span v-html="$t('software.basedon')"></span> <a href="http://ethercalc.net">Ethercalc</a>.</p>
        <p v-html="$t('software.license')"></p>
      </div>

      <div
        class="col-md-4"
        id="jardin">
        <h2 v-html="$t('garden.title')"></h2>
        <p class="text-center" role="presentation">
          <i class="glyphicon glyphicon-tree-deciduous" aria-hidden="true"></i>
        </p>
        <p>
          <span v-html="$t('garden.contrib')"></span>
          <a href="https://github.com/audreyt/ethercalc" v-html="$t('garden.devsite')"></a>.
        </p>
        <br>
        <!--
        <p v-html="$t('garden.install')"></p>
        <p class="text-center"><a
          :href="$t('garden.framacloud')"
          style="color:white"
          class="btn btn-success">
          <i class="glyphicon glyphicon-tree-deciduous" aria-hidden="true"></i>
          framacloud.org</a>
        </p>
        -->
      </div>
    </div>
  </main>
</template>

<script>
import { rmDiacritics, randomName, sanitize } from '../../tools';

export default {
  name: 'Home',
  data() {
    return {
      data: this.$i18n.messages.data,
      modal: {
        open: false,
      },
      name: randomName(),
    };
  },
  methods: {
    sanitizeName() {
      this.name = sanitize(rmDiacritics(this.name));
    },
    createCalc(event) {
      event.preventDefault();
      window.location = `https://lite.framacalc.org/${this.name}`;
    },
  },
};
</script>
