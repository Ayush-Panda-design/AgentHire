import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Problems from './components/Problems.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import CLIDemo from './components/CLIDemo.jsx'
import Permissions from './components/Permissions.jsx'
import EmployeeCard from './components/EmployeeCard.jsx'
import Passport from './components/Passport.jsx'
import HiringModels from './components/HiringModels.jsx'
import Certifications from './components/Certifications.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="page">
      <Navbar />
      <Hero />
      <Marquee />
      <Problems />
      <HowItWorks />
      <CLIDemo />
      <Permissions />
      <EmployeeCard />
      <Passport />
      <HiringModels />
      <Certifications />
      <FinalCTA />
      <Footer />
    </div>
  )
}
