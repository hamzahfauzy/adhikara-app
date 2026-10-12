import { ref, onMounted, onBeforeUnmount } from 'vue'

const deferredPrompt = ref(null)
const canInstall = ref(false)

export function usePwaInstall() {

    const handleBeforeInstallPrompt = (event) => {
        console.log('PWA install prompt ready')

        event.preventDefault()

        deferredPrompt.value = event
        canInstall.value = true
    }

    const install = async () => {
        if (!deferredPrompt.value) {
            console.log('Install prompt tidak tersedia')
            return
        }

        console.log('Menampilkan install prompt')

        await deferredPrompt.value.prompt()

        const { outcome } = await deferredPrompt.value.userChoice

        console.log('Install result:', outcome)

        deferredPrompt.value = null
        canInstall.value = false
    }

    const handleAppInstalled = () => {
        console.log('PWA berhasil diinstall')

        deferredPrompt.value = null
        canInstall.value = false
    }

    onMounted(() => {
        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        )

        window.addEventListener(
            'appinstalled',
            handleAppInstalled
        )
    })

    onBeforeUnmount(() => {
        window.removeEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        )

        window.removeEventListener(
            'appinstalled',
            handleAppInstalled
        )
    })

    return {
        canInstall,
        install
    }
}