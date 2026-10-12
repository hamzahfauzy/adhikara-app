<template>
    <section class="page" id="requestPage">

        <div class="mb-4">
            <div class="eyebrow">Employee Services</div>
            <h2 class="employee-name">Daftar Request</h2>
            <p class="muted small-text mt-2 mb-0">
                Pantau status pengajuan Anda di sini.
            </p>
        </div>

        <!-- SUMMARY -->
        <div class="row g-2 mb-4">
            <div class="col-4">
                <div class="card-dark mb-0 p-3">
                    <div class="muted small-text">Menunggu</div>
                    <div class="fs-4 fw-bold mt-1" style="color:var(--gold-light)"
                            id="awaitingCount">{{ requestDataStatistic.pending ?? 0 }}</div>
                </div>
            </div>

            <div class="col-4">
                <div class="card-dark mb-0 p-3">
                    <div class="muted small-text">Disetujui</div>
                    <div class="fs-4 fw-bold mt-1" style="color:var(--green)"
                            id="approvedCount">{{ requestDataStatistic.approved ?? 0 }}</div>
                </div>
            </div>

            <div class="col-4">
                <div class="card-dark mb-0 p-3">
                    <div class="muted small-text">Ditolak</div>
                    <div class="fs-4 fw-bold mt-1" style="color:var(--red)"
                            id="rejectedCount">{{ requestDataStatistic.rejected ?? 0 }}</div>
                </div>
            </div>
        </div>

        <!-- FILTER TYPE -->
        <div class="filter-scroll" id="typeFilters">
            <button class="filter-chip" :class="{'active': requestDataFilter.record_type == 'all'}" data-type="all" @click="requestDataFilter.record_type = 'all'">Semua</button>
            <button class="filter-chip" :class="{'active': requestDataFilter.record_type == 'attendance'}" data-type="attendance" @click="requestDataFilter.record_type = 'attendance'">Koreksi Absensi</button>
            <button class="filter-chip" :class="{'active': requestDataFilter.record_type == 'leave'}" data-type="leave" @click="requestDataFilter.record_type = 'leave'">Cuti</button>
            <button class="filter-chip" :class="{'active': requestDataFilter.record_type == 'duty'}" data-type="duty" @click="requestDataFilter.record_type = 'duty'">Dinas</button>
        </div>

        <!-- FILTER STATUS -->
        <div class="d-flex align-items-center mb-3">
            <i class="bi bi-funnel" style="color:var(--gold)"></i>

            <div class="ps-2 w-100">
                <select class="form-select" v-model="requestDataFilter.status" id="statusFilter" style="background:#17140f;color:var(--text);border-color:var(--border)">
                    <option value="all">Semua Status</option>
                    <option value="pending">Diajukan</option>
                    <option value="awaiting">Menunggu Persetujuan</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                </select>
            </div>

            <span class="ms-auto muted small-text" id="resultCount"></span>
        </div>

        <!-- REQUEST ITEMS -->
        <div id="requestList">

            <article class="request-card" data-type="attendance" data-status="awaiting" v-for="request in requestData">
                <div class="request-header">
                    <div>
                        <div class="request-title">{{recordType[request.record_type]}}</div>
                    </div>
                    <div class="request-date">{{formatDate(request.created_at)}} {{formatTime(request.created_at)}}</div>
                </div>

                <div class="request-description">
                    Tanggal: {{formatDate(request.start_at)}} {{ request.end_at && request.end_at != request.start_at ? ' - ' + formatDate(request.end_at) : '' }}<br>
                    Keterangan: {{request.notes}}
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3">
                    <span class="muted small-text">{{statusOption[request.status]}}</span>
                    <span class="status text-capitalize" :class="'status-'+request.status">{{request.status}}</span>
                </div>
            </article>
        </div>

        <div v-if="requestData.length == 0" class="text-center my-4">
            <i class="bi bi-inbox"></i>
            Tidak ada request yang sesuai filter.
        </div>

        <router-link type="button" class="btn-gold mt-2 text-decoration-none text-center" to="/request/create">
            <i class="bi bi-plus-lg me-2"></i>
            Buat Request Baru
        </router-link>

    </section>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '../service/api';

const requestDataFilter = ref({
    record_type: 'all',
    status: 'all'
})
const requestData = ref([])
const requestDataStatistic = ref({})

async function init(){
    const queryString = new URLSearchParams(requestDataFilter.value).toString();
    const {data} = await api.get('/requests?' + queryString)
    requestData.value = data.data

    const request = await api.get('/requests/statistic')
    requestDataStatistic.value = request.data.data
}

const formatDate = (givenDate) => {
    const date = new Date(givenDate);
    return date.toLocaleDateString()
}

const formatTime = (givenDate) => {
    const date = new Date(givenDate);
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const recordType = {
    attendance: 'Kehadiran',
    leave: 'Izin/Cuti',
    duty: 'Dinas Luar'
}

const statusOption = {
    pending: 'Diajukan',
    awaiting: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak'
}

watch(
    requestDataFilter,
    () => {
        init();
    },
    { deep: true }
);

onMounted(async e => {
    init()
})
</script>