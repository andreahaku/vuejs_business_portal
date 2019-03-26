export const requestSplitterMixin = {
    methods: {
        splitterGet: function (StringRequest, ORArray, resolve, error, endresolve, enderror) {
            console.log("splitting request")
            if (ORArray.length > 0) {
                var avg = Math.ceil((ORArray[0].length + ORArray[Math.floor(ORArray.length / 2)].length + ORArray[ORArray.length - 1].length) / 3);
                console.log("Array length: " + ORArray.length + " Avg char: " + avg);
                var approxLength = ORArray.length * avg;
                var n_slots = Math.ceil(approxLength / 500);
                var mod = ORArray.length % n_slots;
                var milestone = Math.floor(ORArray.length / n_slots);
                var slots = [];
                var prev = 0;
                for (var i = 0; i < n_slots; i++) {
                    var offset = i == 0 ? mod : 1;
                    var next = milestone * (i + 1) + offset;
                    console.log(next)
                    slots.push(ORArray.slice(prev, next));
                    prev = next;
                }
                console.log(slots);
                var vm = this;
                var promises = [];
                for (var i = 0; i < slots.length; i++) {
                    console.log(slots[i])
                    promises.push(this.$http.get(StringRequest + slots[i].join(';')).then((response) => {
                        resolve(response);
                    }, (err) => {
                        error(err);
                    }))
                }
                Promise.all(promises).then((response) => {
                    endresolve(response);
                }, (err) => {
                    console.log(err)
                    if (enderror != null) {
                        enderror(err);
                    }
                })
            } else {
                enderror("ORArray empty");
            }
        }
    }
}