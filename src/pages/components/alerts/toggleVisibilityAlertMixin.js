export const toggleVisibility = {
    props: {
        show: {
            type: Boolean
        }
    },
    data: function () {
        return {
            datashow: this.show,
            toggleTrans: false
        }
    },
    watch: {
        show: function () {
            this.datashow = this.show;
            var vm = this;
            setTimeout(function () {
                vm.toggleTrans = vm.datashow;
            }, 100)
            //EMULO UN METODO ASTRATTO
            if (this.toggled != null) {
                this.toggled()
            }
        }
    },
    methods: {
        close: function () {
            this.datashow = false;
            this.$emit('closed');
        }
    }
}