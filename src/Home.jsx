import React, { useState, useEffect } from "react";
import {
  Space,
  Row,
  Col,
  Button,
  message
} from "antd";
import { Table } from 'antd';
import axios from "axios";
import MyModal from './MyModal';

function Home() {
  const [data, setData] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [type, setType] = useState();
  const [itemId, setItemId] = useState();
  const [name, setName] = useState();
  
  useEffect(async() => {
    getItems();
  }, [])

  const getItems = async() => {
    const response = await axios.get("https://ShopifyBackendChallenge-prashit.praspatel.repl.co/items");
    
    if(response.data.success === true && response.status === 200) {
     setData(response.data.items); 
    }
  }
  
  const addItemClick = () => {
    setAddModal(true);
  }

  const closeModal = () => {
     setAddModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setItemId();
    getItems();
  }

  const onEditClick = (id) => {
    setItemId(id);
    setEditModal(true);
  }

  const onDeleteClick = (id, name) => {
    setItemId(id);
    setName(name)
    setDeleteModal(true);
  }

  const onUnDeleteClick = (id) => {
    axios.put("https://ShopifyBackendChallenge-prashit.praspatel.repl.co/items/undelete/"+id).then(() => {
        message.success("Item undeleted successfully");
        getItems();
      });
  }
  
  const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: 'Received on',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Priced per item (CAD)',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Deleted',
    dataIndex: 'isdeleted',
    key: 'isdeleted',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button type="link" onClick={() => onEditClick(record._id)}>Edit</Button>
        {record.isdeleted === "false" && <Button type="link" onClick={() => onDeleteClick(record._id, record.name)}>Delete</Button>}
        {record.isdeleted === "true" && <Button type="link" onClick={() => onUnDeleteClick(record._id)}>UnDelete</Button>}
      </Space>
    ),
  },
  {
    title: 'Delete comments',
    dataIndex: 'comments',
    key: 'comments',
  },
];

  return (
    <Col>
      <Row>
        <h2 
          style={{
            fontWeight: "bold"
        }}
        > Shopify Backend Challenge Inventory </h2>   
      </Row>
      <Row>
        <Button onClick={addItemClick} size="medium"
          style={{ backgroundColor: "green", color: "white" }}
        >
          Add Item
        </Button>
      </Row>
      <Row>
        <Table
          columns={columns} dataSource={data} 
          style={{width:"100%"}}
        />
      </Row>
      <MyModal showModal={addModal} closeModal={closeModal} type="add"/>
      <MyModal showModal={editModal} closeModal={closeModal} itemId={itemId} type="edit"/>
      <MyModal showModal={deleteModal} closeModal={closeModal} name={name} itemId={itemId} type="delete"/>
    </Col>
  );
}

export default Home;
