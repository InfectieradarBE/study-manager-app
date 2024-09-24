import {
    multipleChoiceKey,
    responseGroupKey,
  } from "case-editor-tools/constants/key-definitions";
  import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
  import { Expression } from "survey-engine/data_types";
  import {
    symptomsFeedbackReportKey,
    SymptomsFeedbackDataModel,
  } from "../models/reports/SymptomsFeedbackDataModel";
  import { fields } from "../../../utils/ts-utils";
  import { ParticipantFlags } from "../participantFlags";
  import { WeeklyDef } from "../inf-weekly";
  
  const reportFields = fields<SymptomsFeedbackDataModel>();
  
  export const symptomsFeedbackReport = (Weekly: WeeklyDef): Expression => {
    const extractGender = StudyEngine.participantState.getParticipantFlagValue(
      ParticipantFlags.gender.key,
    );
  
    const extractSymptoms = StudyEngine.getSelectedKeys(
      Weekly.Q_symptoms.key,
      `${responseGroupKey}.${multipleChoiceKey}`,
    );
    
    return StudyEngine.ifThen(
      StudyEngine.checkSurveyResponseKey(Weekly.key),
      StudyEngine.participantActions.reports.init(symptomsFeedbackReportKey),
      StudyEngine.participantActions.reports.updateData(
        symptomsFeedbackReportKey,
        reportFields.symptoms,
        extractSymptoms,
        "keyList",
      ),
      StudyEngine.participantActions.reports.updateData(
        symptomsFeedbackReportKey,
        reportFields.gender,
        extractGender,
        "string",
      ),
      StudyEngine.participantActions.reports.updateData(
        symptomsFeedbackReportKey,
        reportFields.version,
        "v1",
        "string",
      ),
    );
  };