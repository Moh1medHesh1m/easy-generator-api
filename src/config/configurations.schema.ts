import * as Joi from 'joi';

export const configurationsSchemaValidation = Joi.object({
  server: {
    port: Joi.number().required(),
  },
  mongo: {
    uri: Joi.string().required(),
  },
  urls: {
    frontend: Joi.string().required(),
  },
});
