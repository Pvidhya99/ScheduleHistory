import axios from "axios";
import { BASE_URL_2 } from "../server/constants";

const client = axios.create({
    baseURL: BASE_URL_2,
   
  });

export default client