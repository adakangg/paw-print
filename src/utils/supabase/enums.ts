const ageUnits = ['years', 'months'] as const
const weightUnits = ['lbs', 'oz'] as const
const procedureType = ['vaccine', 'surgery', 'other'] as const
const personnelType =  ['vet', 'grooming', 'boarding', 'daily', 'other'] as const
const petSpecies = ['dog', 'cat', 'bird', 'reptile', 'small_animal', 'fish', 'other'] as const
const petSexes = ['Male', 'Female', 'Unknown'] as const 
const scheduleType = ['daily', 'weekly', 'once'] as const
const foodScheduleType = ['AM', 'PM', 'AM/PM', 'other'] as const

export { ageUnits, weightUnits, procedureType, personnelType, petSexes, petSpecies, scheduleType, foodScheduleType }