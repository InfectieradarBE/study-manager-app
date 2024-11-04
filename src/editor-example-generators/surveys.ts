 import getBelIntake from "./belgium/inf-intake";
 import getBelWeekly from "./belgium/inf-weekly";
 import getBelVaccination from "./belgium/inf-vaccination";
 import { ContactsDef } from "./external/contacts-survey/src/influenzanet-verdi-contact-extension/surveys/Contacts";
 
 import { en_BE } from "./external/contacts-survey/src/influenzanet-verdi-contact-extension/languages/en-be";
 import { nl_BE } from "./external/contacts-survey/src/influenzanet-verdi-contact-extension/languages/nl-be";
 import { de_BE } from "./external/contacts-survey/src/influenzanet-verdi-contact-extension/languages/de-be";
 import { fr_BE } from "./external/contacts-survey/src/influenzanet-verdi-contact-extension/languages/fr-be";
 
 import getSensorIntake from "./belgium/studies/sensor/intake";
 import getSensorLink from "./belgium/studies/sensor/sensorLink";
 import getSensorDiary from "./belgium/studies/sensor/diary";

 const surveys = [
     {
         instance: "belgium",
         surveys: [
             { name: "intake", survey: getBelIntake() },
             { name: "weekly", survey: getBelWeekly() },
             { name: "vaccination", survey: getBelVaccination() },
             {
                 name: "contacts",
                 survey: new ContactsDef([en_BE, nl_BE, de_BE, fr_BE]).getSurvey(),
             },
         ],
         languageCodes: ["nl-be", "fr-be", "de-be", "en"],
     },
     {
        instance: "sensor",
        surveys: [
            { name: "intake", survey: getSensorIntake() },
            { name: "sensorLink", survey: getSensorLink() },
            { name: "diary", survey: getSensorDiary() },
        ],
        languageCodes: ["nl-be", "fr-be", "de-be", "en"],
     }
 ];


export default surveys;
