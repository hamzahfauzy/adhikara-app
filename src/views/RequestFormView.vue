<template>
  <section class="page">
      <div class="eyebrow">Request Form</div>
      <h2 class="employee-name mb-4">Form pengajuan</h2>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
            <label for="identity" class="form-label">
                Jenis Pengajuan
            </label>

            <div class="input-gold">
                <select class="form-select" v-model="form.record_type">
                    <option value="leave">Izin/Cuti</option>
                    <option value="duty">Dinas Luar</option>
                </select>
            </div>
        </div>

        <div class="mb-3">
            <label for="start_date" class="form-label">
                Tanggal Awal
            </label>

            <div class="input-gold">
                <i class="bi bi-calendar"></i>
                <input type="date" v-model="form.start_date" id="start_date" name="start_date" class="form-control" placeholder="2020-01-01" required>
            </div>
        </div>

        <div class="mb-3">
            <label for="end_date" class="form-label">
                Tanggal Akhir
            </label>

            <div class="input-gold">
                <i class="bi bi-calendar"></i>
                <input type="date" v-model="form.end_date" id="end_date" name="end_date" class="form-control" placeholder="2020-01-01" required>
            </div>
        </div>

        <div class="mb-3">
            <label for="file" class="form-label">
                Berkas Pendukung
            </label>

            <div class="input-gold" role="button" onclick="file.click()">
                <i class="bi bi-file-earmark-pdf-fill"></i>
                <span class="ms-3" v-if="form.file" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">File dipilih: {{ form.file.name }}</span>
                <span class="ms-3" v-else>Pilih berkas...</span>
            </div>
        </div>
        
        <div class="mb-3">
            <label for="notes" class="form-label">
                Keterangan
            </label>

            <div class="input-gold">
                <textarea v-model="form.notes" id="notes" name="notes" class="form-control" rows="5" required style="height: auto;"></textarea>
            </div>
        </div>

        <!-- Login -->
        <button type="submit" class="btn btn-login w-100" id="loginButton">
            <span id="loginButtonText">Submit</span>
            <i class="bi bi-arrow-right ms-2"></i>
        </button>

        <input type="file" id="file" name="file" accept=".pdf,.jpg,.jpeg,.png" @change="handleFileChange" style="height: 0px;overflow: hidden;">

    </form>
  </section>
</template>
<script setup>
import { ref } from 'vue';
import api from '../service/api';
import { store } from '../store/store';

const form = ref({
    record_type: 'leave',
    start_date: '',
    end_date: '',
    notes: '',
    file: ''
})

const handleFileChange = (event) => {
    const file = event.target.files[0];

    form.value.file = file || null;
};

const submitForm = async () => {
    const formData = new FormData();

    formData.append('record_type', form.value.record_type);
    formData.append('start_date', form.value.start_date);
    formData.append('end_date', form.value.end_date);
    formData.append('notes', form.value.notes);

    if (form.value.file) {
        formData.append('file', form.value.file);
    }

    try {
        await api.post('/requests', formData);

        store.showToast('Pengajuan berhasil dikirim');

        form.value = {
            record_type: 'leave',
            start_date: '',
            end_date: '',
            notes: '',
            file: null
        };
    } catch (error) {
        store.showToast(error.message || 'Terjadi kesalahan', 'error');
    }
};
</script>
<style scoped>
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

.input-gold .form-select {
    min-width: 0;
    height: 52px;
    border: 0;
    background: transparent;
    box-shadow: none;
    color: #fff3dc;
    font-size: 14px;
    padding-left: 12px;
}

.input-gold .form-select option {
    color: #333333;
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
</style>