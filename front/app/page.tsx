import Hero from "./components/Hero";
import Header from "./components/Header";
import Services from "./components/Services";
import Contact from "./components/Contact";
import BookingForm from "./components/BookingForm";
import WhatsappButton from "./components/WhatsappButton";
import AboutUs from "./components/AboutUs";

export default function Home() {
  return (
    <main className="font-sans min-h-screen">
      <Header />
      <Hero />
      <AboutUs />
      <Services />
      <BookingForm />
      <Contact />
      <WhatsappButton />
    </main>
  );
}
