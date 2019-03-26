export const relationships = {
    Testata: {
        "AzioniDiSviluppoValutato": ["NoteValutato"],
        "AzioniDiSviluppoValutatore": ["NoteGeneriche"],
        "AzioniDiSviluppoAggiuntive": ["NoteGeneriche2"],
        "CommentiRoundTable": ["NoteGeneriche3"],
        "AutovalutazioneComplessiva": ["Autovalutazione"],
        "CommentiFinaliValutato": ["CommentiFinaliValutato"],
        "ValutazioneComplessiva": ["IDDecodificaValutazioneGlobaleForzata"],
        "RuoloProposto": ["IDRuoloProposto"],
        "CommentiFinaliValutatore": ["CommentiFinaliValutatore"],
        "ValutatoreAggiuntivo1": ["IDValutatoreAggiuntivo1"],
        "ValutatoreAggiuntivo2": ["IDValutatoreAggiuntivo2"],
        "Survey": ["RisposteSurvey"]
    },
    IndividualiGeneriche: {
        "DescrizioneObiettivo": ["DescrizioneIndicatore"],
        "DescrizioneKPI": ["NoteObiettivo"],
        "DataTermine": ["DataObiettivo"],
        "Peso": ["Peso"]
    },
    IndividualiValutato: {
        "Autovalutazione": ["LivelloRequisitoAutovalutato"],
        "CommentiValutato": ["CommentiFinaliValutato"],
        "NotePersonaValutata": ["NoteFinaliValutato"]
    },
    IndividualiValutatore: {
        "Valutazione": ["LivelloRequisito"],
        "CommentiValutatore": ["CommentiFinaliValutatore"],
        "NoteValutatore": ["NoteFinaliValutatore"]
    },
    AltreCompetenze: {
        "Autovalutazione": ["AutoValutazioneFinale"],
        "CommentiValutato": ["CommentiFinaliValutato"],
        "NotePersonaValutata": ["NoteFinaliValutato"],
        "Valutazione": ["ValutazioneFinale"],
        "CommentiValutatore": ["CommentiFinaliValutatore"],
        "NoteValutatore": ["NoteFinaliValutatore"]
    }
}