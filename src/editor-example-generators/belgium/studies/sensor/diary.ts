import { Survey, SurveyItem, SurveyGroupItem } from "survey-engine/data_types";
import { ItemEditor } from "../../../../editor-engine/survey-editor/item-editor";
import { SurveyEditor } from "case-editor-tools/surveys/survey-editor/survey-editor";
import { generateLocStrings, generateTitleComponent, expWithArgs, generateHelpGroupComponent } from "../../../../editor-engine/utils/simple-generators";
import { responseGroupKey } from "../../../common_question_pool/key-definitions";
import { initMultipleChoiceGroup, initSingleChoiceGroup } from "../../../../editor-engine/utils/question-type-generator";
import { singleChoiceKey } from "../../../common_question_pool/key-definitions";
import { ComponentEditor } from "../../../../editor-engine/survey-editor/component-editor";
import { multipleChoiceKey } from "case-editor-tools/constants/key-definitions";
import { initMatrixQuestion, HeaderRow, ResponseRow, ResponseRowCell, RadioRow } from "case-editor-tools/surveys/responseTypeGenerators/matrixGroupComponent";

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
            ["en", "It takes approximately 1-5 minutes to complete this questionnaire."],
            ["nl-be", "It takes approximately 1-5 minutes to complete this questionnaire."],
            ["fr-be", "It takes approximately 1-5 minutes to complete this questionnaire."],
            ["de-be", "It takes approximately 1-5 minutes to complete this questionnaire."],
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

    const Q_contactsMatrix = contactsMatrix(rootKey, true);
    survey.addExistingSurveyItem(Q_contactsMatrix, rootKey);

    const Q_meetingMatrix = meetingMatrix(rootKey, true);
    survey.addExistingSurveyItem(Q_meetingMatrix, rootKey);

    const Q_teachingMatrix = teachingMatrkx(rootKey, true);
    survey.addExistingSurveyItem(Q_teachingMatrix, rootKey);

    // FOR TESTING PURPOSES
    // survey.setAvailableFor('public');
    
    const surveyObject = survey.getSurvey();
    surveyObject.requireLoginBeforeSubmission = true;

    return surveyObject;
})

export default diary;


const date = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q1';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(
            new Map([
                ["en", "What date will you be reporting on?"],
                ["nl-be", "What date will you be reporting on?"],
                ["fr-be", "What date will you be reporting on?"],
                ["de-be", "What date will you be reporting on?"],
            ]),
            new Map([
                ["en", "In the following questions 'today' refers to the date you are reporting on."],
                ["nl-be", "In the following questions 'today' refers to the date you are reporting on."],
                ["fr-be", "In the following questions 'today' refers to the date you are reporting on."],
                ["de-be", "In the following questions 'today' refers to the date you are reporting on."],
            ])
        ),
        
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
        generateTitleComponent(
            new Map([
                ["en", "Are you working from your office on the Diepenbeek campus today?"],
                ["nl-be", "Are you working from your office on the Diepenbeek campus today?"],
                ["fr-be", "Are you working from your office on the Diepenbeek campus today?"],
                ["de-be", "Are you working from your office on the Diepenbeek campus today?"],
            ]),
            new Map([
                ["en", "Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location."],
                ["nl-be", "Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location."],
                ["fr-be", "Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location."],
                ["de-be", "Consider working from your office if you spend any time at the Diepenbeek campus - Hasselt University -, even if you only worked partially from this location."],
            ])
        ),
        
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

