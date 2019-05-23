<template>
  <div class="flex" v-if="detected == ''">
    <v-quagga :onDetected="logIt" :readerSize="readerSize" :readerTypes="readerTypes"></v-quagga>
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
      readerTypes: [
          'code_128_reader',
          'ean_reader',
          'ean_8_reader',
          'code_39_reader',
          'code_39_vin_reader',
          'codabar_reader',
          'upc_reader',
          'upc_e_reader',
          'i2of5_reader',
          '2of5_reader',
          'code_93_reader',
      ],
      detected: '',
      scanned_data: []
    }
  },
  watch: {
    detected: function (val) {
      this.scanned_data = []
    },
  },
  methods: {
    logIt (data) {
        if(this.scanned_data.length <5) {
            // this.detected = data.codeResult.code
            this.scanned_data.push(data.codeResult.code)
        } else {
            if(this.scanned_data.every( (val, i, arr) => val === arr[0] )) {
                console.warn(this.scanned_data[0]);
                this.detected = this.scanned_data[0]
            } else {
                // clear data if failed
                this.scanned_data = []
            }
        }
        // this.$router.push(`/${data.codeResult.code}`)
      console.log('detected', data)
    }

  }
}
</script>
