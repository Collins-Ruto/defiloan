import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import {
  Text,
  Img,
  Heading,
  Button as BButon,
  Input,
  SelectBox,
  TextArea,
} from "..";

import * as Images from "../../assets/images";
import { getBorrowerCollaterals } from "../../utils/borrowerManager";

const AddLoan = ({ borrower, lenders, save, borrowers }) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [lenderId, setLenderId] = useState("");
  const [guarantorId, setGuarantorId] = useState("");
  const [collateralId, setCollateralId] = useState("");
  const [maxAmount, setMaxAmount] = useState(0);
  const [guarantor, setGuarantor] = useState("");
  const [collaterals, setCollaterals] = useState([{ value: "", label: "" }]);
  const isFormFilled = () => title && duration && description;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCollaterals = async () => {
    try {
      setCollaterals(
        await getBorrowerCollaterals(borrower.id).then((res) => {
          return res.map((collateral) => ({
            value: collateral.id,
            label: collateral.assetType,
          }));
        })
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const lendersLists = lenders.map((lender) => ({
    value: lender.id,
    label: lender.name,
  }));

  console.log(collaterals, lenders, lendersLists, borrower);

  useEffect(() => {
    getCollaterals();
  }, []);

  console.log("grnt", guarantor);

  return (
    <>
      <div
        onClick={handleShow}
        className="flex w-full flex-col items-start justify-center gap-5 rounded-[15px] bg-gray-300_77 p-[21px] shadow-sm sm:p-5"
      >
        <Img
          src={Images.img_payment_1}
          alt="financing_loan"
          className="mt-1.5 h-[44px] w-[44px]"
        />
        <div className="mb-1 flex flex-col items-start gap-2">
          <Heading size="s" as="h2">
            Financing Loan
          </Heading>
          <Text as="p">Finance your Projects</Text>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Loan</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <div className=" flex w-100 flex-col items-start rounded-[20px] bg-white-A700_01 p-7 shadow-sm md:w-full sm:p-5">
              <Text size="xl" as="p" className="mt-[3px] !font-epilogue">
                Loan Application
              </Text>

              <div className="mt-5 flex gap-[11px] self-stretch sm:flex-col">
                <div className="flex w-full flex-col items-start justify-center gap-[3px] sm:w-full">
                  <FloatingLabel
                    controlId="isTokenized"
                    label="Guarantor"
                    className="mb-3 w-[70%]"
                  >
                    <select
                      onChange={(e) => {
                        setGuarantor(e.target.value);
                      }}
                      className="form-select w-full"
                      aria-label="Default select example"
                    >
                      <option defaultValue="">select</option>
                      {borrowers.map((borrower, index) => (
                        <option key={index} value={borrower}>
                          {borrower.name} {borrower.savings}
                        </option>
                      ))}
                    </select>
                  </FloatingLabel>
                  <Heading as="h2" className="!text-black">
                    Loan Amount
                  </Heading>
                  <input
                    name="amount"
                    type="number"
                    placeholder={`Input Amount`}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    className="self-stretch rounded !text-black sm:pr-5"
                  />
                </div>
                <FloatingLabel
                  controlId="isTokenized"
                  label="Lender"
                  className="mb-3 w-[60%]"
                >
                  <select
                    onChange={(e) => {
                      setLenderId(e.target.value);
                    }}
                    className="form-select w-full"
                    aria-label="Default select example"
                  >
                    <option defaultValue="">select</option>
                    {lenders.map((lender, index) => (
                      <option key={index} value={lender.id}>
                        {lender.name}
                      </option>
                    ))}
                  </select>
                </FloatingLabel>
              </div>
              <Heading as="h2" className="mt-[17px] !text-black">
                Loan Duration
              </Heading>
              <input
                name="textfield"
                placeholder={`Input text`}
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
                className="mt-0.5 self-stretch rounded !text-black sm:pr-5"
              />
              <Heading as="h2" className="mt-[13px] !text-black">
                Collateral type
              </Heading>
              <FloatingLabel
                controlId="isTokenized"
                label="Collateral "
                className="mb-3 w-60"
              >
                <select
                  onChange={(e) => {
                    setCollateralId(e.target.value);
                  }}
                  className="form-select w-full"
                  aria-label="Default select example"
                >
                  <option defaultValue="">select</option>
                  {collaterals.map((collateral, index) => (
                    <option key={index} value={collateral.value}>
                      {collateral.label}
                    </option>
                  ))}
                </select>
              </FloatingLabel>
              <Heading as="h2" className="mt-[17px] !text-black">
                Loan Title
              </Heading>
              <input
                type="text"
                name="textfield"
                placeholder={`Input Title`}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="mt-0.5 self-stretch rounded !text-black sm:pr-5"
              />
              <Heading as="h2" className="mt-[17px] !text-black">
                Loan Purpose
              </Heading>
              <input
                type="textarea"
                placeholder={`Input text`}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="mt-0.5 self-stretch rounded !text-black sm:pr-5"
              />
              <Text as="p" className="mt-2 !text-gray-700">
                Describe your reasons for applying
              </Text>
            </div>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <div className="mb-3 mt-[65px] flex gap-1 self-end">
            <div className="flex rounded p-[9px]">
              <Text onClick={handleClose} as="p" className="!text-gray-500">
                Cancel
              </Text>
            </div>
            <BButon
              disabled={!isFormFilled()}
              onClick={() => {
                save({
                  title,
                  lenderId,
                  amount,
                  duration,
                  description,
                  collateralId,
                  guarantorId,
                  category: "financial",
                });
                handleClose();
              }}
              color="purple_A200"
              size="lg"
              className="min-w-[62px] rounded"
            >
              Apply
            </BButon>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddLoan.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddLoan;
