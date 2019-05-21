<template>
  <div class="flex" v-if="detected == ''">
    <v-quagga :onDetected="logIt" :readerSize="readerSize" :readerTypes="['code_128_reader']"></v-quagga>
  </div>
  <div class="flex" v-else>
      {{ detected }}
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      readerSize: {
        width: 100,
        height: 100
      },
      detected: ''
    }
  },
  methods: {
    logIt (data) {
        this.detected = data.codeResult.code
        // this.$router.push(`/${data.codeResult.code}`)
      console.log('detected', data)
    }

  }
}
</script>
