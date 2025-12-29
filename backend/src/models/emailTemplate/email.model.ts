import mongoose from 'mongoose';

// Email template types enum
export const EMAIL_TEMPLATE_TYPES = ['welcome', 'password', 'application', 'interview', 'jobalert', 'verification', 'offer', 'rejection', 'stage_update', 'custom'] as const;

export type EmailTemplateType = (typeof EMAIL_TEMPLATE_TYPES)[number];

const emailTemplateSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    templateType: {
      type: String,
      enum: EMAIL_TEMPLATE_TYPES,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 255,
    },
    preheader: {
      type: String,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
    },
    // Lexical editor state (JSON stringified)
    editorState: {
      type: String,
      required: true,
    },
    // Available template variables (e.g., {{user_first_name}}, {{platform_name}})
    variables: {
      type: [String],
      default: [],
    },
    // Template metadata (settings, styling, etc.)
    metadata: {
      fromName: {
        type: String,
        maxlength: 100,
      },
      fromEmail: {
        type: String,
        maxlength: 255,
      },
      replyTo: {
        type: String,
        maxlength: 255,
      },
      // Email styling options
      backgroundColor: {
        type: String,
        default: '#ffffff',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    lastEditedBy: {
      type: String,
      required: true,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
emailTemplateSchema.index({ companyId: 1, templateType: 1 });
emailTemplateSchema.index({ companyId: 1, isActive: 1 });
emailTemplateSchema.index({ companyId: 1, isDefault: 1 });
emailTemplateSchema.index({ lastEditedBy: 1, updatedAt: -1 });

// Compound index for finding active templates by company and type
emailTemplateSchema.index({ companyId: 1, templateType: 1, isActive: 1 });

// Ensure only one default template per type per company
emailTemplateSchema.index({ companyId: 1, templateType: 1, isDefault: 1 }, { unique: true, sparse: true });

// Virtual for full template name
emailTemplateSchema.virtual('fullName').get(function () {
  return `${this.name} (${this.templateType})`;
});

// Method to get available variables for a template type
// emailTemplateSchema.statics.getDefaultVariables = function (templateType: EmailTemplateType): string[] {
//   const variableMap: Record<EmailTemplateType, string[]> = {
//     welcome: ['{{user_first_name}}', '{{user_last_name}}', '{{user_email}}', '{{platform_name}}', '{{login_url}}'],
//     password: ['{{user_first_name}}', '{{reset_link}}', '{{expiry_time}}', '{{platform_name}}'],
//     application: ['{{user_first_name}}', '{{job_title}}', '{{company_name}}', '{{application_id}}', '{{application_date}}'],
//     interview: ['{{user_first_name}}', '{{job_title}}', '{{company_name}}', '{{interview_date}}', '{{interview_time}}', '{{interview_location}}', '{{interviewer_name}}'],
//     jobalert: ['{{user_first_name}}', '{{job_count}}', '{{jobs_list}}', '{{platform_name}}'],
//     verification: ['{{user_first_name}}', '{{verification_code}}', '{{verification_link}}', '{{expiry_time}}'],
//     offer: ['{{user_first_name}}', '{{job_title}}', '{{company_name}}', '{{offer_details}}', '{{accept_deadline}}'],
//     rejection: ['{{user_first_name}}', '{{job_title}}', '{{company_name}}', '{{feedback}}'],
//     stage_update: ['{{user_first_name}}', '{{job_title}}', '{{company_name}}', '{{stage_name}}', '{{next_steps}}'],
//     custom: [],
//   };
//   return variableMap[templateType] || [];
// };

// Pre-save hook to update version
emailTemplateSchema.pre('save', function (next) {
  if (this.isModified('content') || this.isModified('subject') || this.isModified('preheader')) {
    this.version += 1;
  }
  next();
});

export const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
