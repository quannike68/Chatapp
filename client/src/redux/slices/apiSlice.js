import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react';
const API_URL = import.meta.env.VITE_API_URL;

const baseUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_URL + '/api'
    : '/api';


const baseQuery = fetchBaseQuery({baseUrl, credentials: 'include'});


export const apiSlice = createApi({
    baseQuery,
    tagTypes: [],
    endpoints:(builder) =>({

    })
});