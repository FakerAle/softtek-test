import { useState } from 'react';

export function useForm<T extends object>(init:T){
  const [values,setValues]=useState(init);
  const onChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
    const { name,value }=e.target;
    setValues(v=>({ ...v, [name]: value }));
  };
  const reset = ()=>setValues(init);
  return { values,onChange,reset,setValues };
}
