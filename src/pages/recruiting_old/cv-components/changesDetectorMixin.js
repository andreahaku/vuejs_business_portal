export const changesDetectorMixin = {
    data: function () {
        return {
            listeningEnabled: false,
            unsavedChanges: false
        }
    },
    computed: {
        unsavedToken: function () {
            if (this.unsavedChanges || !this.listeningEnabled) {
                return true;
            } else {
                return false;
            }
        }
    }
}