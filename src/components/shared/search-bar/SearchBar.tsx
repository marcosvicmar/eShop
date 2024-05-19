import React, { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

import { Input, InputGroup, InputRightElement, IconButton, Button, FormControl } from "@chakra-ui/react";

interface SearchFormProps {
  onSubmitSearch: (search: string) => void
}

export const SearchForm: React.FC<SearchFormProps> = ({onSubmitSearch}) => {
  const [input, setInput] = useState('');

  const handleInputChange = (ev: any) => setInput(ev.target.value);

  const handleSubmit = (ev: any) => {
    ev.preventDefault();
    onSubmitSearch(input);
  };

  return (
    <FormControl className={"search-bar"} onSubmit={handleSubmit}>
      <Input type='email' value={input} onChange={handleInputChange} />
      <IconButton aria-label='Search product' icon={<SearchIcon />} type="submit"></IconButton>
    </FormControl>
  )
}