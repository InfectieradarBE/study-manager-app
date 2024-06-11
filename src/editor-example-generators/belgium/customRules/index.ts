import { cleanupVaccination } from "./cleanupVaccination"
import { enableVaccination, disableVaccination } from "./vaccinationFlags"
import { resetIntake } from "./resetIntake"
import { resetVaccination } from "./resetVaccination"
import { updateChildCustom } from "./updateChild"

export const customRules = [ resetIntake, resetVaccination, cleanupVaccination, updateChildCustom, enableVaccination, disableVaccination ]