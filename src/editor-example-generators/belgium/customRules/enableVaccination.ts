import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { Expression } from "new-survey-engine/data_types/expression";

import { ParticipantFlags } from "../participantFlags";

import vaccination from "../inf-vaccination"

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
      StudyEngine.participantState.hasParticipantFlagKeyAndValue(
        ParticipantFlags.isChild.key,
        ParticipantFlags.isChild.values.no
      ),
      StudyEngine.participantActions.assignedSurveys.add(
        vaccination.key,
        "prio"
      )
    )
  ]
}