import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductEditScreen = () => {
  const {id: productId} = useParams();

  const {data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productId);

  const [updateProductApiCall, {isLoading: loadingUpdate}] = useUpdateProductMutation();
 
  const [uploadProductImageApiCall, {isLoading: loadingUpload}] = useUploadProductImageMutation();
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  //Pre-Filling form fields with product existing data
  useEffect(() => {
    if(product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    //creating formData object by using FormData
    const formData = new FormData();

    //appending a field named 'image' to the formData and sets its value to e.target.files[0].
    formData.append("image", e.target.files[0]);
    
    try {
     const res = await uploadProductImageApiCall(formData).unwrap();
     setImage(res.image);
     toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }


  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProductApiCall({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock
      });
      toast.success("Product updated successfully");
      refetch();
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <Form  onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => {setName(e.target.value)}}>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => {setPrice(e.target.value)}}>
              </Form.Control>
            </Form.Group>

     
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control type="text" placeholder="Enter image url" value={image} onChange={(e) => {setImage(e.target.value)}}>
              </Form.Control>

              <Form.Control label="Choose File" type="file" onChange={uploadFileHandler}>
              </Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>
            

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control type="text" placeholder="Enter brand" value={brand} onChange={(e) => {setBrand(e.target.value)}}>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control type="number" placeholder="Enter name" value={countInStock} onChange={(e) => {setCountInStock(e.target.value)}}>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" placeholder="Enter ctegory" value={category} onChange={(e) => {setCategory(e.target.value)}}>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter description" value={description} onChange={(e) => {setDescription(e.target.value)}}>
              </Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" style={{marginTop: "1rem"}}>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen;
