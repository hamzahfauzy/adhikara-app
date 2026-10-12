<template>
  <section class="page active" id="homePage">

      <div class="greeting">
          <div>
              <div class="eyebrow">Employee Portal</div>
              <h2 class="employee-name">
                  Halo, <span id="employeeName">{{firstName}}</span>
              </h2>
              <div class="employee-role">
                  <i class="bi bi-briefcase me-1"></i>
                  {{dashboardData.employee?.placement?.position}} - {{dashboardData.employee?.placement?.name}}
              </div>
          </div>

          <div class="avatar" id="employeeAvatar">{{userInitials}}</div>
      </div>

      <!-- WORK SCHEDULE -->
      <div class="card-dark">
          <div class="card-heading">
              <h3 class="section-title">Jadwal Kerja</h3>
              <span class="date-label" id="todayDate">Hari ini - {{ formatDate(dashboardData?.today) }}</span>
          </div>

          <div class="d-none justify-content-between align-items-center">
              <span class="muted small-text">Shift Reguler</span>
              <span class="small-text">
                  <i class="bi bi-clock me-1" style="color:var(--gold)"></i>
                  Senin - Jumat
              </span>
          </div>

          <div class="schedule-time">{{ time }}</div>
          <div class="schedule-caption d-none">
              Jam masuk &nbsp; • &nbsp; Jam pulang
          </div>

          <button v-if="!dashboardData.attendanceToday?.start_at || !dashboardData.attendanceToday?.end_at" class="btn-gold mt-4" id="checkInButton" type="button" @click="startSelfie">
              <i class="bi bi-geo-alt me-2"></i>
              <span id="checkInText">
                {{ presenceButtonLabel }}
              </span>
          </button>

          <div v-else class="text-center my-4">
            <span class="badge bg-success text-white">
                Sudah melakukan absensi
            </span>
          </div>

          <div class="text-center small-text muted mt-3"
                id="checkInInfo">
              <i class="bi bi-shield-check me-1"></i>
              Pastikan Anda berada di lokasi kerja
          </div>
      </div>

      <!-- QUICK MENU -->
      <div class="shortcut-grid">

          <router-link to="/presence" class="shortcut text-decoration-none">
              <i class="bi bi-calendar2-check"></i>
              <span>Kehadiran</span>
          </router-link>

          <router-link to="/request" class="shortcut text-decoration-none">
              <i class="bi bi-clock-history"></i>
              <span>Koreksi Absensi</span>
          </router-link>

          <router-link to="/request" class="shortcut text-decoration-none" type="button">
              <i class="bi bi-airplane"></i>
              <span>Perjalanan Dinas</span>
          </router-link>

          <router-link to="/request" class="shortcut text-decoration-none" type="button">
              <i class="bi bi-person-plus"></i>
              <span>Pengajuan Cuti</span>
          </router-link>

      </div>

      <!-- ATTENDANCE HISTORY -->
      <div class="card-heading">
          <h3 class="section-title">Riwayat Kehadiran</h3>
          <router-link to="/presence" class="text-link" type="button">
              Lihat Semua <i class="bi bi-arrow-right"></i>
          </router-link>
      </div>

      <div class="card-dark">

          <div class="attendance-row" v-for="attendance in dashboardData.attendances">
              <i class="bi bi-calendar-check location-icon"></i>

              <div>
                  <div class="attendance-date">{{formatDate(attendance.attendance_date)}}</div>
                  <!-- <div class="attendance-location">Kantor Pusat</div> -->
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

          <div class="attendance-row mt-0 pt-0" v-if="dashboardData.attendances.length == 0">
            <i>Tidak ada data</i>
          </div>
      </div>
  </section>

  <SelfieCamera ref="selfieCamera" @capture="submitSelfie" @error="handleCameraError" />
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { store } from '../store/store';
import api from '../service/api';
import SelfieCamera from '../components/SelfieCamera.vue';

