import React from 'react';
import Header from '../components/Header';

function About() {
  return (
    <div>
      <Header />
      <h3>Welcome to SwellJam</h3>
      <p>&emsp;&emsp;The ultimate destination for surf enthusiasts to document their
        wave-riding adventures like never before. Immerse yourself in the world of stoke as
        you embark on a journey to capture the essence of every session and ride the perfect
        wave of memories.
      </p>
      <h3>Ride. Record. Remember.</h3>
      <p>&emsp;&emsp;At SwellJam, we understand that surfing is more than just a sport; it&
        apos;s a way of life. Our platform is designed for surfers of all levels to chronicle
        their sessions and create a rich tapestry of their surfing experiences. Whether you&
        apos;re a seasoned pro or a beginner catching your first waves, this is your digital
        sanctuary to relive the magic of each surf session.
      </p>
      <h3>Real-Time Data Integration</h3>
      <p>&emsp;&emsp;What sets us apart is our seamless integration of buoy and weather data
        into your surf journal entries. As you record your session details, our intelligent
        system automatically pulls and records relevant information about the conditions.
        From swell height and wind direction to tide charts and water temperature, you get a
        comprehensive snapshot of the factors that shaped your surfing experience.
      </p>
      <h3>Privacy First</h3>
      <p>&emsp;&emsp;Rest easy knowing that your surf journal is your personal space, not an
        advertiser&apos;s. We prioritize privacy and security, ensuring that your data is
        safe and accessible only to you. Your surf stories are yours to share as you please.
        Embark on a new era of surfing documentation with SwellJam. Join us in creating a
        global mosaic of surf memories, one wave at a time. Start your digital surf journal
        today and let the data guide your story.
      </p>
      <div className="parentBtn"><a className="aboutPageAddSessionBtn" href="/addsession">Record Your Session</a></div>
    </div>
  );
}

export default About;