const contactsMatrix = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q3';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: true });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(
            new Map([
                ["en", "Contacts - A contact is defined as an in-person interaction where you exchanged at least a few words (less than 1.5m), or where you had a physical touch (e.g, a handshake, embracing, kissing)."],
                ["nl-be", "Contacts - A contact is defined as an in-person interaction where you exchanged at least a few words (less than 1.5m), or where you had a physical touch (e.g, a handshake, embracing, kissing)."],
                ["fr-be", "Contacts - A contact is defined as an in-person interaction where you exchanged at least a few words (less than 1.5m), or where you had a physical touch (e.g, a handshake, embracing, kissing)."],
                ["de-be", "Contacts - A contact is defined as an in-person interaction where you exchanged at least a few words (less than 1.5m), or where you had a physical touch (e.g, a handshake, embracing, kissing)."],
            ]),
            new Map([
                ["en", "Report here the contacts you had during the working day (08h00-17h00) while not wearing the sensor, or while wearing the sensor and interacting with DSI or non-DSI members not wearing a sensor. Please report all the contacts that you had during the working day, even if not work-related. If you have work-related contacts outside the working day interval, please report them too. (Do not account here for teaching activities, meetings and academic events.)"],
                ["nl-be", "Report here the contacts you had during the working day (08h00-17h00) while not wearing the sensor, or while wearing the sensor and interacting with DSI or non-DSI members not wearing a sensor. Please report all the contacts that you had during the working day, even if not work-related. If you have work-related contacts outside the working day interval, please report them too. (Do not account here for teaching activities, meetings and academic events.)"],
                ["fr-be", "Report here the contacts you had during the working day (08h00-17h00) while not wearing the sensor, or while wearing the sensor and interacting with DSI or non-DSI members not wearing a sensor. Please report all the contacts that you had during the working day, even if not work-related. If you have work-related contacts outside the working day interval, please report them too. (Do not account here for teaching activities, meetings and academic events.)"],
                ["de-be", "Report here the contacts you had during the working day (08h00-17h00) while not wearing the sensor, or while wearing the sensor and interacting with DSI or non-DSI members not wearing a sensor. Please report all the contacts that you had during the working day, even if not work-related. If you have work-related contacts outside the working day interval, please report them too. (Do not account here for teaching activities, meetings and academic events.)"],
            ])
        )
    );

    // HEADER ROW
    const headerRow: HeaderRow = {
        role: 'headerRow',
        key: 'header',
        cells: [
            {
                role: 'text', 
                key: 'ageRange', 
                content: new Map([
                    ["en", "Age group of the contacted person."],
                    ["nl-be", "Age group of the contacted person."],
                    ["fr-be", "Age group of the contacted person."],
                    ["de-be", "Age group of the contacted person."],
                ])
            },
            {
                role: 'text', 
                key: 'gender', 
                content: new Map([
                    ["en", "Gender"],
                    ["nl-be", "Gender"],
                    ["fr-be", "Gender"],
                    ["de-be", "Gender"],
                ])
            },
            {
                role: 'text', 
                key: 'withinWorkingDay', 
                content: new Map([
                    ["en", "Within the working day? (08:00 - 17:00)"],
                    ["nl-be", "Within the working day? (08:00 - 17:00)"],
                    ["fr-be", "Within the working day? (08:00 - 17:00)"],
                    ["de-be", "Within the working day? (08:00 - 17:00)"],
                ])
            },
            {
                role: 'text', 
                key: 'isDSIMember', 
                content: new Map([
                    ["en", "Is the contacted person a member of DSI?"],
                    ["nl-be", "Is the contacted person a member of DSI?"],
                    ["fr-be", "Is the contacted person a member of DSI?"],
                    ["de-be", "Is the contacted person a member of DSI?"],
                ])
            },
            {
                role: 'text', 
                key: 'contactFrequency', 
                content: new Map([
                    ["en", "How often do you have contact with this person in general?"],
                    ["nl-be", "How often do you have contact with this person in general?"],
                    ["fr-be", "How often do you have contact with this person in general?"],
                    ["de-be", "How often do you have contact with this person in general?"],
                ])
            },
            {
                role: 'text', 
                key: 'timeSpent', 
                content: new Map([
                    ["en", "Total time spent with the person during the whole day?"],
                    ["nl-be", "Total time spent with the person during the whole day?"],
                    ["fr-be", "Total time spent with the person during the whole day?"],
                    ["de-be", "Total time spent with the person during the whole day?"],
                ])
            },
        ]
    };

    // RESPONSE CELLS
    const rowCells: ResponseRowCell[] = [
       {role: 'dropDownGroup', key: 'ageRange', items: [
        {
            'key': '0',
            role: 'option',
            content: new Map([
                ["en", "Under 1"],
                ["nl-be", "Under 1"],
                ["fr-be", "Under 1"],
                ["de-be", "Under 1"],
            ])
        },
        {
            'key': '1',
            role: 'option',
            content: new Map([
                ["en", "1-4"],
                ["nl-be", "1-4"],
                ["fr-be", "1-4"],
                ["de-be", "1-4"],
            ])
        },
        {
            'key': '2',
            role: 'option',
            content: new Map([
                ["en", "5-9"],
                ["nl-be", "5-9"],
                ["fr-be", "5-9"],
                ["de-be", "5-9"],
            ])
        },
        {
            'key': '3',
            role: 'option',
            content: new Map([
                ["en", "10-14"],
                ["nl-be", "10-14"],
                ["fr-be", "10-14"],
                ["de-be", "10-14"],
            ])
        },
        {
            'key': '4',
            role: 'option',
            content: new Map([
                ["en", "15-19"],
                ["nl-be", "15-19"],
                ["fr-be", "15-19"],
                ["de-be", "15-19"],
            ])
        },
        {
            'key': '5',
            role: 'option',
            content: new Map([
                ["en", "20-24"],
                ["nl-be", "20-24"],
                ["fr-be", "20-24"],
                ["de-be", "20-24"],
            ])
        },
        {
            'key': '6',
            role: 'option',
            content: new Map([
                ["en", "25-34"],
                ["nl-be", "25-34"],
                ["fr-be", "25-34"],
                ["de-be", "25-34"],
            ])
        },
        {
            'key': '7',
            role: 'option',
            content: new Map([
                ["en", "35-44"],
                ["nl-be", "35-44"],
                ["fr-be", "35-44"],
                ["de-be", "35-44"],
            ])
        },
        {
            'key': '8',
            role: 'option',
            content: new Map([
                ["en", "45-54"],
                ["nl-be", "45-54"],
                ["fr-be", "45-54"],
                ["de-be", "45-54"],
            ])
        },
        {
            'key': '9',
            role: 'option',
            content: new Map([
                ["en", "55-64"],
                ["nl-be", "55-64"],
                ["fr-be", "55-64"],
                ["de-be", "55-64"],
            ])
        },
        {
            'key': '10',
            role: 'option',
            content: new Map([
                ["en", "65-69"],
                ["nl-be", "65-69"],
                ["fr-be", "65-69"],
                ["de-be", "65-69"],
            ])
        },
        {
            'key': '11',
            role: 'option',
            content: new Map([
                ["en", "70-74"],
                ["nl-be", "70-74"],
                ["fr-be", "70-74"],
                ["de-be", "70-74"],
            ])
        },
        {
            'key': '12',
            role: 'option',
            content: new Map([
                ["en", "75-79"],
                ["nl-be", "75-79"],
                ["fr-be", "75-79"],
                ["de-be", "75-79"],
            ])
        },
        {
            'key': '13',
            role: 'option',
            content: new Map([
                ["en", "80-84"],
                ["nl-be", "80-84"],
                ["fr-be", "80-84"],
                ["de-be", "80-84"],
            ])
        },
        {
            'key': '14',
            role: 'option',
            content: new Map([
                ["en", "85+"],
                ["nl-be", "85+"],
                ["fr-be", "85+"],
                ["de-be", "85+"],
            ])
        },
        {
            'key': '15',
            role: 'option',
            content: new Map([
                ["en", "Don't know"],
                ["nl-be", "Don't know"],
                ["fr-be", "Don't know"],
                ["de-be", "Don't know"],
            ])
        },
        {
            'key': '16',
            role: 'option',
            content: new Map([
                ["en", "Prefer not to answer"],
                ["nl-be", "Prefer not to answer"],
                ["fr-be", "Prefer not to answer"],
                ["de-be", "Prefer not to answer"],
            ])
        },
       ]},
       {role: 'dropDownGroup', key: 'gender', items: [
        {
            key: '0',
            role: 'option',
            content: new Map([
                ["en", "Male"],
                ["nl-be", "Male"],
                ["fr-be", "Male"],
                ["de-be", "Male"],
            ])
        },
        {
            key: '1',
            role: 'option',
            content: new Map([
                ["en", "Female"],
                ["nl-be", "Female"],
                ["fr-be", "Female"],
                ["de-be", "Female"],
            ])
        },
        {
            key: '2',
            role: 'option',
            content: new Map([
                ["en", "Other"],
                ["nl-be", "Other"],
                ["fr-be", "Other"],
                ["de-be", "Other"],
            ])
        },
       ]},
       {role: 'check', key: 'withinWorkingDay'},
       {role: 'check', key: 'isDSIMember'},
       {role: 'dropDownGroup', key: 'contactFrequency', items: [
        {
            key: '0',
            role: 'option',
            content: new Map([
                ["en", "Daily"],
                ["nl-be", "Daily"],
                ["fr-be", "Daily"],
                ["de-be", "Daily"],
            ])
        },
        {
            key: '1',
            role: 'option',
            content: new Map([
                ["en", "Weekly"],
                ["nl-be", "Weekly"],
                ["fr-be", "Weekly"],
                ["de-be", "Weekly"],
            ])
        },
        {
            key: '2',
            role: 'option',
            content: new Map([
                ["en", "Monthly"],
                ["nl-be", "Monthly"],
                ["fr-be", "Monthly"],
                ["de-be", "Monthly"],
            ])
        },
        {
            key: '4',
            role: 'option',
            content: new Map([
                ["en", "A few times a year"],
                ["nl-be", "A few times a year"],
                ["fr-be", "A few times a year"],
                ["de-be", "A few times a year"],
            ])
        },
        {
            key: '5',
            role: 'option',
            content: new Map([
                ["en", "For the first time"],
                ["nl-be", "For the first time"],
                ["fr-be", "For the first time"],
                ["de-be", "For the first time"],
            ])
        },
       ]},
       {role: 'dropDownGroup', key: 'timeSpent', items: [
        {
            key: '0',
            role: 'option',
            content: new Map([
                ["en", "Less than 5 minutes"],
                ["nl-be", "Less than 5 minutes"],
                ["fr-be", "Less than 5 minutes"],
                ["de-be", "Less than 5 minutes"],
            ])
        },
        {
            key: '1',
            role: 'option',
            content: new Map([
                ["en", "5-15 minutes"],
                ["nl-be", "5-15 minutes"],
                ["fr-be", "5-15 minutes"],
                ["de-be", "5-15 minutes"],
            ])
        },
        {
            key: '2',
            role: 'option',
            content: new Map([
                ["en", "15-60 minutes"],
                ["nl-be", "15-60 minutes"],
                ["fr-be", "15-60 minutes"],
                ["de-be", "15-60 minutes"],
            ])
        },
        {
            key: '3',
            role: 'option',
            content: new Map([
                ["en", "1-4 hours"],
                ["nl-be", "1-4 hours"],
                ["fr-be", "1-4 hours"],
                ["de-be", "1-4 hours"],
            ])
        },
        {
            key: '4',
            role: 'option',
            content: new Map([
                ["en", "Over 4 hours"],
                ["nl-be", "Over 4 hours"],
                ["fr-be", "Over 4 hours"],
                ["de-be", "Over 4 hours"],
            ])
        },
       ]},
    ]

    // BUILD ROWS
    const amountOfRows = 30;
    const rows: ResponseRow[] = [];
    for (let i = 0; i < amountOfRows; i++) {
        const row: ResponseRow = {
            role: 'responseRow',
            key: i.toString(),
            cells: rowCells,
        };
        rows.push(row);
    }

    // ADD MATRIX QUESTION
    const matrix = initMatrixQuestion(itemKey, [headerRow, ...rows]);

    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent(matrix, rg?.key);

    // VALIDATION
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'soft',
            rule: expWithArgs('allRowsFilled', itemKey, 'responseGroup')
        });
    }



    return editor.getItem();
    
}

