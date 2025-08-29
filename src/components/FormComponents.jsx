import styled from "styled-components";

export const Input = styled.input`
  padding: 10px;
  margin: 10px 10px 15px 0;
  width: 250px;
  border-radius: 6px;
  border: 1px solid #d4af37;
  background-color: #1f1f1f;
  color: #d4af37;
  &:focus { outline: none; border-color: #00b894; }
`;

export const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  background-color: #00b894;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

export const AddButton = styled(Button)`
  background-color: #d4af37;
  color: #000;
`;
