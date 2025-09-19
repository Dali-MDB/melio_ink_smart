import smtplib
from dotenv import load_dotenv
import os
load_dotenv()
sender_email = os.getenv('EMAIL_SENDER')
password = os.getenv('EMAIL_PASSWORD')


def send_mail(receiver_email, subject, body):
    sender_email = sender_email
    text = f'Subject: {subject}\n\n{body}'
    password = password
    server = smtplib.SMTP("smtp.gmail.com",587)
    server.starttls()
    server.login(sender_email,password)
    server.sendmail(sender_email,receiver_email,text)
