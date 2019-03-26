<template>
    <div>
        <sidejsonly :default="true"></sidejsonly>
        <div class="st-pusher" id="content">
            <div class="st-content">
                <div class="st-content-inner padding-none">
                    <div class="container-fluid">
                        <br>
                        <div class="row">
                            <div class="item col-xs-6">
                                <h5 class="text-headline" style="margin-top:2px;">Lista Competenze</h5>
                                <div class="panel panel-default">
                                    <div class="panel-body">
                                        <div class="form-group form-control-material">
                                            <input id="filtracorso" type="text" class="form-control" placeholder="parole chiave da cercare" v-model="filtro" @blur="filterOut_filtro()" />
                                            <label for="filtracorso" :class="{condati: labelout_filtro}">Filtra</label>
                                        </div>
                                        <div class="pull-right">
                                            <button class="btn btn-primary btn-sm reset" @click="cancellaFiltro()">Cancella Filtro</button>
                                            <button class="btn btn-primary btn-sm reset" @click="resetFilter()">Reset Selezione</button>
                                        </div>
                                    </div>
                                    <!-- 
                                    <div class="panel panel-default paper-shadow listacompetenze">
                                        <ul class="list-group">
                                            <li v-for="(skill,i) in skills" class="list-group-item media v-middle sk" v-if="skill.nome.toLowerCase().indexOf(filtro.toLowerCase()) != -1">
                                                <div class="col-xs-12" @click="generaLista(skill.idseq)">
                                                    {{skill.nome}} <span class="badge skpeople" v-if="skill.contatore > 0">{{skill.contatore}}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                     -->
                                </div>
                                <div class="panel panel-default paper-shadow listacompetenze">
                                    <ul class="list-group">
                                        <li v-for="(skill,i) in skills" class="list-group-item media v-middle sk" v-if="skill.nome.toLowerCase().indexOf(filtro.toLowerCase()) != -1 && skill.selezionato == false" :class="{selezionato: skill.selezionato}" style="padding-left: 0px;">
                                            <div class="col-xs-12">
                                                <i class="fa fa-plus-circle iconask" @click="skill.selezionato = !skill.selezionato; generaLista(skill.idseq);"></i> {{skill.nome}} <span class="badge skpeople" v-if="skill.contatore > 0">{{skill.contatore}}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div v-if="skill_selezionate.length > 0" class="item col-xs-6">
                                <div class="panel panel-default paper-shadow listacompetenze_selezionate">
                                    <ul class="list-group">
                                        <li v-for="(skill,i) in skills" class="list-group-item media v-middle sk" v-if="skill.selezionato == true" :class="{selezionato: skill.selezionato}" style="padding-left: 0px;">
                                            <div class="col-xs-12">
                                                <i class="fa fa-minus-circle iconask" @click="skill.selezionato = !skill.selezionato; generaLista(skill.idseq);"></i> {{skill.nome}} <span class="badge skpeople" v-if="skill.contatore > 0">{{skill.contatore}}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div v-if="listaFiltrata.length > 0" class="item col-xs-6">
                                <!-- 
                                <h6 class="text-headline" style="margin-top:2px;">{{skills[skill_selezionata].nome}}</h6>
                             -->
                                <div class="panel panel-default">
                                    <div class="panel panel-default paper-shadow listapersone">
                                        <ul class="list-group">
                                            <li v-for="(persona,i) in listaFiltrata" class="list-group-item media v-middle v-middle-skill" :key="i">
                                                <span class="badge badge-right">{{persona.livello_skill}}</span>
                                                <div class="media-left avt" data-toggle="collapse" :data-target="'#listaskill_'+i" aria-expanded="false" :aria-controls="'listaskill_'+i" @click="chiudiAltriCollapse()">
                                                    <img :src="persona.avatar" class="img-circle width-70" />
                                                    <span v-if="persona.preferito" class="prefer fa fa-fw fa-2x fa-star text-yellow-800 m1" @click.prevent="togglePreferito(persona.id)"></span>
                                                    <span v-if="!persona.preferito" class="prefer fa fa-fw fa-2x fa-star-o text-yellow-800 m1" @click.prevent="togglePreferito(persona.id)"></span>
                                                </div>
                                                <div class="media-body ">
                                                    <span class="cnom ">{{persona.cognome}} {{persona.nome}}</span>
                                                    <span class="cuo ">UO: {{uo[persona.uo].nome}}</span>
                                                    <span class="cruolo ">Ruolo: {{ruoli[persona.ruolo].nome}}</span>
                                                    <hr class="linea ">
                                                    <span class="cemail ">E-Mail: <a :href=" 'mailto://'+persona.email ">{{persona.email}}</a></span>
                                                    <span class="ctel ">Tel: <a :href=" 'tel://'+persona.telefono ">{{persona.telefono}}</a></span>
                                                </div>
                                                <div :id="'listaskill_'+i" class="collapse panel panel-default paper-shadow" style="margin-top:10px;">
                                                    <ul class="list-group">
                                                        <li v-for="sk in persona.skills" class="list-group-item sk" :class="{active: skill_selezionate.indexOf(sk.id) != -1}">
                                                            {{skills[sk.id].nome}} <span class="badge sklivello">{{sk.livello}}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <br>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="item col-xs-6">
                                <div class="panel panel-default">
                                    <h5 class="text-headline" style="margin-top:7px;margin-left: 10px;">Nessun Risultato</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import sidejsonly from '../../components/side-default-jsonly.vue'
