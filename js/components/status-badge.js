// status-badge.js
Vue.component('status-badge', {
    props: ['status'],
    template: '#tpl-status-badge',
    computed: {
        statusClass() {
            if (this.status === 'Aman') return 'status-aman';
            if (this.status === 'Menipis') return 'status-menipis';
            if (this.status === 'Kosong') return 'status-kosong';
            return '';
        },
        statusText() {
            return this.status;
        }
    }
});