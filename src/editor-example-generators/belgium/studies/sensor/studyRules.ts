import { Expression } from "survey-engine/data_types";
import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { StudyRules } from "case-editor-tools/types/studyRules";

import intake from "./intake";
import sensorLink from "./sensorLink";
import diary from "./diary";


// NOTE: just to be sure these are called before generating rules, might not be
// necessary, should have already been called
intake();
sensorLink();
diary();

export interface RulesOptions {
    diaryResubmitHours: number;
}

export const rulesOptions = {
    diaryResubmitHours: 8, // leave 8 hours for next workday
};

/**
 * Define what should happen, when persons enter the study first time:
 */

const entryRules: Expression[] = [
    StudyEngine.participantActions.assignedSurveys.add(
        intake.key,
        "normal",
    ),
    StudyEngine.participantActions.assignedSurveys.add(
        sensorLink.key,
        "normal",
    ),
];

/**
 * Define what should happen, when persons submit an intake survey:
 */
const handleIntake = StudyEngine.ifThen(
    StudyEngine.checkSurveyResponseKey(intake.key),
    // remove intake
    StudyEngine.participantActions.assignedSurveys.remove(intake.key, "all"),
    // add diary if sensor link submitted (not assigned)
    StudyEngine.ifThen(
        StudyEngine.not(StudyEngine.participantState.hasSurveyKeyAssigned(sensorLink.key)),
        StudyEngine.participantActions.assignedSurveys.add(diary.key, "prio"),
    ),
);

const handleSensorLink = StudyEngine.ifThen(
    StudyEngine.checkSurveyResponseKey(sensorLink.key),
    // remove intake
    StudyEngine.participantActions.assignedSurveys.remove(sensorLink.key, "all"),
    // add diary if intake submitted (not assinged)
    StudyEngine.ifThen(
        StudyEngine.not(StudyEngine.participantState.hasSurveyKeyAssigned(intake.key)),
        StudyEngine.participantActions.assignedSurveys.add(diary.key, "prio"),
    ),
);

const handleDiary = StudyEngine.ifThen(
    StudyEngine.checkSurveyResponseKey(diary.key),
    // remove diary and re-add it with new a new timeout
    StudyEngine.participantActions.assignedSurveys.remove(
        diary.key,
        "all",
    ),
    StudyEngine.participantActions.assignedSurveys.add(
        diary.key,
        "prio",
        StudyEngine.timestampWithOffset({
            hours: rulesOptions.diaryResubmitHours,
        }),
    ),
);


const submitRules: Expression[] = [
    handleIntake,
    handleSensorLink,
    handleDiary,
];

/**
 * STUDY RULES
 */
export const studyRules = new StudyRules(entryRules, submitRules).get();
