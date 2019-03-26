export const ruoliUoMixin = {
    mounted: function () {
        this.getUO();
        this.getRuoli();
    },
    data: function () {
        return {
            uo: [],
            ruoli: []
        }
    },
    methods: {
        getUO: function () {
            this.uo.push({
                id: 0,
                nome: 'TUTTE'
            });
            this.uo.push({
                id: 1,
                nome: 'DIVISIONE VENDITA E MARKETING'
            });
            this.uo.push({
                id: 2,
                nome: 'DIVISIONE INFORMATICA'
            });
            this.uo.push({
                id: 3,
                nome: 'DIVISIONE GRANDI IMPIANTI'
            });
            this.uo.push({
                id: 4,
                nome: 'SERVIZIO CONTABILE  E AMMINISTRATIVO'
            });
        },
        getRuoli: function () {
            this.ruoli.push({
                id: 0,
                idUo: 0,
                nome: 'TUTTI'
            })
            this.ruoli.push({
                id: 1,
                idUo: 1,
                nome: 'SPECIALISTA ANALISI DI MARKETING'
            })
            this.ruoli.push({
                id: 2,
                idUo: 1,
                nome: 'ADDETTO SERVIZI COMMERCIALI'
            })
            this.ruoli.push({
                id: 3,
                idUo: 1,
                nome: 'PROGRAMMATORE'
            })
            this.ruoli.push({
                id: 4,
                idUo: 1,
                nome: 'PROJECT LEADER'
            })
            this.ruoli.push({
                id: 5,
                idUo: 1,
                nome: 'SISTEMISTA E DATABASE ADMINISTRATOR'
            })
            this.ruoli.push({
                id: 6,
                idUo: 1,
                nome: 'SECURITY ANALYST'
            })
            this.ruoli.push({
                id: 7,
                idUo: 2,
                nome: 'ADDETTO MANUTENZIONE'
            })
            this.ruoli.push({
                id: 8,
                idUo: 2,
                nome: 'OPERATORE IMPIANTI GAS'
            })
            this.ruoli.push({
                id: 9,
                idUo: 3,
                nome: "SPECIALISTA CONTABILITA' GENERALE"
            })
            this.ruoli.push({
                id: 10,
                idUo: 3,
                nome: 'SPECIALISTA BILANCIO'
            })
        }
    }
}