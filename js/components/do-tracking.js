// do-tracking.js
Vue.component('do-tracking', {
    template: '#tpl-do-tracking',
    props: ['trackingList', 'paketList', 'ekspedisiList'],
    data() {
        return {
            searchQuery: '',
            newDO: {
                nim: '', nama: '', ekspedisi: '', paketKode: '',
                tanggalKirim: new Date().toISOString().slice(0,10), total: 0
            },
            selectedPaketDetail: null,
            errors: {},
            newPerjalanan: {}
        };
    },
    computed: {
        filteredTrackingList() {
            if (!this.searchQuery) return this.trackingList;
            const q = this.searchQuery.toLowerCase();
            return this.trackingList.filter(t => t.nomorDO.toLowerCase().includes(q) || t.nim.includes(q));
        },
        lastNumber() {
            if (this.trackingList.length === 0) return 0;
            const last = this.trackingList[this.trackingList.length-1].nomorDO;
            const match = last.match(/\d+$/);
            return match ? parseInt(match[0]) : 0;
        },
        generatedDONumber() {
            const tahun = new Date().getFullYear();
            const nextSeq = this.lastNumber + 1;
            return `DO${tahun}-${nextSeq.toString().padStart(3,'0')}`;
        }
    },
    watch: {
        'newDO.paketKode'(kode) {
            const p = this.paketList.find(p => p.kode === kode);
            if (p) {
                this.newDO.total = p.harga;
                this.selectedPaketDetail = p;
            } else {
                this.newDO.total = 0;
                this.selectedPaketDetail = null;
            }
        }
    },
    methods: {
        formatRupiah(val) {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(val);
        },
        formatTanggal(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        },
        getPaketNama(kode) {
            const p = this.paketList.find(p => p.kode === kode);
            return p ? p.nama : kode;
        },
        resetSearch() {
            this.searchQuery = '';
        },
        search() {
            // already reactive via computed
        },
        resetForm() {
            this.newDO = {
                nim: '', nama: '', ekspedisi: this.ekspedisiList[0]?.kode || '',
                paketKode: '', tanggalKirim: new Date().toISOString().slice(0,10), total: 0
            };
            this.selectedPaketDetail = null;
            this.errors = {};
        },
        addTracking() {
            this.errors = {};
            if (!this.newDO.nim) this.errors.nim = 'NIM wajib';
            if (!this.newDO.nama) this.errors.nama = 'Nama wajib';
            if (!this.newDO.ekspedisi) this.errors.ekspedisi = 'Pilih ekspedisi';
            if (!this.newDO.paketKode) this.errors.paketKode = 'Pilih paket';
            if (!this.newDO.tanggalKirim) this.errors.tanggalKirim = 'Tanggal kirim wajib';
            if (Object.keys(this.errors).length) { alert('Lengkapi data'); return; }
            const newTrack = {
                nomorDO: this.generatedDONumber,
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                status: 'Diproses',
                ekspedisi: this.newDO.ekspedisi,
                tanggalKirim: this.newDO.tanggalKirim,
                paket: this.newDO.paketKode,
                total: this.newDO.total,
                perjalanan: [{ waktu: new Date().toLocaleString(), keterangan: 'Pesanan diterima' }]
            };
            this.trackingList.push(newTrack);
            alert(`DO ${newTrack.nomorDO} ditambahkan`);
            this.resetForm();
        },
        addPerjalanan(track) {
            const keterangan = this.newPerjalanan[track.nomorDO];
            if (!keterangan) { alert('Masukkan keterangan'); return; }
            if (!track.perjalanan) track.perjalanan = [];
            track.perjalanan.push({
                waktu: new Date().toLocaleString(),
                keterangan: keterangan
            });
            this.newPerjalanan[track.nomorDO] = '';
            alert('Riwayat ditambahkan');
        }
    }
});