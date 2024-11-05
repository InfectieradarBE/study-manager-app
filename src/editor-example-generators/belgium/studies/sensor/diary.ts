import { Survey, SurveyItem, SurveyGroupItem } from "survey-engine/data_types";
import { ItemEditor } from "../../../../editor-engine/survey-editor/item-editor";
import { SurveyEditor } from "../../../../editor-engine/survey-editor/survey-editor";
import { generateLocStrings, generateTitleComponent, expWithArgs } from "../../../../editor-engine/utils/simple-generators";
import { responseGroupKey } from "../../../common_question_pool/key-definitions";
import { initMultipleChoiceGroup, initSingleChoiceGroup } from "../../../../editor-engine/utils/question-type-generator";
import { singleChoiceKey } from "../../../common_question_pool/key-definitions";
import { ComponentEditor } from "../../../../editor-engine/survey-editor/component-editor";
import { multipleChoiceKey } from "case-editor-tools/constants/key-definitions";

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
            ["en", "Daily diary entry"],
            ["nl-be", "Daily diary entry"],
            ["fr-be", "Daily diary entry"],
            ["de-be", "Daily diary entry"],
        ])
    ));
    survey.setSurveyDescription(generateLocStrings(
        new Map([
            ["en", "The purpose of daily diary is to collect information about your daily activities such as your contacts, meetings or academic events and teaching activities."],
            ["nl-be", "The purpose of daily diary is to collect information about your daily activities such as your contacts, meetings or academic events and teaching activities."],
            ["fr-be", "The purpose of daily diary is to collect information about your daily activities such as your contacts, meetings or academic events and teaching activities."],
            ["de-be", "The purpose of daily diary is to collect information about your daily activities such as your contacts, meetings or academic events and teaching activities."],
        ])
    ));
    survey.setSurveyDuration(generateLocStrings(
        new Map([
            ["en", "It takes approximately 10-15 minutes to complete this questionnaire."],
            ["nl-be", "It takes approximately 10-15 minutes to complete this questionnaire."],
            ["fr-be", "It takes approximately 10-15 minutes to complete this questionnaire."],
            ["de-be", "It takes approximately 10-15 minutes to complete this questionnaire."],
        ])
    ));


    // *******************************
    // Questions
    // *******************************
    const rootItemEditor = new ItemEditor(survey.findSurveyItem(surveyKey) as SurveyGroupItem);
    rootItemEditor.setSelectionMethod({ name: 'sequential' });
    survey.updateSurveyItem(rootItemEditor.getItem());
    const rootKey = rootItemEditor.getItem().key;

    const Q_date = date(rootKey, true);
    survey.addExistingSurveyItem(Q_date, rootKey);

    const Q_office = campus(rootKey, true);
    survey.addExistingSurveyItem(Q_office, rootKey);

    // if yes to office
    const onCampus = onCampusGroup(rootKey, Q_office.key);
    survey.addExistingSurveyItem(onCampus, rootKey);
    const onCampusGroupKey = onCampus.key;

    const Q_transportation = transportation(onCampusGroupKey, true);
    survey.addExistingSurveyItem(Q_transportation, onCampusGroupKey);

    const Q_woreOnCampus = woreOnCampus(onCampusGroupKey, true);
    survey.addExistingSurveyItem(Q_woreOnCampus, onCampusGroupKey);

    // if no to office
    const offCampus = offCampusGroup(rootKey, Q_office.key);
    survey.addExistingSurveyItem(offCampus, rootKey);
    const offCampusGroupKey = offCampus.key;

    const Q_offCampusReason = offCampusReason(offCampusGroupKey, true);
    survey.addExistingSurveyItem(Q_offCampusReason, offCampusGroupKey);



    return survey.getSurvey();
})

export default diary;


const date = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "What date will you be reporting on?"],
            ["nl-be", "What date will you be reporting on?"],
            ["fr-be", "What date will you be reporting on?"],
            ["de-be", "What date will you be reporting on?"],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const dateInputEditor = new ComponentEditor(undefined, {
        key: '1',
        role: 'dateInput'
    });
    editor.addExistingResponseComponent(dateInputEditor.getComponent(), rg?.key);

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

const campus = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q2';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "Are you working from your office on the Diepenbeek campus today? (Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location.)"],
            ["nl-be", "Are you working from your office on the Diepenbeek campus today? (Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location.)"],
            ["fr-be", "Are you working from your office on the Diepenbeek campus today? (Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location.)"],
            ["de-be", "Are you working from your office on the Diepenbeek campus today? (Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location.)"],
        ]))
    );


    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new Map([
                ["en", "Yes"],
                ["nl-be", "Yes"],
                ["fr-be", "Yes"],
                ["de-be", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new Map([
                ["en", "No"],
                ["nl-be", "No"],
                ["fr-be", "No"],
                ["de-be", "No"],
            ])
        },
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

const onCampusGroup = (parentKey: string, userWorkedInOffice: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'onCampus';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: true });

    editor.setCondition(
        expWithArgs('responseHasKeysAny', userWorkedInOffice, [responseGroupKey, singleChoiceKey].join('.'), '0'),
    );

    editor.setSelectionMethod({ name: 'sequential' });
    return editor.getItem();
}

