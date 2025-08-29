export const logger = {
  error: (message: string, context: any = {}) => {
    console.error(`[ERROR] ${message}`, context);
  },

  info: (message: string, context: any = {}) => {
    console.info(`[INFO] ${message}`, context);
  },

  debug: (message: string, context: any = {}) => {
    console.debug(`[DEBUG] ${message}`, context);
  }
};

