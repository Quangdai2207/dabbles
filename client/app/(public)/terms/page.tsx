const TermsPage = () => {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-16 md:py-24'>
      <h1 className='mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-white'>Terms of Service</h1>
      <p className='mb-8 text-lg text-gray-600 dark:text-gray-300'>Last updated: January 2024</p>

      <div className='prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300'>
        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>1. Introduction</h2>
          <p>
            Welcome to Dabble! By accessing or using our website, services, and tools (collectively, the
            &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not
            agree to these Terms, please do not use our Service.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>2. User Accounts</h2>
          <p>
            To use certain features of the Service, you must create an account. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities that occur under your account. You agree
            to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>3. Content and Conduct</h2>
          <p>
            You retain ownership of the content you post to Dabble (&quot;User Content&quot;). However, by posting User
            Content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such
            content in connection with providing the Service.
          </p>
          <ul className='mt-4 list-disc space-y-2 pl-6'>
            <li>You agree not to post content that is illegal, harmful, or violates the rights of others.</li>
            <li>We reserve the right to remove any content that violates these Terms or our community guidelines.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>4. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding User Content), features, and functionality are and will
            remain the exclusive property of Dabble Inc. and its licensors.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>5. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>6. Limitation of Liability</h2>
          <p>
            In no event shall Dabble Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide
            notice of any significant changes. By continuing to access or use our Service after those revisions become
            effective, you agree to be bound by the revised terms.
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsPage
