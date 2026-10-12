
<template>
  <!-- Layer kamera menutupi seluruh .app -->
  <div v-if="cameraOpen" class="camera-layer">

    <!-- Header kamera -->
    <header class="camera-header">
      <button
        type="button"
        class="icon-button"
        aria-label="Tutup kamera"
        @click="closeCamera"
        >
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
        </button>

      <h2>Ambil Selfie</h2>

      <div class="header-spacer"></div>
    </header>

    <!-- Preview kamera -->
    <div class="camera-viewport">
        <video
            ref="video"
            autoplay
            playsinline
            muted
            class="camera-video"
            :class="{ 'video-hidden': photo }"
        ></video>

        <!-- Hasil capture tetap berada di layer kamera -->
        <img
            v-if="photo"
            :src="photo"
            alt="Foto selfie"
            class="captured-preview"
        />

        <div v-if="!photo" class="face-guide"></div>

        <!-- Loading overlay -->
        <div v-if="submitting" class="capture-loading">
            <div class="loading-spinner"></div>
            <p>Mengirim foto...</p>
            <span>Mohon tunggu sebentar</span>
        </div>
    </div>

    <!-- Kontrol di atas kamera -->
    <div class="camera-bottom">
      <p class="camera-hint">
        Posisikan wajah Anda di tengah kamera
      </p>

      <div class="camera-actions">
        <button
            type="button"
            class="cancel-button"
            :disabled="submitting"
            @click="closeCamera"
        >
            Cancel
        </button>

        <button
            type="button"
            class="capture-button"
            :disabled="submitting"
            @click="photo ? retrySubmit() : takePhoto()"
        >
            <template v-if="submitting">
            Mengirim...
            </template>

            <template v-else-if="photo">
            Kirim Ulang
            </template>

            <template v-else>
            <span class="capture-icon"></span>
            Ambil Foto
            </template>
        </button>
        </div>
    </div>
  </div>

  <p v-if="error" class="error-message">
    {{ error }}
  </p>
</template>

<script>
export default {
  name: 'SelfieCamera',

  emits: ['capture', 'error'],

  data() {
    return {
        cameraOpen: false,
        stream: null,
        photo: null,
        error: '',
        submitting: false
    }
  },

  methods: {
    async openCamera() {
        // Reset foto dan error dari sesi sebelumnya
        this.photo = null
        this.error = ''
        this.submitting = false

        if (!navigator.mediaDevices?.getUserMedia) {
            this.error = 'Kamera tidak didukung. Gunakan HTTPS atau localhost.'
            this.$emit('error', this.error)
            return
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 1280 }
            }
            })

            this.cameraOpen = true

            await this.$nextTick()

            const video = this.$refs.video
            video.srcObject = this.stream

            await video.play()
        } catch (err) {
            this.stopCamera()

            if (err.name === 'NotAllowedError') {
            this.error = 'Izin kamera ditolak. Aktifkan izin kamera browser.'
            } else if (err.name === 'NotFoundError') {
            this.error = 'Kamera tidak ditemukan pada perangkat ini.'
            } else {
            this.error = 'Kamera gagal dibuka. Periksa izin dan perangkat kamera.'
            }

            this.$emit('error', this.error)
        }
        },

    takePhoto() {
        if (this.submitting) return

        const video = this.$refs.video

        if (!video || !video.videoWidth) {
            this.error = 'Kamera belum siap. Silakan coba lagi.'
            return
        }

        const canvas = document.createElement('canvas')

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const context = canvas.getContext('2d')

        context.translate(canvas.width, 0)
        context.scale(-1, 1)
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        this.photo = canvas.toDataURL('image/jpeg', 0.9)
        this.error = ''
        this.submitting = true

        // Langsung trigger POST melalui parent
        this.$emit('capture', this.photo)
    },

    retakePhoto() {
      this.photo = null
      this.openCamera()
    },

    confirmPhoto() {
      if (!this.photo) return

      this.$emit('capture', this.photo)
    },

    retrySubmit() {
        if (!this.photo || this.submitting) return

        this.error = ''
        this.submitting = true

        this.$emit('capture', this.photo)
    },

    setSubmitting(value) {
        this.submitting = value
    },

    finishCapture() {
        // Dipanggil hanya ketika POST sukses
        this.submitting = false
        this.photo = null
        this.closeCamera()
    },

    closeCamera() {
        // Jangan tutup kamera ketika request sedang berjalan
        if (this.submitting) return

        this.stopCamera()
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop())
            this.stream = null
        }

        if (this.$refs.video) {
            this.$refs.video.srcObject = null
        }

        this.cameraOpen = false
    },
  },

  beforeUnmount() {
    this.stopCamera()
  }
}
</script>

<style scoped>

/* Layer kamera memenuhi container .app */
.camera-layer {
  position: absolute;
  inset: 0;
  z-index: 9999;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-height: 100dvh;

  overflow: hidden;
  background: #090909;
  color: #fff;
}

/* Header */
.camera-header {
  position: relative;
  z-index: 2;

  flex-shrink: 0;
  min-height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding:
    calc(10px + env(safe-area-inset-top))
    16px
    10px;

  background: rgba(9, 9, 9, 0.9);
}

.camera-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.icon-button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;

  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 0;
  border-radius: 50%;
}

.close-icon {
  font-size: 30px;
  line-height: 1;
}

.header-spacer {
  width: 40px;
}

/* Area preview kamera */
.camera-viewport {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #171717;
}

.camera-video {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
  transform: scaleX(-1);
}

/* Panduan posisi wajah */
.face-guide {
  position: absolute;
  left: 50%;
  top: 45%;

  width: min(68vw, 280px);
  height: min(85vw, 350px);

  transform: translate(-50%, -50%);

  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 48%;

  pointer-events: none;
}

/* Panel tombol di bagian bawah */
.camera-bottom {
  position: relative;
  z-index: 2;
  flex-shrink: 0;

  padding: 16px 20px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));

  background: linear-gradient(
    to bottom,
    #151515,
    #090909
  );
}

.camera-hint {
  margin: 0 0 20px;
  text-align: center;
  color: #c4c4c4;
  font-size: 13px;
}

/* Tombol */
.camera-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.camera-actions button {
  flex: 1;
  min-height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  padding: 12px;
  border-radius: 999px;

  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-button {
  color: #fff;
  background: transparent;
  border: 1px solid #525252;
}

.capture-button {
  color: #090909;
  background: #fff;
  border: 1px solid #fff;
}

.capture-icon {
  width: 17px;
  height: 17px;
  display: inline-block;
  border: 3px solid currentColor;
  border-radius: 50%;
  outline: 1px solid currentColor;
  outline-offset: 2px;
}

.open-camera-button {
  padding: 12px 20px;
  color: #fff;
  background: #2563eb;
  border: 0;
  border-radius: 12px;
}

.photo-result {
  padding: 16px;
}

.photo-preview {
  display: block;
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 12px;
}

.error-message {
  color: #f87171;
  font-size: 13px;
}
.camera-video.video-hidden {
  visibility: hidden;
}

.captured-preview {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
  background: #090909;
}

.capture-loading {
  position: absolute;
  inset: 0;
  z-index: 5;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: #fff;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(3px);
}

.capture-loading p {
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 600;
}

.capture-loading span {
  color: #d4d4d4;
  font-size: 12px;
}

.loading-spinner {
  width: 38px;
  height: 38px;

  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;

  animation: camera-spin 0.8s linear infinite;
}

.camera-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes camera-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
