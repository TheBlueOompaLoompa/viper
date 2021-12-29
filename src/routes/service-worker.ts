import { build, files, timestamp } from '$service-worker';

const cache = new Cache();

cache.addAll(build);