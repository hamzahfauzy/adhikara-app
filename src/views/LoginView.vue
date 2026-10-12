<template>
  <div class="login-page">
    <main class="login-card">

        <!-- LOGO PERUSAHAAN -->
        <header class="brand">
            <img src="/adhikara-nusa-perkasa.png" alt="Logo Adhikara Nusa Perkasa" class="brand-logo">
        </header>

        <!-- FORM LOGIN -->
        <section>
            <p class="welcome-description">
                Masuk ke portal layanan Adhikara Nusa Perkasa
            </p>

            <div id="loginAlert" class="alert d-none py-2 small" role="alert"></div>

            <form id="loginForm" @submit.prevent="handleLogin">

                <!-- Email / Nomor HP -->
                <div class="mb-3">
                    <label for="identity" class="form-label">
                        Email / Nomor HP
                    </label>

                    <div class="input-gold">
                        <i class="bi bi-envelope"></i>
                        <input type="text" v-model="identity" id="identity" name="identity" class="form-control" placeholder="Masukkan email atau nomor HP" autocomplete="username" required>
                    </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                    <label for="password" class="form-label">
                        Password
                    </label>

                    <div class="input-gold">
                        <i class="bi bi-lock"></i>

                        <input v-model="password" :type="isTogglePassword ? 'text' : 'password'" id="password" name="password" class="form-control" placeholder="Masukkan password" autocomplete="current-password" required>

                        <button type="button" id="togglePassword" class="password-toggle" aria-label="Tampilkan password" @click="togglePassword">
                            <i class="bi bi-eye" id="eyeIcon"></i>
                        </button>
                    </div>
                </div>

                <!-- Remember / Forgot -->
                <!-- <div class="d-flex justify-content-between align-items-center gap-2 mt-3 mb-4">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="remember" name="remember">
                        <label class="form-check-label" for="remember">
                            Ingat saya
                        </label>
                    </div>

                    <a href="/forgot-password" class="forgot-link">
                        Lupa password?
                    </a>
                </div> -->

                <!-- Login -->
                <button type="submit" class="btn btn-login w-100" id="loginButton">
                    <span id="loginButtonText">{{btnLoginLabel}}</span>
                    <i class="bi bi-arrow-right ms-2"></i>
                </button>

            </form>
        </section>

        <!-- FOOTER -->
        <footer class="login-footer">
            <div class="security-note">
                <div class="mb-2">
                    <i class="bi bi-shield-lock fs-4"></i>
                </div>

                Akses Aman &bull; Layanan Profesional
            </div>

            <div class="copyright">
                &copy; 2026 Adhikara Nusa Perkasa
            </div>
        </footer>

    </main>
</div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store/store';
import api from '../service/api.js';

const identity = ref('');
const password = ref('');
const isTogglePassword = ref(false)
const router = useRouter();
const isLoading = ref(false)
const btnLoginLabel = computed(() => isLoading.value ? 'Silahkan Tunggu...' : 'Masuk')


const handleLogin = async () => {
  if (!identity.value || !password.value) return

  isLoading.value = true
  try {
      const {data} = await api.post('/login', {
          username: identity.value,
          password: password.value,
      })
  
      store.token = data.data.token;
      store.user = data.data.employee
      localStorage.setItem('lp_token', store.token);
      store.showToast('Login berhasil!');
      isLoading.value = false
      router.push('/home');
      
  } catch (error) {

      console.error(error)
      isLoading.value = false
      store.showToast('Login gagal! ', 'error');
      
  }
};

const togglePassword = () => {
  isTogglePassword.value = !isTogglePassword.value
}
</script>
<style scoped>
:root {
    --gold: #d9a441;
    --gold-light: #f8d88a;
    --gold-dark: #96631b;
    --black: #090909;
    --text: #f3e8d0;
    --muted: #a7a29a;
}

* {
    box-sizing: border-box;
}

.login-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
}

/* Aksen sudut emas */
.login-page::before,
.login-page::after {
    content: "";
    position: absolute;
    width: 210px;
    height: 210px;
    border: 1px solid rgba(217, 164, 65, .4);
    border-radius: 50%;
    pointer-events: none;
}

.login-page::before {
    top: -140px;
    left: -100px;
    box-shadow:
        0 0 0 9px rgba(217,164,65,.05),
        0 0 0 18px rgba(217,164,65,.04);
}

.login-page::after {
    bottom: -150px;
    right: -100px;
    box-shadow:
        0 0 0 9px rgba(217,164,65,.05),
        0 0 0 18px rgba(217,164,65,.04);
}

.login-card {
    width: 100%;
    max-width: 440px;
    position: relative;
    z-index: 1;
    padding: 36px 30px;
    border: 1px solid rgba(217, 164, 65, .15);
    border-radius: 24px;
    background: rgba(12, 12, 11, .82);
    box-shadow: 0 25px 80px rgba(0, 0, 0, .4);
}

