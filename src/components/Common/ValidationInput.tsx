import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import Flex from "./Flex";
import styled from "@emotion/styled";

interface Validation {
  type: string;
  validator: (input: string) => boolean;
  message: string;
}

interface ValidationInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onChange: (value: string) => void;
  validations: Validation[];
}

const ErrorMessage = styled.span`
  font-size: 11px;
  color: var(--color-error);
`;

const Input = styled.input<{ $isError: boolean }>`
  width: 100%;
  font-size: 13px;
  border-radius: 2px;
  padding: 8px 6px;
  border: 1px solid
    ${({ $isError }) =>
      $isError ? "var(--color-error)" : "var(--color-border)"};

  :focus {
    border: 1px solid
      ${({ $isError }) =>
        $isError ? "var(--color-error)" : "var(--color-black)"};
    outline: 0;
  }
`;

function ValidationInput({
  value,
  onChange,
  validations,
  ...rest
}: ValidationInputProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnchange = (event: ChangeEvent<HTMLInputElement>) => {
    const failValidation = validations.find(
      (validation: Validation) =>
        validation.type === "validateOnChange" &&
        !validation.validator(event.target.value),
    );

    if (failValidation) {
      setErrorMessage(failValidation.message);
    } else {
      onChange?.(event.target.value);
      setErrorMessage("");
    }
  };

  const handleOnBlur = () => {
    const failValidation = validations.find(
      (validation) =>
        validation.type === "validateOnBlur" && !validation.validator(value),
    );

    if (failValidation) {
      setErrorMessage(failValidation.message);
    } else {
      setErrorMessage("");
    }
  };

  return (
    <Flex direction="column" gap={10}>
      <Input
        {...rest}
        value={value}
        onChange={handleOnchange}
        onBlur={handleOnBlur}
        $isError={!!errorMessage}
      />
      {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Flex>
  );
}

export default ValidationInput;
