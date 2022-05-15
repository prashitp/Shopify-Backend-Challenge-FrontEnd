import React, {useState, useEffect} from 'react';
import { Modal, message, Input, InputNumber, DatePicker } from 'antd';
import axios from "axios";
import moment from "moment";

function MyModal(props) {
  const [name, setName] = useState();
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState(new moment());
  const [dbDate, setDbDate] = useState(new moment().format("YYYY-MM-DD"));
  const [comments, setComments] = useState();

  useEffect(async() => {
    if(props.type === "edit") {
      const response = await axios.get("https://ShopifyBackendChallenge-prashit.praspatel.repl.co/items/"+props.itemId);
      if(response.data.success === true && response.status === 200) {
        setName(response.data.item.name);
        setQty(response.data.item.qty);
        setPrice(response.data.item.price);
        setDate(moment(response.data.item.date, "YYYY-MM-DD"));
      }
    } 
  }, [props.showModal]);

  const onOkClick =() => {
    if(props.type === "add") {
      axios.post("https://ShopifyBackendChallenge-prashit.praspatel.repl.co/items/add", {
          name: name,
          qty: qty,
          price: price,
          date: dbDate
      }).then(() => {
        message.success("Item added successfully");
        onCancelClick();
      });
    } else if(props.type === "edit") {
      axios.put("https://ShopifyBackendChallenge-prashit.praspatel.repl.co/items/update/"+props.itemId, {
          name: name,
          qty: qty,
          price: price,
          date: dbDate
      }).then(() => {
        message.success("Item updated successfully");
        onCancelClick();
      });
    } else if(props.type === "delete") {
      axios.put("https://ShopifyBackendChallenge-prashit.praspatel.repl.co/items/delete/"+props.itemId, {
          comments: comments,
      }).then(() => {
        message.success("Item deleted successfully");
        onCancelClick();
      });
    }

  }

  const onCancelClick = () => {
    setName();
    setQty();
    setPrice();
    setDate(new moment());
    setDbDate();
    setComments();
    
    props.closeModal();
  }

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onQtyChange = (qty) => {
    setQty(qty);
  }

  const onPriceChange = (price) => {
    setPrice(price);
  }

  const onDateChange = (date, dateString) => {
    setDate(date);
    setDbDate(dateString);
  }

  const onCommentsChange = (event) => {
    setComments(event.target.value);
  }
  
  return (
    <main>
        <Modal visible={props.showModal} onOk={onOkClick} onCancel={onCancelClick} >
         {props.type !== "delete" && (<>
      <h2 style={{textAlign:"center"}}>{props.type === "add" ? "Add" : "Edit"} new item</h2>
          <h4>Item Name</h4>
            <Input style={{width:"70%", margin:"0% 0% 2% 1%"}} placeholder="Item Name" onChange={onNameChange} value={name}/>
          <h4>Item Quantity</h4>
            <InputNumber style={{width:"70%", margin:"0% 0% 2% 1%"}} placeholder="Item Quantity" min={1} onChange={onQtyChange} value={qty}/>
          <h4>Price per item in CAD</h4>
            <InputNumber style={{width:"70%", margin:"0% 0% 2% 1%"}} placeholder="Price per item in CAD" onChange={onPriceChange} value={price}/>
          <h4>Date Received</h4>
            <DatePicker style={{width:"70%", margin:"0% 0% 2% 1%"}} onChange={onDateChange} value={date}/></>)}
          {props.type === "delete" && (<><h2 style={{textAlign:"center"}}>Are you sure you want to delete {props.name}?</h2>
          <h4>Deletion Comments</h4>
            <Input style={{width:"70%", margin:"0% 0% 2% 1%"}} placeholder="Description" onChange={onCommentsChange} value={comments}/></>)}
        </Modal>
    </main>
  );
}

export default MyModal;