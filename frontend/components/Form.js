import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

// Define validation errors
const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S, M, or L',
};

// Define toppings
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

// Define Yup validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required'),
  toppings: Yup.array(), // Optional
});

// Map sizes to full names
const sizeMap = {
  S: 'small',
  M: 'medium',
  L: 'large',
};

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to validate form data
  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsFormValid(true);
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      setIsFormValid(false);
    }
  };

  // Validate form data on change or blur
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        toppings: checked
          ? [...prevData.toppings, value]
          : prevData.toppings.filter((topping) => topping !== value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validateForm(); // Validate the form

      if (isFormValid) {
        const toppingCount = formData.toppings.length;
        const toppingText =
          toppingCount === 0 ? 'no toppings' : `${toppingCount} ${toppingCount === 1 ? 'topping' : 'toppings'}`;
        const fullSizeName = sizeMap[formData.size] || '';

        setSuccessMessage(
          `Thank you for your order, ${formData.fullName}! Your ${fullSizeName} pizza with ${toppingText} is on the way.`
        );

        console.log('Submitted data:', formData); // Debug submitted data

        // Reset form
        setFormData({
          fullName: '',
          size: '',
          toppings: [],
        });
        setTouched({});
        setIsFormValid(false);
      }
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      setIsFormValid(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>

      {successMessage && <div className="success">{successMessage}</div>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name</label><br />
        <input
          placeholder="Type full name"
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.fullName && errors.fullName && (
          <div className="error">{errors.fullName}</div>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label><br />
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {touched.size && errors.size && (
          <div className="error">{errors.size}</div>
        )}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.text}
              onChange={handleChange}
              checked={formData.toppings.includes(topping.text)}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>

      <input type="submit" value="Submit" disabled={!isFormValid} />
    </form>
  );
}
