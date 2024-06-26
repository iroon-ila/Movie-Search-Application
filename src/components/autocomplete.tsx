import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import loadingItems from "../../public/lottie/LoadingItems.json";

interface AutocompleteProps<T> {
  placeholder: string;
  options: T[];
  inputValue: string;
  onInputChange: (newTerm: string) => void;
  onSelectOption: (option: T) => void;
  getOptionView: (option: T) => React.ReactNode;
  fetchOptions: VoidFunction;
  loading: boolean;
}

const inputCn =
  "w-full h-12 focus:outline-primary rounded-xl py-3 pl-4 pr-10 leading-normal transition-colors duration-200 text-gray-600 placeholder-gray-500 border border-gray-300";

const optionsCn =
  "absolute z-10 w-full bg-white shadow-lg rounded-b-xl max-h-[400px] overflow-auto";

export function Autocomplete<T>({
  inputValue,
  options,
  onInputChange,
  onSelectOption,
  getOptionView,
  fetchOptions,
  placeholder,
  loading,
}: AutocompleteProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Trigger the fetchOptions API call when the search term changes
  useEffect(() => {
    // Set a timeout of 700 ms before triggering the API call because we want to search only when the user has typed the whole search query
    const searchTimeout = setTimeout(fetchOptions, 700);

    return () => clearTimeout(searchTimeout); // Cleanup timeout on unmount or searchTerm change
  }, [inputValue]);

  return (
    <div className="relative w-1/2 m-auto">
      <div className="relative">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          className={inputCn}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <span className="absolute top-1/2 -translate-y-1/2 right-4">
          {<IoIosSearch />}
        </span>
      </div>

      {loading && (
        <div className={optionsCn}>
          <Lottie
            animationData={loadingItems}
            style={{ width: "60%", margin: "auto" }}
          />
        </div>
      )}

      {isFocused && !loading && (
        <ul className={optionsCn}>
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => onSelectOption(option)}
            >
              {getOptionView(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
