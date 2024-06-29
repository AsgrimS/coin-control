export const frequency = ["weekly", "monthly"] as const
export type Frequency = (typeof frequency)[number]
export enum FrequencyEnum {
	Weekly = "weekly",
	Monthly = "monthly"
}
