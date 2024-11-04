import { Survey, SurveyItem, SurveyGroupItem } from "survey-engine/data_types";
import { ItemEditor } from "../../../../editor-engine/survey-editor/item-editor";
import { SurveyEditor } from "../../../../editor-engine/survey-editor/survey-editor";
import { generateLocStrings, generateTitleComponent, expWithArgs } from "../../../../editor-engine/utils/simple-generators";
import { responseGroupKey } from "../../../common_question_pool/key-definitions";
import { initSingleChoiceGroup } from "../../../../editor-engine/utils/question-type-generator";
import { singleChoiceKey } from "../../../common_question_pool/key-definitions";
import { ComponentEditor } from "../../../../editor-engine/survey-editor/component-editor";

export type DiaryDef = {
    (): Survey;
    key: string;
}

const diary = <DiaryDef>((): Survey | undefined => {
    const surveyKey = 'diary';

    diary.key = surveyKey;

    const survey = new SurveyEditor();
    survey.changeItemKey('survey', surveyKey);

    // *******************************
    // Survey card
    // *******************************
    survey.setSurveyName(generateLocStrings(
        new Map([
            ["nl-be", "Achtergrondvragenlijst"],
            ["en", "Intake questionnaire"],
            ["fr-be", "Questionnaire préliminaire"],
            ["de-be", "Hintergrundfrageboge"],
        ])
    ));
    survey.setSurveyDescription(generateLocStrings(
        new Map([
            ["nl-be", "Het doel van de eerste vragenlijst is om elke gebruiker wat beter te leren kennen."],
            ["en", "The purpose of the background questionnaire is to find out a little more about each user."],
            ["fr-be", "Le questionnaire préliminaire a pour but de connaître un peu mieux chaque utilisateur."],
            ["de-be", "Der Zweck des Hintergrundfragebogens ist es, jeden Benutzer ein wenig besser kennen zu lernen."],
        ])
    ));
    survey.setSurveyDuration(generateLocStrings(
        new Map([
            ["nl-be", "Dit zal ongeveer 5-15 minuten tijd in beslag nemen."],
            ["en", "It takes approximately 5-15 minutes to complete this questionnaire."],
            ["fr-be", "Comptez environ 5-15 minutes pour compléter le questionnaire préliminaire."],
            ["de-be", "Es dauert etwa 5-15 Minuten, um diesen Fragebogen auszufüllen."],
        ])
    ));


    // *******************************
    // Questions
    // *******************************
    const rootItemEditor = new ItemEditor(survey.findSurveyItem(surveyKey) as SurveyGroupItem);
    rootItemEditor.setSelectionMethod({ name: 'sequential' });
    survey.updateSurveyItem(rootItemEditor.getItem());
    const rootKey = rootItemEditor.getItem().key;


    // PLACEHOLDER
    const Q_id = sensor_id(rootKey, true);
    survey.addExistingSurveyItem(Q_id, rootKey);

    return survey.getSurvey();
})

export default diary;


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