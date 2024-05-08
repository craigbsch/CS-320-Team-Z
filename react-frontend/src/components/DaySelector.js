import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from '../api/common';

const DaySelector = (props) => {
    const [validDates, setValidDates] = useState([]);

    useEffect(() => { // dynamically contructs valid dates
        if (props.hall) {
            axios.get(`/menu/valid_dates`, { params: { dining_hall: props.hall } })
                .then(response => {
                    if (response.data.length > 0) {
                        setValidDates(response.data);
                    } else {
                        // If no valid dates, set to current date
                        const currentDate = new Date().toISOString().split('T')[0];
                        setValidDates([currentDate]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching valid dates:', error);
                    // Defaults to today's date on error
                    const currentDate = new Date().toISOString().split('T')[0];
                    setValidDates([currentDate]);
                });
        }
    }, [props.hall]);

    return (
        <Container className='d-flex justify-content-center align-items-center'>
            Select a Date:
            <DropdownButton id='dropdown-basic-button' title={props.day || 'Select Date'}>
                {validDates.map((dateStr) => {
                    const date = new Date(dateStr + 'T00:00:00Z'); 
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
                    const formattedDate = `${dayOfWeek}: ${date.toLocaleDateString('en-US', { timeZone: 'UTC' })}`;
                    return (
                        <Dropdown.Item
                            key={dateStr}
                            onClick={() => props.setDay(dateStr)}
                        >
                            {formattedDate}
                        </Dropdown.Item>
                    );
                })}
            </DropdownButton>
        </Container>
    );
};

export default DaySelector;
