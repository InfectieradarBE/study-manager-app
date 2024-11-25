import { Survey, SurveyItem, SurveyGroupItem } from "survey-engine/data_types";
import { ItemEditor } from "../../../../editor-engine/survey-editor/item-editor";
import { SurveyEditor } from "case-editor-tools/surveys/survey-editor/survey-editor";
import { generateLocStrings, generateTitleComponent, expWithArgs } from "../../../../editor-engine/utils/simple-generators";
import { responseGroupKey } from "../../../common_question_pool/key-definitions";
import { ComponentEditor } from "../../../../editor-engine/survey-editor/component-editor";

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
            ["en", "It takes approximately 5 minutes to complete this questionnaire."],
            ["nl-be", "It takes approximately 5 minutes to complete this questionnaire."],
            ["fr-be", "It takes approximately 5 minutes to complete this questionnaire."],
            ["de-be", "It takes approximately 5 minutes to complete this questionnaire."],
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

    // FOR TESTING PURPOSES
    survey.setAvailableFor('public');

    return survey.getSurvey();
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
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const textInputEditor = new ComponentEditor(undefined, {
        key: '1',
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