<template>
  <div v-if="!detected" class="scanner-wrapper">
    <ClientOnly>
      <div>
        <div ref="scannerTarget" class="scanner-target" />
        <p v-if="isStarting" class="status-message">Starting camera...</p>
        <p v-if="scannerError" class="error-message">{{ scannerError }}</p>
      </div>
    </ClientOnly>
  </div>
  <div v-else class="flex flex-col my-10">
    <span class="mx-auto mb-4">Barcode:</span>
    <span class="mx-auto mb-10">{{ detected }}</span>
    <div class="mx-auto">
      <button class="button--grey" @click="resetScan">
        Rescan Barcode
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

type QuaggaModule = {
  init: (config: Record<string, unknown>, cb: (err?: Error) => void) => void
  start: () => void
  stop: () => void
  onDetected: (cb: (result: any) => void) => void
  offDetected: (cb: (result: any) => void) => void
}

const scannerTarget = ref<HTMLElement | null>(null)
const detected = ref('')
const scannedData = ref<string[]>([])
const isStarting = ref(false)
const scannerError = ref('')

const readerTypes = [
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
  'code_93_reader'
]

let quagga: QuaggaModule | null = null

const logIt = (data: any) => {
  const code = data?.codeResult?.code
  if (!code) {
    return
  }

  if (scannedData.value.length < 5) {
    scannedData.value.push(code)
    return
  }

  if (scannedData.value.every((val) => val === scannedData.value[0])) {
    detected.value = scannedData.value[0]
    stopScanner()
  } else {
    scannedData.value = []
  }
}

const startScanner = async () => {
  if (!process.client || !scannerTarget.value || quagga || isStarting.value) {
    return
  }

  isStarting.value = true
  scannerError.value = ''

  try {
    const module = await import('@ericblade/quagga2')
    quagga = module.default as unknown as QuaggaModule

    await new Promise<void>((resolve, reject) => {
      quagga?.init(
        {
          inputStream: {
            type: 'LiveStream',
            target: scannerTarget.value,
            constraints: {
              facingMode: 'environment'
            }
          },
          decoder: {
            readers: readerTypes
          }
        },
        (err?: Error) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }
      )
    })

    quagga.onDetected(logIt)
    quagga.start()
  } catch (error) {
    scannerError.value = 'Unable to access camera. Check permissions and HTTPS.'
    quagga = null
  } finally {
    isStarting.value = false
  }
}

const stopScanner = () => {
  if (!quagga) {
    return
  }

  quagga.offDetected(logIt)
  quagga.stop()
  quagga = null
}

const resetScan = () => {
  detected.value = ''
  scannedData.value = []
  startScanner()
}

watch(detected, () => {
  scannedData.value = []
})

onMounted(() => {
  startScanner()
})

onBeforeUnmount(() => {
  stopScanner()
})
</script>

<style scoped>
.scanner-wrapper {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.scanner-target {
  width: 100%;
  min-height: 360px;
  background: #111827;
  border-radius: 8px;
  overflow: hidden;
}

.status-message {
  margin-top: 0.75rem;
  color: #526488;
}

.error-message {
  margin-top: 0.75rem;
  color: #dc2626;
}
</style>
