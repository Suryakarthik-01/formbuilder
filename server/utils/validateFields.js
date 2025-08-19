const Joi = require('joi');

// Field validation schemas
const fieldSchemas = {
  text: Joi.string().trim(),
  email: Joi.string().email(),
  number: Joi.number(),
  textarea: Joi.string().trim(),
  select: Joi.string(),
  radio: Joi.string(),
  checkbox: Joi.alternatives().try(
    Joi.boolean(),
    Joi.array().items(Joi.string())
  ),
  file: Joi.any(),
  date: Joi.date().iso(),
  url: Joi.string().uri(),
  tel: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/)
};

const validateSubmissionData = (formFields, submissionData) => {
  const errors = [];
  const validatedData = {};

  for (const field of formFields) {
    const value = submissionData[field.id];
    
    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field.label} is required`);
      continue;
    }

    // Skip validation if field is not required and empty
    if (!field.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Get base schema for field type
    let schema = fieldSchemas[field.type];
    
    if (!schema) {
      errors.push(`Invalid field type: ${field.type}`);
      continue;
    }

    // Apply field-specific validation rules
    if (field.validation) {
      const { minLength, maxLength, min, max, pattern } = field.validation;
      
      if (field.type === 'text' || field.type === 'textarea') {
        if (minLength) schema = schema.min(minLength);
        if (maxLength) schema = schema.max(maxLength);
        if (pattern) schema = schema.pattern(new RegExp(pattern));
      }
      
      if (field.type === 'number') {
        if (min !== undefined) schema = schema.min(min);
        if (max !== undefined) schema = schema.max(max);
      }
    }

    // Validate select and radio options
    if ((field.type === 'select' || field.type === 'radio') && field.options) {
      const validOptions = field.options.map(opt => opt.value);
      schema = schema.valid(...validOptions);
    }

    // Make required if specified
    if (field.required) {
      schema = schema.required();
    }

    // Validate the value
    const { error, value: validatedValue } = schema.validate(value);
    
    if (error) {
      errors.push(`${field.label}: ${error.details[0].message}`);
    } else {
      validatedData[field.id] = validatedValue;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData
  };
};

const validateFormData = (formData) => {
  const schema = Joi.object({
    title: Joi.string().required().trim().max(200),
    description: Joi.string().trim().max(1000).allow(''),
    fields: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid('text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'date', 'url', 'tel').required(),
        label: Joi.string().required(),
        placeholder: Joi.string().allow(''),
        required: Joi.boolean().default(false),
        options: Joi.array().items(
          Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required()
          })
        ),
        validation: Joi.object({
          minLength: Joi.number().min(0),
          maxLength: Joi.number().min(0),
          min: Joi.number(),
          max: Joi.number(),
          pattern: Joi.string()
        }),
        order: Joi.number().required()
      })
    ).required(),
    settings: Joi.object({
      allowMultipleSubmissions: Joi.boolean().default(true),
      requireAuth: Joi.boolean().default(false),
      isPublic: Joi.boolean().default(true),
      submitButtonText: Joi.string().default('Submit'),
      successMessage: Joi.string().default('Thank you for your submission!')
    }),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft')
  });

  return schema.validate(formData);
};

module.exports = {
  validateSubmissionData,
  validateFormData
};
