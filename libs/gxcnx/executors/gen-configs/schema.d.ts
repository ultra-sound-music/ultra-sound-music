export type GenConfigsExecutorSchema = {
  // NX does not provide a way to pass configs to dependent builds, as a result we use NODE_ENV to determine buildMode
  // buildMode = process.env.NODE_ENV === 'production' ? 'production' : 'development',
  buildMode: 'production' | 'development';
  app: string;
};
