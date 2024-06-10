import { cleanupVaccination } from "./cleanupVaccination"
import { flagVaccinationActive } from "./flagVaccinationActive"
import { resetIntake } from "./resetIntake"
import { resetVaccination } from "./resetVaccination"
import { updateChildCustom } from "./updateChild"

export const customRules = [ resetIntake, resetVaccination, cleanupVaccination, updateChildCustom, flagVaccinationActive ]