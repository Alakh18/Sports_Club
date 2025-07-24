import React from "react";

const EventFormModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newEvent = {
      title: form.title.value,
      date: form.date.value,
      description: form.description.value,
    };
    onSubmit(newEvent);
    form.reset();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" type="text" placeholder="Event Title" required />
          <input name="date" type="date" required />
          <textarea name="description" placeholder="Description" />
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
