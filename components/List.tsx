
import React, { FC } from "react";
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import { CoffeesProps } from "../interfaces/CoffeesProps";
import CoffeeIcon from '@mui/icons-material/Coffee';
import { grey } from '@mui/material/colors';



const CoffeeList: FC<CoffeesProps> = ({ coffeesList }) => {

    return (<List >

        {coffeesList.map((coffee, i) => {
            let avatar;
            let style;
            let url = "";
            if (coffee.name && coffee.name.startsWith("@")) {
                const picture = "https://unavatar.io/twitter/" + coffee.name;
                url = "https://twitter.com/" + coffee.name;
                style = { border: "1px solid lightseagreen" };
                avatar =
                    <Avatar src={picture} sx={{ border: "1px solid lightseagreen" }} />
            } else {
                style = { border: "1px solid black", bgcolor: grey[500] };
                avatar = <Avatar sx={{ border: "1px solid black", bgcolor: grey[500] }}> <CoffeeIcon /> </Avatar>

            }
            
            return <ListItem key={"coffee" + i}>

                <IconButton disabled={url == ""} onClick={() => window.open(url, "_blank")}>{avatar}</IconButton>
                <span>{"  "}</span>
                <Typography variant="body2"> {url !== "" ? <Link href={url}>{coffee.name}</Link> : "Someone"}{" made a donation of " + coffee.amount + (coffee.amount > 1 ? " coffees" : " coffee")}{}{coffee.message? ": "+ coffee.message : ""} </Typography>
            </ListItem>
        })}
    </List>
    );
}

export default CoffeeList;