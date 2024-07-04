import { generateId } from "lucia"

export const getRandomId = (): string => generateId(15)
