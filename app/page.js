'use client';
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Modal, Typography, Stack, TextField, Button, Container } from "@mui/material";
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const q = query(collection(firestore, "inventory"));
    const docs = await getDocs(q);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, "inventory"), name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
        });
      }
    }

    await updateInventory();
  };

  const addItem = async (name) => {
    const docRef = doc(collection(firestore, "inventory"), name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, {
        quantity: docSnap.data().quantity + 1,
      });
    } else {
      await setDoc(docRef, {
        quantity: 1,
      });
    }

    await updateInventory();
  };

  const handleSearch = (event) => {
    const typedName = event.target.value.toLowerCase();
    const filteredInventory = inventory.filter((item) =>
      item.name.toLowerCase().includes(typedName)
    );
    setFilteredInventory(filteredInventory);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const showFilteredInventory = filteredInventory.length > 0 ? filteredInventory : inventory;

  return (
    <Container>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Modal open={open} handleClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid black"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant="outlined" onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}>Add</Button>
            </Stack>
          </Box>
        </Modal>
        <Box border="1px solid #333">
          <Box
            width="800px"
            height="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderBottom="1px solid #333"
          >
            <Typography variant="h2" color="primary.main">
              Inventory Tracker
            </Typography>
          </Box>
          <Box
            width="100%"
            height="70px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #333"
            p={2}
          >
            <Typography variant="h6" color="secondary.main">Item</Typography>
            <Typography
              variant="h6"
              color="secondary.main"
            >Quantity</Typography>
            <TextField id="filled-search" label="Search item" type="search" onChange={(e)=>{
              handleSearch(e);
            }} />
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {
              showFilteredInventory.map((item) => (
                <Box
                  key={item.name}
                  width="100%"
                  height="60px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  borderBottom="1px solid #333"
                  p={2}
                >
                  <Typography variant="body1">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Typography>
                  <Typography variant="body1">{item.quantity}</Typography>
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="outlined"
                      sx = {{
                        ":hover": {
                          backgroundColor: "primary.main",
                          color: "white"
                        }
                      }}
                      onClick={() => addItem(item.name)}>Add</Button>
                    <Button 
                      variant="outlined" 
                      onClick={() => removeItem(item.name)}
                      sx = {{
                        ":hover": {
                          backgroundColor: "primary.main",
                          color: "white"
                        }
                      }}
                      >Remove</Button>
                  </Stack>

                </Box>
              ))
            }
          </Stack>
        </Box>
        <Button 
          variant="contained"
          sx = {{
            ":hover": {
              backgroundColor: "secondary.main",
              color: "white"
            }
          }} 
          onClick={() => handleOpen()}>Add New Item</Button>
      </Box>
    </Container>

  );
}
