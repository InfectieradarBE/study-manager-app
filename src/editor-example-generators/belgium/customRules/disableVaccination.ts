import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { Expression } from "new-survey-engine/data_types/expression";

import { ParticipantFlags } from "../participantFlags";

import vaccination from "../inf-vaccination"

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