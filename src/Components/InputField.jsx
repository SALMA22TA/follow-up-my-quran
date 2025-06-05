const InputField = ({ label, name, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  inputGroup: {
    width: '100%',
    marginBottom: '1rem',
  },
  label: {
    fontSize: '1rem',
    color: '#34495e',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
};

export default InputField;
