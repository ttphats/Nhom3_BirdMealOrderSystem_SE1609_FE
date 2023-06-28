import AxiosClient from "../../../config/AxiosClient";
import { Combo } from "../models";

const comboApi = {
  fetch: (): Promise<Combo[]> => AxiosClient.get("/guest/Combos"),
};

export default comboApi;