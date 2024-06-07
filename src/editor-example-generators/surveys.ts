import getBelIntake from './belgium/inf-intake';
import getBelWeekly from './belgium/inf-weekly';
import getBelVaccination from './belgium/inf-vaccination';
import {ContactsDef} from "./external/contacts-survey/src/influenzanet-verdi-contact-extension/surveys/Contacts"

const surveys = [
    {
        instance: 'belgium',
        surveys: [
            { name: "intake", survey: getBelIntake() },
            { name: "weekly", survey: getBelWeekly() },
            { name: "vaccination", survey: getBelVaccination() },
            { name: "contacts", survey: new ContactsDef().getSurvey() },
        ],
        languageCodes: [
            'nl-be',
            'fr-be',
            'de-be',
            'en',
        ]
    }
];

export default surveys;
