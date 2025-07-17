import React, { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "What is Inter-NIT?",
    answer:
      "Inter-NIT is a national-level competition where students from various NITs compete in different sports and cultural events.",
  },
  {
    question: "How can I participate in sports events?",
    answer:
      "To participate, you can contact the Sports Club coordinators or check the official notice boards and online portals during selection drives.",
  },
  {
    question: "Are there tryouts for every sport?",
    answer:
      "Yes, tryouts are conducted before each major tournament or semester. You can register through forms shared by the Sports Club.",
  },
  {
    question: "Do I need prior experience to join?",
    answer:
      "Not necessarily. Beginners are encouraged to try out. We value dedication and willingness to improve.",
  },
  {
    question: "How do I stay updated on upcoming events?",
    answer:
      "Follow the SVNIT Sports Club on social media or join our official WhatsApp and Telegram groups for regular updates.",
  },
  {
    question: "Is there a selection process for Inter-NIT?",
    answer:
      "Yes, students are selected based on performance in tryouts, commitment, and previous records.",
  },
  {
    question: "Can first-year students participate?",
    answer:
      "Absolutely! First-year students are encouraged to get involved in various sports activities.",
  },
  {
    question: "Do I have to buy my own sports equipment?",
    answer:
      "Basic equipment is provided by the Sports Club. However, personal gear may be needed for certain sports.",
  },
];

const FAQ = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIndexes([]);
    } else {
      setOpenIndexes(faqData.map((_, idx) => idx));
    }
    setAllExpanded(!allExpanded);
  };

  return (
    <>
      <div className="faq-container">
        <h1 className="faq-main-heading">FAQ</h1>
        <p className="faq-subtitle">
          Find answers to common questions about our sports club, Inter-NIT, and
          more.
        </p>

        <div className="faq-header-row">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <button className="expand-btn" onClick={toggleAll}>
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {faqData.map((faq, index) => (
          <div
            className="faq-item"
            key={index}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-toggle">
                {openIndexes.includes(index) ? "−" : "+"}
              </span>
            </div>
            {openIndexes.includes(index) && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
