import axios from 'axios';

export const dataLoader = async path => {
    const config = {
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await axios.get(path, config);
    return response.data;
};
