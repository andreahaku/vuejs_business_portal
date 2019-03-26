export const jsonSurvey = {
    locale: "en",
    title: "APPRAISEE FINAL SURVEY",
    pages: [{
        name: "Pagina 1",
        questions: [{
            type: "radiogroup",
            name: "Domanda 2",
            title: "Was the overall Performance Management process of value to you?",
            isRequired: true,
            choices: [{
                value: "1",
                text: "Not at all"
            },
            {
                value: "2",
                text: "Very little"
            },
            {
                value: "3",
                text: "Moderately"
            },
            {
                value: "4",
                text: "Very much"
            },
            {
                value: "0",
                text: "Not applicable"
            }
            ],
            otherText: "Altro (inserire la descrizione)"
        },
        {
            type: "radiogroup",
            name: "Domanda 1",
            title: "Did you appreciate the Final Performance discussion?",
            isRequired: true,
            choices: [{
                value: "1",
                text: "Not at all"
            },
            {
                value: "2",
                text: "Very little"
            },
            {
                value: "3",
                text: "Moderately"
            },
            {
                value: "4",
                text: "Very much"
            },
            {
                value: "0",
                text: "Not applicable"
            }
            ],
            otherText: "Altro (inserire la descrizione)"
        },
        {
            type: "radiogroup",
            name: "Domanda 3",
            title: "Was the feedback relevant to you and objectively supported by examples?",
            isRequired: true,
            choices: [{
                value: "1",
                text: "Not at all"
            },
            {
                value: "2",
                text: "Very little"
            },
            {
                value: "3",
                text: "Moderately"
            },
            {
                value: "4",
                text: "Very much"
            },
            {
                value: "0",
                text: "Not applicable"
            }
            ],
            otherText: "Altro (inserire la descrizione)"
        },
        {
            type: "radiogroup",
            name: "Domanda 4",
            title: "Was the feedback exhaustive?",
            isRequired: true,
            choices: [{
                value: "1",
                text: "Not at all"
            },
            {
                value: "2",
                text: "Very little"
            },
            {
                value: "3",
                text: "Moderately"
            },
            {
                value: "4",
                text: "Very much"
            },
            {
                value: "0",
                text: "Not applicable"
            }
            ],
            otherText: "Altro (inserire la descrizione)"
        },
        {
            type: "radiogroup",
            name: "Domanda 5",
            title: "Have you received clear guidance on how to improve your performance?",
            isRequired: true,
            choices: [{
                value: "1",
                text: "Not at all"
            },
            {
                value: "2",
                text: "Very little"
            },
            {
                value: "3",
                text: "Moderately"
            },
            {
                value: "4",
                text: "Very much"
            },
            {
                value: "0",
                text: "Not applicable"
            }
            ],
            otherText: "Altro (inserire la descrizione)"
        },
        {
            type: "radiogroup",
            name: "Domanda 6",
            title: "Have performance expectations / goals been correctly set and explained?",
            isRequired: true,
            choices: [{
                value: "1",
                text: "Not at all"
            },
            {
                value: "2",
                text: "Very little"
            },
            {
                value: "3",
                text: "Moderately"
            },
            {
                value: "4",
                text: "Very much"
            },
            {
                value: "0",
                text: "Not applicable"
            }
            ],
            otherText: "Altro (inserire la descrizione)"
        },
        {
            type: "comment",
            name: "Domanda 8",
            title: "Free text comments"
        }
        ]
    }],
    completeText: "Click to complete survey",
    lmsid: "1"
}