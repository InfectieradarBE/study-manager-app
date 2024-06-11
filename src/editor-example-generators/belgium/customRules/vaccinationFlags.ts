import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { Expression } from "new-survey-engine/data_types/expression";

import { ParticipantFlags } from "../participantFlags";

import vaccination from "../inf-vaccination"
import { checkVaccinationSurveyEligibility } from "../studyRules";

export const disableVaccination: {
  name: string;
  rules: Expression[];
} = {
  name: "disableVaccination",
  rules: [
    StudyEngine.participantActions.updateFlag(
      ParticipantFlags.vaccinationSurveyActive.key, 
      ParticipantFlags.vaccinationSurveyActive.values.no
    ),
    StudyEngine.participantActions.assignedSurveys.remove(
        vaccination.key,
        "all"
    )
  ]
}

export const enableVaccination: {
  name: string;
  rules: Expression[];
} = {
  name: "enableVaccination",
  rules: [
    StudyEngine.participantActions.updateFlag(
      ParticipantFlags.vaccinationSurveyActive.key, 
      ParticipantFlags.vaccinationSurveyActive.values.yes
    ),
    StudyEngine.ifThen(
      checkVaccinationSurveyEligibility,
      StudyEngine.participantActions.assignedSurveys.add(
        vaccination.key,
        "prio"
      )
    )
  ]
}