import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();
  
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({email, password}).unwrap();
      //console.log(res);
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }


    const { userInfo } = useSelector((state) => state.auth);

    // Accessing properties of the location object(search --> the query string parameters)
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";
  
    useEffect(() => {
      if(userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => { setEmail(e.target.value) }}>
          </Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => {setPassword(e.target.value)}}>
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading} >
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer? {" "}
          <Link to={redirect ? `/register?redirect=${redirect}`: "/register" }>Register</Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong style={{color: "red"}}>Please login with below credentials for Demo!</strong></p>
        </Col>
      </Row>
      <Row>
        <Col>
          <strong>Regular User </strong>
        </Col>
      </Row>
      <Row>
        <Col>
          <strong>Email </strong>: demo123@mail.com
        </Col>
      </Row>
      <Row>
        <Col>
        <strong>Password </strong>: demo@user@123
        </Col>
      </Row>
      <br/>
      <Row>
        <Col>
          <strong>Admin User </strong>
        </Col>
      </Row>
      <Row>
        <Col>
          <strong>Email </strong>: admin@email.com
        </Col>
      </Row>
      <Row>
        <Col>
        <strong>Password </strong>: admin@user@123
        </Col>
      </Row>
    </FormContainer>
  )
}


export default LoginScreen;


