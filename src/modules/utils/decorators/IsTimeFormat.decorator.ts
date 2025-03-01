import {
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTimeFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return true; // Empty values are validated separately
          }

          const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format of HH:MM`;
        },
      },
    });
  };
}
