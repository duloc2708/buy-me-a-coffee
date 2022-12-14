import type { NextPage } from 'next'
import abi from '../utils/BuyMeACoffee.json';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import List from '../components/List';
import SnackBar from '../components/SnackBar';
import Form from '../components/Form';
import Footer from '../components/Footer';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { GitHub, Telegram, LinkedIn, ContactPage, Twitter, Mail } from '@mui/icons-material';

interface IDonation {
  account: string;
  name?: string;
  message?: string;
  amount: number
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Home: NextPage = () => {

  // Contract Address & ABI
  const contractAddress = "0x90F7597B225A9df18983840F7f23ef460D8d0f8a"; // TODO: env var
  const contractABI = abi.abi;

  // Component state
  const [donators, setDonators] = useState<IDonation[]>([]);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const donationsPerPage = 3;

  const [walletConnected, setWalletConnected] = React.useState(false);
  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleToggle = () => {
  //   setOpen(!open);
  // };

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [showWalletError, setShowWalletError] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [coffeesLoading, setCoffeesLoading] = React.useState(false);

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [walletMessage, setWalletMessage] = useState("Hey! Connect your wallet to see the messages");

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleWalletError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowWalletError(false);
  };


  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window as any;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const { chainId } = await provider.getNetwork()
        if (chainId !== 5) {
          console.log("incorrect network " + chainId);
          setShowWalletError(true)
          // setOpen(true)
          setWalletMessage("Oops! Change the wallet network to Goerli")
          throw new Error("incorrect network");

        }
        console.log("wallet is connected! " + account);
        setWalletConnected(true)

      } else {
        console.log("make sure MetaMask is connected");
        setWalletConnected(false)
      }
    } catch (error) {
      console.log("error: ", error);
      setWalletConnected(false)
    }
  }

  const connectWallet = async () => {
    try {

      const { ethereum } = window as any;

      if (!ethereum) {
        console.log("please install MetaMask");
        setShowWalletError(true)
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      setCurrentAccount(accounts[0]);
      getMemos();
      // setOpen(true)
      setWalletConnected(true)
      setShowWalletError(false)
      setSuccess(true)
      console.log("true")

    } catch (error) {
      // setOpen(false)
      console.log(error);
      setWalletConnected(false)
      setSuccess(false)
      setWalletMessage("Oops! It's seems there's a problem with your wallet")

    }
  }


  const buyCoffee = async (name: string, message: string, amount: number) => {
    try {
      const { ethereum } = window as any;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..")
        console.log("buying coffee..", name, message, amount)
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "",
          message ? message : "",
          BigInt(amount),
          { value: ethers.utils.parseEther("0.001").mul(BigInt(amount)) }
        );

        await coffeeTxn.wait();
        setSuccess(true)

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");
        // Clear the form fields.
        getMemos();
      }
    } catch (error) {
      console.log(error);
      setSuccess(false)
      setError(true)
      // setWalletMessage("Error while donating")
    } finally {
      setOpen(true)
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        setCoffeesLoading(true)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..",buyMeACoffee);
        const memos = await buyMeACoffee.getMemos();
        console.log('memos',memos)
        const previousDonators: IDonation[] = []
        for (let index = memos.length - 1; index >= 0; index--) {
          const { address: account, name, message, amount } = memos[index];
          console.log({ account, name, message, amount })
          previousDonators.push({ account, name, message, amount })
        }
        console.log("fetched!", previousDonators);
        setDonators(previousDonators);
        setPages(Math.ceil(previousDonators.length / donationsPerPage))
      } else {
        console.log("Metamask is not connected");
        setWalletConnected(false)

      }

    } catch (error) {
      console.log(error);
      setWalletConnected(false)
      setError(true)
      setWalletMessage("Oops! There's a problem loading the coffees")
    } finally {
      setCoffeesLoading(false)
    }
  };
  useEffect(() => {
    if (walletConnected) {
      getMemos()

    }
  }, [walletConnected])

  useEffect(() => {
    let buyMeACoffee: ethers.Contract;
    isWalletConnected();
    // getMemos(); //twice
    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewCoffee = (from: string, timestamp: string, name: string, message: string, amount: number) => {
      console.log("Memo received: ", from, timestamp, name, message, amount);
    };

    const { ethereum } = window as any;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewCoffee", onNewCoffee);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewCoffee", onNewCoffee);
      }
    }
  }, []);
  // handle this change
  return (
    <div >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <Grid container
        spacing={3}
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Item>
            <Paper variant="outlined" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundImage: `url(${"/wallpaper.jpg"})` }}>
              <br />
              <Typography variant="h1" gutterBottom component="div" color="common.white">nfts9999</Typography>
              <Avatar alt="Leandro Palazzolo" src="/profile-new.jpg" sx={{ width: 240, height: 240, border: "3px solid lightseagreen" }} />
              <br />
              <Typography variant="subtitle1" gutterBottom component="div" color="common.white">Black coffee, no sugar, please</Typography>
              <Typography variant="body1" gutterBottom color="common.white"> {donators.length}{" supporters"}</Typography>
            </Paper>
          </Item>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', }}>



          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ minHeight: '300px' }}>
          <Item sx={{ height: '100%' }}>
            <Typography variant="h6" gutterBottom component="div">Bio</Typography>
            <br />
            <Typography variant="body1" gutterBottom>
              {"Hey! I'm Leandro, I'm 27 and I live in Buenos Aires, Argentina. I work as a software engineer and this is my buy-me-a-coffee page. \nI created this web in my second week of the program #RoadToWeb3 because I'm learning about web3."}
            </Typography>
            <br />
            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="center">

              <Grid item xs={2} sm={1}>
                <a href={"https://linkedin.com/in/leandro-palazzolo-85350787/"}>
                  <LinkedIn sx={{ color: "#0077b5" }} />
                </a>
              </Grid><Grid item xs={2} sm={1}>
                <a href={"https://twitter.com/nfts9999"}>
                  <Twitter sx={{ color: "#1da1f2" }} />
                </a>
              </Grid><Grid item xs={2} sm={1}>
                <a href={"http://github.com/nfts9999"}>
                  <GitHub sx={{ color: "#24292e" }} />
                </a>
              </Grid><Grid item xs={2} sm={1}>

                <a href={"https://t.me/nfts9999"}>
                  <Telegram sx={{ color: "#0088cc" }} />
                </a>            </Grid>
              <Grid item xs={2} sm={1}>
                <a href={"mailto:nfts9999@gmail.com"}>
                  <Mail sx={{ color: "#c71610" }} />
                </a>
              </Grid><Grid item xs={2} sm={1}>
                <a href={"https://nfts9999.github.io/CV"}>
                  <ContactPage sx={{ color: "#00a98f" }} />
                </a>
              </Grid>
            </Grid>

          </Item>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Item>
            <Typography variant="h6" gutterBottom component="div">Donate</Typography>
            <Form buyCoffee={buyCoffee} success={success} loading={loading} error={error} walletConnected={walletConnected} connectWallet={connectWallet} />
          </Item>
        </Grid>

        <Grid item xs={12} sm={8} sx={{ minHeight: '300px' }}>
          <Item sx={{ height: '100%' }}>

            <Typography variant="h6" gutterBottom component="div">Recent donations</Typography>
            {coffeesLoading && walletConnected ? <CircularProgress /> :


              walletConnected ?
                <>
                  {donators.length > 0 ?
                    <>
                      <List coffeesList={donators.slice((page - 1) * donationsPerPage, (page) * donationsPerPage)} />
                      {donators.length > donationsPerPage && <Pagination count={pages} defaultPage={1} page={page} onChange={handleChange} />}
                    </> :
                    <Typography variant="body1" gutterBottom component="div">There're no donations yet, soyez le premier!</Typography>}
                </>
                : <>{walletMessage}</>
            }
          </Item>

        </Grid>

      </Grid>

      <SnackBar onClose={handleClose} open={open} severity={error ? "error" : "success"} message={error ? "Error donating!" : "Donation made. Thanks!"} />
      <SnackBar onClose={handleWalletError} open={showWalletError} severity={"error"} message={walletMessage} />

      <Grid item xs={12} sm={4}>
        <Item >

          <Typography>Powered by Ethereum, Alchemy, Next.js and IPFS</Typography>
        </Item>

      </Grid>
    </div>
  )
}

export default Home
