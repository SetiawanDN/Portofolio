using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace SoupApi.Helpers
{
    public static class MailHelper
    {
        public static async Task Send(string toName, string toEmail, string subject, string messageText)
        {
            /* configuration */
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Soup", "noreplysoup365@gmail.com"));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;
            /* configuration */

            /* masukin message text */
            message.Body = new TextPart("html")
            {
                Text = messageText,
            };
            /* masukin message text */

            /* kirim email nya */
            using (var smtp = new SmtpClient())
            {
                await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("noreplysoup365@gmail.com", "zghrnygpmzwyshdm");
                await smtp.SendAsync(message);
                await smtp.DisconnectAsync(true);
            }
            /* kirim email nya */

        }
    }
}
