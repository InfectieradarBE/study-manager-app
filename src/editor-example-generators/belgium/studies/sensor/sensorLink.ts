import { Survey, SurveyItem, SurveyGroupItem } from "survey-engine/data_types";
import { ItemEditor } from "../../../../editor-engine/survey-editor/item-editor";
import { SurveyEditor } from "case-editor-tools/surveys/survey-editor/survey-editor";
import { generateLocStrings, generateTitleComponent, expWithArgs } from "../../../../editor-engine/utils/simple-generators";
import { responseGroupKey } from "../../../common_question_pool/key-definitions";
import { ComponentEditor } from "../../../../editor-engine/survey-editor/component-editor";
import { singleChoiceKey } from "../../../common_question_pool/key-definitions";
import { initSingleChoiceGroup } from "../../../../editor-engine/utils/question-type-generator";


export type SensorLinkDef = {
    (): Survey;
    key: string;
}

const sensorLink = <SensorLinkDef>((): Survey | undefined => {
    const surveyKey = 'sensor-link';

    sensorLink.key = surveyKey;

    const survey = new SurveyEditor();
    survey.changeItemKey('survey', surveyKey);

    // *******************************
    // Survey card
    // *******************************
    survey.setSurveyName(generateLocStrings(
        new Map([
            ["en", "Link your sensor"],
            ["nl-be", "Link your sensor"],
            ["fr-be", "Link your sensor"],
            ["de-be", "Link your sensor"],
        ])
    ));
    survey.setSurveyDescription(generateLocStrings(
        new Map([
            ["en", "The purpose of this small questionnaire is to link your sensor to your account."],
            ["nl-be", "The purpose of this small questionnaire is to link your sensor to your account."],
            ["fr-be", "The purpose of this small questionnaire is to link your sensor to your account."],
            ["de-be", "The purpose of this small questionnaire is to link your sensor to your account."],
        ])
    ));
    survey.setSurveyDuration(generateLocStrings(
        new Map([
            ["en", "It takes approximately 1 minute to complete this questionnaire."],
            ["nl-be", "It takes approximately 1 minute to complete this questionnaire."],
            ["fr-be", "It takes approximately 1 minute to complete this questionnaire."],
            ["de-be", "It takes approximately 1 minute to complete this questionnaire."],
        ])
    ));


    // *******************************
    // Questions
    // *******************************
    const rootItemEditor = new ItemEditor(survey.findSurveyItem(surveyKey) as SurveyGroupItem);
    rootItemEditor.setSelectionMethod({ name: 'sequential' });
    survey.updateSurveyItem(rootItemEditor.getItem());
    const rootKey = rootItemEditor.getItem().key;

    const Q_id = sensor_id(rootKey, true);
    survey.addExistingSurveyItem(Q_id, rootKey);

    const Q_verification = sensor_verification(rootKey, true);
    survey.addExistingSurveyItem(Q_verification, rootKey);

    // FOR TESTING PURPOSES
    // survey.setAvailableFor('public');

    const surveyObject = survey.getSurvey();
    surveyObject.requireLoginBeforeSubmission = true;

    return surveyObject;
})

export default sensorLink;

const sensor_id = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "Please enter your sensor identification number."],
            ["nl-be", "Please enter your sensor identification number."],
            ["fr-be", "Please enter your sensor identification number."],
            ["de-be", "Please enter your sensor identification number."],
        ]),
        new Map([
            ["en", "Make sure to double check the number before submitting. If you enter the wrong number, your data will not be linked to your account."],
            ["nl-be", "Make sure to double check the number before submitting. If you enter the wrong number, your data will not be linked to your account."],
            ["fr-be", "Make sure to double check the number before submitting. If you enter the wrong number, your data will not be linked to your account."],
            ["de-be", "Make sure to double check the number before submitting. If you enter the wrong number, your data will not be linked to your account."],
        ])
    ));

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const textInputEditor = new ComponentEditor(undefined, {
        key: '0',
        role: 'input',
    });
    editor.addExistingResponseComponent(textInputEditor.getComponent(), rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

const sensor_verification = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q2';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "Please verify that you have entered the correct sensor identification number."],
            ["nl-be", "Please verify that you have entered the correct sensor identification number."],
            ["fr-be", "Please verify that you have entered the correct sensor identification number."],
            ["de-be", "Please verify that you have entered the correct sensor identification number."],
        ],),
        new Map([
            ["en", "Please ensure that you have entered the correct number."],
            ["nl-be", "Please ensure that you have entered the correct number."],
            ["fr-be", "Please ensure that you have entered the correct number."],
            ["de-be", "Please ensure that you have entered the correct number."],
        ])
    ));

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new Map([
                ["en", "Yes, I have checked the number and it is correct."],
                ["nl-be", "Yes, I have checked the number and it is correct."],
                ["fr-be", "Yes, I have checked the number and it is correct."],
                ["de-be", "Yes, I have checked the number and it is correct."],
            ])
        }
    ]);

    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}