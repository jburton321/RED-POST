import LegalPage from '../components/LegalPage';

export default function DMCANotice() {
  return (
    <LegalPage title="DMCA Notice" effectiveDate="February 14, 2026">
      <p className="legal-subtitle">Digital Millennium Copyright Act</p>

      <section>
        <h2>1. Reporting Copyright Infringement</h2>
        <p>
          Red Post Realty respects the intellectual property rights of others. In accordance with the
          Digital Millennium Copyright Act (DMCA), we have designated an agent to receive
          notifications of alleged copyright infringement on our website.
        </p>
        <p>
          If you believe that your work has been copied in a way that constitutes copyright
          infringement, please provide our Copyright Agent with the following information:
        </p>
        <ul>
          <li>
            A physical or electronic signature of a person authorized to act on behalf of the owner
            of an exclusive right that is allegedly infringed.
          </li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>
            Identification of the material that is claimed to be infringing and information
            reasonably sufficient to permit us to locate the material (e.g., the specific property
            address or URL).
          </li>
          <li>
            Your contact information, including your address, telephone number, and email address.
          </li>
          <li>
            A statement that you have a good faith belief that use of the material in the manner
            complained of is not authorized by the copyright owner, its agent, or the law.
          </li>
          <li>
            A statement that the information in the notification is accurate, and under penalty of
            perjury, that you are authorized to act on behalf of the owner of an exclusive right that
            is allegedly infringed.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Designated Copyright Agent</h2>
        <p>Notifications of claimed infringement should be sent to:</p>
        <div className="legal-contact-block">
          <p><strong>Copyright Agent</strong></p>
          <p>Red Post Realty</p>
          <p>1 Wall St, Portsmouth, NH 03801</p>
          <p>Email: compliance@redpostrealty.com</p>
          <p>Phone: (603) 605-0181</p>
        </div>
      </section>

      <section>
        <h2>3. Counter-Notification</h2>
        <p>
          If you believe that your content was removed by mistake or misidentification, you may submit
          a counter-notification to our Copyright Agent containing the requirements set forth in 17
          U.S.C. &sect; 512(g)(3).
        </p>
      </section>
    </LegalPage>
  );
}
