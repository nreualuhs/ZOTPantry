import './pantry.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React, {useState} from 'react';
import { v1 as uuidv1 } from 'uuid';


const Pantry = () => {
    
    const [items, setItems] = useState([
        {
            name: "apple",
            id: "wjavande",
            expiration_date: "2024-02-03"
        },
        {
            name: "cereal",
            id: "azerty",
            expiration_date: "2024-12-24"
        },
        {
            name: "bananas",
            id: "dvorak",
            expiration_date: "2025-02-03"
        }

    ]);

    const [id, setId] = useState('');

    const[input, setInput] = useState({
        name: "",
        expiration_date: ""
    });

    const d = (name) => {
        setInput({
            ...input,
            name: name,
        }); //this is probably wrong
        console.log(input);
    }
    const expdate = (date) => {
        setInput({
            ...input,
            expiration_date: date,
        })
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        // this.reminders.push({
        //     description: event.target.description,
        //     author: event.target.author,
        // });
        input.id = uuidv1();
        if (items.length == 0)
        {
            setItems([input])
            return;
        }
        let i = 0;
        while (i < items.length && compareDates(items[i].expiration_date, input.expiration_date) < 0)
        {
            i++;
        }
        items.splice(i, 0, input);
        console.log(items);
        setItems([...items]);
        /*
        setItems([...items, 
            input
        ]);
        */
        //console.log(reminders);
        
        console.log("keys: " + Object.keys(items));
        console.log("Values:" + Object.values(items));
    }

    const handleDelete = (item) => {
        let newItems = items.filter(i => i.id !== item.id)
        setItems([...newItems,
        ]);
    }



    
    return (
        <div className="chore-list">
            <div className="pantry-title">
                <h2>pantry</h2>
            </div>
            {items.map((item) => (
                <div className="itembox">
                    <IconButton type="delete" color="primary" onClick={event => handleDelete(item)}><DeleteIcon/></IconButton>
                    <Item id={item.id} name={item.name} expiration_date={item.expiration_date}/>
                </div>
            ))}
            <Popup trigger={<IconButton color="primary"><AddCircleIcon/></IconButton>} modal nested>
                <form onSubmit={handleSubmit}>
                    <label for="name">
                        <p>Name:</p>
                        <input type="text" name="description" onChange={event => d(event.target.value)}></input>
                    </label>
                    <label for="expiration_date">
                        <p>Expiration Date:</p>
                        <input type="date" name="expiration_date" onChange={event => expdate(event.target.value)}></input>
                    </label>
                    <IconButton type="submit" color="primary"><AddCircleIcon /></IconButton>
                </form>
            </Popup>
        </div>
    )
}

const compareDates = (x, y) => {
    // if one date is null, 
    if (x == null)
    {
        return -1;
    }
    if (y == null)
    {
        return 1;
    }
    const dx = new Date(x);
    const dy = new Date(y);
    return dx.getTime() - dy.getTime();
}

const timeTilExpired = (date) => {
    const d = new Date(date);
    const diff = d.getTime() - Date.now();
    let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const daystring = days % 30 > 0 ? days % 30 + " day" + (days % 30 > 1 ? "s" : "") : "";
    const monthstring = months > 0 ? months + " month" + (months > 1 ? "s" : "") : "";

    if (days < 0)
    {
        return "Expired"
    }
    else if (days === 0)
    {
        return "Expires today"
    }
    return "Expires in " + (monthstring !== "" && daystring !== "" ? monthstring + ", " + daystring : monthstring + daystring);
}

const daysTilExpired = (date) => {
    const d = new Date(date);
    const diff = d.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const Item = (props) => {
    const days_til_expired = daysTilExpired(props.expiration_date)
    let expireStyle;
    if (days_til_expired < 0)
    {
        expireStyle = "item item-expired"
    }
    else if (days_til_expired === 0)
    {
        expireStyle = "item item-expiring"
    }
    else if (days_til_expired < 8)
    {
        expireStyle = "item item-caution"
    }
    else
    {
        expireStyle = "item item-good"
    }
    
    return (<div className="item">
        <div className={expireStyle}>
            <p className="item-title">{props.name}</p>
            <br/>
            <p className="item-description">
                {timeTilExpired(props.expiration_date)}
            </p>
        </div>
    </div> 
    );
}

export default Pantry;