import paginazione from '../../components/paginazione.vue'

import {
    ruoliUoMixin
} from '../../components/ruoliUoMixin.js'

import {
    eventBus
} from '../../../eventbus.js'

var competenze = [{
    ID: 2299,
    nome: "Adempimenti amministrativi per la raccolta dei rifiuti speciali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2430,
    nome: "Adempimenti della segreteria del CdA Holding ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2429,
    nome: "Adempimenti societari di carattere ordinario ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2248,
    nome: "Ambiente e territorio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2336,
    nome: "Analisi di bilancio civilistico e tecniche di riclassificazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2337,
    nome: "Analisi di bilancio consolidato e tecniche di consolidamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2188,
    nome: "Andamento dei consumi di energia ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2231,
    nome: "Apparecchiature di laboratorio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41902,
    nome: "Architettura di veicolo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2249,
    nome: "Architetture e dimensionamento impianti ed opere ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2455,
    nome: "Architetture e piattaforme informatiche ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2212,
    nome: "Aspetti tecnico economici dell’offerta ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2246,
    nome: "Automazione e controllo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2377,
    nome: "Budget e costo del lavoro ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2330,
    nome: "Business Planning ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2225,
    nome: "Canali di finanziamento per la ricerca ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2204,
    nome: "Canali distributivi diretti ed indiretti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2407,
    nome: "Caratteristiche del prodotto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2448,
    nome: "Caratteristiche dell’interazione tra impianto, ambiente e territorio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2223,
    nome: "Caratteristiche funzionali e problematiche di funzionamento di impianti e reti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2449,
    nome: "Caratterizzazione biologica/idrogeologica/Paesaggistica del territorio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2440,
    nome: "Certificazionidi prodotto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2439,
    nome: "Certificazionidi sistema ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2247,
    nome: "Chimica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2235,
    nome: "Chimica e microbiologia applicate alle analisi ambientali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41903,
    nome: "Ciclo di produzione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2491,
    nome: "Ciclo logistico integrato ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2296,
    nome: "Codice della strada e regolamenti applicativi comunali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2301,
    nome: "Codificazione dei rifiuti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 34468,
    nome: "Come si veste ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 26828,
    nome: "Comportamento organizzativo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 15271,
    nome: "Comunicazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2210,
    nome: "Comunicazione telefonica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 42013,
    nome: "Conoscenza SAP modulo MM 1 ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 42014,
    nome: "Conoscenza SAP modulo MM 2 ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 42015,
    nome: "Conoscenza SAP modulo MM 3 ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 42016,
    nome: "Conoscenza SAP modulo MM 4 ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 42017,
    nome: "Conoscenza SAP modulo MM 5 ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41904,
    nome: "Conoscenza commerciale dell 'offerta Hitachi Rail Italy",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41905,
    nome: "Conoscenza degli ERP",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41906,
    nome: "Conoscenza degli impianti e stabilimenti produttivi",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2238,
    nome: "Conoscenza dei prodotti merceologici",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2327,
    nome: "Conoscenza dei sistemi di supporto amministrativo e contabile",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41907,
    nome: "Conoscenza e gestione dei fornitori",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2522,
    nome: "Consapevolezza del business",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2292,
    nome: "Contabilità cantieri/lavori e relativo sistema informativo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2328,
    nome: "Contabilità generale",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2329,
    nome: "Contabilità gestionale",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2388,
    nome: "Contabilità immobili",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2380,
    nome: "Contenzioso sul lavoro ed evoluzione del Diritto del lavoro",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41908,
    nome: "Contract Management",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2484,
    nome: "Contract management e gestione contabile amministrativa delle forniture",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2403,
    nome: "Contratti di servizio",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41909,
    nome: "Contrattualistica",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2423,
    nome: "Contrattualistica italiana/internazionale e normative aziendali correlate",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 15269,
    nome: "Controllo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41910,
    nome: "Controllo qualità approvvigionamenti",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 42034,
    nome: "Creatività",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2224,
    nome: "Criteri e metodi per la pianificazione dello sviluppo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2393,
    nome: "Customer care",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2456,
    nome: "Data modelling ed architetturedata base relazionali",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2400,
    nome: "Definizione di layout",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2322,
    nome: "Delibere delle Authorities e quadro regolamentare",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41933,
    nome: "Dinamica di marcia",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2502,
    nome: "Direttive Authority/ATOe carta dei servizi",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2427,
    nome: "Diritto societario e relative operazioni",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2495,
    nome: "Disciplina del rapporto di lavoro",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2297,
    nome: "Disciplina delle servitù,",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2289,
    nome: "Disegno tecnico",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2294,
    nome: "Documentazione e modulistica relativa al trasporto rifiuti",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2295,
    nome: "Documentazione/modulistica relativa al maneggio di sostanze tossiche",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41911,
    nome: "E-Procurement",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2241,
    nome: "Edile",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2389,
    nome: "Elementi di estimo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2478,
    nome: "Elementi di funzionamento degli impianti e delle tecnologie in esercizio",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2240,
    nome: "Elettrotecnica",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2243,
    nome: "Energetica",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2219,
    nome: "Evoluzione legislativa e regolatoria",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41912,
    nome: "Expertise di beni/classi di prodotto (merceologiche)",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2483,
    nome: "Fabbisogni di acquisto",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2344,
    nome: "Finanziamenti agevolati (nazionali e europei)",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2521,
    nome: "Flessibilità",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2479,
    nome: "Forma pubblica e privata",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2406,
    nome: "Funzionamento dei mezzi operativi",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2416,
    nome: "Gestione agende",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2217,
    nome: "Gestione amministrativa di supporto all'attività commerciale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2209,
    nome: "Gestione dei reclami e customer retention ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2392,
    nome: "Gestione del Make or Buy ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41913,
    nome: "Gestione del fabbisogno e delle fonti di approvvigionamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2207,
    nome: "Gestione delle forze di vendita ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2208,
    nome: "Gestione delle trattative complesse ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 15270,
    nome: "Gestione e sviluppo delle risorse ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2431,
    nome: "Gestione protocolli ed archivi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2356,
    nome: "Gestione spazi sui Media e tecniche promo-pubblicitarie ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2363,
    nome: "Grafica e immagine coordinata ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2242,
    nome: "Idraulica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2245,
    nome: "Illuminotecnica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2524,
    nome: "Impegno ed allineamento verso l’organizzazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2276,
    nome: "Impianti ciclo idrico ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2274,
    nome: "Impianti del servizio elettrico ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2278,
    nome: "Impianti di illuminazione pubblica e semaforici ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2401,
    nome: "Impianti di riscaldamento e condizionamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2277,
    nome: "Impianti di telecomunicazioni ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2271,
    nome: "Impianti di teleriscaldamento e centrali termiche ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2269,
    nome: "Impianti di termovalorizzazione e produzione di energia ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2270,
    nome: "Impianti di trattamento rifiuti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2275,
    nome: "Impianti gas ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2272,
    nome: "Impianti termoelettrici ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2519,
    nome: "Influenzamento e impatto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2229,
    nome: "Ingegneria termo-dinamica, termo-tecnica, Macchine ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2523,
    nome: "Innovazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2516,
    nome: "Integrazione e cooperazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41914,
    nome: "Internal functions planning management and liaison ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41915,
    nome: "Interpretazione, gestione, redazione documentazione tecnica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2411,
    nome: "Istituti contrattuali e normativa per la gestione del rapporto di lavoro ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2387,
    nome: "Legislazione e normativa riferite alle modalità contrattuali di alienazionee vendita immobili ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2394,
    nome: "Legislazione e normativa riferite alle modalità contrattuali di gestione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41916,
    nome: "Legislazione nazionale ed internazionale su approvvigionamenti e supply management ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2202,
    nome: "Leve di marketing mix ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2286,
    nome: "Linee di telecomunicazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2461,
    nome: "Linguaggi di sviluppo sistemi object-oriented ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2460,
    nome: "Linguaggi di sviluppo sistemi web based (HTML, JAVA) ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41917,
    nome: "Logistica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2261,
    nome: "Logistica servizi di raccolta e spazzamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41918,
    nome: "Make vs. Buy techniques ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2397,
    nome: "Manutenzione dei sistemi di edificio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2244,
    nome: "Meccanica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2408,
    nome: "Meccanica idraulica e impianti elettrici ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2477,
    nome: "Mercati di approvvigionamento specializzati per tipologia di prodotto/apparato/servizio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2342,
    nome: "Mercati valutarie finanziari nazionali ed internazionali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2196,
    nome: "Mercato Pubblica Amministrazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2197,
    nome: "Mercato Tecnologico ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2391,
    nome: "Mercato dei servizi accessori ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2497,
    nome: "Mercato di riferimento e trend di sviluppo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2186,
    nome: "Mercato energetico nazionale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2386,
    nome: "Mercato immobiliare di riferimento e valori di riferimento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2185,
    nome: "Mercato mondiale dell’energia (EPC, BOO, BOT) ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2198,
    nome: "Mercato residenziale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2199,
    nome: "Mercatobusiness ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2315,
    nome: "Metodi di valutazione aziendale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2457,
    nome: "Metodi e canali di scouting tecnologico ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2445,
    nome: "Metodi per la messa a norma di materiali e attrezzature ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2259,
    nome: "Metodi, tecniche e strumenti di smaltimento dirifiuti solidi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2258,
    nome: "Metodi, tecniche e strumenti di trattamento e smaltimento dei rifiuti liquidi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2260,
    nome: "Metodi, tecniche e strumenti di trattamento/recupero rifiuti solidi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2369,
    nome: "Metodologie di Change Management ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2332,
    nome: "Metodologie di analisi dei costi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2437,
    nome: "Metodologie di analisi dei processi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2367,
    nome: "Metodologie di analisi e valutazione delle posizioni organizzative ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2453,
    nome: "Metodologie di descrizione delle specifiche ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2418,
    nome: "Metodologie di gestione dei flussi e degli stock di beni e materiali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2317,
    nome: "Metodologie e strumenti di analisi della domanda e fattori macro-economici ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2376,
    nome: "Metodologie e strumenti di analisi, pianificazione e audit della formazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2316,
    nome: "Metodologie e strumenti di rilevazione e analisi dei dati di mercato ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41919,
    nome: "Metodologie e tecniche di miglioramento continuo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2368,
    nome: "Metodologiee tecnichedi analisi e progettazione organizzativa ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2467,
    nome: "Misurazione dei livelli di servizio e tecniche di tuning di sistema ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2311,
    nome: "Misure elettriche e norme ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2462,
    nome: "Modalità di manutenzione evolutiva di sistema ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2463,
    nome: "Modalità e procedure di test e collaudo di sistemi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2466,
    nome: "Modalità tecniche di gestione, abilitazione lato utente e monitoring di servizi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2335,
    nome: "Modelli e criteri di progettazione deibudget ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2291,
    nome: "Modelli e strumenti di progettazione unificata ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2189,
    nome: "Modelli e tecniche di costruzione scenari e modelli di simulazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2193,
    nome: "Negoziazione e gestione dei contratti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2454,
    nome: "Networking e protocolli di comunicazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2220,
    nome: "Normativa contrattuale tariffaria e fiscale sulle forniture ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2399,
    nome: "Normativa di settore e procedureautorizzative ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2410,
    nome: "Normativa e procedure di gestione amministrativa del personale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2310,
    nome: "Normativa e procedure in materia di direzione lavori ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2309,
    nome: "Normativa e procedure in materia di progettazione impianti e reti e servizi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2405,
    nome: "Normativa fiscale autorizzativa e amministrativa in materia di autoveicoli ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2348,
    nome: "Normativa fiscale e tributaria ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2402,
    nome: "Normativa fiscale e tributaria in materia di immobili ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2302,
    nome: "Normativa funeraria ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2303,
    nome: "Normativa in materia di risparmio energetico ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2325,
    nome: "Normativa inerente gare ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2321,
    nome: "Normativa nazionale ed europea di regolazione dei settori di interesse del Gruppo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2378,
    nome: "Normativa per la gestione degli adempimenti contributivi, fiscali, assicurativie previdenziali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2349,
    nome: "Normativa recupero crediti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2305,
    nome: "Normativa regionale, nazionale e comunitaria in materia di ambiente ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2307,
    nome: "Normativa relativa all’acqua potabile ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2306,
    nome: "Normativa sicurezza cantieri, luoghi di lavoro e norme antinfort. ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2384,
    nome: "Normativa sulla privacy ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2383,
    nome: "Normativa sulla sicurezza dei lavoratori ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41920,
    nome: "Normativa tecnica prodotto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2313,
    nome: "Normativa tecnico/amministrativa di sicurezza impianti utilizzatori ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2447,
    nome: "Normative Ambientali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2446,
    nome: "Normative di Sicurezza ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2486,
    nome: "Normative e gare di appalto nazionali ed europee ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2381,
    nome: "Normative e procedure di amministrazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2308,
    nome: "Normative e procedure in materia di lavori pubblici, gare e appalti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2396,
    nome: "Normative etecniche di tutela e manutenzione del patrimonio immobiliare ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2218,
    nome: "Normative, procedure e sistemi informativi di gestione della fatturazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41921,
    nome: "Norme e procedure HSE ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2232,
    nome: "Norme e procedure di sicurezza per le attività di laboratorio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2358,
    nome: "Nuove tecnologie a supporto della comunicazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41922,
    nome: "Operations planning ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41923,
    nome: "Order book management ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 15266,
    nome: "Organizzazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2490,
    nome: "Organizzazione e gestione del magazzino ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2357,
    nome: "Organizzazione e gestione della comunicazione interna ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2494,
    nome: "Organizzazione e processi aziendali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2359,
    nome: "Organizzazione eventi e fiere ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2360,
    nome: "Organizzazione eventi locali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2515,
    nome: "Orientamento al cliente / servizio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 15267,
    nome: "Orientamento attivo/impegno ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2350,
    nome: "Piani e politiche di gestione e recupero crediti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2346,
    nome: "Piani e politichedegli incassi e della fatturazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2352,
    nome: "Pianificazione e Programmazione dei processi di Comunicazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2475,
    nome: "Piattaforme di customer service e WFMS ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2206,
    nome: "Politiche commerciali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2347,
    nome: "Politiche di pagamentofornitori ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2205,
    nome: "Politiche, normative e tecniche di monitoraggio servizio e customer relat. ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2498,
    nome: "Portafoglio d 'offerta e sua evoluzione",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2323,
    nome: "Presidio normativa in materia di risparmio energetico",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2324,
    nome: "Presidio normativa vettoriamento e contratti del gas acqua",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2480,
    nome: "Presidio qualità degli approvvigionamenti",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2222,
    nome: "Problematiche economiche-sociali-ambientali dei mercati dell'energia ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2436,
    nome: "Procedure aziendali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2482,
    nome: "Procedure e processi operativi di approvvigionamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2256,
    nome: "Procedure e tecniche di manutenzione ordinaria e straordinaria e di ripristino ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2257,
    nome: "Procedure e tecniche di monitoraggio e verifica delle funzionalità ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2304,
    nome: "Procedure per il collaudo e l 'attivazione degli impianti in sicurezza",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41924,
    nome: "Processi e tecniche di qualifica fornitori/processi",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41925,
    nome: "Procurement marketing",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2266,
    nome: "Progettazione e Pianificazione cimiteriale",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2450,
    nome: "Progettazione ed erogazione di interventi di formazione/informazione",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2500,
    nome: "Project Management",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2422,
    nome: "Quadro legislativo e normativo di riferimento",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 15268,
    nome: "Realizzazione",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2300,
    nome: "Regolamenti comunali e provinciali e standard di igiene urbana",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2298,
    nome: "Regolamenti di fornitura, preventivazione e relativo sistema tariffario e informativo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2237,
    nome: "Regole e procedure di finanziamento per l'acquisto di strumentazioni di ricerca ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2362,
    nome: "Relazioni con Enti locali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2339,
    nome: "Relazioni con gli stakeholders ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41926,
    nome: "Reporting ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2503,
    nome: "Responsabilità sociale di impresa ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2187,
    nome: "Rete e sue possibilità/potenzialità ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2283,
    nome: "Reti ciclo idrico ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2281,
    nome: "Reti del servizio elettrico ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2282,
    nome: "Reti gas ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2284,
    nome: "Reti teleriscaldamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2493,
    nome: "Salute e sicurezza sul lavoro ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2465,
    nome: "Scheduling e controllo dei sistemi ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2215,
    nome: "Servizi ambientali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2345,
    nome: "Servizi bancari e postali relativi ai sistemi di incasso e pagamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2267,
    nome: "Servizi cimiteriali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2213,
    nome: "Servizi di energia ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2268,
    nome: "Servizi di onoranze funebri ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2216,
    nome: "Servizi funerari e cimiteriali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2214,
    nome: "Servizi idrici ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2451,
    nome: "Sicurezza e classificazione delle informazioni ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2355,
    nome: "Sistema delle relazioni con le agenzie ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2473,
    nome: "Sistemi Enterprise Resource Planning ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2366,
    nome: "Sistemi classificatori ed inquadramentali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2428,
    nome: "Sistemi delle deleghe, dei poteri aziendali e della corporate governance ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2320,
    nome: "Sistemi di Competitive Intelligence ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2371,
    nome: "Sistemi di assessment e valutazione della performance e del potenziale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2280,
    nome: "Sistemi di conduzione, teleconduzione, supervisione e controllo degli impianti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2382,
    nome: "Sistemi di definizione ed applicazione strumenti di comunicazione organizzativa ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2424,
    nome: "Sistemi di gestione del contenzioso civile/lavoro aziendale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2425,
    nome: "Sistemi di gestione del contenzioso civilee amministrativo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2426,
    nome: "Sistemi di gestione del contenzioso penale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2370,
    nome: "Sistemi di gestione delle carriere e della mobilità ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2419,
    nome: "Sistemi di immagazzinamento e movimentazione delle merci ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2415,
    nome: "Sistemi di incasso e pagamento ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2373,
    nome: "Sistemi di incentivazione individuale e collettiva ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2472,
    nome: "Sistemi di monitoring e distribuzione SW per stazioni di lavoro ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2489,
    nome: "Sistemi di pianificazione degli approvvigionamenti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2365,
    nome: "Sistemi di pianificazione delle risorse ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2375,
    nome: "Sistemi di pianificazione per obiettivi ed MBO ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2203,
    nome: "Sistemi di pricing e tariffazione ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2279,
    nome: "Sistemi di protezione catodica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2444,
    nome: "Sistemi di qualificazione fornitori ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2438,
    nome: "Sistemi di qualità aziendali e do prodotto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2334,
    nome: "Sistemi di reporting e controllo aziendale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2372,
    nome: "Sistemi di riconoscimento e compensation ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2435,
    nome: "Sistemi documentali ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2412,
    nome: "Sistemi e strumentazione per la gestione del Pay Roll ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2496,
    nome: "Sistemi informativi di supporto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2414,
    nome: "Sistemidi Billing ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2290,
    nome: "Software tecnici ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2468,
    nome: "Standard e strumenti di sicurezza informatica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2288,
    nome: "Strumentazione operativa ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2228,
    nome: "Strumentazione specialistica ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2343,
    nome: "Strumenti di analisi dei flussi finanziari di breve periodo (fonti ed impieghi) ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2194,
    nome: "Strumenti di gestione del Risk Management ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2433,
    nome: "Strumenti di gestione del rischio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2190,
    nome: "Strumenti di valutazione a medio termine del venduto ai clienti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2464,
    nome: "Strumenti e metodologie di certificazione di qualità e di pre-esercizio ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2481,
    nome: "Strumenti e schemi contrattuali di acquisto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2487,
    nome: "Strumenti e sistemi informativi di supporto ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2331,
    nome: "Strumenti e tecniche di analisi e valutazione economico- finanziaria degli investimenti ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2341,
    nome: "Strumenti finanziari (reperimento impiego capitali) ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2230,
    nome: "Struttura, attività e servizi offerti dai laboratori ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2474,
    nome: "Supporto sistemi di Office Automation ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2518,
    nome: "Sviluppo delle persone ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2517,
    nome: "Team leadership ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2432,
    nome: "Tecnica delle assicurazioni ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2469,
    nome: "Tecniche di amministrazione di sistema ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2236,
    nome: "Tecniche di analisi ambientale ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2200,
    nome: "Tecniche di analisi del mercato e dei principali fattori macroeconomici ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2201,
    nome: "Tecniche di analisi del posizionamento competitivo ",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2234,
    nome: "Tecniche di analisi e verifica dell 'incertezza delle misurazioni",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2499,
    nome: "Tecniche di benchmarking",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2233,
    nome: "Tecniche di campionamento",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2442,
    nome: "Tecniche di certificazione di prodotto",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2441,
    nome: "Tecniche di certificazione di sistema",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2211,
    nome: "Tecniche di comunicazione efficace",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2255,
    nome: "Tecniche di conduzione degli impianti",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2420,
    nome: "Tecniche di conservazione materiali",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2251,
    nome: "Tecniche di costruzione di impianti, reti, stazioni",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2471,
    nome: "Tecniche di data base administration",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2263,
    nome: "Tecniche di disinfestazione e norme di riferimento",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2262,
    nome: "Tecniche di esercizio dei servizi di igiene urbana",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2265,
    nome: "Tecniche di esercizio e gestione di discariche",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2398,
    nome: "Tecniche di gestione dei servizi",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2485,
    nome: "Tecniche di gestione delle trattative di approvvigionamento",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2470,
    nome: "Tecniche di gestione sistemi di rete",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2353,
    nome: "Tecniche di ideazione e diffusione immagine di Gruppo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2319,
    nome: "Tecniche di monitoraggio strategicodelle performance",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2253,
    nome: "Tecniche di montaggio e componentistica impianti",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2338,
    nome: "Tecniche di pianificazione e budgeting aziendale",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2191,
    nome: "Tecniche di pianificazione e gestione dei flussi energetici",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2340,
    nome: "Tecniche di pianificazione e programmazione finanziaria",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2333,
    nome: "Tecniche di pianificazione e programmazione gestionale",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2318,
    nome: "Tecniche di pianificazione strategica e simulazione economica",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2264,
    nome: "Tecniche di preparazione dei composti e di intervento per disinfestazioni",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2252,
    nome: "Tecniche di prove e collaudo per impianti, sistemi ausiliari, macchinari e apparecchiature",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2379,
    nome: "Tecniche di relazioni sindacali",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2501,
    nome: "Tecniche di reporting",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41927,
    nome: "Tecniche di sviluppo fornitori e miglioramento continuo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2374,
    nome: "Tecniche e metodologie di reperimento e selezione delle Risorse Umane",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2354,
    nome: "Tecniche e modalità di relazioni con i Media",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2443,
    nome: "Tecniche e modelli operativi di auditing interno",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2250,
    nome: "Tecniche e norme di progettazione di impianti, reti e stazioni",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2459,
    nome: "Tecniche e sistemi di system integration",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2361,
    nome: "Tecniche e strumenti di comunicazione finanziaria",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2226,
    nome: "Tecniche e strumenti di modellazione, simulaz. ed ottimiz.sistemi, impianti e comp.",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2488,
    nome: "Tecnologie applicate ai processi di approvvigionamento",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2458,
    nome: "Tecnologie di impiantistica e networking",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2227,
    nome: "Tecnologie elettriche/elettroniche/meccaniche e di conversione energetica",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2192,
    nome: "Trading del settore elettrico",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2395,
    nome: "Urbanistica",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2312,
    nome: "Urbanistica e pratiche edilizie",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41928,
    nome: "Valutazione affidabilità economico-finanziaria",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41929,
    nome: "Vendor rating e monitoraggio fornitori",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 41930,
    nome: "Vendor selection, qualification and performance management",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2506,
    nome: "a) Analisi e soluzione dei problemi",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2507,
    nome: "b) Programmazione e controllo",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2508,
    nome: "c) Sviluppo e trasferimento del know-how",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2510,
    nome: "d) Tensione al risultato",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2511,
    nome: "e) Orientamento all’efficienza",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2512,
    nome: "f) Organizzazione",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2513,
    nome: "g) Qualità ed accuratezza",
    contatore: 0,
    idseq: 0,
    selezionato: false
}, {
    ID: 2287,
    nome: "linee di illuminazione pubblica e semaforici"
}]

