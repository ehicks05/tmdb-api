import { z } from 'zod';
import { PersonSchema } from './person.js';

// fields specific to cast/crew credits
const CastSchema = z.object({ character: z.string(), order: z.number() });
const CrewSchema = z.object({ department: z.string(), job: z.string() });

// fields common to both cast and crew credits
const CreditBaseSchema = PersonSchema.pick({
	adult: true,
	gender: true,
	id: true,
	known_for_department: true,
	name: true,
	popularity: true,
	profile_path: true,
}).extend({
	credit_id: z.string(),
	original_name: z.string(),
});

export const CastCreditSchema = CreditBaseSchema.extend(CastSchema);
export type CastCredit = z.infer<typeof CastCreditSchema>;

export const CrewCreditSchema = CreditBaseSchema.extend(CrewSchema);
export type CrewCredit = z.infer<typeof CrewCreditSchema>;

export const CreditsSchema = z.object({
	cast: z.array(CastCreditSchema),
	crew: z.array(CrewCreditSchema),
});
export type Credits = z.infer<typeof CreditsSchema>;
