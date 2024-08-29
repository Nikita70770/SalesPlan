import axios from 'axios';

export const between = (x, min, max) => {
    return x >= min && x <= max;
};

export const numberWithSpaces = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const dataLoader = async path => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await axios.get(path, config);
    return response.data;
};
