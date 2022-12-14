import React, { FC, useState, ChangeEvent, MouseEvent, Dispatch, SetStateAction } from "react";
import { CoffeesProps } from "../interfaces/CoffeesProps";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';
import LoadingButton from '@mui/lab/LoadingButton';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Coffee from '@mui/icons-material/Coffee';
import FormControl from '@mui/material/FormControl';
import { ContentPasteGoOutlined } from "@mui/icons-material";

interface Props {
    buyCoffee: (name: string, message: string, value: number) => Promise<void>,
    connectWallet: () => Promise<void>,
    success: boolean,
    loading: boolean,
    error: boolean,
    walletConnected: boolean,
}

const Form: FC<Props> = ({ buyCoffee, success, loading, error, walletConnected, connectWallet, ...props }) => {
    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };
    const [input, setInput] = useState({
        name: "",
        message: "",
        amount: 1
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        const newValue = id == "amount" ? parseInt(value) : value
        setInput({
            ...input,
            [id]: newValue
        });
        console.log(input)
    };
    const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (input.name == "" || input.message == "" || input.amount < 1 || input.amount > 4000000) {
            console.log("validate")
        }
        console.log("validate")
        console.log(input)
        if (walletConnected) {
            handleClick(e)
        } else {
            connectWallet()
        }
    }
    const addNetwork = (e: MouseEvent<HTMLButtonElement>) => {
        const { ethereum } = window as any;
        try {
            ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x5' }],
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x5',
                                chainName: 'Goerli Testnet',
                                rpcUrls: ['https://eth-goerli.public.blastapi.io']
                            },
                        ],
                    });
                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        }
    }
    const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
        const { name, message, amount } = input;

        try {
            console.log(input)

            await buyCoffee(name, message, amount);
        } catch (e) {

            setInput({
                name: "",
                message: "",
                amount: 1
            });
        }
    };

    return (

        <FormControl variant="standard" margin="normal" >
            <br />
            <TextField value={input.amount}
                onChange={handleChange}
                required
                id="amount"
                label="Amount"
                type="number"
                disabled={!walletConnected}
                // InputProps={{ inputProps: { min: 0, max: 100 } }}
                // InputLabelProps={{
                //     shrink: true,
                // }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Coffee />
                        </InputAdornment>
                    ),
                }}

                {...props}
            />
            <br />
            <TextField value={input.name}
                onChange={handleChange}
                disabled={!walletConnected}
                id="name"
                label="Name or @yourtwitter"
            // placeholder="name or @yourtwitter (optional)"
            />
            <br />
            <TextField value={input.message}
                onChange={handleChange}
                disabled={!walletConnected}
                id="message"
                label="Message"
            // placeholder="say something nice (optional)"
            />
            <Box sx={{ m: 1, position: 'relative' }}>
                <LoadingButton loading={loading} variant="contained" color={'error'}
                    onClick={addNetwork}>
                    Switch Network
                </LoadingButton>
                {' => '}
                <LoadingButton loading={loading} variant="contained" color={'warning'}
                    onClick={() => {
                        window.open('https://goerlifaucet.com/', '_blank')
                    }}>
                    Faucet
                </LoadingButton>
                {' => '}
                <LoadingButton loading={loading} variant="contained" color={success ? "success" : (error ? "error" : "primary")}
                    onClick={handleOnClick}>
                    {walletConnected ? "Buy" : "Connect"}
                </LoadingButton>

            </Box>
        </FormControl >

    );
};

export default Form;