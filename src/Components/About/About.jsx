import "./About.css";

function About() {
  return (
    <div className="about-docs">
      <aside className="about-sidebar">
        <ul>
          <li>
            <a href="#sports">Sports at Our Platform</a>
          </li>
          <li>
            <a href="#nitsurat">Sports at NIT Surat</a>
          </li>
          <li>
            <a href="#inter-nit">Inter-NIT Leagues</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </aside>

      <main className="about-content">
        <section id="sports">
          <h1>Sports at Our Platform</h1>
          <p>
            Our platform serves as a centralized hub for managing all things
            sports — events, registrations, results, eligibility, galleries, and
            more. Whether you're a participant, organizer, or sports enthusiast,
            our goal is to simplify how you interact with sports data, team
            logistics, and tournament structures.
          </p>
          <p>
            With real-time updates, streamlined registrations, and integrated
            profiles, we ensure you stay connected with your favorite sports
            activities effortlessly. Every feature is built keeping
            accessibility, speed, and clarity in mind.
          </p>
        </section>

        <section id="nitsurat">
          <h2>Sports at NIT Surat</h2>
          <p>
            NIT Surat (SVNIT) has a rich legacy in sports, nurturing excellence
            both in academics and athletic achievements. With world-class sports
            facilities, dedicated teams, and vibrant student participation, the
            institute fosters holistic development.
          </p>
          <p>
            Events like intra-college tournaments, friendly leagues, and annual
            sports festivals are organized with great enthusiasm across cricket,
            football, basketball, athletics, volleyball, and more. The campus
            atmosphere during these events is a blend of competitiveness and
            camaraderie.
          </p>
        </section>

        <section id="inter-nit">
          <h2>Inter-NIT Leagues</h2>
          <p>
            Inter-NIT leagues are prestigious sporting events where top talents
            from different NITs compete in various disciplines. These events
            promote sportsmanship, unity, and healthy competition among
            institutes.
          </p>
          <p>
            NIT Surat has consistently performed remarkably across Inter-NIT
            platforms, with its athletes achieving national and even
            international recognition. Participation in these leagues brings
            immense pride and serves as a platform for students to showcase
            their skills beyond the campus.
          </p>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p>
            For any queries, collaborations, or technical support, feel free to
            connect with us:
            <br />
            <br />
            📧 <strong>Email:</strong>{" "}
            <a href="mailto:support@sportsevent.com">support@sportsevent.com</a>
            <br />
            📞 <strong>Phone:</strong> +91 98765 43210
          </p>
        </section>
      </main>
    </div>
  );
}

export default About;