const timer = ref(null)
const time = ref('')
const date = ref('')
const locationLoading = ref(false)
const selfieCamera = ref(null)
const currentLocation = ref(null)
const firstName = computed(() => store.user.name.split(' ')[0]);
const userInitials = computed(() => store.user?.name.split(' ').map(n => n[0]).join(''));
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

const dashboardData = ref({
    attendanceToday: {},
    attendances: [],
    employee: {},
    today: '2000-01-01'
})

const presenceButtonLabel = computed(() => {
    if(locationLoading.value) return 'Memvalidasi Lokasi...'
    return (dashboardData.value.attendanceToday?.start_at ? 'Check Out' : 'Check In') + ' Sekarang'
});

function updateClock() {
    const now = new Date()

    time.value = now.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
    }) + ' WIB'

    date.value = now.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

async function submitSelfie(image) {
  const camera = selfieCamera.value

  try {
    const response = await api.post('/attendances', {
        action: dashboardData.value.attendanceToday?.start_at ? 'check_out' : 'check_in',
        location: {
            lat: currentLocation.value.latitude,
            lng: currentLocation.value.longitude,
        },
        photo: image
    })

    const result = response.data

    // Tutup kamera hanya jika server menyatakan sukses
    camera?.finishCapture()

    console.log('Absensi berhasil:', result)

    store.showToast(result.message)

    init()
  } catch (error) {
    // Kamera tetap terbuka, loading dihentikan
    camera?.setSubmitting(false)

    console.error('Gagal mengirim absensi:', error)
    alert(error.message || 'Terjadi kesalahan saat mengirim absensi.')

    store.showToast(error.message  || 'Terjadi kesalahan saat mengirim absensi.', 'error')
  }
}

function handleCameraError(message) {
  console.error(message)
}

async function startSelfie() {
    if (locationLoading.value) return

    locationLoading.value = true

    try {
        await validateAttendanceLocation()

        // Kamera hanya dibuka jika lokasi valid
        selfieCamera.value?.openCamera()
    } catch (error) {
        store.showToast(error.message,'error');
    } finally {
        locationLoading.value = false
    }
}

async function init(){
    const {data} = await api.get('/home')
    dashboardData.value = data.data
}

onMounted( async () => {

    init()

    updateClock()

    timer.value = setInterval(() => {
      updateClock()
    }, 1000)
})

onBeforeMount( e => {
    clearInterval(timer.value)
})

// Menghitung jarak antara dua koordinat dalam meter
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000
    const toRadians = degree => degree * Math.PI / 180

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2

    return earthRadius * 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    )
}

// Mengambil lokasi dan memvalidasi radius
function validateAttendanceLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Browser tidak mendukung akses lokasi.'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude, accuracy } = position.coords

                const distance = calculateDistance(
                    latitude,
                    longitude,
                    parseFloat(dashboardData.value.employee?.placement.lat),
                    parseFloat(dashboardData.value.employee?.placement.lng)
                )

                currentLocation.value = {
                    latitude,
                    longitude,
                    accuracy,
                    distance: Math.round(distance)
                }

                if (distance > dashboardData.value.employee?.placement.radius) {
                    reject(new Error(
                        `Anda berada di luar radius absensi. ` +
                        `Jarak Anda sekitar ${Math.round(distance)} meter, ` +
                        `sedangkan radius yang diizinkan ${dashboardData.value.employee?.placement.radius} meter.`
                    ))
                    return
                }

                resolve(currentLocation.value)
            },
            error => {
                let message = 'Gagal mendapatkan lokasi Anda.'

                if (error.code === 1) {
                    message = 'Izin lokasi ditolak. Aktifkan izin lokasi untuk melanjutkan absensi.'
                } else if (error.code === 2) {
                    message = 'Lokasi tidak tersedia. Periksa GPS atau koneksi perangkat Anda.'
                } else if (error.code === 3) {
                    message = 'Pengambilan lokasi melewati batas waktu. Silakan coba lagi.'
                }

                reject(new Error(message))
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        )
    })
}
</script>