export const handleDataMixin = {
    created: function () {
        this.fetchMessages();
    },
    watch: {
        items: function () {
            this.fetchMessages();
        }
    },
    methods: {
        fetchMessages: function (fakes) {
            var array = [];
            this.messages = null;
            if (this.items) {
                for (var i = 0; i < this.items.length; i++) {
                    array.push(this.fetchItem(this.items[i]));
                }
                this.messages = array;
            } else {
                this.initFakes();
            }
        },
        initFakes: function () {
            var fakes = []
            var c = this.$root.chance;
            for (var i = 0; i < 7; i++) {
                var gender = c.gender();
                var male = gender == "Female" ? false : true;
                var id = c.integer({ min: 1, max: 90 })
                var avatar = male ? 'https://randomuser.me/api/portraits/men/' + id + '.jpg' : 'https://randomuser.me/api/portraits/women/' + id + '.jpg'

                var mine = c.bool();

                fakes.push({
                    ID: i,
                    IDPersona: mine ? localStorage.getItem("idpersona") : i * 5,
                    Persona: mine ? localStorage.getItem("nomecognome") : c.name({ nationality: "it", gender: gender.toLowerCase() }),
                    Immagine: mine ? localStorage.getItem("userAvatar") : avatar,
                    DataInserimento: c.date({ string: true }),
                    Testo: c.paragraph({ sentences: male ? 1 : 2 })
                })
            }
            var array = [];
            console.log(JSON.stringify(fakes))
            for (var i = 0; i < fakes.length; i++) {
                array.push(this.fetchItem(fakes[i]));
            }
            this.messages = array;
        },
        messageAdded: function (message) {
            var vm = this;
            var callback = function (error, result) {
                if (error != null) {
                    console.log(error)
                } else {
                    vm.messages.push(result)
                    vm.$nextTick(function () {
                        $('#wrapped_chat').animate({
                            scrollTop: 9999
                        });
                    })
                    vm.new_message = null;
                }
            }
            this.$emit("insertMSG", { callback: callback, msg: message });

        }
    }
}