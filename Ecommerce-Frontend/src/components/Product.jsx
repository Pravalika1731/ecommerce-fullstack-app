import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } =
    useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);

        // ✅ ALWAYS fetch image (FIXED)
        fetchImage();

      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        
        {/* ✅ IMAGE */}
        <img
          className="left-column-img"
          src={imageUrl}
          alt="product"
          style={{ width: "50%", height: "auto" }}
        />

        <div className="right-column" style={{ width: "50%" }}>
          <div className="product-description">

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "lighter" }}>
                {product.category}
              </span>

              <h6>
                Listed :
                <span>
                  <i>
                    {" "}
                    {new Date(product.releaseDate).toLocaleDateString()}
                  </i>
                </span>
              </h6>
            </div>

            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "0.5rem",
                textTransform: "capitalize",
              }}
            >
              {product.name}
            </h1>

            <i>{product.brand}</i>

            <p style={{ fontWeight: "bold", marginTop: "10px" }}>
              PRODUCT DESCRIPTION :
            </p>
            <p>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
              ₹{product.price}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={!product.productAvailable}
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                marginTop: "1rem",
              }}
            >
              {product.productAvailable ? "Add to cart" : "Out of Stock"}
            </button>

            <h6>
              Stock Available :
              <i style={{ color: "green", marginLeft: "5px" }}>
                {product.stockQuantity}
              </i>
            </h6>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleEditClick}
              style={{
                padding: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
              }}
            >
              Update
            </button>

            <button
              onClick={deleteProduct}
              style={{
                padding: "1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;