const meetingMatrix = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q4';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: true });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(
            new Map([
                ["en", "Meetings or academic events"],
                ["nl-be", "Meetings or academic events"],
                ["fr-be", "Meetings or academic events"],
                ["de-be", "Meetings or academic events"],
            ]),
            new Map([
                ["en", "Did you participate in any meeting, seminar, workshop today in person? If yes, please provide the duration, the estimated number of attendees (please include the DSI members in the attendance), if it took place at the campus Diepenbeek within the working day."],
                ["nl-be", "Did you participate in any meeting, seminar, workshop today in person? If yes, please provide the duration, the estimated number of attendees (please include the DSI members in the attendance), if it took place at the campus Diepenbeek within the working day."],
                ["fr-be", "Did you participate in any meeting, seminar, workshop today in person? If yes, please provide the duration, the estimated number of attendees (please include the DSI members in the attendance), if it took place at the campus Diepenbeek within the working day."],
                ["de-be", "Did you participate in any meeting, seminar, workshop today in person? If yes, please provide the duration, the estimated number of attendees (please include the DSI members in the attendance), if it took place at the campus Diepenbeek within the working day."],
            ])
        )
    );

    // HEADER ROW
    const headerRow: HeaderRow = {
        role: 'headerRow',
        key: 'header',
        cells: [
            {
                role: 'text', 
                key: 'activity', 
                content: new Map([
                    ["en", "Type"],
                    ["nl-be", "Type"],
                    ["fr-be", "Type"],
                    ["de-be", "Type"],
                ])
            },
            {
                role: 'text', 
                key: 'onCampus', 
                content: new Map([
                    ["en", "At the Diepenbeek campus?"],
                    ["nl-be", "At the Diepenbeek campus?"],
                    ["fr-be", "At the Diepenbeek campus?"],
                    ["de-be", "At the Diepenbeek campus?"],
                ])
            },
            {
                role: 'text', 
                key: 'withinWorkingDay', 
                content: new Map([
                    ["en", "Within the working day? (08:00 - 17:00)"],
                    ["nl-be", "Within the working day? (08:00 - 17:00)"],
                    ["fr-be", "Within the working day? (08:00 - 17:00)"],
                    ["de-be", "Within the working day? (08:00 - 17:00)"],
                ])
            },
            {
                role: 'text', 
                key: 'numberAttendees', 
                content: new Map([
                    ["en", "Number of attendees"],
                    ["nl-be", "Number of attendees"],
                    ["fr-be", "Number of attendees"],
                    ["de-be", "Number of attendees"],
                ])
            },
            {
                role: 'text', 
                key: 'duration', 
                content: new Map([
                    ["en", "Duration (minutes)"],
                    ["nl-be", "Duration (minutes)"],
                    ["fr-be", "Duration (minutes)"],
                    ["de-be", "Duration (minutes)"],
                ])
            }
        ]
    };

    // RESPONSE CELLS
    const rowCells: ResponseRowCell[] = [
        {role: 'dropDownGroup', key: 'activity', items: [
            {
                'key': '0', 
                role: 'option', 
                content: new Map([
                    ["en", "Meeting"], 
                    ["nl-be", "Meeting"], 
                    ["fr-be", "Meeting"], 
                    ["de-be", "Meeting"]
                ])
            },
            {
                'key': '1', 
                role: 'option', 
                content: new Map([
                    ["en", "Seminar"], 
                    ["nl-be", "Seminar"], 
                    ["fr-be", "Seminar"], 
                    ["de-be", "Seminar"]
                ])
            },
            {
                'key': '2', 
                role: 'option', 
                content: new Map([
                    ["en", "Workshop"], 
                    ["nl-be", "Workshop"], 
                    ["fr-be", "Workshop"], 
                    ["de-be", "Workshop"]
                ])
            },
            {
                'key': '3', 
                role: 'option', 
                content: new Map([
                    ["en", "Other"], 
                    ["nl-be", "Other"], 
                    ["fr-be", "Other"], 
                    ["de-be", "Other"]
                ])
            },
        ]},
        {role: 'check', key: 'onCampus'},
        {role: 'check', key: 'withinWorkingDay'},
        {role: 'numberInput', key: 'numberAttendees'},
        {role: 'numberInput', key: 'duration'},
    ]

    // BUILD ROWS
    const amountOfRows = 10;
    const rows: ResponseRow[] = [];
    for (let i = 0; i < amountOfRows; i++) {
        const row: ResponseRow = {
            role: 'responseRow',
            key: i.toString(),
            cells: rowCells,
        };
        rows.push(row);
    }

    // ADD MATRIX QUESTION
    const matrix = initMatrixQuestion(itemKey, [headerRow, ...rows]);

    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent(matrix, rg?.key);

    // VALIDATION
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'soft',
            rule: expWithArgs('allRowsFilled', itemKey, 'responseGroup')
        });
    }



    return editor.getItem();
    
}

