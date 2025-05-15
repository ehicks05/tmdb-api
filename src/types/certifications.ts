import { z } from 'zod/v4';

export const CertificationSchema = z.object({
	certification: z.string(),
	meaning: z.string(),
	order: z.int(),
});
export type Certification = z.infer<typeof CertificationSchema>;

export const CertificationResponseSchema = z.object({
	certifications: z.record(z.string(), z.array(CertificationSchema)),
});
export type CertificationResponse = z.infer<typeof CertificationResponseSchema>;
