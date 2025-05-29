import { useState } from 'react';

// @ts-ignore
const useForm = (initialValues, validate) => {
  const [formData, setFormData] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // @ts-ignore
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // @ts-ignore
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form
    if (validate) {
      const errors = validate(formData);
      if (Object.keys(errors).length > 0) {
        alert('Please fill in all required fields.');
        return;
      }
    }

    setIsSubmitted(true);
    setFormData(initialValues);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitted,
    setFormData,
  };
};

export default useForm;
