import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { parse } from 'date-fns';

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!value) {
            return true; // Empty values are validated separately
          }

          const date = parse(value, 'dd/MM/yyyy', new Date());
          return (
            date.getDate() === parseInt(value.slice(0, 2), 10) &&
            date.getMonth() === parseInt(value.slice(3, 5), 10) - 1 &&
            date.getFullYear() === parseInt(value.slice(6, 10), 10)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format of DD/MM/YYYY`;
        },
      },
    });
  };
}
