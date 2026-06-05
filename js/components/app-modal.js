// app-modal.js
Vue.component('app-modal', {
    template: '#tpl-app-modal',
    props: ['visible'],
    methods: {
        close() {
            this.$emit('close');
        }
    }
});