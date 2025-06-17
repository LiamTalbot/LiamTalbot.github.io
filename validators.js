// Create a new instance of Ajv for schema validation
const ajv = new window.ajv7();

// Add custom format for flexible date handling (YYYY or YYYY-MM-DD)
ajv.addFormat('flexible-date', {
    validate: (data) => {
        // YYYY format (as number or string)
        if (typeof data === 'number') {
            return data >= 0 && data <= 9999;
        }
        if (typeof data === 'string') {
            // Try YYYY format first
            if (/^\d{4}$/.test(data)) {
                const year = parseInt(data);
                return year >= 0 && year <= 9999;
            }
            // Then try YYYY-MM-DD format
            if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
                const [year, month, day] = data.split('-').map(num => parseInt(num));
                if (year < 0 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
                    return false;
                }
                // Check if the date is valid (handles months with different days, leap years, etc.)
                const date = new Date(year, month - 1, day);
                return date.getFullYear() === year && 
                       date.getMonth() === month - 1 && 
                       date.getDate() === day;
            }
        }
        return false;
    }
});

// Define the schema for spans
const spanSchema = {
    type: 'object',
    properties: {
        text: { type: 'string' },
        category: { type: 'string' },
        start: { 
            anyOf: [
                { type: 'number' },
                { type: 'string', format: 'flexible-date' }
            ]
        },
        end: { 
            anyOf: [
                { type: 'number' },
                { type: 'string', format: 'flexible-date' }
            ]
        },
        priority: { type: 'number', minimum: 1 }
    },
    required: ['category', 'start', 'priority'],
    additionalProperties: false
};

// Define the schema for elements
const elementSchema = {
    type: 'object',
    properties: {
        text: { type: 'string' },
        position: { type: 'number', minimum: 1 },
        spans: {
            type: 'array',
            items: spanSchema,
            minItems: 1
        }
    },
    required: ['text', 'spans'],
    additionalProperties: false
};

// Define the schema for axis
const axisSchema = {
    type: 'object',
    properties: {
        text: { type: 'string' },
        scaleJump: { type: 'number', minimum: 1 },
        scales: { 
            anyOf: [
                { type: 'null' },
                { type: 'string', enum: ['years', 'months'] }
            ]
        },
        elements: {
            type: 'array',
            items: elementSchema,
            minItems: 1
        }
    },
    required: ['text', 'elements'],
    additionalProperties: false
};

// Define the schema for category appearances
const appearanceSchema = {
    type: 'object',
    properties: {
        priority: { type: 'number', minimum: 1 },
        colour: { 
            type: 'string',
            pattern: '^#[0-9A-Fa-f]{6}$' // Hex color validation
        },
        style: { type: 'string' }
    },
    required: ['priority', 'colour', 'style'],
    additionalProperties: false
};

// Define the schema for categories
const categorySchema = {
    type: 'object',
    properties: {
        category: { type: 'string' },
        appearances: {
            type: 'array',
            items: appearanceSchema,
            minItems: 1
        }
    },
    required: ['category', 'appearances'],
    additionalProperties: false
};

// Define the main timeline schema
const timelineSchema = {
    type: 'object',
    properties: {
        text: { type: 'string' },
        xAxis: axisSchema,
        yAxis: axisSchema,
        categories: {
            type: 'array',
            items: categorySchema,
            minItems: 1
        }
    },
    required: ['text', 'xAxis', 'yAxis', 'categories'],
    additionalProperties: false
};

// Compile the schema
const validateTimeline = ajv.compile(timelineSchema);

// Function to validate a timeline dataset
function validateTimelineData(data) {
    const valid = validateTimeline(data);
    if (!valid) {
        console.error('Validation errors:', validateTimeline.errors);
        return {
            valid: false,
            errors: validateTimeline.errors
        };
    }
    return {
        valid: true,
        errors: null
    };
}

// Example usage:
/*
const result = validateTimelineData(myTimelineData);
if (!result.valid) {
    console.error('Invalid timeline data:', result.errors);
} else {
    console.log('Timeline data is valid!');
}
*/
