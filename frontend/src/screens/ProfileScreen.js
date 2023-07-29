import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";


const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfileApiCall, {isLoading: loadingUpdateProfile}] = useProfileMutation();
  const dispatch = useDispatch();

  const {data: orders, isLoading, error} = useGetMyOrdersQuery();

  //Pre-Filling user name email for profile updation
  useEffect(() => {
    if(userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);


  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error("Password do not match");
      console.log("Password do not match")
      return;
    }

    try {
      const res = await updateProfileApiCall({
        _id: userInfo._id,
        name,
        email,
        password
      }).unwrap();
      dispatch(setCredentials({...res}));
      toast.success("Profile updated successfully");      
    } catch (err) {
      toast.error(err?.data?.message || err.error); 
    }
    //clearing the password and confirmapssword to empty after updation
    setPassword("");
    setConfirmPassword("");
  }


  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {loadingUpdateProfile ? <Loader /> :(
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => {setName(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => {setPassword(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="confirPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">Update</Button>
        </Form>
        )}
      </Col>


      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Loader />
        ): error ? (
          <Message varient="danger">{error?.data?.message || error.error}</Message>
        ): (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{color: "red"}} />
                  )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen;
