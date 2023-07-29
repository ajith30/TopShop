import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

const SearchBox = () => {
  const { keyword: urlkeyword } = useParams()
  const [keyword , setKeyword] =useState(urlkeyword || "");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if(keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else{
      navigate("/");
    }
  }

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
}

export default SearchBox;