const transportation = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "How did you get to work? (You can select more than one option)"],
            ["nl-be", "How did you get to work? (You can select more than one option)"],
            ["fr-be", "How did you get to work? (You can select more than one option)"],
            ["de-be", "How did you get to work? (You can select more than one option)"],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: "0",
            role: "option",
            content: new Map([
                ["en", "Car"],
                ["nl-be", "Car"],
                ["fr-be", "Car"],
                ["de-be", "Car"],
            ]),
        },
        {
            key: "1",
            role: "option",
            content: new Map([
                ["en", "Public transport"],
                ["nl-be", "Public transport"],
                ["fr-be", "Public transport"],
                ["de-be", "Public transport"],
            ]),
        },
        {
            key: "2",
            role: "option",
            content: new Map([
                ["en", "Bicycle"],
                ["nl-be", "Bicycle"],
                ["fr-be", "Bicycle"],
                ["de-be", "Bicycle"],
            ]),
        },
        {
            key: "3",
            role: "option",
            content: new Map([
                ["en", "Walking"],
                ["nl-be", "Walking"],
                ["fr-be", "Walking"],
                ["de-be", "Walking"],
            ]),
        }
    ])

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

const woreOnCampus = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q2';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "Did you wear the sensor while you were on campus?"],
            ["nl-be", "Did you wear the sensor while you were on campus?"],
            ["fr-be", "Did you wear the sensor while you were on campus?"],
            ["de-be", "Did you wear the sensor while you were on campus?"],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: "0",
            role: "option",
            content: new Map([
                ["en", "Yes"],
                ["nl-be", "Yes"],
                ["fr-be", "Yes"],
                ["de-be", "Yes"],
            ]),
        },
        {
            key: "1",
            role: "option",
            content: new Map([
                ["en", "No"],
                ["nl-be", "No"],
                ["fr-be", "No"],
                ["de-be", "No"],
            ]),
        },
        {
            key: "2",
            role: "option",
            content: new Map([
                ["en", "Not the entire time"],
                ["nl-be", "Not the entire time"],
                ["fr-be", "Not the entire time"],
                ["de-be", "Not the entire time"],
            ]),
        }
    ])

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

const offCampusGroup = (parentKey: string, userWorkedInOffice: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'offCampus';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: true });

    editor.setCondition(
        expWithArgs('responseHasKeysAny', userWorkedInOffice, [responseGroupKey, singleChoiceKey].join('.'), '1'),
    );

    editor.setSelectionMethod({ name: 'sequential' });
    return editor.getItem();
}

const offCampusReason = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "If not, may we ask the reason? (You can select more than one option)"],
            ["nl-be", "If not, may we ask the reason? (You can select more than one option)"],
            ["fr-be", "If not, may we ask the reason? (You can select more than one option)"],
            ["de-be", "If not, may we ask the reason? (You can select more than one option)"],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: "0",
            role: "option",
            content: new Map([
                ["en", "Teleworking"],
                ["nl-be", "Teleworking"],
                ["fr-be", "Teleworking"],
                ["de-be", "Teleworking"],
            ]),
        },
        {
            key: "1",
            role: "option",
            content: new Map([
                ["en", "Caring for a family member"],
                ["nl-be", "Caring for a family member"],
                ["fr-be", "Caring for a family member"],
                ["de-be", "Caring for a family member"],
            ]),
        },
        {
            key: "2",
            role: "option",
            content: new Map([
                ["en", "Sick"],
                ["nl-be", "Sick"],
                ["fr-be", "Sick"],
                ["de-be", "Sick"],
            ]),
        },
        {
            key: "3",
            role: "option",
            content: new Map([
                ["en", "Working from another university"],
                ["nl-be", "Working from another university"],
                ["fr-be", "Working from another university"],
                ["de-be", "Working from another university"],
            ]),
        },
        {
            key: "4",
            role: "option",
            content: new Map([
                ["en", "Personal appointment(s)"],
                ["nl-be", "Personal appointment(s)"],
                ["fr-be", "Personal appointment(s)"],
                ["de-be", "Personal appointment(s)"],
            ]),
        },
        {
            key: "5",
            role: "option",
            content: new Map([
                ["en", "Childcare responsibilities"],
                ["nl-be", "Childcare responsibilities"],
                ["fr-be", "Childcare responsibilities"],
                ["de-be", "Childcare responsibilities"],
            ]),
        },
        {
            key: "6",
            role: "option",
            content: new Map([
                ["en", "Conference/workshops/research visits"],
                ["nl-be", "Conference/workshops/research visits"],
                ["fr-be", "Conference/workshops/research visits"],
                ["de-be", "Conference/workshops/research visits"],
            ]),
        },
        {
            key: "7",
            role: "option",
            content: new Map([
                ["en", "Other"],
                ["nl-be", "Other"],
                ["fr-be", "Other"],
                ["de-be", "Other"],
            ]),
        },
    ])

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