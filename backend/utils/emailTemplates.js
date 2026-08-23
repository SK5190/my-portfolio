function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getSiteName() {
  return process.env.SITE_NAME?.trim() || 'Shubhanshu Kumar';
}

function buildEmailLayout({ label, headline, bodyHtml, footerHtml }) {
  const siteName = getSiteName();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(headline.replace(/<[^>]+>/g, ''))}</title>
</head>
<body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050508;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:32px;">
              <div style="width:96px;height:4px;background:linear-gradient(90deg,#3b82f6,#a855f7);border-radius:999px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;">
              <span style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#3b82f6;font-weight:600;">${label}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:42px;line-height:1.05;font-weight:700;color:#f8fafc;letter-spacing:-0.03em;">
                ${headline}
              </h1>
            </td>
          </tr>
          ${bodyHtml}
          <tr>
            <td style="border-top:1px solid #1e293b;padding-top:24px;">
              <p style="margin:0 0 8px;font-size:14px;color:#64748b;">${escapeHtml(siteName)}</p>
              ${footerHtml || `<p style="margin:0;font-size:12px;color:#475569;">© ${new Date().getFullYear()} All rights reserved.</p>`}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildInfoCard(label, contentHtml) {
  return `
          <tr>
            <td style="padding-bottom:20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f1117;border:1px solid #1e293b;border-radius:16px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#64748b;font-weight:600;">${label}</p>
                    ${contentHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function buildCtaButton(href, label) {
  return `
          <tr>
            <td style="padding-bottom:40px;">
              <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.04em;border-radius:999px;">
                ${label}
              </a>
            </td>
          </tr>`;
}

/**
 * Styled notification email sent to the portfolio owner.
 */
export function buildOwnerNotificationEmail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const messagePreview = escapeHtml(message.trim()).replace(/\n/g, '<br>');
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: Your message to ${getSiteName()}`)}`;

  const bodyHtml = `
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:17px;line-height:1.7;color:#94a3b8;">
                Someone just reached out through your portfolio contact form. Here are the details.
              </p>
            </td>
          </tr>
          ${buildInfoCard('From', `
                    <p style="margin:0 0 6px;font-size:20px;line-height:1.4;font-weight:600;color:#f8fafc;">${safeName}</p>
                    <a href="mailto:${safeEmail}" style="font-size:15px;color:#60a5fa;text-decoration:none;">${safeEmail}</a>
          `)}
          ${buildInfoCard('Message', `
                    <p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">${messagePreview}</p>
          `)}
          ${buildCtaButton(mailto, 'Reply to ' + safeName.split(' ')[0] + ' &rarr;')}`;

  return {
    subject: `New contact: ${name}`,
    text: `New portfolio contact\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: buildEmailLayout({
      label: 'New submission',
      headline: 'You have a<br>new message.',
      bodyHtml
    })
  };
}
