import dayjs from 'dayjs';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export const schemaHelper = {
  /**
   * Phone number
   * Apply for phone number input.
   */
  phoneNumber: (props) =>
    zod
      .string({
        required_error: props?.message?.required ?? 'شماره ی موبایل اجباری است',
        invalid_type_error: props?.message?.invalid_type ?? 'شماره ی موبایل معتبر نیست',
      })
      .min(1, { message: props?.message?.required ?? 'شماره ی موبایل اجباری است' })
      .refine((data) => props?.isValid?.(data), {
        message: props?.message?.invalid_type ?? 'شماره ی موبایل معتبر نیست',
      }),
  /**
   * Date
   * Apply for date pickers.
   */
  date: (props) =>
    zod
      .union([
        zod.string(),
        zod.number(),
        zod.date(),
        zod.null(),
        zod.custom((value) => dayjs(value).isValid()),
      ])
      .transform((value, ctx) => {
        if (value === null || value === undefined || value === '') {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required ?? 'تاریخ اجباری است',
          });

          return null;
        }

        const isValid = dayjs(value).isValid();

        if (!isValid) {
          ctx.addIssue({
            code: zod.ZodIssueCode.invalid_date,
            message: props?.message?.invalid_type ?? 'تاریخ معتبر نیست',
          });
        }

        return value;
      }),
  /**
   * Editor
   * defaultValue === '' | <p></p>
   * Apply for editor
   */
  editor: (props) => zod.string().min(8, { message: props?.message ?? 'محتوا اجباری است!' }),
  /**
   * Nullable Input
   * Apply for input, select... with null value.
   */
  nullableInput: (schema, options) =>
    schema.nullable().transform((val, ctx) => {
      if (val === null || val === undefined) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: options?.message ?? 'فیلد اجباری',
        });
        return val;
      }
      return val;
    }),
  /**
   * Boolean
   * Apply for checkbox, switch...
   */
  boolean: (props) =>
    zod.boolean().refine((val) => val, {
      message: props?.message ?? 'فیلد اجباری',
    }),
  /**
   * Slider
   * Apply for slider with range [min, max].
   */
  sliderRange: (props) =>
    zod
      .number()
      .array()
      .refine((data) => data[0] >= props?.min && data[1] <= props?.max, {
        message: props.message ?? `مقدار باید بین ${props?.min} و ${props?.max} باشد`,
      }),
  /**
   * File
   * Apply for upload single file.
   */
  file: (props) =>
    zod.custom().transform((data, ctx) => {
      const hasFile =
        (props?.optional && (data === null || data === undefined)) ||
        data instanceof File ||
        data?.path ||
        (typeof data === 'string' && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message ?? 'انتخاب فایل اجباری است',
        });
        return null;
      }

      return data;
    }),
  /**
   * Files
   * Apply for upload multiple files.
   */
  files: (props) =>
    zod.array(zod.custom()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 2;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message ?? 'انتخاب فایل اجباری ست',
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `انتخاب حداقل ${minFiles} فایل اجباری ست`,
        });
      }

      return data;
    }),
};

// ----------------------------------------------------------------------

/**
 * Test one or multiple values against a Zod schema.
 */
export function testCase(schema, inputs) {
  const textGreen = (text) => `\x1b[32m${text}\x1b[0m`;
  const textRed = (text) => `\x1b[31m${text}\x1b[0m`;
  const textGray = (text) => `\x1b[90m${text}\x1b[0m`;

  inputs.forEach((input) => {
    const result = schema.safeParse(input);
    const type = textGray(`(${typeof input})`);
    const value = JSON.stringify(input);

    const successValue = textGreen(`✅ Valid - ${value}`);
    const errorValue = textRed(`❌ Error - ${value}`);

    if (!result.success) {
      console.info(`${errorValue} ${type}:`, JSON.stringify(result.error.format(), null, 2));
    } else {
      console.info(`${successValue} ${type}:`, JSON.stringify(result.data, null, 2));
    }
  });
}

// Example usage:
// testCase(schemaHelper.boolean(), [true, false, 'true', 'false', '', 1, 0, null, undefined]);

// testCase(schemaHelper.date(), [
//   '2025-04-10',
//   1712736000000,
//   new Date(),
//   '2025-02-30',
//   '04/10/2025',
//   'not-a-date',
//   '',
//   null,
//   undefined,
// ]);

// testCase(
//   schemaHelper.nullableInput(
//     zod
//       .number({ coerce: true })
//       .int()
//       .min(1, { message: 'Age is required!' })
//       .max(80, { message: 'Age must be between 1 and 80' })
//   ),
//   [2, '2', 79, '79', 81, '81', null, undefined]
// );
