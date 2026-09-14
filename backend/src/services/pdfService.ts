import PDFDocument from 'pdfkit';
import type { Response } from 'express';
import type { ProfileDocument } from '../types/profile';
import { getLocalizedText } from '../utils/localizedText';

function formatRange(startDate: string, endDate?: string) {
  return endDate ? `${startDate} - ${endDate}` : startDate;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function streamProfilePdf(response: Response, profile: ProfileDocument, locale: 'fi' | 'en' = 'en'): void {
  const document = new PDFDocument({ size: 'A4', margin: 48 });
  const fileName = `${slugify(profile.name || 'cv')}-cv.pdf`;

  response.setHeader('Content-Type', 'application/pdf');
  response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  document.pipe(response);

  document.fontSize(24).fillColor('#111827').text(profile.name);
  document.moveDown(0.2);
  document.fontSize(12).fillColor('#4b5563').text(profile.headline);
  document.moveDown(0.5);
  document.fontSize(10).fillColor('#6b7280').text(`${profile.location} • ${profile.email}`);
  document.moveDown(0.8);

  document.fontSize(14).fillColor('#111827').text(locale === 'fi' ? 'Yhteenveto' : 'Summary');
  const profileSummary = getLocalizedText(profile.summary, locale);
  if (profileSummary) {
    document.fontSize(11).fillColor('#1f2937').text(profileSummary);
  }
  document.moveDown(0.6);

  document.fontSize(14).fillColor('#111827').text(locale === 'fi' ? 'Työkokemus' : 'Experience');
  (profile.experience || []).forEach((entry) => {
    document.fontSize(11).fillColor('#111827').text(`${getLocalizedText(entry.role, locale)} · ${entry.company}`);
    document.fontSize(9).fillColor('#6b7280').text(formatRange(entry.startDate, entry.endDate));
    const experienceSummary = getLocalizedText(entry.summary, locale);
    if (experienceSummary) {
      document.fontSize(10).fillColor('#1f2937').text(experienceSummary);
    }
    entry.highlights?.forEach((highlight) => {
      document.text(`- ${getLocalizedText(highlight, locale)}`);
    });
    document.moveDown(0.3);
  });

  document.fontSize(14).fillColor('#111827').text(locale === 'fi' ? 'Koulutus' : 'Education');
  (profile.education || []).forEach((entry) => {
    document.fontSize(11).fillColor('#111827').text(`${getLocalizedText(entry.degree, locale)} · ${getLocalizedText(entry.institution, locale)}`);
    document.fontSize(9).fillColor('#6b7280').text(formatRange(entry.startDate, entry.endDate));
    if (entry.summary) {
      document.fontSize(10).fillColor('#1f2937').text(getLocalizedText(entry.summary, locale));
    }
    document.moveDown(0.3);
  });

  document.fontSize(14).fillColor('#111827').text(locale === 'fi' ? 'Sertifikaatit' : 'Certificates');
  (profile.certificates || []).forEach((certificate) => {
    document.fontSize(11).fillColor('#111827').text(`${certificate.name} · ${certificate.issuer}`);
    document.fontSize(9).fillColor('#6b7280').text(certificate.date);
    if (certificate.url) {
      document.fontSize(9).fillColor('#2563eb').text(certificate.url);
    }
    document.moveDown(0.3);
  });

  document.fontSize(14).fillColor('#111827').text(locale === 'fi' ? 'Osaaminen' : 'Skills');
  document.fontSize(10).fillColor('#1f2937').text((profile.skills || []).join(' • '));

  document.end();
}
