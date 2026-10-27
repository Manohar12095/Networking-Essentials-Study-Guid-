import { Topic } from '../../types/content';

export const smtpTopic: Topic = {
  slug: 'smtp',
  unit: 5,
  order: 2,
  title: 'Simple Mail Transfer Protocol (SMTP)',
  shortTitle: 'SMTP Email Protocol',
  oneLineDefinition:
    'SMTP (RFC 5321) is the application-layer push protocol used to send and relay email between mail clients and mail servers over TCP ports 25, 587, and 465.',
  examKeywords: [
    'MTA',
    'UA',
    'MDA',
    'MX record',
    'push protocol',
    'port 25',
    'HELO',
    'MAIL FROM',
    'RCPT TO',
    'DATA',
    '250',
    '354',
    'MIME',
    'POP3',
    'IMAP',
  ],
  writeInExam: [
    '1. Define SMTP: connection-oriented push protocol running on TCP port 25 for sending and relaying electronic mail.',
    '2. Detail email architecture: User Agent (UA), Mail Transfer Agent (MTA client/server), MDA, and Message Access Agents (MAA).',
    '3. Draw the end-to-end email architecture diagram and list the 5 core SMTP commands in order.',
    '4. Transcribe a complete verbatim SMTP client-server terminal session from 220 greeting to 221 quit.',
    '5. Explain SMTP reply code classes, MIME encoding for non-ASCII data, and compare POP3 vs IMAP.',
  ],
  revisionPoints: [
    'Application-layer push protocol running over TCP port 25 (server-to-server) and 587 (client submission).',
    'Email Architecture: User Agent (UA) → Sender MTA → DNS MX lookup → Receiver MTA → Mailbox → POP3/IMAP → Receiver UA.',
    'Push vs Pull: SMTP pushes mail to servers; POP3/IMAP pull mail from mailboxes down to recipient clients.',
    'Three Phases: Connection Establishment (220), Mail Transfer (HELO, MAIL FROM, RCPT TO, DATA, <CRLF>.<CRLF>), Termination (QUIT, 221).',
    'Reply Code Classes: 2xx Success (250 OK), 3xx Info/Input (354 Start Mail), 4xx Transient Error (421), 5xx Permanent Error (550).',
    'MIME: Extends 7-bit ASCII SMTP to support binary attachments, images, and international character sets via Base64.',
    'Mnemonic: "Hello, Mail, Rcpt, Data, Quit."',
  ],
  sections: [
    {
      id: 'definition',
      title: '1. Introduction and Definition',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'The Simple Mail Transfer Protocol (SMTP, RFC 5321) is an application-layer protocol designed for the reliable and efficient transfer of electronic mail. It operates over a stream-oriented Transmission Control Protocol (TCP) connection on well-known port 25 for server-to-server relaying and port 587 for authenticated client submission.',
        },
        {
          type: 'keypoints',
          title: 'Push Protocol vs Pull Protocol Distinction',
          items: [
            'SMTP is a Push Protocol: It is exclusively used to push messages from the sender’s mail client to the sender’s server, and to push messages between intermediate mail transfer servers.',
            'Access Protocols are Pull Protocols: Because the receiver’s computer cannot remain powered on 24/7 with a static IP to accept incoming TCP connections, mail is stored in a server mailbox. The recipient uses a pull protocol like POP3 (Post Office Protocol v3) or IMAP (Internet Message Access Protocol) to retrieve mail.',
          ],
        },
        {
          type: 'mnemonic',
          text: 'Mnemonic: "Hello, Mail, Rcpt, Data, Quit."',
        },
      ],
    },
    {
      id: 'architecture',
      title: '2. Email Architecture & End-to-End Mail Flow',
      marks: 5,
      blocks: [
        {
          type: 'table',
          caption: 'Four Core Architectural Components in Email Systems',
          headers: ['Component', 'Full Name', 'Operational Role'],
          rows: [
            ['UA', 'User Agent', 'The email client software (e.g. Outlook, Thunderbird, Gmail web app). Used by human users to compose, send, format, and read messages.'],
            ['MTA', 'Mail Transfer Agent', 'The server routing engine (e.g. Postfix, Sendmail, Exchange). Operates as SMTP client when forwarding and SMTP server when receiving.'],
            ['MDA', 'Mail Delivery Agent', 'Software component (e.g. Dovecot, Procmail) that accepts mail from the receiver MTA and deposits it into the user’s mailbox.'],
            ['MAA', 'Message Access Agent', 'Protocol server (POP3 on port 110/995 or IMAP on port 143/993) allowing the receiver UA to authenticate and download messages.'],
          ],
        },
        {
          type: 'steps',
          items: [
            '1. Composition: Sender drafts email in their User Agent (UA).',
            '2. Client Submission: Sender UA connects to Sender Mail Server (MTA) via SMTP over port 587.',
            '3. MX Lookup: Sender MTA queries DNS for the destination domain’s MX (Mail Exchanger) record to discover the receiver MTA’s IP address.',
            '4. Server-to-Server Relay: Sender MTA connects to Receiver MTA via SMTP over port 25 and transfers the message.',
            '5. Local Delivery: Receiver MTA delivers message to local MDA, which writes it to the recipient’s mailbox on disk.',
            '6. Retrieval: Recipient UA launches, connects to Receiver Mail Server via POP3 or IMAP, and pulls down the email.',
          ],
        },
      ],
    },
    {
      id: 'diagram',
      title: '3. Email Architecture and Command Sequence Diagram',
      marks: 3,
      blocks: [
        {
          type: 'paragraph',
          text: 'The architecture diagram illustrates the complete pathway from Sender UA through Sender MTA, across the Internet via SMTP, to the Receiver MTA, mailbox storage, and final retrieval via POP3/IMAP.',
        },
        {
          type: 'image',
          src: './images/smtp-architecture.png',
          alt: 'Email Architecture and SMTP Flow Diagram',
          caption:
            'Figure 3.1: Email Architecture and SMTP Command Sequence (HELO, MAIL FROM, RCPT TO, DATA, QUIT) with POP3/IMAP access.',
        },
      ],
    },
    {
      id: 'session-commands',
      title: '4. SMTP Phases, Commands & Sample Dialogue',
      marks: 4,
      blocks: [
        {
          type: 'table',
          caption: 'Standard SMTP Client Commands',
          headers: ['Command', 'Syntax & Purpose'],
          rows: [
            ['HELO / EHLO', 'HELO <client-domain> (identifies client; EHLO requests Extended SMTP)'],
            ['MAIL FROM:', 'MAIL FROM:<sender@domain.com> (initiates transaction & declares return path)'],
            ['RCPT TO:', 'RCPT TO:<recipient@domain.com> (declares recipient; repeatable for multiple recipients)'],
            ['DATA', 'DATA (signals start of message headers and body; completed by <CRLF>.<CRLF>)'],
            ['RSET', 'RSET (aborts current mail transaction without closing the TCP connection)'],
            ['VRFY', 'VRFY <username> (verifies existence of mailbox without sending mail)'],
            ['NOOP', 'NOOP (no operation; keeps the TCP connection alive)'],
            ['QUIT', 'QUIT (gracefully closes the SMTP session)'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Sample Verbatim SMTP Session Dialogue (Reproduce in Exam):',
        },
        {
          type: 'code',
          title: 'Verbatim SMTP Client-Server Protocol Exchange',
          language: 'txt',
          code: `S: 220 mail.example.com ESMTP ready
C: HELO example.com
S: 250 Hello example.com
C: MAIL FROM:<sender@example.com>
S: 250 OK
C: RCPT TO:<receiver@example.com>
S: 250 OK
C: DATA
S: 354 Start mail input; end with <CRLF>.<CRLF>
C: From: sender@example.com
C: To: receiver@example.com
C: Subject: Hello
C: 
C: This is a test message.
C: .
S: 250 OK: message accepted for delivery
C: QUIT
S: 221 mail.example.com closing connection`,
        },
        {
          type: 'interactive',
          component: 'SmtpSimulator',
        },
      ],
    },
    {
      id: 'reply-codes-mime',
      title: '5. Reply Codes, MIME & POP3 vs IMAP Comparison',
      marks: 2,
      blocks: [
        {
          type: 'table',
          caption: 'Classification of SMTP Server Reply Codes',
          headers: ['Range', 'Category', 'Exam Examples'],
          rows: [
            ['2xx', 'Positive Completion', '220 (Service ready), 221 (Service closing), 250 (Action OK / completed)'],
            ['3xx', 'Positive Intermediate', '354 (Start mail input; end with <CRLF>.<CRLF>)'],
            ['4xx', 'Transient Negative (Temporary error)', '421 (Service unavailable), 450 (Mailbox busy, try later)'],
            ['5xx', 'Permanent Negative (Fatal error)', '500 (Syntax error), 550 (Mailbox unavailable / not found), 554 (Transaction failed)'],
          ],
        },
        {
          type: 'keypoints',
          title: 'MIME (Multipurpose Internet Mail Extensions, RFC 2045)',
          items: [
            'Limitation of Classic SMTP: Legacy SMTP can only transmit 7-bit ASCII text. Binary files (PDFs, images) or non-English alphabets corrupt the stream.',
            'MIME Solution: Encodes arbitrary 8-bit binary data into safe 7-bit ASCII characters using Base64 or Quoted-Printable encoding.',
            'Header Fields Added: MIME-Version: 1.0, Content-Type (e.g. multipart/mixed, image/png), Content-Transfer-Encoding: base64, and boundary markers.',
          ],
        },
        {
          type: 'table',
          caption: 'POP3 vs IMAP Direct Comparison',
          headers: ['Comparison Feature', 'POP3 (Post Office Protocol v3)', 'IMAP (Internet Message Access Protocol)'],
          rows: [
            ['Default Port', 'Port 110 (Port 995 with SSL/TLS)', 'Port 143 (Port 993 with SSL/TLS)'],
            ['Storage Philosophy', 'Downloads email to local client and deletes from server', 'Keeps all emails synchronized on the central server'],
            ['Multi-Device Support', 'Poor (reading an email on phone leaves it missing on laptop)', 'Flawless (status, flags, read/unread synced across devices)'],
            ['Server Folders', 'No support for server-side folders or search', 'Full support for hierarchical folders, labels, and server search'],
            ['Bandwidth Overhead', 'Minimal once downloaded', 'Higher (continuous synchronization)'],
          ],
        },
      ],
    },
  ],
};
