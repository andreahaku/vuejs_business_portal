export const updateCvTokenMixin = {
    data: function () {
        return {
            doneUpdating: false
        }
    },
    watch: {
        updating: function () {
            var waiting = 2000;
            if (this.err) { waiting = 5000; }
            if (!this.updating) {
                this.doneUpdating = true;
                var vm = this;
                setTimeout(function () {
                    vm.doneUpdating = false;
                }, waiting);
            }
        }
    }
}