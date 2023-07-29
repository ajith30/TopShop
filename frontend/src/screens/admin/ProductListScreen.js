import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { LinkContainer } from "react-router-bootstrap";
import {toast} from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const {data, isLoading, error, refetch} = useGetProductsQuery({ pageNumber });

  const [createProductApiCall, {isLoading: loadingCreate}] = useCreateProductMutation();
  
  const [deleteProductApiCall, {isLoading: loadingDelete}] = useDeleteProductMutation();

  const createProductHandler = async () =>{
    if(window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProductApiCall()
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  const deleteHandler = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductApiCall(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message ||err.error);
      }
    }
  } 

  return (
    <>
    <Row className="align-items-center">
      <Col>
        <h1>Products</h1>
      </Col>
      <Col className="text-end">
        <Button className="btn-sm my-3" onClick={createProductHandler}>
          <FaPlus /> Create Product
        </Button>
      </Col>
    </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ): error ? (
        <Message varient="danger">{error?.data?.message || error?.error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={() => {deleteHandler(product._id)}}>
                      <FaTrash style={{color: "white"}}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>  

          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListScreen;
