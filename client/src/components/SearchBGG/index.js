import React, { useEffect, useState } from "react";
// import './style.css';
// import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    button: {
        padding: '5px',
        marginTop: '10px',
        marginBottom: '10px'
    },
    div: {
        marginTop: '5px'
    }
}));

function SearchBGG(props) {
    const classes = useStyles();

    const topGames = [
        // top BGG games? Most recent user search?
        { title: 'Settlers of Catan', year: 1995 },
        { title: 'Crossbows and Catapults', year: 1983 },
        { title: 'Cards Against Humanity', year: 2009 },
        { title: 'Exploding Kittens', year: 2015 },
        { title: 'Scattergories', year: 1988 },
        { title: "Magic: The Gathering", year: 1993 },
        { title: 'Photosynthesis', year: 2017 },
      ];

    const [gamePrev, setGamePrev] = useState({});
    // const [searchedFor, setSearchedFor] = useState([]);
    const [games, setGames] = useState([]);
    const [query, setQuery] = useState('catan');
    const [search, setSearch] = useState('');
    const [value, setValue] = useState(topGames[0].title);
    const [inputValue, setInputValue] = useState('');    // const [gamePreview, setPreview] = useState([]);

    useEffect(()  => {      
        const fetchData = async() => {
            const response = await axios.get(`/api/games/${inputValue}`);
            let game = {
                gameId: response.data.elements[0].elements[0].attributes.objectid,
                name: response.data.elements[0].elements[0].elements[0].elements[0].text,
                yearPublished: response.data.elements[0].elements[0].elements[1].elements[0].text
            }
            setGames(games => [...games, game ]);
        };

        fetchData();    
    }, [inputValue]);

function getPreview(id) {
    const fetchPreview = async() => {
        const response = await axios.get(`/api/ids/${id}`);
        console.log('response: ',response.data);
        let gameId = response.data.elements[0].elements[0].attributes.id;
        let name;
        let image;
        let description;
        let minPlayers;
        let maxPlayers;
        let minPlayTime;
        let maxPlayTime;
        let yearPublished;

        for (let i = 0; i < response.data.elements[0].elements[0].elements.length; i++) {
            if (response.data.elements[0].elements[0].elements[i].name === "thumbnail") {
                image = response.data.elements[0].elements[0].elements[0].elements[0].text
            }
            if (response.data.elements[0].elements[0].elements[i].name === "name") {
                name = response.data.elements[0].elements[0].elements[2].attributes.value
            }
            if (response.data.elements[0].elements[0].elements[i].name === "minplayers") {
                minPlayers = response.data.elements[0].elements[0].elements[i].attributes.value
            }
            if (response.data.elements[0].elements[0].elements[i].name === 'maxplayers') {
                maxPlayers = response.data.elements[0].elements[0].elements[i].attributes.value
            }
            if (response.data.elements[0].elements[0].elements[i].name === 'description') {
                description = response.data.elements[0].elements[0].elements[i].elements[0].text
            }
            if (response.data.elements[0].elements[0].elements[i].name === 'minplaytime') {
                minPlayTime = response.data.elements[0].elements[0].elements[i].attributes.value
            }
            if (response.data.elements[0].elements[0].elements[i].name === 'maxplaytime') {
                maxPlayTime = response.data.elements[0].elements[0].elements[i].attributes.value
            }
            if (response.data.elements[0].elements[0].elements[i].name === 'yearpublished') {
                yearPublished = response.data.elements[0].elements[0].elements[i].attributes.value
            }
        }

        const gamePrevObj = {
            gameId: gameId,
            name: name,
            image: image,
            description: description,
            minPlayers: minPlayers,
            maxPlayers: maxPlayers,
            minPlayTime: minPlayTime,
            maxPlayTime: maxPlayTime,
            yearPublished: yearPublished,
        }
        console.log(gamePrevObj);
        setGamePrev(gamePrevObj);
        props.setAppState(gamePrevObj);
    }   
    fetchPreview(); 
};

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
            {/* <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div> */}
            {/* <div>{`inputValue: '${inputValue}'`}</div> */}
                <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        setInputValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    id="topGamesDropdown"

                    // disableClearable
                    options={topGames.map((option) => option.title)}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search for Board Game"
                        // margin="normal"
                        variant="outlined"
                        // value={query}
                        // onChange = { 
                        //     event => {
                        //         setQuery(event.target.value);
                        //         setSearchedFor(event.target.value);
                        //     }
                        // }
                        // InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                    )}
                />
                <button 
                    type="button"
                    value={inputValue}
                    // value={search}
                    onClick={() =>  {
                        setQuery(inputValue);
                        setSearch(inputValue);
                        }
                    }
                >
                    Search
                </button> 
            </Paper>
            <Paper>
                {games.length ? (
                    <div className={classes.div}>
                        {games.map(game => (
                        <button className={classes.button}
                            key={game.gameId} 
                            value={game.gameId} 
                            onClick={() => {
                                getPreview(game.gameId)
                              }
                            }
                        >
                            <strong> {game.name} </strong>
                        </button>
                        
                        ))}
                    </div>
                    ) : (
                    <div>
                        <h3>No Search Results to Display</h3>
                    </div>
                )}
            </Paper>
        </div>
    )
}

export default SearchBGG;