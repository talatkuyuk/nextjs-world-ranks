import { FaSearch } from "react-icons/fa";
import styles from "./SearchInput.module.css";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput = (props: SearchInputProps) => {
  return (
    <div className={styles.wrapper}>
      <FaSearch color="inherit" />
      <input className={styles.input} {...props} />
    </div>
  );
};

export default SearchInput;
