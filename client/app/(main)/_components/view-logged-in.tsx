import MainLayout from '@/components/layouts/main-layout'
import ScrollToTop from './scroll-to-top'

const ViewLoggedIn = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <MainLayout>
      <ScrollToTop />
      {children}
    </MainLayout>
  )
}

export default ViewLoggedIn
