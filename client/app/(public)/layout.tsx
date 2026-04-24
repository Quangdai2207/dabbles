import HeaderNotLoggedIn from '@/components/partials/header-not-logged-in'
import ConditionalFooter from './_components/conditional-footer'
import ScrollToTop from '../(main)/_components/scroll-to-top'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative flex min-h-screen flex-col bg-white dark:bg-black'>
      <HeaderNotLoggedIn />
      <ScrollToTop />
      <main className='flex-1'>{children}</main>
      <ConditionalFooter />
    </div>
  )
}

export default PublicLayout
