import React, { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [dateFormat, setDateFormat] = useState("european"); // Nuovo stato per il formato della data
  const canvasRef = useRef(null);

  const addEvent = () => {
    // Formatta la data in base al formato selezionato
    let formattedDate;
    if (dateFormat === "european") {
      formattedDate = new Date(date).toLocaleDateString("it-IT"); // Formato dd/mm/yyyy
    } else {
      formattedDate = new Date(date).toISOString().split("T")[0]; // Formato yyyy-mm-dd
    }

    // Aggiungi l'evento all'array in ordine cronologico
    const newEvent = { title, date: formattedDate };
    const updatedEvents = [...events, newEvent];

    // Ordina gli eventi in base alla data
    updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    setEvents(updatedEvents);
    setTitle("");
    setDate("");
  };

  const deleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const drawTimeline = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Pulisce il canvas

    // Disegna la linea della timeline
    ctx.beginPath();
    ctx.moveTo(50, 100); // Inizio della linea
    ctx.lineTo(750, 100); // Fine della linea
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Disegna gli eventi sulla timeline
    const totalWidth = 700;
    const eventSpacing = totalWidth / (events.length - 1 || 1); // Spaziatura tra eventi

    events.forEach((event, index) => {
      const xPosition = 50 + index * eventSpacing;

      // Disegna il punto dell'evento
      ctx.beginPath();
      ctx.arc(xPosition, 100, 5, 0, 2 * Math.PI); // Punto sull'evento
      ctx.fillStyle = "red";
      ctx.fill();

      // Calcola la posizione verticale in base all'indice
      const yOffset = index % 2 === 0 ? -30 : 30; // Alterna sopra e sotto
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";

      // Disegna il titolo e la data
      ctx.fillText(event.title, xPosition - ctx.measureText(event.title).width / 2, 100 + yOffset);
      ctx.fillText(event.date, xPosition - ctx.measureText(event.date).width / 2, 115 + yOffset);
    });
  }, [events]);

  useEffect(() => {
    drawTimeline(); // Ridisegna la timeline ogni volta che gli eventi cambiano
  }, [drawTimeline]); // Aggiunto drawTimeline come dipendenza

  const saveTimelineAsImage = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "timeline.jpg";
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    });
  };

  return (
    <div className="App">
      <h1>Timeline Creator</h1>
      <div className="event-input">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)} // Aggiunto gestore per la selezione del formato della data
        >
          <option value="european">Formato Europeo (dd/mm/yyyy)</option>
          <option value="iso">Formato ISO (yyyy-mm-dd)</option>
        </select>
        <button onClick={addEvent}>Add Event</button>
      </div>

      {/* Timeline Graphic */}
      <div className="timeline-container">
        <canvas ref={canvasRef} width="800" height="200" className="timeline-canvas"></canvas>
      </div>

      <button onClick={saveTimelineAsImage}>Save Timeline as Image</button>

      <div className="timeline">
        {events.map((event, index) => (
          <div className="timeline-event" key={index}>
            <span>{event.date}</span> - <strong>{event.title}</strong>
            <button onClick={() => deleteEvent(index)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Sezione per i libri */}
      <div className="books-container">
        <a href="https://www.amazon.it/memorie-Roksteg-risveglio-Lephisto-ebook/dp/B0B1CDQZP9/ref=sr_1_2?crid=10RMI41Q0FHQO&dib=eyJ2IjoiMSJ9.U8fx2RS8is2OJtm-3on31iVZNqF7APa0dW4YuqhazeogUTKUaYiJhfW9Uo2VYRmp4D6GStlfZOEH8_QqtXQgayH9wm40tKjTLAUNuaAt4KI.ScQnpl_9QdrvqQsBIeJdVZLbSwD7YTgJG8mpKezehfg&dib_tag=se&keywords=le+memorie+di+roksteg&qid=1728557430&sprefix=le+memorie+di+rok%2Caps%2C93&sr=8-2" target="_blank" rel="noopener noreferrer">
          <img src="https://m.media-amazon.com/images/I/61+ubWP-uuL._SY466_.jpg" alt="Le memeorie di Roksteg - Il risceglio di Lephisto" className="book-thumbnail" />
        </a>
        <a href="https://www.amazon.it/memorie-Roksteg-perduti-Gherrod-ebook/dp/B0B362Q6H6/ref=tmm_kin_swatch_0?_encoding=UTF8&dib_tag=se&dib=eyJ2IjoiMSJ9.U8fx2RS8is2OJtm-3on31iVZNqF7APa0dW4YuqhazeogUTKUaYiJhfW9Uo2VYRmp4D6GStlfZOEH8_QqtXQgayH9wm40tKjTLAUNuaAt4KI.ScQnpl_9QdrvqQsBIeJdVZLbSwD7YTgJG8mpKezehfg&qid=1728557430&sr=8-1" target="_blank" rel="noopener noreferrer">
          <img src="https://m.media-amazon.com/images/I/71hkN0R9A2L._SY466_.jpg" alt="Le memorie di Roksteg - I re perduti di Gherrod" className="book-thumbnail" />
        </a>
        <a href="https://www.amazon.it/memorie-Roksteg-sette-cavalieri-peccato-ebook/dp/B0B59WB2T9/ref=sr_1_4?crid=10RMI41Q0FHQO&dib=eyJ2IjoiMSJ9.U8fx2RS8is2OJtm-3on31iVZNqF7APa0dW4YuqhazeogUTKUaYiJhfW9Uo2VYRmp4D6GStlfZOEH8_QqtXQgayH9wm40tKjTLAUNuaAt4KI.ScQnpl_9QdrvqQsBIeJdVZLbSwD7YTgJG8mpKezehfg&dib_tag=se&keywords=le+memorie+di+roksteg&qid=1728557430&sprefix=le+memorie+di+rok%2Caps%2C93&sr=8-4" target="_blank" rel="noopener noreferrer">
          <img src="https://m.media-amazon.com/images/I/71qD-QBdrlL._SY466_.jpg" alt="Le memorie di Roksteg - I sette cavalieri del peccato" className="book-thumbnail" />
        </a>
        <a href="https://www.amazon.it/memorie-Roksteg-Federico-Fubiani-ebook/dp/B0BCYXKY72/ref=sr_1_3?crid=10RMI41Q0FHQO&dib=eyJ2IjoiMSJ9.U8fx2RS8is2OJtm-3on31iVZNqF7APa0dW4YuqhazeogUTKUaYiJhfW9Uo2VYRmp4D6GStlfZOEH8_QqtXQgayH9wm40tKjTLAUNuaAt4KI.ScQnpl_9QdrvqQsBIeJdVZLbSwD7YTgJG8mpKezehfg&dib_tag=se&keywords=le+memorie+di+roksteg&qid=1728557430&sprefix=le+memorie+di+rok%2Caps%2C93&sr=8-3" target="_blank" rel="noopener noreferrer">
          <img src="https://m.media-amazon.com/images/I/910WG9LatfL._SY466_.jpg" alt="Le memorie di Roksteg" className="book-thumbnail" />
        </a>
        <a href="https://www.amazon.it/Undici-racconti-che-avete-letto-ebook/dp/B09Z9S5S3J/ref=sr_1_1?crid=2M9M5HCFOBKE0&dib=eyJ2IjoiMSJ9.u2tUSKWs1_wtfNnpuAQ7yg.73QMwsL0VyUbAU5s2SsQlhjlEi6oCBUO7-gz21-xqRs&dib_tag=se&keywords=undici+racconti+che+non+avete+mai+letto&qid=1728557470&sprefix=undici+racc%2Caps%2C101&sr=8-1" target="_blank" rel="noopener noreferrer">
          <img src="https://m.media-amazon.com/images/I/81vOERLipAL._SY466_.jpg" alt="Undici racconti che non avete mai letto" className="book-thumbnail" />
        </a>
      </div>
    </div>
  );
}

export default App;
