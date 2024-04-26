import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClientCreditCardManagement({ clientEmail }) {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [newCardNumber, setNewCardNumber] = useState('');

    useEffect(() => {
        fetchCards();
    }, [clientEmail]);

    const fetchCards = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/client/${clientEmail}/cards`);
            if (response.data.success) {
                setCards(response.data.cards);
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
            alert('Failed to load cards. Please try again.');
        }
    };

    const handleAddCard = async () => {
        if (!cardNumber) {
            alert('Please enter a card number to add.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:4000/client/addCard`, {
                cardNumber,
                clientEmail
            });
            if (response.data.success) {
                setCards([...cards, response.data.card]);
                setCardNumber('');
            } else {
                alert('Failed to add card.');
            }
        } catch (error) {
            console.error('Error adding card:', error);
            alert('Failed to add card. Please try again.');
        }
    };

    const handleUpdateCard = async () => {
        if (!newCardNumber || !selectedCard) {
            alert('Please select a card and enter a new card number to update.');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:4000/client/${clientEmail}/cards/${selectedCard.card_number}`, {
                newCardNumber
            });
            if (response.data.success) {
                const updatedCards = cards.map(card => 
                    card.card_number === selectedCard.card_number ? { ...card, card_number: newCardNumber } : card
                );
                setCards(updatedCards);
                setSelectedCard(null);
                setNewCardNumber('');
            } else {
                alert('Failed to update card.');
            }
        } catch (error) {
            console.error('Error updating card:', error);
            alert('Failed to update card. Please try again.');
        }
    };

    const handleDeleteCard = async (cardNumberToDelete) => {
        if (!cardNumberToDelete) {
            alert('Please select a card to delete.');
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:4000/client/${clientEmail}/cards/${cardNumberToDelete}`);
            if (response.data.success) {
                setCards(cards.filter(card => card.card_number !== cardNumberToDelete));
            } else {
                alert('Failed to delete card.');
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('Failed to delete card. Please try again.');
        }
    };

    return (
        <div className="container mx-auto mt-4">
            <h2 className="text-xl font-semibold">Manage Client Credit Cards</h2>
            <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Add New Card Number" />
            <button onClick={handleAddCard}>Add Card</button>
            {cards.map(card => (
                <div key={card.card_number}>
                    <p>{card.card_number}</p>
                    <button onClick={() => setSelectedCard(card)}>Select Card</button>
                </div>
            ))}
            {selectedCard && (
                <div>
                    <input type="text" value={newCardNumber} onChange={e => setNewCardNumber(e.target.value)} placeholder="New Card Number" />
                    <button onClick={handleUpdateCard}>Update Card</button>
                    <button onClick={() => handleDeleteCard(selectedCard.card_number)}>Delete Card</button>
                </div>
            )}
        </div>
    );
}

export default ClientCreditCardManagement;
