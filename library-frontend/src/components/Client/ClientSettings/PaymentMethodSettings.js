import React, { useState, useEffect } from "react";
import axios from "axios";

// componet to display payment ifnormation
function PaymentMethodSettings({ email }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newCardNumber, setNewCardNumber] = useState("");

  // will look for if client hasCard to choose whether to run fetchChards script
  useEffect(() => {
    const checkAndFetchCards = async () => {
      try {
        const hasCardsResponse = await axios.get(
          `http://localhost:4000/client/${email}/hasCard`
        );
        console.log(hasCardsResponse);
        if (hasCardsResponse.data.hasCard) {
          fetchCards();
        } else {
          console.log("No cards to fetch");
        }
      } catch (error) {
        console.error("Failed to check for cards:", error);
        alert(
          "Failed to check payment methods availability. Please try again."
        );
      }
    };

    checkAndFetchCards();
  }, [email]);

  // gets all of the valid cards stored in database
  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/client/${email}/cards`
      );
      if (response.data.success) {
        setCards(response.data.cards);
      } else {
        console.log("No cards found");
        setCards([]);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      alert("Failed to load payment methods. Please try again.");
      setCards([]);
    }
  };

  // handler for the Add button to add new card to database
  const handleAdd = async () => {
    if (!cardNumber) {
      alert("Please enter a card number");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/client/addCard",
        {
          cardNumber,
          clientEmail: email,
        }
      );
      if (response.data.success) {
        setCards([...cards, response.data.card]);
        setCardNumber("");
      } else {
        alert("Failed to add card: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding card:", error);
      alert("Failed to add card. Please try again. " + error.message);
    }
  };

  // handler for delete button to delete a card from the database
  const handleDelete = async (cardNumber) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/client/${email}/cards/${cardNumber}`
      );
      if (response.data.success) {
        setCards(cards.filter((card) => card.card_number !== cardNumber));
        setSelectedCard(null);
      } else {
        alert("Failed to delete card");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Failed to delete card. Please try again.");
    }
  };

  // handler for update button to update a card from the database
  const handleUpdate = async () => {
    if (!newCardNumber) {
      alert("Please enter the new card number");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:4000/client/${email}/cards/${selectedCard.card_number}`,
        {
          newCardNumber,
        }
      );
      if (response.data.success) {
        const updatedCards = cards.map((card) =>
          card.card_number === selectedCard.card_number
            ? { ...card, card_number: newCardNumber }
            : card
        );
        setCards(updatedCards);
        setNewCardNumber("");
        setSelectedCard(null);
      } else {
        alert("Failed to update card: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating card:", error);
      alert("Failed to update card. Please try again. " + error.message);
    }
  };

  // sets the currently selected card w/ menu
  const selectCard = (card) => {
    setSelectedCard(card);
    setNewCardNumber(card.card_number);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Payment Methods</h2>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Enter Card Number"
        className="form-control mb-3"
      />
      <button onClick={handleAdd} className="btn btn-primary mb-3">
        Add New Method
      </button>
      {selectedCard && (
        <div>
          <h3>Update Method</h3>
          <input
            type="text"
            value={newCardNumber}
            onChange={(e) => setNewCardNumber(e.target.value)}
            placeholder="New Card Number"
            className="form-control mb-3"
          />
          <button onClick={handleUpdate} className="btn btn-success mb-3">
            Update Method
          </button>
        </div>
      )}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Card Number</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.card_number} onClick={() => selectCard(card)}>
              <td className="border px-4 py-2">{card.card_number}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(card.card_number)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cards.length === 0 && <div>No payment methods found.</div>}
    </div>
  );
}

export default PaymentMethodSettings;
