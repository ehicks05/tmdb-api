import { defineConfig } from 'vitest/config';
import {
	BaseSequencer,
	type TestSpecification,
	type Vitest as VitestFromVitestNode,
} from 'vitest/node';

export default defineConfig({
	test: {
		sequence: {
			sequencer: class Seqencer extends BaseSequencer {
				protected ctx: VitestFromVitestNode;

				constructor(ctx: VitestFromVitestNode) {
					super(ctx);
					this.ctx = ctx;
				}

				async shard(files: TestSpecification[]) {
					return files;
				}

				async sort(files: TestSpecification[]) {
					const changesTestIndex = files.findIndex((file) =>
						file.moduleId.includes('changes.test.ts'),
					);
					const changesTest = files.splice(changesTestIndex, 1)[0];

					const discoverTestIndex = files.findIndex((file) =>
						file.moduleId.includes('discover.test.ts'),
					);
					const discoverTest = files.splice(discoverTestIndex, 1)[0];

					const rateLimitTestIndex = files.findIndex((file) =>
						file.moduleId.includes('rateLimit.test.ts'),
					);
					const rateLimitTest = files.splice(rateLimitTestIndex, 1)[0];

					const heavyTestsLast = [
						...files,
						changesTest,
						discoverTest,
						rateLimitTest,
					];

					return heavyTestsLast;
				}
			},
		},
	},
});
