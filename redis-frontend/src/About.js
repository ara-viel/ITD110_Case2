import React from "react";

const About = () => {
  return (
    <div className="about-container">
      <h1>About Barangay Hindang</h1>
      
      <section className="population">
        <h2>Population</h2>
        <p>
          Hindang is a barangay in the city of Iligan. Its population, as determined by the 2020 Census, was <strong>953</strong>. 
          This represented <strong>0.26%</strong> of the total population of Iligan.
        </p>
      </section>

      <section className="historical-population">
        <h2>Historical Population</h2>
        <p>
          The population of Hindang fell from <strong>2,210</strong> in 1995 to <strong>953</strong> in 2020, a decrease of <strong>1,257</strong> people over 25 years. 
          The latest census figures in 2020 show a positive annualized growth rate of <strong>0.91%</strong>, 
          or an increase of <strong>40</strong> people from the previous population of <strong>913</strong> in 2015.
        </p>
      </section>

      <section className="location">
        <h2>Location</h2>
        <p>
          Hindang is situated at approximately <strong>8.3177, 124.3457</strong> in the island of Mindanao. 
          Elevation at these coordinates is estimated at <strong>300.7 meters</strong> (986.5 feet) above sea level.
        </p>
        {/* Embedded Map */}
        <iframe 
          title="Barangay Hindang Map"
          width="100%" 
          height="400" 
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=8.3177,124.3457">
        </iframe>
      </section>
    </div>
  );
};

export default About;