/* Brand */
.brand {
    text-align: center;
}

.brand-logo {
    width: 100%;
    max-width: 230px;
    max-height: 210px;
    object-fit: contain;
    display: block;
    margin: 0 auto 18px;
}

.brand-name {
    color: var(--gold-light);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 2px;
    margin: 0;
}

.brand-subtitle {
    color: var(--gold);
    font-size: 11px;
    letter-spacing: 3px;
    margin-top: 8px;
}

/* Welcome */
.welcome-title {
    color: var(--gold-light);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
}

.welcome-description {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
    text-align: center;
    margin-bottom: 28px;
}

/* Form */
.form-label {
    color: #e6d6b7;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
}

.input-gold {
    display: flex;
    align-items: center;
    min-height: 54px;
    border: 1px solid #514128;
    border-radius: 12px;
    background: rgba(255,255,255,.025);
    transition: border-color .2s, box-shadow .2s;
}

.input-gold:focus-within {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(217,164,65,.1);
}

.input-gold > i {
    color: var(--gold);
    font-size: 19px;
    padding-left: 16px;
}

.input-gold .form-control {
    min-width: 0;
    height: 52px;
    border: 0;
    background: transparent;
    box-shadow: none;
    color: #fff3dc;
    font-size: 14px;
    padding-left: 12px;
}

.input-gold .form-control::placeholder {
    color: #817d75;
}

.input-gold .form-control:focus {
    background: transparent;
    color: #fff3dc;
}

.password-toggle {
    align-self: stretch;
    padding: 0 16px;
    border: 0;
    background: transparent;
    color: var(--gold-light);
}

.password-toggle:hover {
    color: #fff;
}

.form-check-input {
    background-color: #16140f;
    border-color: #8b713f;
    cursor: pointer;
}

.form-check-input:checked {
    background-color: var(--gold-dark);
    border-color: var(--gold);
}

.form-check-label {
    color: #d1c6b1;
    font-size: 13px;
    cursor: pointer;
}

.forgot-link {
    color: var(--gold-light);
    font-size: 13px;
    text-decoration: none;
}

.forgot-link:hover {
    color: #fff;
    text-decoration: underline;
}

/* Primary button */
.btn-login {
    min-height: 54px;
    border: 1px solid #e7b958;
    border-radius: 12px;
    background: linear-gradient(
        135deg,
        #f5d68a 0%,
        #d5a03c 45%,
        #a97525 100%
    );
    color: #171006;
    font-size: 15px;
    font-weight: 750;
    box-shadow: 0 7px 24px rgba(177, 124, 37, .12);
    transition: transform .2s, filter .2s;
}

.btn-login:hover {
    color: #100c05;
    filter: brightness(1.08);
    transform: translateY(-1px);
}

.btn-login:disabled {
    opacity: .65;
    transform: none;
}

.divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 22px;
    color: #b2a58d;
    font-size: 12px;
    white-space: nowrap;
}

.divider::before,
.divider::after {
    content: "";
    height: 1px;
    flex: 1;
    background: linear-gradient(
        90deg,
        transparent,
        #8d692c
    );
}

.divider::after {
    transform: scaleX(-1);
}

.btn-contact {
    min-height: 50px;
    border: 1px solid var(--gold-dark);
    border-radius: 12px;
    background: transparent;
    color: var(--gold-light);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: background .2s;
}

.btn-contact:hover {
    background: rgba(217,164,65,.08);
    border-color: var(--gold);
    color: #fff;
}

/* Footer */
.security-note {
    text-align: center;
    color: #a99a7c;
    font-size: 12px;
    margin-top: 30px;
}

.security-note i {
    color: var(--gold);
    margin-right: 5px;
}

.copyright {
    color: #716b61;
    text-align: center;
    font-size: 11px;
    margin-top: 18px;
}

/* Mobile */
@media (max-width: 575.98px) {
    .login-page {
        align-items: stretch;
        padding: 0;
    }

    .login-card {
        max-width: none;
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        padding: max(28px, env(safe-area-inset-top))
                  24px
                  max(24px, env(safe-area-inset-bottom));
        border: 0;
        border-radius: 0;
        box-shadow: none;
        background: transparent;
    }

    .brand {
        margin-top: 12px;
    }

    .brand-logo {
        margin-bottom: 14px;
    }

    .brand-name {
        font-size: 23px;
    }

    .welcome-title {
        font-size: 28px;
    }

    .login-footer {
        margin-top: auto;
        padding-top: 34px;
    }
}

@media (max-height: 760px) and (max-width: 575.98px) {
    .brand {
        margin-top: 0;
    }

    .brand-logo {
        margin-bottom: 10px;
    }

    .welcome-title {
        font-size: 25px;
    }

    .welcome-description {
        margin-bottom: 20px;
    }

    .login-footer {
        padding-top: 24px;
    }
}
</style>