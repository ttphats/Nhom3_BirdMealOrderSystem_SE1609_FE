import AxiosClient from "../../../config/AxiosClient";
import { BirdSpecies, Combo } from "../models";

const comboApi = {
  fetch: (): Promise<Combo[]> => AxiosClient.get("/guest/Combos"),
  getBird: (): Promise<BirdSpecies[]> => AxiosClient.get("/BirdSpecies"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (form: any) =>
    AxiosClient.post("/staff/Combos", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getDetails: (id: number) : Promise<Combo>  => AxiosClient.get(`/guest/Combos/detail/${id}`),
};

export default comboApi;
