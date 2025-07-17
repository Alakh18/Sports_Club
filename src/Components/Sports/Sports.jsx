import { useParams } from "react-router-dom";

const sportsList = [
  {
    name: "Cricket",
    eligibility: "Open to all students. Team of 11 players required.",
    upcomingEvents: ["Inter-college League - Aug 2025", "Night Cup - Sep 2025"],
    registrationLink: "/register/cricket",
  },
  {
    name: "Football",
    eligibility: "Open to UG & PG students. Must have a valid ID.",
    upcomingEvents: ["5-a-side Tournament - Aug 2025", "Monsoon Cup - Oct 2025"],
    registrationLink: "/register/football",
  },
  {
    name: "Volleyball",
    eligibility: "Teams must have at least 6 players. Mixed teams allowed.",
    upcomingEvents: ["Spike Fest - Jul 2025", "College Open - Sep 2025"],
    registrationLink: "/register/volleyball",
  },
  {
    name: "Basketball",
    eligibility: "Open to all departments. Team of 5 required.",
    upcomingEvents: ["3x3 Street Tournament - Aug 2025", "College League - Oct 2025"],
    registrationLink: "/register/basketball",
  },
  {
    name: "Chess",
    eligibility: "Solo event. Open to all.",
    upcomingEvents: ["Rapid Chess Open - Jul 2025", "Blitz Challenge - Sep 2025"],
    registrationLink: "/register/chess",
  },
  {
    name: "Badminton",
    eligibility: "Singles & Doubles allowed. Bring your own rackets.",
    upcomingEvents: ["Smash Open - Jul 2025", "Doubles Cup - Aug 2025"],
    registrationLink: "/register/badminton",
  },
  {
    name: "Tennis",
    eligibility: "Players must bring their own racquet. Shoes compulsory.",
    upcomingEvents: ["Grand Slam College Series - Aug 2025", "Hard Court Battle - Sep 2025"],
    registrationLink: "/register/tennis",
  },
];

function Sports() {
  const { sportName } = useParams();
  const sport = sportsList.find(
    (s) => s.name.toLowerCase() === sportName.toLowerCase()
  );

  if (!sport) return <div>Sport not found</div>;

  return (
    <div className="sports-detail-page">
      <h2>{sport.name}</h2>
      <p><strong>Eligibility:</strong> {sport.eligibility}</p>
      <p><strong>Upcoming Events:</strong></p>
      <ul>
        {sport.upcomingEvents.map((event, i) => (
          <li key={i}>{event}</li>
        ))}
      </ul>
      <div className="sport-actions">
        <button onClick={() => alert(`Tracking ${sport.name}`)}>Track</button>
        <button onClick={() => window.location.href = sport.registrationLink}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Sports;
