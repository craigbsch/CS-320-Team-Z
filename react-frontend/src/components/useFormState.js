import { useState } from 'react';

const useFormState = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const handleChange = (key) => (e) => setValues({...values, [key]: e.target.value});

  const resetForm = () => setValues(initialValues);

  return { values, handleChange, resetForm };
};

export default useFormState;
