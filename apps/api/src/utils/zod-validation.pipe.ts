import {
  HttpStatus,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

function zodErrorsToFieldMap(error: ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const path = issue.path.join('.') || 'root';
    errors[path] = issue.message;
    return errors;
  }, {});
}

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: zodErrorsToFieldMap(result.error),
      });
    }

    return result.data;
  }
}
