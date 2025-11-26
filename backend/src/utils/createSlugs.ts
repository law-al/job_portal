import slugify from 'slugify';

export const createJobSlug = (title: string, experienceLevel: string) => {
  const experienceLevelFormatted = experienceLevel.toLowerCase();

  if (title.toLowerCase().includes(experienceLevelFormatted)) {
    return slugify.default(title, { lower: true, strict: true });
  }

  return slugify.default(`${experienceLevel.toLowerCase()} ${title}`, {
    lower: true,
    strict: true,
  });
};
