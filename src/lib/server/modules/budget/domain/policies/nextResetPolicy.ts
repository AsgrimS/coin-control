import { Policy } from "$lib/server/shared/policy"
import { ResetDateVO } from "../value-objects/resetDate"
import type { ResetFrequencyVO } from "../value-objects/resetFrequency"

export class NextResetPolicy extends Policy {
	private constructor(private readonly resetFrequency: ResetFrequencyVO) {
		super()
	}

	static from(resetFrequency: ResetFrequencyVO): NextResetPolicy {
		return new NextResetPolicy(resetFrequency)
	}

	getNextResetDate(): ResetDateVO {
		const nextResetDate = new Date()

		if (this.resetFrequency.Value === "weekly") {
			nextResetDate.setDate(nextResetDate.getDate() + 7)
		} else {
			nextResetDate.setMonth(nextResetDate.getMonth() + 1)
		}

		return ResetDateVO.fromDB(nextResetDate)
	}
}
