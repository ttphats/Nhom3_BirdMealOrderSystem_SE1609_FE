import AxiosClient from "../../../config/AxiosClient";
import { BirdSpecies, Combo } from "../models";

const comboApi = {
  fetch: (sortOption: string, idBird: string, page: number, pageSize: number): Promise<Combo[]> =>
    AxiosClient.get(`/guest/Combos?descending=${sortOption}&idBird=${idBird}&page=${page}&pageSize=${pageSize}`),
  getBird: (): Promise<BirdSpecies[]> => AxiosClient.get("/BirdSpecies"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (form: any) =>
    AxiosClient.post("/staff/Combos", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getDetails: (id: number): Promise<Combo> =>
    AxiosClient.get(`/guest/Combos/detail/${id}`),
  search: (query: string): Promise<Combo[]> =>
    AxiosClient.get(`/guest/Combos?name=${query}`),
};

export default comboApi;
