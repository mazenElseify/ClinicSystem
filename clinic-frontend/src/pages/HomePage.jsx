export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-pink-100 text-center py-16 px-4">
        <h2 className="text-4xl font-bold text-pink-700 mb-4">Compassionate Care for Every Woman</h2>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Book appointments, view medical records, and connect with expert doctors — all in one place.
        </p>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4 flex flex-col md:flex-row gap-6 justify-center items-center">
        <div className="bg-white shadow-md p-6 rounded-xl max-w-xs text-center">
          <h3 className="text-xl font-semibold text-pink-600 mb-2">🩺 Appointments</h3>
          <p className="text-gray-600">Schedule, view, or cancel appointments easily.</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl max-w-xs text-center">
          <h3 className="text-xl font-semibold text-pink-600 mb-2">👩‍⚕️ Doctors</h3>
          <p className="text-gray-600">Meet our experienced and caring specialists.</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl max-w-xs text-center">
          <h3 className="text-xl font-semibold text-pink-600 mb-2">📁 Records</h3>
          <p className="text-gray-600">Access your medical records securely anytime.</p>
        </div>
      </section>
    </>
  );
}