const teachingMatrkx = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q5';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: true });

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(
            new Map([
                ["en", "Teaching activities"],
                ["nl-be", "Teaching activities"],
                ["fr-be", "Teaching activities"],
                ["de-be", "Teaching activities"],
            ]),
            new Map([
                ["en", "Have you been conducting in-person teaching activities today? If yes, please list the type of activities among: lecture, workshop, seminar, others, and report the duration and an estimate of the number of attendees."],
                ["nl-be", "Have you been conducting in-person teaching activities today? If yes, please list the type of activities among: lecture, workshop, seminar, others, and report the duration and an estimate of the number of attendees."],
                ["fr-be", "Have you been conducting in-person teaching activities today? If yes, please list the type of activities among: lecture, workshop, seminar, others, and report the duration and an estimate of the number of attendees."],
                ["de-be", "Have you been conducting in-person teaching activities today? If yes, please list the type of activities among: lecture, workshop, seminar, others, and report the duration and an estimate of the number of attendees."],
            ])
        )
    );

    // HEADER ROW
    const headerRow: HeaderRow = {
        role: 'headerRow',
        key: 'header',  
        cells: [
            {
                role: 'text', 
                key: 'activity', 
                content: new Map([
                    ["en", "Teaching activity"],
                    ["nl-be", "Teaching activity"],
                    ["fr-be", "Teaching activity"],
                    ["de-be", "Teaching activity"],
                ])
            },
            {
                role: 'text', 
                key: 'onCampus', 
                content: new Map([
                    ["en", "At the Diepenbeek campus?"],
                    ["nl-be", "At the Diepenbeek campus?"],
                    ["fr-be", "At the Diepenbeek campus?"],
                    ["de-be", "At the Diepenbeek campus?"],
                ])
            },
            {
                role: 'text', 
                key: 'withinWorkingDay', 
                content: new Map([
                    ["en", "Within the working day? (08:00 - 17:00)"],
                    ["nl-be", "Within the working day? (08:00 - 17:00)"],
                    ["fr-be", "Within the working day? (08:00 - 17:00)"],
                    ["de-be", "Within the working day? (08:00 - 17:00)"],
                ])
            },
            {
                role: 'text', 
                key: 'numberAttendees', 
                content: new Map([
                    ["en", "Number of attendees"],
                    ["nl-be", "Number of attendees"],
                    ["fr-be", "Number of attendees"],
                    ["de-be", "Number of attendees"],
                ])
            },
            {
                role: 'text', 
                key: 'duration', 
                content: new Map([
                    ["en", "Duration (minutes)"],
                    ["nl-be", "Duration (minutes)"],
                    ["fr-be", "Duration (minutes)"],
                    ["de-be", "Duration (minutes)"],
                ])
            }
        ]
    };

    // RESPONSE CELLS
    const rowCells: ResponseRowCell[] = [
        {role: 'dropDownGroup', key: 'activity', items: [
            {
                key: '0',
                role: 'option',
                content: new Map([
                    ["en", "Lecture"],
                    ["nl-be", "Lecture"],
                    ["fr-be", "Lecture"],
                    ["de-be", "Lecture"],
                ])
            },
            {
                key: '1',
                role: 'option',
                content: new Map([
                    ["en", "Workshop"],
                    ["nl-be", "Workshop"],
                    ["fr-be", "Workshop"],
                    ["de-be", "Workshop"],
                ])
            },
            {
                key: '2',
                role: 'option',
                content: new Map([
                    ["en", "Seminar"],
                    ["nl-be", "Seminar"],
                    ["fr-be", "Seminar"],
                    ["de-be", "Seminar"],
                ])
            },
            {
                key: '3',
                role: 'option',
                content: new Map([
                    ["en", "Other"],
                    ["nl-be", "Other"],
                    ["fr-be", "Other"],
                    ["de-be", "Other"],
                ])
            },
        ]},
        {role: 'check', key: 'onCampus'},
        {role: 'check', key: 'withinWorkingDay'},
        {role: 'numberInput', key: 'numberAttendees'},
        {role: 'numberInput', key: 'duration'},
    ]

    // BUILD ROWS
    const amountOfRows = 5;
    const rows: ResponseRow[] = [];
    for (let i = 0; i < amountOfRows; i++) {
        const row: ResponseRow = {
            role: 'responseRow',
            key: i.toString(),
            cells: rowCells,
        };
        rows.push(row);
    }

    // ADD MATRIX QUESTION
    const matrix = initMatrixQuestion(itemKey, [headerRow, ...rows]);

    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent(matrix, rg?.key);

    // VALIDATION
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'soft',
            rule: expWithArgs('allRowsFilled', itemKey, 'responseGroup')
        });
    }



    return editor.getItem();
    
}

