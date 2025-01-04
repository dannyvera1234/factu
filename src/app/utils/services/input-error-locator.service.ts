import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const DEFAULT_ERRORS = {
  required: () => 'Este campo es obligatorio.',

  email: () => 'Correo electrónico inválido.',
  minlength: (error: any) => `Este campo debe tener al menos ${error.requiredLength} caracteres.`,
  maxlength: (error: any) => `Este campo no debe tener más de ${error.requiredLength} caracteres.`,
  minArrayLength: (minArrayLength: any) => `Este campo debe tener al menos ${minArrayLength} elementos.`,
  maxArrayLength: (maxArrayLength: any) => `Este campo no debe tener más de ${maxArrayLength} elementos.`,
  min: (error: any) => `Este campo debe ser al menos ${error.min}.`,
  max: (error: any) => `Este campo no debe ser mayor a ${error.max}.`,
  pattern: () => 'El formato es inválido.',
  ONLY_LETTERS: () => 'Solo se permiten letras.',
  ONLY_NUMBERS: () => 'Solo se permiten números.',
  ONLY_NUMBERS_DECIMALS: () => 'Solo se permiten números y decimales.',
  INVALID_EMAIL: () => 'Invalid email.',
  INVALID_DATE: () => 'Invalid date.',
  INVALID_AGE: () => 'Debes ser mayor de 18 años.',
  INVALID_PROVINCE_CODE: ()=> 'Indetificador inválido.',

  // Related to phone number
  PHONE_NOT_VALID: () => 'Invalid phone number.',
  PHONE_NOT_A_NUMBER: () => 'Invalid phone number.',
  PHONE_TOO_SHORT: () => 'Invalid phone number.',
  PHONE_TOO_LONG: () => 'Invalid phone number.',
  PHONE_INVALID_LENGTH: () => 'Invalid phone number.',
  PHONE_INVALID_COUNTRY: () => 'Invalid country.',

  // Errors related to files
  FILE_INVALID_FORMAT: (fileName: string) => `el archivo "${fileName}" no es un formato válido`,
  FILE_MAX_FILES: (files: string) => `The maximum number of files allowed is ${files}`,
  FILE_INVALID_SIZE: ([fileName, maxSize]: string[]) =>
    `The file "${fileName}" exceeds the maximum allowed size of ${maxSize}.`,
  FILE_DUPLICATED: () => `One or more of the uploaded documents is duplicated`,
  MAX_FILES_PER_TYPE_EXCEEDED: (maxFiles: number) => `The maximum number of files of the same type is ${maxFiles}`,
  FILE_DOC_TYPE_REQUIRED: () => `Select the type for each document`,

  // Errors related to percentages
  INSUFFICIENT_PERCENTAGE: () => 'The sum of the percentages does not complete 100%',

  // duplicate file
  DUPLICATE_FILE: (fileName: string) => `The file "${fileName}" is duplicated.`,

  AMOUNT_GREATER_THAN_PRICE: () => 'The amount cannot be greater than the price.',

  COMMISSION_GREATER_THAN_PRICE: () => 'The commission cannot be greater than the price.',

  COMMISSION_GREATER_THAN_AMOUNT: () => 'The commission cannot be greater than the amount.',

  PERCENTAGE__INVALID: () => 'the percentage cannot exceed 100%.',

  AMOUNT_EXCEEDS_TOTAL: () => 'The amount exceeds the total.',

  DUPLICATE_INDUSTRIES: () => 'This industry is already selected.',

  PASSWORD_STRENGTH: () =>
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',

  CONTACT_ALREADY_EXISTS: () => 'This contact is already registered',

  COMPANY_ALREADY_EXISTS: () => 'This company is already registered',
};

@Injectable({
  providedIn: 'platform',
})
export class InputErrorLocatorService {
  public locate(error?: ValidationErrors | undefined | null): string {
    if (!error) return '';

    const message = error['message'];

    if (message) return message;

    for (const entry of Object.entries(DEFAULT_ERRORS)) {
      const [key, value] = entry;
      if (error[key]) return value(error[key]);
    }

    const errorAsMessage = Object.values(error).find((value) => typeof value === 'string');
    if (errorAsMessage) return errorAsMessage;

    throw new Error(`Unknown input error: ${JSON.stringify(error)}`);
  }
}
