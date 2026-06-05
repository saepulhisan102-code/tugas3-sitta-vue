// stock-table.js
Vue.component('ba-stock-table', {
    template: '#tpl-stock-table',
    props: ['stokItems', 'upbjjList', 'kategoriList', 'trackingCount'],
    data() {
        return {
            filterUpbjj: '',
            filterKategori: '',
            filterReorderOnly: false,
            sortBy: '',
            sortAsc: true,
            showModal: false,
            isEditMode: false,
            editKode: null,
            formData: {
                kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '',
                harga: 0, qty: 0, safety: 0, catatanHTML: ''
            },
            errors: {},
            tooltipText: ''
        };
    },
    computed: {
        totalBahanAjar() {
            return this.stokItems.length;
        },
        totalStok() {
            return this.stokItems.reduce((sum, i) => sum + i.qty, 0);
        },
        perluReorder() {
            return this.stokItems.filter(i => i.qty <= i.safety).length;
        },
        totalDO() {
            return this.trackingCount || 0;
        },
        uniqueUpbjj() {
            return [...new Set(this.stokItems.map(i => i.upbjj))];
        },
        filteredKategoriOptions() {
            if (!this.filterUpbjj) return [...new Set(this.stokItems.map(i => i.kategori))];
            return [...new Set(this.stokItems.filter(i => i.upbjj === this.filterUpbjj).map(i => i.kategori))];
        },
        filteredAndSortedItems() {
            let result = [...this.stokItems];
            if (this.filterUpbjj) result = result.filter(i => i.upbjj === this.filterUpbjj);
            if (this.filterKategori) result = result.filter(i => i.kategori === this.filterKategori);
            if (this.filterReorderOnly) result = result.filter(i => i.qty <= i.safety);
            if (this.sortBy) {
                result.sort((a,b) => {
                    let valA = a[this.sortBy], valB = b[this.sortBy];
                    if (typeof valA === 'string') valA = valA.toLowerCase();
                    if (typeof valB === 'string') valB = valB.toLowerCase();
                    if (valA < valB) return this.sortAsc ? -1 : 1;
                    if (valA > valB) return this.sortAsc ? 1 : -1;
                    return 0;
                });
            }
            return result;
        }
    },
    watch: {
        filterUpbjj() { this.filterKategori = ''; }
    },
    methods: {
        getStatus(qty, safety) {
            if (qty === 0) return { text: 'Kosong', class: 'status-kosong' };
            if (qty < safety) return { text: 'Menipis', class: 'status-menipis' };
            return { text: 'Aman', class: 'status-aman' };
        },
        formatRupiah(val) {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(val);
        },
        resetFilters() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterReorderOnly = false;
            this.sortBy = '';
            this.sortAsc = true;
        },
        setSort(field) {
            if (this.sortBy === field) this.sortAsc = !this.sortAsc;
            else { this.sortBy = field; this.sortAsc = true; }
        },
        openAddModal() {
            this.isEditMode = false;
            this.editKode = null;
            this.formData = {
                kode: '', judul: '', kategori: this.kategoriList[0] || '', upbjj: this.filterUpbjj || (this.upbjjList[0] || ''),
                lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
            };
            this.errors = {};
            this.showModal = true;
        },
        openEditModal(item) {
            this.isEditMode = true;
            this.editKode = item.kode;
            this.formData = { ...item };
            this.errors = {};
            this.showModal = true;
        },
        saveItem() {
            this.errors = {};
            if (!this.formData.kode) this.errors.kode = 'Kode wajib';
            if (!this.formData.judul) this.errors.judul = 'Judul wajib';
            if (!this.formData.kategori) this.errors.kategori = 'Kategori wajib';
            if (!this.formData.upbjj) this.errors.upbjj = 'UPBJJ wajib';
            if (this.formData.harga <= 0) this.errors.harga = 'Harga > 0';
            if (this.formData.qty < 0) this.errors.qty = 'Stok tidak negatif';
            if (this.formData.safety < 0) this.errors.safety = 'Safety tidak negatif';
            if (Object.keys(this.errors).length) { alert('Perbaiki error'); return; }
            if (this.isEditMode) {
                const index = this.stokItems.findIndex(i => i.kode === this.editKode);
                if (index !== -1) {
                    Vue.set(this.stokItems, index, { ...this.formData });
                    alert('Data diupdate');
                }
            } else {
                if (this.stokItems.find(i => i.kode === this.formData.kode)) {
                    alert('Kode sudah ada');
                    return;
                }
                this.stokItems.push({ ...this.formData });
                alert('Data ditambahkan');
            }
            this.showModal = false;
        },
        deleteItem(item) {
            if (confirm('Yakin hapus?')) {
                const index = this.stokItems.findIndex(i => i.kode === item.kode);
                if (index !== -1) this.stokItems.splice(index, 1);
                alert('Data dihapus');
            }
        },
        closeModal() { this.showModal = false; }
    }
});