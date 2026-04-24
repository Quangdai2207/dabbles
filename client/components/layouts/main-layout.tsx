import Header from '@/components/partials/header'
import MainContent from '@/components/partials/main-content'
import Sidebar from '@/components/partials/sidebar'
import MobileNav from '@/components/partials/mobile-nav'

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex h-[calc(100vh)] w-full flex-col'>
        <Header />
        <MainContent>{children}</MainContent>
        <MobileNav />
      </div>
    </div>
  )
}

export default MainLayout
