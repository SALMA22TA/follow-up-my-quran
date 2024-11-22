import { useState } from 'react';

const useForm = (initialValues, validate) => {
  const [formData, setFormData] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form
    if (validate) {
      const errors = validate(formData);
      if (Object.keys(errors).length > 0) {
        alert('يرجى ملء جميع الحقول المطلوبة.');
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
