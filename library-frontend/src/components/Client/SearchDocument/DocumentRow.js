import React from 'react';

// componet to store document infomation in Search Documents Table
function DocumentRow({ document, isSelected, onSelect }) {
    const handleClick = () => {
        onSelect(document);
    };

    return (
        <tr 
            onClick={handleClick}
            style={{ cursor: 'pointer', backgroundColor: isSelected ? '#f8f9fa' : '' }}
        >
            <td>{document.title}</td>
            <td>{document.authors}</td>
            <td>{document.year}</td>
            <td>{document.isbn}</td>
            <td>{document.copies}</td>
        </tr>
    );
}

export default DocumentRow;
