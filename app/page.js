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
    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
            <Box
              display="flex"
              justifyContent="space-between"
            >
              <Typography
                variant="h6"
                color="primary.main"
              >Add Item</Typography>
              <Button
                onClick={handleClose}
                variant="outlined"
              >Cancel</Button>
            </Box>

            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                sx={{
                  color: "white",
                  bgcolor: "secondary.main",

                  ":hover": {
                    backgroundColor: "primary.main",
                    color: "white"
                  }
                }}
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}>Add</Button>
            </Stack>
          </Box>
        </Modal>
        <Box
          border="2px solid #333"
          borderRadius="10px"
          borderColor="primary.main"
          bordershadow={24}
        >
          <Box
            width="800px"
            height="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderBottom="2px solid #333"
            borderColor="primary.main"
            bordershadow={24}
          >
            <Typography variant="h2" color="primary.main">
              Inventory Tracker
            </Typography>
          </Box>
          <Box
            width="100%"
            height="80px"
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            borderColor="primary.main"
            bordershadow={24}
            pl={2}
            pr={8}
            borderBottom="2px solid #333"
          >
            <TextField
              id="filled-search"
              label="Search item"
              type="search"
              sx={{
                flexGrow: 1,
                width: "16%"
              }}
              onChange={(e) => {
                handleSearch(e);
              }} />
            <Box
              sx={{
                flexGrow: 1,
                width: "64%"
              }}
            >
            </Box>
            <Button
              variant="contained"
              sx={{
                ":hover": {
                  backgroundColor: "secondary.main",
                  color: "white"
                },
                flexGrow: 1,
                width: "20%"
              }}
              onClick={() => handleOpen()}>Add New Item</Button>
          </Box>
          <Box
            width="100%"
            height="60px"
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            borderColor="primary.main"
            bordershadow={24}
            px={2}
            borderBottom="2px solid #333"
          >
            <Typography
              variant="h6"
              color="secondary.main"
              sx={{
                flexGrow: 1,
                width: "33%"
              }}
            >Item</Typography>
            <Typography
              variant="h6"
              color="secondary.main"
              sx={{
                flexGrow: 1,
                width: "40%"
              }}
            >Quantity</Typography>
            <Box
              sx={{
                flexGrow: 1,
                width: "25%"
              }}
            ></Box>
          </Box>
          <Stack
            width="800px"
            height="400px"
            overflow="auto"
            sx={{
              spacing: 0,
            }}
          >
            {
              showFilteredInventory.map((item) => (
                <Box
                  key={item.name}
                  width="100%"
                  height="80px"
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  borderBottom="1px solid #333"
                  borderColor="primary.main"
                  sx={{
                    margin: "0px"
                  }}
                  p={2}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      width: "33%",
                    }}
                  >{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      width: "33%",
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  <Stack
                    display="flex"
                    direction="row"
                    spacing={1}
                    sx={{
                      flexGrow: 1,
                      width: "20%"
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        ":hover": {
                          backgroundColor: "primary.main",
                          color: "white"
                        }
                      }}
                      onClick={() => addItem(item.name)}>Add</Button>
                    <Button
                      variant="outlined"
                      onClick={() => removeItem(item.name)}
                      sx={{
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
      </Box>
    </Container>

  );
}
