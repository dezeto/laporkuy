import {
  Box,
  Flex,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import React, { useState } from "react";

type TagsInputProps = {
  placeholder: string;
  onChange: (tags: string[]) => void;
  defaultTags: string[];
};

const capitalizeFirstLetter = (string: string | undefined) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function TagsInput({
  placeholder,
  onChange,
  defaultTags,
}: TagsInputProps) {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<string[]>(defaultTags || [""]);

  const changeHandler = (e: any) => {
    setValue(e.target.value);
    onChange(tags);
  };

  const removeTag = (tag: any) => {
    const arr = tags.filter((t) => t !== tag);
    setTags(arr);
    onChange(arr);
  };

  const updateTagsHandler = (e: any) => {
    e.preventDefault();

    if (e.target.value !== "" && e.target.value !== ",") {
      if (e.key === ",") {
        const newTag = capitalizeFirstLetter(value.trim().split(",")[0]);
        if (!tags.includes(newTag) && newTag !== "") {
          const arr = [...tags, newTag];
          setTags(arr);
          onChange(arr);
        }
        setValue("");
      } else if (e.key === "Enter") {
        const newTag = capitalizeFirstLetter(value.trim());
        if (!tags.includes(newTag) && newTag !== "") {
          const arr = [...tags, newTag];
          setTags(arr);
          onChange(arr);
        }
        setValue("");
      }
    }

    if (e.key === "Backspace" && tags.length > 0 && value === "") {
      const copyOfTags = [...tags];
      copyOfTags.pop();
      setTags(copyOfTags);
      onChange(copyOfTags);
    }
  };

  return (
    <Box mb="7px">
      <Box border="1px soled gray" borderRadius="1" transition="all 0.3s ease">
        <Flex flexWrap="wrap" alignItems="center">
          {tags.map((tag, i) => (
            <Box
              key={i}
              py="5px"
              pr="7px"
              borderRadius="1"
              fontSize="12px"
              mr="5px"
              transition="all 0.3s ease"
            >
              <Tag
                size="md"
                key="md"
                borderRadius="full"
                variant="solid"
                colorScheme="brand"
              >
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => removeTag(tag)} />
              </Tag>
            </Box>
          ))}
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={changeHandler}
            autoComplete="off"
            onKeyUp={updateTagsHandler}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
            mb="5px"
            p="0"
            flex={1}
            variant="unstyled"
          />
        </Flex>
      </Box>
    </Box>
  );
}
