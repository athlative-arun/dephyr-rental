import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">About Dephyr</h1>

        <div className="max-w-1xl mx-auto">
          {/* Our Story */}
          <div className="bg-white p-6 sm:p-8 mb-8">
  <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>

  <div className="flex flex-col md:flex-row items-center gap-8">
    {/* Text Content */}
    <div className="md:w-1/2 md:ml-12 text-center md:text-left">
      <p className="text-gray-700 mb-4">
        Dephyr was founded in 2024 with a simple mission: to make bike rentals easy,
        affordable, and accessible to everyone in Bangalore. We started as a small platform
        connecting riders with local rental shops and have since grown to become the city's
        premier bike rental marketplace.
      </p>
      <p className="text-gray-700 mb-4">
        As avid riders ourselves, we understand the joy and freedom that comes with exploring
        Bangalore on two wheels. Whether you're a local looking for a weekend adventure, a
        college student seeking affordable transportation, or a tourist wanting to experience
        the Garden City like a local, Dephyr has you covered.
      </p>
      <p className="text-gray-700">
        Our platform brings together the best rental shops in Bangalore, offering a wide variety
        of bikes from economical scooters to premium motorcycles, all in one convenient place.
      </p>
    </div>

    {/* Image */}
    <div className="md:w-1/2">
      <img
        src="https://images.unsplash.com/photo-1706062202423-e6655d342741?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Our Story - Bangalore Wheels"
        className="w-90 h-80 max-w-sm md:max-w-full mx-auto md:ml-24 rounded-lg shadow"
      />
    </div>
  </div>
</div>


<section className="text-center py-12">
  <h2 className="text-3xl font-bold text-gray-900 mb-4">
    Why You Should Choose Our Services
  </h2>
  <div className="w-20 h-1 bg-orange-500 mx-auto mb-10"></div>

  <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-6">
    
    {/* Left Column */}
    <div className="flex flex-col gap-6 items-center md:items-end">
      <div className="flex items-center bg-cyan-50 rounded-xl p-3 w-[300px] shadow">
        <div className="bg-cyan-100 p-3 rounded-xl">
          <img src="https://img.icons8.com/ios-filled/50/approval--v1.png" className="w-6 h-6" />
        </div>
        <p className="ml-4 text-left">Govt. Authorized Two Wheeler Rentals</p>
      </div>
      <div className="flex items-center bg-cyan-50 rounded-xl p-3 w-[300px] shadow md:mr-24">
        <div className="bg-cyan-100 p-3 rounded-xl">
          <img src="https://img.icons8.com/ios-filled/50/maintenance.png" className="w-6 h-6" />
        </div>
        <p className="ml-4 text-left">Free Service and Maintenance</p>
      </div>
      <div className="flex items-center bg-cyan-50 rounded-xl p-3 w-[300px] shadow">
        <div className="bg-cyan-100 p-3 rounded-xl">
          <img src="https://img.icons8.com/ios-filled/50/umbrella.png" className="w-6 h-6" />
        </div>
        <p className="ml-4 text-left">Free Insurance</p>
      </div>
    </div>

    {/* Image - Hidden on Mobile */}
    <div className="hidden md:block rounded-full overflow-hidden w-72 h-72 shadow-xl animate-float">
      <img src="public/images/bikes/mini_bg.jpg" alt="Bike Rider" className="object-cover w-full h-full" />
    </div>

    {/* Right Column */}
    <div className="flex flex-col gap-6 items-center md:items-start">
      <div className="flex items-center bg-cyan-50 rounded-xl p-3 w-[300px] shadow">
        <div className="bg-cyan-100 p-3 rounded-xl">
          <img src="https://img.icons8.com/ios-filled/50/motorcycle.png" className="w-6 h-6" />
        </div>
        <p className="ml-4 text-left">Wide Range of Vehicles</p>
      </div>
      <div className="flex items-center bg-cyan-50 rounded-xl p-3 w-[300px] shadow md:ml-24">
        <div className="bg-cyan-100 p-3 rounded-xl">
          <img src="https://img.icons8.com/ios-filled/50/cheap-2.png" className="w-6 h-6" />
        </div>
        <p className="ml-4 text-left">Guaranteed Lower Prices</p>
      </div>
      <div className="flex items-center bg-cyan-50 rounded-xl p-3 w-[300px] shadow">
        <div className="bg-cyan-100 p-3 rounded-xl">
          <img src="https://img.icons8.com/ios-filled/50/delivery-scooter.png" className="w-6 h-6" />
        </div>
        <p className="ml-4 text-left">Home Delivery Available</p>
      </div>
    </div>
  </div>
</section>



          {/* Our Mission */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At Dephyr, our mission is to transform urban mobility by making bike rentals
              a seamless, transparent, and enjoyable experience. We aim to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Provide a diverse range of quality bikes to suit every need and budget</li>
              <li>Partner with reputable local shops to ensure excellent service</li>
              <li>Make booking and payment as simple as a few taps on your screen</li>
              <li>Promote sustainable transportation options in our growing city</li>
              <li>Support local businesses and contribute to the community</li>
            </ul>
          </div>

          {/* How it Works */}
          

          {/* Our Team */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-700 mb-6">
              Dephyr is powered by a passionate team of technology enthusiasts, bike lovers,
              and customer experience experts. We're dedicated to continually improving our platform
              to better serve our users and partner shops.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Suriya Narayanan</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Hashlee</h3>
                <p className="text-gray-600">COO</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Vikram Singh</h3>
                <p className="text-gray-600">CTO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
