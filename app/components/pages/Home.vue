<template lang="html">
  <main id="classic">

    <div class="row">
      <div class="col-md-8" id="classic">
        <p class="text-center"><img :src="screen" alt="" class="ombre" /></p>

        <div class="col-md-10 col-md-offset-1 alert alert-danger alert-dismissible">
          <button type="button" class="close" data-dismiss="alert" :aria-label="$t('msg.warning.close')">
            <span aria-hidden="true">&times;</span>
          </button>
          <p><strong>{{ $t('msg.warning.title') }}</strong></p>
          <p v-html="$t('msg.warning.text1')"></p>
          <p v-html="$t('msg.warning.text2')"></p>
          <p v-html="$t('msg.warning.text3')"></p>
          <p v-html="$t('msg.warning.text4')"></p>
        </div>
        <div class="col-md-10 col-md-offset-1 well calc-options">
          <form class="form-horizontal" id="create-calc">
            <fieldset>
              <legend>{{ $t('msg.public.title') }}</legend>
              <div class="form-group">
                <label for="classic-calc-name" class="col-md-5">{{ $t('msg.public.name') }}</label>
                <div class="col-sm-7">
                  <input
                    id="classic-calc-name"
                    v-model="calcName"
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
                      {{ $t('msg.public.warning') }}
                    </strong><br/>
                    {{ $t('msg.public.samename') }}
                  </span>
                </div>
              </div>
              <div class="text-center col-sm-12">
                  <button class="btn btn-lg btn-primary calc-create"
                    type="submit" aria-describeby="#expiration-help"
                    @click="createCalc">
                    {{ $t('msg.public.create') }}
                  </button>
                  <a id="calc-url" href="https://lite.framacalc.org/" class="hidden" rel="nofollow"></a>
              </div>
              <p class="help-block small col-sm-12" id="expiration-help" v-html="$t('msg.public.help')"></p>

            </fieldset>
          </form>
        </div>

      </div>
      <div
        id="howitworks"
        class="col-md-4">
        <h2 class="h3">{{ $t('msg.what.title') }}</h2>
          <p>{{ $t('msg.what.desc') }}</p>
          <p>{{ $t('msg.what.desc2') }}</p>
        <h2 class="h3">{{ $t('msg.how.title') }}</h2>
        <ul>
          <li v-html="$t('msg.how.collab')"></li>
          <li v-html="$t('msg.how.func')"></li>
          <li v-html="$t('msg.how.comment')"></li>
          <li v-html="$t('msg.how.autosave')"></li>
          <li v-html="$t('msg.how.graph')"></li>
          <li v-html="$t('msg.how.export')"></li>
          <li v-html="$t('msg.how.size')"></li>
        </ul>
        <p v-html="$t('msg.how.share')"></p>
        <p v-html="$t('msg.how.demo')"></p>
      </div>
    </div>

    <hr role="presentation" />

    <div class="row">

      <div
        class="col-md-4"
        id="tuto-video">
        <h2>{{ $t('msg.help.title') }}</h2>
        <p
          class="text-center"
          role="presentation"><i class="glyphicon glyphicon-question-sign"></i></p>
        <p v-html="$t('msg.help.desc')"></p>
        <p v-html="$t('msg.help.desc2')"></p>
        <p class="text-center"><a href="https://contact.framasoft.org/foire-aux-questions/#framacalc" class="btn btn-primary">
          {{ $t('msg.help.faq') }} »
        </a></p>
        <p v-html="$t('msg.help.desc3')"></p>
      </div>

      <div
        class="col-md-4"
        id="le-logiciel">
        <h2>{{ $t('msg.software.title') }}</h2>
        <p
          class="text-center"
          role="presentation"><i class="glyphicon glyphicon-cloud"></i></p>
        <p>{{ $t('msg.software.basedon') }} <a href="http://ethercalc.net">Ethercalc</a>.</p>
        <p v-html="$t('msg.software.license')"></p>
      </div>

      <div
        class="col-md-4"
        id="jardin">
        <h2>{{ $t('msg.garden.title') }}</h2>
        <p
          class="text-center"
          role="presentation"><i class="glyphicon glyphicon-tree-deciduous"></i></p>
        <p>{{ $t('msg.garden.contrib') }} <a href="https://github.com/audreyt/ethercalc">{{ $t('msg.garden.devsite') }}</a>.</p>
        <br/>
        <!-- <p>{{ $t('msg.garden.install') }}</p>
        <p class="text-center"><a
          :href="$t('msg.garden.framacloud')"
          style="color:white"
          class="btn btn-success"><i class="glyphicon glyphicon-tree-deciduous"></i> framacloud.org</a></p>-->
      </div>
    </div>
  </main>
</template>

<script>
import { removeDiacritics, randomName } from '../../tools';

export default {
  name: 'Home',
  data() {
    const { lang } = document.getElementsByTagName('html')[0];
    const base = (window.location.href.split('/')[3] !== lang) ? `/${window.location.href.split('/')[3]}` : '';
    return {
      modal: {
        open: false,
      },
      screen: `${base}/img/screenshot-fr.png`,
      calcName: randomName(),
    };
  },
  methods: {
    sanitizeName() {
      this.calcName = removeDiacritics(this.calcName).replace(/[ '’]/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
    },
    createCalc(event) {
      event.preventDefault();
      window.location = `https://lite.framacalc.org/${this.calcName}`;
    },
  },
};
</script>
