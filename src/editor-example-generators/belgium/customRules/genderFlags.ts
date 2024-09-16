import { Expression } from "new-survey-engine/data_types/expression";
import { updateGenderFlag } from "../studyRules";

export const updateGenderCustom: {
  name: string;
  rules: Expression[];
} = {
  name: "updateGender",
  rules: [
      updateGenderFlag
  ]
}