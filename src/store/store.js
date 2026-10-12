import { reactive } from 'vue';

export const store = reactive({
  token: localStorage.getItem('lp_token') || null,
  user: null,
//   user: {
//     id: "USR001",
//     memberId: "MBR-00001234",
//     name: "Hamzah Fauzy",
//     email: "hamzah@example.com",
//     phone: "+628123456789",
//     membershipLevel: "Gold",
//     points: 12580,
//     pendingPoints: 1200,
//     redeemedPoints: 8500,
//     joinedAt: "2026-01-12"
//   },
  transactions: [
    { id: "TX101", title: "Pembelian Kopi Arabica", type: "earned", points: 500, date: "18 Sep 2026" },
    { id: "TX102", title: "Bonus Ulang Tahun Member", type: "earned", points: 250, date: "17 Sep 2026" },
    { id: "TX103", title: "Redeem Free Coffee", type: "redeemed", points: -1000, date: "15 Sep 2026" },
    { id: "TX104", title: "Belanja Minimarket #882", type: "earned", points: 1500, date: "12 Sep 2026" },
    { id: "TX105", title: "Redeem Voucher Rp50.000", type: "redeemed", points: -5000, date: "10 Sep 2026" }
  ],
  rewards: [
    { id: "REW01", name: "Free Signature Coffee", category: "Food", pointsRequired: 1000, stock: 124, description: "Nikmati 1 cangkir Kopi Signature gratis.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80", terms: ["Berlaku 1x penukaran", "Tidak dapat ditukar uang tunai", "Berlaku s/d 31 Des 2026"], },
    { id: "REW02", name: "Voucher Belanja Rp 50.000", category: "Voucher", pointsRequired: 5000, stock: 45, description: "Voucher diskon belanja senilai Rp50.000.", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80", terms: ["Hanya untuk 1x transaksi", "Tidak ada refund poin"], },
    { id: "REW03", name: "Merchandise Tumbler Eksklusif", category: "Exclusive", pointsRequired: 8500, stock: 12, description: "Tumbler stainless steel edisi terbatas.", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", terms: ["Diambil langsung di outlet cabang utama", "Selama persediaan masih ada"], }
  ],
  redemptions: [
    { id: "RED001", rewardName: "Free Signature Coffee", points: 1000, code: "HTD-8F29KX", redeemedAt: "18 Sep 2026", status: "Active" }
  ],
  notifications: [],
    //     {id: 1, title: 'Notification 1', date: '2026-01-01', validFrom: '2026-01-01', validUntil: '2026-12-31', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', description: 'Lorem ipsum dolor sit amet.'},
    //     {id: 2, title: 'Notification 2', date: '2026-01-01', validFrom: '2026-01-01', validUntil: '2026-12-31', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', description: 'Lorem ipsum dolor sit amet.'},
    //     {id: 3, title: 'Notification 3', date: '2026-01-01', validFrom: '2026-01-01', validUntil: '2026-12-31', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', description: 'Lorem ipsum dolor sit amet.'},
    //     {id: 4, title: 'Notification 4', date: '2026-01-01', validFrom: '2026-01-01', validUntil: '2026-12-31', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', description: 'Lorem ipsum dolor sit amet.'},
    // ],
  toast: { show: false, message: '', type: 'success' },
  modal: { show: false, type: '', data: null },

  showToast(msg, type = 'success') {
    this.toast.message = msg;
    this.toast.type = type;
    this.toast.show = true;
    setTimeout(() => { this.toast.show = false; }, 3000);
  },
  openModal(type, data = null) {
    this.modal.type = type;
    this.modal.data = data;
    this.modal.show = true;
  },
  closeModal() {
    this.modal.show = false;
  }
});
