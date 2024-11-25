import { Survey, SurveyItem, SurveyGroupItem } from "survey-engine/data_types";
import { ItemEditor } from "../../../../editor-engine/survey-editor/item-editor";
import { SurveyEditor } from "case-editor-tools/surveys/survey-editor/survey-editor";
import { generateLocStrings, generateTitleComponent, expWithArgs } from "../../../../editor-engine/utils/simple-generators";
import { responseGroupKey } from "../../../common_question_pool/key-definitions";
import { initSingleChoiceGroup } from "../../../../editor-engine/utils/question-type-generator";
import { singleChoiceKey } from "../../../common_question_pool/key-definitions";
import { ComponentEditor } from "../../../../editor-engine/survey-editor/component-editor";

export type IntakeDef = {
    (): Survey;
    key: string;
    Q_birthdate: SurveyItem;
    Q_gender: SurveyItem;
}

const intake = <IntakeDef>((): Survey | undefined => {
    const surveyKey = 'intake';

    intake.key = surveyKey;

    const survey = new SurveyEditor();
    survey.changeItemKey('survey', surveyKey);

    // *******************************
    // Survey card
    // *******************************
    survey.setSurveyName(generateLocStrings(
        new Map([
            ["en", "Intake questionnaire"],
            ["nl-be", "Intake questionnaire"],
            ["fr-be", "Intake questionnaire"],
            ["de-be", "Intake questionnaire"],
        ])
    ));
    survey.setSurveyDescription(generateLocStrings(
        new Map([
            ["en", "The purpose of the background questionnaire is to find out a little more about each user."],
            ["nl-be", "The purpose of the background questionnaire is to find out a little more about each user."],
            ["fr-be", "The purpose of the background questionnaire is to find out a little more about each user."],
            ["de-be", "The purpose of the background questionnaire is to find out a little more about each user."],
        ])
    ));
    survey.setSurveyDuration(generateLocStrings(
        new Map([
            ["en", "It takes approximately 5-15 minutes to complete this questionnaire."],
            ["nl-be", "It takes approximately 5-15 minutes to complete this questionnaire."],
            ["fr-be", "It takes approximately 5-15 minutes to complete this questionnaire."],
            ["de-be", "It takes approximately 5-15 minutes to complete this questionnaire."],
        ])
    ));

    // *******************************
    // Questions
    // *******************************
    const rootItemEditor = new ItemEditor(survey.findSurveyItem(surveyKey) as SurveyGroupItem);
    rootItemEditor.setSelectionMethod({ name: 'sequential' });
    survey.updateSurveyItem(rootItemEditor.getItem());
    const rootKey = rootItemEditor.getItem().key;

    const Q_birthdate = date_of_birth(rootKey, true);
    survey.addExistingSurveyItem(Q_birthdate, rootKey);

    const Q_gender = gender(rootKey, true);
    survey.addExistingSurveyItem(Q_gender, rootKey);

    const Q_nationality = nationality(rootKey, true);
    survey.addExistingSurveyItem(Q_nationality, rootKey);

    const Q_dsi_role = dsi_role(rootKey, true);
    survey.addExistingSurveyItem(Q_dsi_role, rootKey);

    const Q_dsi_research_group = dsi_research_group(rootKey, true);
    survey.addExistingSurveyItem(Q_dsi_research_group, rootKey);

    const Q_amount_of_people = amount_of_people(rootKey, true);
    survey.addExistingSurveyItem(Q_amount_of_people, rootKey);

    // FOR TESTING PURPOSES
    survey.setAvailableFor('public');

    return survey.getSurvey();
})

export default intake;

