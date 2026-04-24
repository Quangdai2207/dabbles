const PrivacyPage = () => {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-16 md:py-24'>
      <h1 className='mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-white'>Privacy Policy</h1>
      <p className='mb-8 text-lg text-gray-600 dark:text-gray-300'>Last updated: January 2024</p>

      <div className='prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300'>
        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, update your profile,
            or communicate with us. This may include your name, email address, password, and profile information.
          </p>
          <p className='mt-4'>
            We also automatically collect certain information when you use our Services, including:
          </p>
          <ul className='mt-4 list-disc space-y-2 pl-6'>
            <li>Log Information: Device type, browser type, IP address, and access times.</li>
            <li>Usage Information: Content viewed, features used, and interactions with other users.</li>
            <li>Cookies and technologies: We use cookies to improve your experience and analyze traffic.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className='mt-4 list-disc space-y-2 pl-6'>
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process transactions and send related information.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>3. Sharing of Information</h2>
          <p>
            We do not share your personal information with third parties except as described in this privacy policy or
            with your consent. We may share information with vendors, consultants, and other service providers who need
            access to such information to carry out work on our behalf.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized
            access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>5. Your Choices</h2>
          <p>
            You may update, correct, or delete information about you at any time by logging into your online account or
            emailing us. You may also opt out of receiving promotional communications from us by following the
            instructions in those communications.
          </p>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href='mailto:support@dabble.com' className='text-primary hover:underline'>
              support@dabble.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPage
