// api.js
const API = {
    async fetchData() {
        try {
            const response = await fetch('data/dataBahanAjar.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Gagal memuat data:', error);
            return null;
        }
    }
};