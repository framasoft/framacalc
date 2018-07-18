<template lang="html">
  <main id="classic">

    <div class="row">
      <div class="col-md-8" id="classic">
        <p class="text-center"><img :src="`${data['/img/']}screenshot-fr.png`" alt="" class="ombre" /></p>

        <div class="col-md-10 col-md-offset-1 alert alert-danger alert-dismissible">
          <button type="button" class="close" data-dismiss="alert" :aria-label="$t('warning.close')">
            <span aria-hidden="true">&times;</span>
          </button>
          <p><strong>{{ $t('warning.title') }}</strong></p>
          <p v-html="$t('warning.text1')"></p>
          <p v-html="$t('warning.text2')"></p>
          <p v-html="$t('warning.text3')"></p>
          <p v-html="$t('warning.text4')"></p>
        </div>
        <div class="col-md-10 col-md-offset-1 well calc-options">
          <form class="form-horizontal" id="create-calc">
            <fieldset>
              <legend>{{ $t('public.title') }}</legend>
              <div class="form-group">
                <label for="classic-calc-name" class="col-md-5">{{ $t('public.name') }}</label>
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
                      {{ $t('public.warning') }}
                    </strong><br/>
                    {{ $t('public.samename') }}
                  </span>
                </div>
              </div>
              <div class="text-center col-sm-12">
                  <button class="btn btn-lg btn-primary calc-create"
                    type="submit" aria-describeby="#expiration-help"
                    @click="createCalc">
                    {{ $t('public.create') }}
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
        <h2 class="h3">{{ $t('what.title') }}</h2>
          <p>{{ $t('what.desc') }}</p>
          <p>{{ $t('what.desc2') }}</p>
        <h2 class="h3">{{ $t('how.title') }}</h2>
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
        <h2>{{ $t('help.title') }}</h2>
        <p
          class="text-center"
          role="presentation"><i class="glyphicon glyphicon-question-sign"></i></p>
        <p v-html="$t('help.desc')"></p>
        <p v-html="$t('help.desc2')"></p>
        <p class="text-center"><a href="https://contact.framasoft.org/foire-aux-questions/#framacalc" class="btn btn-primary">
          {{ $t('help.faq') }} »
        </a></p>
        <p v-html="$t('help.desc3')"></p>
      </div>

      <div
        class="col-md-4"
        id="le-logiciel">
        <h2>{{ $t('software.title') }}</h2>
        <p
          class="text-center"
          role="presentation"><i class="glyphicon glyphicon-cloud"></i></p>
        <p><span v-html="$t('software.basedon')"></span> <a href="http://ethercalc.net">Ethercalc</a>.</p>
        <p v-html="$t('software.license')"></p>
      </div>

      <div
        class="col-md-4"
        id="jardin">
        <h2>{{ $t('garden.title') }}</h2>
        <p
          class="text-center"
          role="presentation"><i class="glyphicon glyphicon-tree-deciduous"></i></p>
        <p>{{ $t('garden.contrib') }} <a href="https://github.com/audreyt/ethercalc">{{ $t('garden.devsite') }}</a>.</p>
        <br/>
        <!-- <p>{{ $t('garden.install') }}</p>
        <p class="text-center"><a
          :href="$t('garden.framacloud')"
          style="color:white"
          class="btn btn-success"><i class="glyphicon glyphicon-tree-deciduous"></i> framacloud.org</a></p>-->
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
