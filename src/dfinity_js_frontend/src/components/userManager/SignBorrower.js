import React, { useState } from "react";
import { createBorrower } from "../../utils/borrowerManager";

const SignBorrower = ({ fetchUser }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const isFormFilled = () => name && address && email && imageUrl;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBorrower({ name, address, email, imageUrl }).then((res) => {
        console.log(res);
        fetchUser();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <section
        className="vh-100 bg-image"
        style={{
          backgroundImage:
            "url(" +
            "https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp" +
            ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-5">
                      Create an account
                    </h2>

                    <form>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="form3Example1cg"
                          className="form-control form-control-lg"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        <label className="form-label" htmlFor="form3Example1cg">
                          Your Name
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form3Example3cg"
                          className="form-control form-control-lg"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                        <label className="form-label" htmlFor="form3Example3cg">
                          Your Email
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form3Example4cg"
                          className="form-control form-control-lg"
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                        />
                        <label className="form-label" htmlFor="form3Example4cg">
                          Address
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="form3Example4cdg"
                          className="form-control form-control-lg"
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                          }}
                        />
                        <label
                          className="form-label"
                          htmlFor="form3Example4cdg"
                        >
                          Image Url
                        </label>
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          disabled={!isFormFilled()}
                          onClick={handleSubmit}
                          type="button"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        >
                          Register
                        </button>
                      </div>

                      <p className="text-center text-muted mt-5 mb-0">
                        Welcome to decentralized loans
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignBorrower;
