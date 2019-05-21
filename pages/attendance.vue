<template>
  <div class="flex" v-if="detected == ''">
    <v-quagga :onDetected="logIt" :readerSize="readerSize" :readerTypes="['code_128_reader']"></v-quagga>
  </div>
  <div class="flex flex-col my-10" v-else>
      <span class="mx-auto mb-4">Barcode:</span>
      <span class="mx-auto mb-10">{{ detected }}</span>
      <div class="mx-auto">
          <button class="button--grey" @click="detected = ''">
              Rescan Barcode
          </button>
      </div>
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
      detected: '',
      scanned_data: []
    }
  },
  methods: {
    logIt (data) {
        if(this.scanned_data.length <5) {
            // this.detected = data.codeResult.code
            this.scanned_data.push(data.codeResult.code)
        } else {
            if(this.scanned_data.every( (val, i, arr) => val === arr[0] )) {
                this.detected = this.scanned_data[0]
            }
        }
        // this.$router.push(`/${data.codeResult.code}`)
      console.log('detected', data)
    }

  }
}
</script>