const date_of_birth = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "What is your date of birth (year and month)?"],
            ["nl-be", "What is your date of birth (year and month)?"],
            ["fr-be", "What is your date of birth (year and month)?"],
            ["de-be", "What is your date of birth (year and month)?"],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const dateInputEditor = new ComponentEditor(undefined, {
        key: '1',
        role: 'dateInput'
    });
    dateInputEditor.setProperties({
        dateInputMode: { str: 'YM' },
        min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -3311280000) },
        max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 0) }
    })
    editor.addExistingResponseComponent(dateInputEditor.getComponent(), rg?.key);
    editor.addExistingResponseComponent({
        key: 'feedback',
        role: 'text',
        style: [{ key: 'className', value: 'fst-italic mt-1' }],
        displayCondition: expWithArgs('isDefined',
            expWithArgs('getResponseItem', editor.getItem().key, [responseGroupKey, '1'].join('.'))
        ),
        content: [
            {
                code: 'en', parts: [
                    { dtype: 'exp', exp: expWithArgs('dateResponseDiffFromNow', editor.getItem().key, [responseGroupKey, '1'].join('.'), 'years', 1) },
                    { str: ' years old' }
                ]
            },
            {
                code: 'nl-be', parts: [
                    { dtype: 'exp', exp: expWithArgs('dateResponseDiffFromNow', editor.getItem().key, [responseGroupKey, '1'].join('.'), 'years', 1) },
                    { str: ' years old' }
                ]
            },
            {
                code: 'fr-be', parts: [
                    { dtype: 'exp', exp: expWithArgs('dateResponseDiffFromNow', editor.getItem().key, [responseGroupKey, '1'].join('.'), 'years', 1) },
                    { str: ' years old' }
                ]
            },
            {
                code: 'de-be', parts: [
                    { dtype: 'exp', exp: expWithArgs('dateResponseDiffFromNow', editor.getItem().key, [responseGroupKey, '1'].join('.'), 'years', 1) },
                    { str: ' years old' }
                ]
            }
        ]
    }, rg?.key);

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

