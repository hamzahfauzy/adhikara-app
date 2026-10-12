<template>
  <Transition name="modal-fade">
    <div
      v-if="store.modal.show"
      class="custom-modal-overlay"
      @click.self="store.closeModal()"
    >
      <Transition name="modal-slide" appear>
        <div
          v-if="store.modal.show"
          class="custom-modal-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="store.modal.type === 'logout'
            ? 'Konfirmasi Keluar'
            : 'Informasi Reward'"
        >
          <!-- LOGOUT -->
          <div
            v-if="store.modal.type === 'logout'"
            class="text-center"
          >
            <div
              class="modal-icon-circle bg-danger-subtle text-danger mx-auto mb-3"
            >
              <LogOut :size="24" />
            </div>

            <h5 class="fw-bold text-dark mb-2">
              Konfirmasi Keluar
            </h5>

            <p class="text-muted small mb-0">
              Apakah Anda yakin ingin keluar dari akun membership Anda?
            </p>

            <div class="d-flex gap-3 mt-4">
              <button
                type="button"
                class="btn btn-light text-secondary fw-semibold flex-fill py-2"
                @click="store.closeModal()"
              >
                Batal
              </button>

              <button
                type="button"
                class="btn btn-danger fw-semibold flex-fill py-2"
                @click="confirmLogout"
              >
                Keluar
              </button>
            </div>
          </div>

          <!-- REDEEM REQUEST -->
          <div
            v-else-if="store.modal.type === 'redeem_request'"
          >
            <div class="reward-image-wrapper mb-3">
              <img
                :src="store.modal.data?.Image"
                :alt="store.modal.data?.ProductName"
                class="reward-image"
              />
            </div>

            <h5 class="fw-bold text-dark mb-2">
              {{ store.modal.data?.ProductName }}
            </h5>

            <div class="d-flex align-items-center flex-wrap gap-2 my-2">
              <span class="fs-5 fw-bold text-brand">
                {{
                  store.modal.data?.PointRequired?.toLocaleString('id-ID')
                }}
                PTS
              </span>

              <span class="text-muted small">
                &bull; Available Stok:
                {{ store.modal.data?.StockAvailable }}
              </span>
            </div>

            <p class="text-muted small mb-4">
              {{ store.modal.data?.Description }}
            </p>

            <div class="terms-box mb-4">
              <h6
                class="fw-bold text-dark small text-uppercase mb-2"
              >
                Syarat &amp; Ketentuan
              </h6>

              <div
                class="terms-content small text-secondary"
                v-html="store.modal.data?.Terms"
              ></div>
            </div>

            <div class="d-flex gap-3">
              <button
                type="button"
                class="btn btn-light text-secondary fw-semibold flex-fill py-2"
                @click="store.closeModal()"
              >
                Tutup
              </button>

              <button
                type="button"
                class="btn btn-brand fw-semibold flex-fill py-2"
                @click="redeemReward(store.modal.data)"
              >
                Konfirmasi Tukar
              </button>
            </div>
          </div>

          <!-- REDEEM SUCCESS -->
          <div
            v-else-if="store.modal.type === 'redeem_success'"
            class="text-center py-2"
          >
            <div
              class="modal-icon-circle bg-success-subtle text-success mx-auto mb-4 success-icon"
            >
              <PartyPopper :size="32" />
            </div>

            <h4 class="fw-bold text-dark mb-2">
              Penukaran Berhasil! 🎉
            </h4>

            <p class="text-muted small">
              Voucher reward Anda telah berhasil diterbitkan.
            </p>

            <div class="voucher-code-box my-4 p-4 text-white rounded-4">
              <span class="d-block voucher-label text-uppercase">
                KODE VOUCHER REWARD
              </span>

              <span class="d-block voucher-code mt-2">
                {{ store.modal.data?.code }}
              </span>
            </div>

            <div class="d-flex gap-3">
              <button
                type="button"
                class="btn btn-light text-secondary fw-semibold py-3"
                @click="store.closeModal()"
              >
                Tutup
              </button>

              <button
                type="button"
                class="btn btn-brand fw-bold flex-fill py-3"
                @click="goToRedemptions"
              >
                Lihat Voucher Saya
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { LogOut, PartyPopper } from 'lucide-vue-next'
import { store } from '../store/store'
import api from '../service/api'

const router = useRouter()

const confirmLogout = async () => {
  try {
    const { data } = await api.post('/logout')

    if (data.status == 200) {
      localStorage.removeItem('lp_token')
      store.user = null
      store.token = null
      store.closeModal()
      store.showToast('Anda telah keluar.')
      router.push('/login')
    }
  } catch (error) {
    store.showToast(
      error?.response?.data?.Message || 'Gagal keluar dari akun.'
    )
  }
}
</script>

<style scoped>
/* BRAND */
.text-brand {
  color: #4dba87;
}

.btn-brand {
  background-color: #4dba87;
  border-color: #4dba87;
  color: #fff;
}

.btn-brand:hover,
.btn-brand:focus {
  background-color: #3ca574;
  border-color: #3ca574;
  color: #fff;
}

/* OVERLAY */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1055;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* MODAL */
.custom-modal-dialog {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  background: #fff;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

/* ICON */
.modal-icon-circle {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.success-icon {
  width: 64px;
  height: 64px;
}

/* REWARD IMAGE */
.reward-image-wrapper {
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 16px;
  background: #f8f9fa;
}

.reward-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* TERMS */
.terms-box {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.terms-content {
  overflow-wrap: anywhere;
}

.terms-content :deep(ul),
.terms-content :deep(ol) {
  padding-left: 20px;
  margin-bottom: 0;
}

.terms-content :deep(li + li) {
  margin-top: 4px;
}

.terms-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* VOUCHER */
.voucher-code-box {
  background: #0f172a;
}

.voucher-label {
  color: #94a3b8;
  font-size: 10px;
  letter-spacing: 2px;
}

.voucher-code {
  color: #fbbf24;
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 3px;
  overflow-wrap: anywhere;
}

/* FADE TRANSITION */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* SLIDE TRANSITION */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: transform 300ms ease;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(100%);
}

/* DESKTOP */
@media (min-width: 576px) {
  .custom-modal-overlay {
    align-items: center;
    padding: 16px;
  }

  .custom-modal-dialog {
    border-radius: 24px;
  }

  .modal-slide-enter-from,
  .modal-slide-leave-to {
    transform: translateY(16px);
  }
}

/* REDUCE MOTION */
@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-slide-enter-active,
  .modal-slide-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>