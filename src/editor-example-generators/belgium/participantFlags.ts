import { responseGroupKey, singleChoiceKey } from 'case-editor-tools/constants/key-definitions'
import { StudyEngine } from 'case-editor-tools/expression-utils/studyEngineExpressions'
export const ParticipantFlags = {
    isChild: {
        key: 'group',
        values: {
            no: 'NC',
            yes: 'C'
        }
    },
    hasOnGoingSymptoms: {
        key: 'prev',
        values: {
            no: '0',
            yes: '1'
        }
    },
    vaccinationCompleted: {
        key: 'completedVaccSurvey',
        values: {
            no: '0',
            yes: '1'
        }
    },
    vaccinationSurveyActive: {
        key: 'vaccSurveyActive',
        values: {
            no: '0',
            yes: '1'
        }
    },
    gender: {
        key: 'gender',
        buildExpression: (gender_key: string) =>
            StudyEngine.getSelectedKeys(
                gender_key,
                `${responseGroupKey}.${singleChoiceKey}`
            )
    }
}