const gender = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q2';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "What is your sex?"],
            ["nl-be", "What is your sex?"],
            ["fr-be", "What is your sex?"],
            ["de-be", "What is your sex?"],
        ]))
    );


    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new Map([
                ["en", "Male"],
                ["nl-be", "Male"],
                ["fr-be", "Male"],
                ["de-be", "Male"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new Map([
                ["en", "Female"],
                ["nl-be", "Female"],
                ["fr-be", "Female"],
                ["de-be", "Female"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new Map([
                ["en", "Other"],
                ["nl-be", "Other"],
                ["fr-be", "Other"],
                ["de-be", "Other"],
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

const nationality = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q3';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "What is your nationality?"],
            ["nl-be", "What is your nationality?"],
            ["fr-be", "What is your nationality?"],
            ["de-be", "What is your nationality?"],
        ]))
    );

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

const dsi_role = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q4';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "What is your role within the DSI department?"],
            ["nl-be", "What is your role within the DSI department?"],
            ["fr-be", "What is your role within the DSI department?"],
            ["de-be", "What is your role within the DSI department?"],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: "0",
            role: "option",
            content: new Map([
                ["en", "PhD student"],
                ["nl-be", "PhD student"],
                ["fr-be", "PhD student"],
                ["de-be", "PhD student"],
            ]),
        },
        {
            key: "1",
            role: "option",
            content: new Map([
                ["en", "Post-doctoral researcher"],
                ["nl-be", "Post-doctoral researcher"],
                ["fr-be", "Post-doctoral researcher"],
                ["de-be", "Post-doctoral researcher"],
            ]),
        },
        {
            key: "2",
            role: "option",
            content: new Map([
                ["en", "Professor"],
                ["nl-be", "Professor"],
                ["fr-be", "Professor"],
                ["de-be", "Professor"],
            ]),
        },
        {
            key: "3",
            role: "option",
            content: new Map([
                ["en", "Consultant"],
                ["nl-be", "Consultant"],
                ["fr-be", "Consultant"],
                ["de-be", "Consultant"],
            ]),
        },
        {
            key: "4",
            role: "option",
            content: new Map([
                ["en", "Research/IOF manager"],
                ["nl-be", "Research/IOF manager"],
                ["fr-be", "Research/IOF manager"],
                ["de-be", "Research/IOF manager"],
            ]),
        },
        {
            key: "5",
            role: "option",
            content: new Map([
                ["en", "Administrative/IT Assistant"],
                ["nl-be", "Administrative/IT Assistant"],
                ["fr-be", "Administrative/IT Assistant"],
                ["de-be", "Administrative/IT Assistant"],
            ]),
        },
        {
            key: "6",
            role: "option",
            content: new Map([
                ["en", "Visitors"],
                ["nl-be", "Visitors"],
                ["fr-be", "Visitors"],
                ["de-be", "Visitors"],
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

const dsi_research_group = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q5';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "Which research group are you part of within the DSI?"],
            ["nl-be", "Which research group are you part of within the DSI?"],
            ["fr-be", "Which research group are you part of within the DSI?"],
            ["de-be", "Which research group are you part of within the DSI?"],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: "0",
            role: "option",
            content: new Map([
                ["en", "ACSL"],
                ["nl-be", "ACSL"],
                ["fr-be", "ACSL"],
                ["de-be", "ACSL"],
            ]),
        },
        {
            key: "1",
            role: "option",
            content: new Map([
                ["en", "Readsearch"],
                ["nl-be", "Readsearch"],
                ["fr-be", "Readsearch"],
                ["de-be", "Readsearch"],
            ]),
        },
        {
            key: "2",
            role: "option",
            content: new Map([
                ["en", "CENSTAT"],
                ["nl-be", "CENSTAT"],
                ["fr-be", "CENSTAT"],
                ["de-be", "CENSTAT"],
            ]),
        },
        {
            key: "3",
            role: "option",
            content: new Map([
                ["en", "TLAB"],
                ["nl-be", "TLAB"],
                ["fr-be", "TLAB"],
                ["de-be", "TLAB"],
            ]),
        },
        {
            key: "4",
            role: "option",
            content: new Map([
                ["en", "CMAT"],
                ["nl-be", "CMAT"],
                ["fr-be", "CMAT"],
                ["de-be", "CMAT"],
            ]),
        },
        {
            key: "5",
            role: "option",
            content: new Map([
                ["en", "RDM/ECOOM"],
                ["nl-be", "RDM/ECOOM"],
                ["fr-be", "RDM/ECOOM"],
                ["de-be", "RDM/ECOOM"],
            ]),
        },
        {
            key: "6",
            role: "option",
            content: new Map([
                ["en", "DBTI"],
                ["nl-be", "DBTI"],
                ["fr-be", "DBTI"],
                ["de-be", "DBTI"],
            ]),
        },
        {
            key: "7",
            role: "option",
            content: new Map([
                ["en", "Technology Supported Rehab"],
                ["nl-be", "Technology Supported Rehab"],
                ["fr-be", "Technology Supported Rehab"],
                ["de-be", "Technology Supported Rehab"],
            ]),
        },
        {
            key: "8",
            role: "option",
            content: new Map([
                ["en", "CORE"],
                ["nl-be", "CORE"],
                ["fr-be", "CORE"],
                ["de-be", "CORE"],
            ]),
        },
        {
            key: "9",
            role: "option",
            content: new Map([
                ["en", "Biomedical Data Science"],
                ["nl-be", "Biomedical Data Science"],
                ["fr-be", "Biomedical Data Science"],
                ["de-be", "Biomedical Data Science"],
            ]),
        },
        {
            key: "10",
            role: "option",
            content: new Map([
                ["en", "Support Staff/Others"],
                ["nl-be", "Support Staff/Others"],
                ["fr-be", "Support Staff/Others"],
                ["de-be", "Support Staff/Others"],
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

const amount_of_people = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q6';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "Report how many people (including yourself) you share the office with. Please include only those who are officially still members of the office (not resigned or graduated). If you have your own office to yourself, enter 1. "],
            ["nl-be", "Report how many people (including yourself) you share the office with. Please include only those who are officially still members of the office (not resigned or graduated). If you have your own office to yourself, enter 1. "],
            ["fr-be", "Report how many people (including yourself) you share the office with. Please include only those who are officially still members of the office (not resigned or graduated). If you have your own office to yourself, enter 1. "],
            ["de-be", "Report how many people (including yourself) you share the office with. Please include only those who are officially still members of the office (not resigned or graduated). If you have your own office to yourself, enter 1. "],
        ]))
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const textInputEditor = new ComponentEditor(undefined, {
        key: '0',
        role: 'numberInput',
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