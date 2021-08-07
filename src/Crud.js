import React, { useEffect, useState } from "react";
import { Row, Col, Button, Input, Modal, ModalBody, Table } from "reactstrap";
import axios from 'axios'


export default function Crud() {

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [modalDel, setModalDel] = useState(false);
  const [idxDel, setIdxDel] = useState(null);

  const handleModalAdd = () => {
    setModalAdd(!modalAdd)
  }

  const handleAdd = () => {
      let newData = { name, username }
        axios.post(`http://localhost:3004/data`, (newData))
      .then(res => {
        setData([...data, res.data])
        setName("");
        setUsername("");
        setModalAdd(false);
        setLoading(false)
      })
  }

  const handleName = (e, idx) => {
    let dataTmp = [...data]
    dataTmp[idx].name = e.target.value
    setData([...dataTmp])
  }

  const handleUsername = (e, idx) => {
    let dataTmp = [...data]
    dataTmp[idx].username = e.target.value
    setData([...dataTmp])
  }

  const handleDel = () => {
    axios.delete(`http://localhost:3004/data/${idxDel}`)
      .then(res => {
        let dataTmp = data.filter((v) => v.id !== idxDel)
        setData(dataTmp)
        setModalDel(false)
      })
  }

  const handleEdit = (idx) => {
    let dataTmp = [...data]
    dataTmp[idx].isEdited = true
    setData(dataTmp)
  }

  const handleSave = (id, idx) => {
    let dataEdit = {
      name:data[idx].name, 
      username:data[idx].username, 
    }
    axios.put(`http://localhost:3004/data/${id}`, dataEdit )
    .then(res => {
      let dataTmp = [...data]
      dataTmp[idx].isEdited = false
      setData(dataTmp)
    })
  }


  const getData = () => {
    axios.get(`http://localhost:3004/data`)
      .then(res => {
        let data = res.data.map(v => ({ ...v, isEdited: false }))
        setData(data)
        setLoading(false)
      })
  }


  useEffect(() => {
    getData()
  }, [])

  console.log(data)

  return (
    <div className="app">
      {loading ? "Loading..." :
        <>
                  
                  <h3>CRUD App with Hooks</h3>
                  <Button style={{marginBottom: '10px'}} className="btn-add" color="primary" type="submit" onClick={() => handleModalAdd()} >Add user</Button>
                  
        <Row style={{marginLeft: '10px'}}>
            

        <Col>

            <Table borderless>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Action</th>
                    </tr>
                </thead>
                {data.map((v, idx) => (
                    <tbody>
                        <tr>
                            <td><Input value={v.name} onChange={(e) => handleName(e, idx)}  readOnly={!v.isEdited} /></td>
                            <td><Input value={v.username} onChange={(e) => handleUsername(e, idx)}  readOnly={!v.isEdited} /></td>
                            <td>
                            {v.isEdited?
                                <Button outline  color="primary" size="sm" onClick={() => handleSave(v.id ,idx)}>Save</Button>
                                    :
                                    <Button style={{ marginTop:'5px'}} outline  color="warning" size="sm" onClick={() => handleEdit(idx)}>Edit</Button>
                                }
                                
                                <Button style={{marginLeft: '5px', marginTop:'5px'}} outline color="danger" size="sm" onClick={() => {
                                    setModalDel(true)
                                    setIdxDel(v.id)

                                }} >Delete</Button>

                            </td>
                        </tr>
                    </tbody>
                ))}
                </Table>
        </Col>
        </Row>
    </>}


    <Modal isOpen={modalAdd} toggle={() => setModalAdd(!modalAdd)} >
        <ModalBody className="modal-create">
        <Row>
            <h4 style={{textAlign: 'center'}}>Add Data</h4>
        <Col>
            <Row style={{paddingLeft: '5px', paddingRight: '5px', marginBottom: '5px'}}> <Input placeholder='Input name' value={name} onChange={(e) => setName(e.target.value)} /></Row>
            <Row style={{paddingLeft: '5px', paddingRight: '5px', marginBottom: '10px'}}><Input placeholder='Input username' value={username} onChange={(e) => setUsername(e.target.value)} /></Row>
        </Col>
        </Row>
        <Button color="primary" onClick={() => handleAdd()}> Add</Button>
    </ModalBody>
    </Modal>

      <Modal isOpen={modalDel} toggle={() => setModalDel(!modalDel)}>
        <ModalBody className="modal-delete">
          <h4>Delete data?</h4>
          <Row>
            <Button style={{marginBottom: '5px'}} color="danger" size="sm" onClick={() => handleDel()}> Delete</Button>
            <Button color="secondary" size="sm" onClick={() => setModalDel(false)}> Cancel</Button>
          </Row>
        </ModalBody>
    </Modal>
    </div>
  );

}
