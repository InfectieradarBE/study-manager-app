import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { Expression } from "new-survey-engine/data_types/expression";

import { ParticipantFlags } from "../participantFlags";

export const flagVaccinationActive: {
  name: string;
  rules: Expression[];
} = {
  name: "flagVaccinationActive",
  rules: [
    StudyEngine.participantActions.updateFlag(
      ParticipantFlags.vaccinationSurveyActive.key, 
      ParticipantFlags.vaccinationSurveyActive.values.no
    ),
  ]
}