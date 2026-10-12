<template>
    <section class="page" id="attendancePage">
        <div class="eyebrow">Employee Services</div>
        <h2 class="employee-name mb-2">Kehadiran</h2>
        <p class="muted small-text mb-4">
            Ringkasan kehadiran karyawan.
        </p>

        <div class="card-dark">
            <div class="card-heading">
                <h3 class="section-title">Hari Ini</h3>
                <span class="status status-awaiting">{{formatDate(dashboardData.today)}}</span>
            </div>

            <div class="attendance-row">
                <i class="bi bi-box-arrow-in-right location-icon"></i>
                <div>
                    <div class="attendance-date">Check In</div>
                    <div class="attendance-location">Kehadiran masuk</div>
                </div>
                <div class="ms-auto fw-bold" id="attendancePageIn">{{ dashboardData.attendanceToday?.start_at ? formatTime(dashboardData.attendanceToday?.start_at) : '-' }}</div>
            </div>

            <div class="attendance-row">
                <i class="bi bi-box-arrow-right location-icon"></i>
                <div>
                    <div class="attendance-date">Check Out</div>
                    <div class="attendance-location">Kehadiran pulang</div>
                </div>
                <div class="ms-auto fw-bold" id="attendancePageOut">{{ dashboardData.attendanceToday?.end_at ? formatTime(dashboardData.attendanceToday?.end_at) : '-' }}</div>
            </div>

            <!-- <button class="btn-outline-gold w-100 mt-3">
                <i class="bi bi-pencil-square me-2"></i>
                Ajukan Koreksi Absensi
            </button> -->
        </div>

        <h3 class="section-title mb-3">Riwayat</h3>

        <div class="card-dark">
            <div class="attendance-row" v-for="attendance in attendances">
                <i class="bi bi-calendar-check location-icon"></i>
                <div>
                    <div class="attendance-date">{{formatDate(attendance.attendance_date)}}</div>
                    <div class="attendance-location">{{recordType[attendance.record_type]}}</div>
                </div>
                <div class="attendance-times">
                    <div>
                        <div class="time-label">Check In</div>
                        <div class="time-value" id="todayIn">{{formatTime(attendance.start_at)}}</div>
                    </div>
                    <div>
                        <div class="time-label">Check Out</div>
                        <div class="time-value" id="todayOut">{{attendance.end_at ? formatTime(attendance.end_at) : '--:--'}}</div>
                    </div>
                </div>
            </div>

            <div class="attendance-row mt-0 pt-0" v-if="attendances.length == 0">
                <i>Tidak ada data</i>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../service/api';

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num);
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
    presence: 'Kehadiran',
    leave: 'Izin/Cuti',
    duty: 'Dinas Luar'
}

const attendances = ref([])
const dashboardData = ref({
    attendanceToday: {}
})

async function init(){
    const {data} = await api.get('/attendances')
    attendances.value = data.data
    
    const request = await api.get('/home')
    dashboardData.value = request.data.data
}

onMounted( async () => {
    init()
})
</script>