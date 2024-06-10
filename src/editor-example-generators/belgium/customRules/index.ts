import { cleanupVaccination } from "./cleanupVaccination"
import { enableVaccination } from "./enableVaccination"
import { disableVaccination } from "./disableVaccination"
import { resetIntake } from "./resetIntake"
import { resetVaccination } from "./resetVaccination"
import { updateChildCustom } from "./updateChild"

export const customRules = [ resetIntake, resetVaccination, cleanupVaccination, updateChildCustom, enableVaccination, disableVaccination ]