export default {
    mounted() {
        this.$nextTick(function() {
            $(".listacompetenze").height($(window).height() - 330)
            $(".listapersone").css('max-height', ($(window).height() - 210) + 'px')

            if (localStorage.getItem("TokenScaduto")) {
                localStorage.removeItem("TokenScaduto")
                eventBus.$emit("alert", "Sessione scaduta")
            }

            this.peopleInit()
            this.contaPersone()
        })
    },
    mixins: [ruoliUoMixin],
    components: {
        sidejsonly
    },
    data: function() {
        return {
            skills: competenze,
            filtro: '',
            labelout_filtro: false,
            skill_selezionate: [],
            listaFiltrata: []
        }
    },
    methods: {
        peopleInit() {
            var get = this.$store.getters.getPeople
            if (get != null) {
                this.people = get
            } else {
                this.$store.commit("initPeople")
                this.people = this.$store.getters.getPeople
            }
        },
        filterOut_filtro: function() {
            if (this.filtro.trim() != '') {
                this.labelout_filtro = true
            } else {
                this.labelout_filtro = false
            }
        },
        contaPersone() {
            for (let i = 0; i < this.skills.length; i++) {
                let conta = 0
                this.skills[i].idseq = i

                for (let ii = 0; ii < this.people.length; ii++) {
                    let persona = this.people[ii]

                    for (let iii = 0; iii < persona.skills.length; iii++) {
                        if (persona.skills[iii].id == i) conta++
                    }
                }

                this.skills[i].contatore = conta
            }
        },
        generaLista(id) {
            let esiste = this.skill_selezionate.indexOf(id)

            if (esiste == -1) {
                this.skill_selezionate.push(id)
            } else {
                this.skill_selezionate.splice(esiste, 1)
            }


            if ((this.listaFiltrata.length == 0 && this.skill_selezionate.length == 1) || this.listaFiltrata.length > 0) {

                this.listaFiltrata = []

                for (let i = 0; i < this.skill_selezionate.length; i++) {

                    if (this.listaFiltrata.length == 0) {
                        for (let ii = 0; ii < this.people.length; ii++) {
                            let persona = this.people[ii]

                            for (let iii = 0; iii < persona.skills.length; iii++) {
                                if (persona.skills[iii].id == this.skill_selezionate[i]) {

                                    this.listaFiltrata.push({
                                        id: persona.id,
                                        avatar: persona.avatar,
                                        cognome: persona.cognome,
                                        nome: persona.nome,
                                        uo: persona.uo,
                                        ruolo: persona.ruolo,
                                        email: persona.email,
                                        telefono: persona.telefono,
                                        skills: persona.skills,
                                        livelli: [persona.skills[iii].livello],
                                        livello_skill: persona.skills[iii].livello
                                    })
                                }
                            }
                        }
                    } else {
                        let listaAppoggio = this.listaFiltrata.splice(0)
                        this.listaFiltrata = []

                        for (let a = 0; a < listaAppoggio.length; a++) {
                            let persona = listaAppoggio[a]

                            for (let b = 0; b < persona.skills.length; b++) {
                                if (persona.skills[b].id == this.skill_selezionate[i]) {

                                    persona.livelli.push(persona.skills[b].livello)

                                    this.listaFiltrata.push({
                                        avatar: persona.avatar,
                                        cognome: persona.cognome,
                                        nome: persona.nome,
                                        uo: persona.uo,
                                        ruolo: persona.ruolo,
                                        email: persona.email,
                                        telefono: persona.telefono,
                                        skills: persona.skills,
                                        livelli: persona.livelli,
                                        livello_skill: (persona.livelli.reduce(function(a, b) {
                                            return a + b
                                        }) / (i + 1)).toFixed(1)
                                    })
                                }
                            }

                        }
                    }
                }
            }

            // ordina prima per score e poi in ordine alfabetico
            this.listaFiltrata.sort(function(a, b) {
                return (a.cognome > b.cognome) ? 1 : ((b.cognome > a.cognome) ? -1 : 0);
            }).sort(function(a, b) {
                return (a.livello_skill < b.livello_skill) ? 1 : ((b.livello_skill < a.livello_skill) ? -1 : 0);
            })

            this.chiudiAltriCollapse()
                //this.riordinaSkills()

            let altezzaFinestra = $(window).height() - 210
            $(".listapersone").css('max-height', altezzaFinestra + 'px')

        },
        chiudiAltriCollapse() {
            for (let i = 0; i < this.listaFiltrata.length; i++) {
                $('#listaskill_' + i).collapse('hide')
            }
        },
        resetFilter() {
            this.skill_selezionate = []
            this.listaFiltrata = []

            for (let i = 0; i < this.skills.length; i++) {
                this.skills[i].selezionato = false
            }
            //            this.riordinaSkills()
        },
        cancellaFiltro() {
            this.filtro = ''
            this.labelout_filtro = false
        },
        riordinaSkills() {
            this.skills.sort(function(a, b) {
                return (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0)
            }).sort(function(a, b) {
                return (a.selezionato < b.selezionato) ? 1 : ((b.selezionato < a.selezionato) ? -1 : 0)
            })
        },
        togglePreferito(id) {
            for (let i = 0; i < this.people.length; i++) {
                let persona = this.people[i]

                if (persona.id == id) {
                    this.people[i].preferito = !persona.preferito
                }
            }
        }
    },
    computed: {}
}
</script>
<style scoped>
h6.text-headline {
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.listacompetenze {
    height: 70vh;
    overflow-y: auto;
    margin-bottom: 0px;
}

.listapersone {
    max-height: 80vh;
    overflow-y: scroll !important;
    margin-bottom: 0px;
}

.listacompetenze li:hover {
    background-color: #eee;
}

.selezionato {
    background-color: #ddd;
    font-weight: 500 !important;
}

.sk {
    font-weight: 300;
    font-size: 1.1rem;
}

.skpeople {
    top: 0px !important;
    right: 0px;
}

.sklivello {
    top: 10px !important;
    right: 5px;
}

span {
    font-weight: 300;
    position: absolute;
}

.cnom {
    top: 11px;
    font-size: 1.2rem;
    font-weight: 400;
}

.cuo {
    top: 26px;
    font-size: 1rem;
}

.cruolo {
    top: 39px;
    font-size: 1rem;
}

hr {
    margin-top: 29px;
    margin-left: 0px;
    margin-right: 0px;
}

.cemail {
    top: 56px;
    font-size: 1rem;
}

.ctel {
    top: 70px;
    font-size: 1rem;
}

.avt {
    padding-top: 5px !important;
}

.prefer {
    position: absolute;
    top: 4px;
    margin-left: -15px;
    -ms-transform: rotate(-15deg);
    -webkit-transform: rotate(-15deg);
    transform: rotate(-15deg);
}

.lista {
    font-size: 1.3rem;
    font-weight: 300;
    padding: 10px;
    padding-right: 20px;
    border: 1px solid #e9e9e9;
    border-radius: 5px;
}

.lista-sm {
    font-size: 1rem;
    font-weight: 300;
    padding: 10px;
    padding-right: 20px;
    border: 1px solid #e9e9e9;
    border-radius: 5px;
    white-space: nowrap;
    /*
    overflow: hidden;
    */
    text-overflow: ellipsis;
}

.dd {
    margin-top: 5px;
    margin-bottom: 20px;
}

.caret {
    margin-top: 8px;
    margin-left: 5px;
}

.risul {
    top: 166px !important;
}

.badge-right {
    right: 10px !important;
    top: 12px !important;
    font-size: 2rem !important;
    background-color: orange !important;
}

.v-middle-skill {
    padding-bottom: 0px !important;
}

.iconask {
    font-size: 1.3rem;
    padding-right: 5px;
    color: #aaa;
}

.iconask:hover {
    color: #fff;
}
</style>
