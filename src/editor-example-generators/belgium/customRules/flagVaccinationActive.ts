import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { Expression } from "new-survey-engine/data_types/expression";

import { ParticipantFlags } from "../participantFlags";

import vaccination from "../inf-vaccination"

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
    StudyEngine.do(
      // If vaccination survey is active, add it to all participants
      StudyEngine.ifThen(
          StudyEngine.participantState.hasParticipantFlagKeyAndValue(
              ParticipantFlags.vaccinationSurveyActive.key,
              ParticipantFlags.vaccinationSurveyActive.values.yes,
          ),
          StudyEngine.ifThen(
              StudyEngine.not(
                  StudyEngine.participantState.hasSurveyKeyAssigned(
                      vaccination.key,
                  ),
              ),
              StudyEngine.participantActions.assignedSurveys.add(
                  vaccination.key,
                  "prio",
              ),
          )
      ),
      // If vaccination survey is not active, remove it from all participants
      StudyEngine.ifThen(
          StudyEngine.participantState.hasParticipantFlagKeyAndValue(
              ParticipantFlags.vaccinationSurveyActive.key,
              ParticipantFlags.vaccinationSurveyActive.values.no,
          ),
          StudyEngine.participantActions.assignedSurveys.remove(
              vaccination.key,
              "all",
          ),
      )
  ),
  ]
}