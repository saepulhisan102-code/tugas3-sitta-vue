// app.js
new Vue({
    el: '#app',
    data: {
        activeTab: 'stock',
        upbjjList: [],
        kategoriList: [],
        pengirimanList: [],
        paketList: [],
        stokItems: [],
        trackingList: []
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async loadData() {
            const data = await API.fetchData();
            if (data) {
                this.upbjjList = data.upbjjList;
                this.kategoriList = data.kategoriList;
                this.pengirimanList = data.pengirimanList;
                this.paketList = data.paket;
                this.stokItems = data.stok;
                this.trackingList = data.tracking;
            }
        },
        setTab(tab) {
            this.activeTab = tab;
        }
    }
});