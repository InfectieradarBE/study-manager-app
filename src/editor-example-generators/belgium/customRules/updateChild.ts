import { Expression } from "new-survey-engine/data_types/expression";
import { updateChild } from "../studyRules";

export const updateChildCustom: {
  name: string;
  rules: Expression[];
} = {
  name: "updateChild",
  rules: [
      updateChild
  ]
}