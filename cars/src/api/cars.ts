import { http } from './http';

export interface Car {
  id?: number;            
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
}

/* --- CRUD ---*/
export const listMine  = async ()          => (await http.get <Car[]>('/cars')).data;
export const getByPlate= async (p:string ) => (await http.get <Car>(`/cars/${p}`)).data;
export const create    = async (c:Car)     => (await http.post<Car>('/cars', c)).data;
export const update    = async (p:string,c:Car)=> (await http.put <Car>(`/cars/${p}`,c)).data;
export const remove    = async (p:string ) =>   http.delete   (`/cars/${p}`);
