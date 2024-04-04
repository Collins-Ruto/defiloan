import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

import { CloseSVG } from "../../assets/images";
import { Text, Img, Button, Heading, Input, SelectBox } from "../";
import * as Images from "../../assets/images";
import Wallet from "../Wallet";
import Loader from "../utils/Loader";
import {
  approveLoan,
  getLenderActiveLoans,
  getLenderCompletedLoans,
  getLenderPendingLoans,
} from "../../utils/lenderManager";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import ApproveLoan from "./ApproveLoan";
import { Button as BButton } from "../";
import { payRequest } from "../../utils/loanManager";

const dropDownOptions = [
  { label: "Pending Loans", value: "pending" },
  { label: "Active Loans", value: "active" },
  { label: "Completed Loans", value: "completed" },
];

export default function LenderPage({ lender }) {
  const [searchBarValue, setSearchBarValue] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [activeLoan, setActiveLoan] = useState([]);
  const [loanType, setLoanType] = useState("pending");

  const getActiveLoans = useCallback(async () => {
    try {
      setLoading(true);
      setLoans(
        await getLenderActiveLoans(lender.id).then(async (res) => {
          console.log(res);
          return res;
        })
      );
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const getPendingLoans = useCallback(async () => {
    try {
      setLoading(true);
      setLoans(
        await getLenderPendingLoans(lender.id).then(async (res) => {
          console.log(res, "ln");
          return res;
        })
      );
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const getCompletedLoans = useCallback(async () => {
    try {
      setLoading(true);
      setLoans(
        await getLenderCompletedLoans(lender.id).then(async (res) => {
          console.log(res);
          return res;
        })
      );
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const loanApproval = async (data) => {
    try {
      setLoading(true);
      approveLoan(data).then((resp) => {
        getPendingLoans();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to payBid book
  const disburseRequest = async (id) => {
    try {
      setLoading(true);
      payRequest(id).then((resp) => {
        getCompletedLoans();
        toast(
          <NotificationSuccess text="Service payBid successfull, refresh to see new balance" />
        );
      });
    } catch (error) {
      console.log(
        "failed to payBid service, check that you have enough ICP tokens"
      );
      console.log(error);
      toast(
        <NotificationError text="Failed to payBid service. plese check that you have enough ICP tokens" />
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loanType === "active" && getActiveLoans();
    loanType === "completed" && getCompletedLoans();
    loanType === "pending" && getPendingLoans();
  }, [loanType]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex w-full flex-col items-center bg-white-A700_01 pt-6 shadow-xs sm:pt-5">
            <header className="flex w-[82%] items-center justify-between gap-5 rounded-[42px] bg-white-A700_01 p-[19px] shadow-md md:w-full">
              <div className="ml-4 flex w-[15%] justify-center self-end md:ml-0">
                <Img
                  src={Images.logo}
                  alt="logo"
                  className={"h-[36px] w-[120px]"}
                />
              </div>
              <div className="mr-[29px] flex w-[16%] items-center justify-center gap-[13px] md:mr-0">
                <Img
                  src={Images.img_bell_6}
                  alt="bellsix_one"
                  className="h-[24px] w-[24px]"
                />
                <Wallet />
              </div>
            </header>
            <div className="mx-auto mt-[35px] flex w-full max-w-[1027px] flex-col gap-[31px] md:p-5">
              <Input
                color="gray_200"
                size="sm"
                name="search"
                placeholder={`Search for loan options`}
                value={searchBarValue}
                onChange={(e) => setSearchBarValue(e)}
                suffix={
                  searchBarValue?.length > 0 ? (
                    <CloseSVG
                      onClick={() => setSearchBarValue("")}
                      height={27}
                      width={27}
                    />
                  ) : (
                    <Img
                      src={Images.img_image_121}
                      alt="Image 121"
                      className="h-[27px] w-[27px] cursor-pointer"
                    />
                  )
                }
                className="gap-[35px] rounded-[12px] text-gray-900_01 sm:px-5"
              />
              <div className="flex items-start gap-7 md:flex-col">
                <div className="flex w-[44%] flex-col gap-[13px] rounded-lg bg-gray-200 shadow-sm md:w-full">
                  <select
                    onChange={(e) => {
                      setLoanType(e.target.value);
                    }}
                    className="form-select w-full"
                    aria-label="Default select example"
                  >
                    <option defaultValue="">select</option>
                    {dropDownOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                  <div className="mb-10 flex flex-col gap-[5px]">
                    {loans?.map((loan, index) => (
                      <div
                        key={index}
                        onClick={() => setActiveLoan(loan)}
                        className={`flex flex-1 items-center justify-between gap-5 rounded-[15px] ${
                          activeLoan.id === loan.id
                            ? "bg-white-A700"
                            : "bg-gray"
                        } p-5 shadow-sm`}
                      >
                        <div className="ml-[26px] flex flex-col items-start gap-[7px] md:ml-0">
                          <Text size="md" as="p">
                            Title: {loan.title}
                          </Text>
                          <Text as="p">
                            Amount: {Number(loan.amount) / 10 ** 8} ICP
                          </Text>
                          <Text as="p">Borrower: {loan.Borrower?.name}</Text>
                        </div>
                        <Img
                          src={Images.img_select_1}
                          alt="image"
                          className="mb-[3px] mr-[45px] h-[34px] w-[34px] self-end md:mr-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-start rounded-[15px] bg-gray-200 p-6 shadow-sm md:self-stretch sm:p-5">
                  <div className="ml-[9px] mt-2 flex items-center justify-between gap-5 self-stretch md:ml-0">
                    <Heading size="3xl" as="h1" className="!font-epilogue">
                      Loan details
                    </Heading>
                    <Button size="xl" shape="square" className="w-[39px]">
                      <Img src={Images.img_image_96} />
                    </Button>
                  </div>
                  <Heading size="xl" as="h4" className="!font-epilogue">
                    Title: {activeLoan.title}
                  </Heading>
                  <div className="ml-[9px] mt-[35px] flex items-center md:ml-0">
                    <Img
                      src={Images.img_image_104}
                      alt="image104_one"
                      className="h-[24px] w-[24px] rounded object-cover"
                    />
                    <Text as="p" className="mb-[3px] ml-3 self-end">
                      Borrower details
                    </Text>
                    <Button
                      color="white_A700_01"
                      shape="round"
                      className="ml-10 min-w-[73px] border border-solid border-blue_gray-900"
                    >
                      {activeLoan.borrower?.name}
                    </Button>
                  </div>
                  <div className="ml-[9px] mt-[22px] flex items-center md:ml-0">
                    <Img
                      src={Images.img_image_111}
                      alt="image111_one"
                      className="h-[24px] w-[24px] rounded object-cover"
                    />
                    <Text as="p" className="ml-3 self-end">
                      Loan application
                    </Text>
                    <Button
                      color="purple_A200"
                      shape="round"
                      className="ml-10 min-w-[220px] !rounded-[12px] shadow-sm"
                    >
                      {activeLoan.createdDate}
                    </Button>
                  </div>
                  <div className="ml-[9px] mt-[19px] flex w-[60%] items-center justify-between gap-5 md:ml-0 md:w-full">
                    <div className="flex items-center gap-3">
                      <Img
                        src={Images.img_image_116}
                        alt="image116_one"
                        className="h-[19px] self-start rounded object-cover"
                      />
                      <Text as="p" className="self-end">
                        Loan Category
                      </Text>
                    </div>
                    <Button
                      color="white_A700_01"
                      shape="round"
                      className="min-w-[114px] border border-solid border-gray-900_02"
                    >
                      {activeLoan.category}
                    </Button>
                  </div>
                  <div className="ml-[17px] mt-[19px] flex w-[51%] items-center justify-between gap-5 md:ml-0 md:w-full">
                    <div className="flex items-center gap-5">
                      <Img
                        src={Images.img_image_102}
                        alt="image102_one"
                        className="h-[22px] rounded object-cover"
                      />
                      <Text as="p" className="self-end">
                        Loan Amount
                      </Text>
                    </div>
                    <Button
                      color="white_A700_01"
                      size="xs"
                      className="min-w-[71px] rounded-[3px] border border-solid border-gray-900_03 font-medium"
                    >
                      {Number(activeLoan.amount) / 10 ** 8}
                    </Button>
                  </div>
                  <Text size="lg" as="p" className="ml-[9px] mt-[43px] md:ml-0">
                    Loan attachments
                  </Text>
                  <div className="ml-[9px] mt-3.5 flex justify-between gap-5 self-stretch rounded-lg bg-white-A700_01 p-[17px] shadow-sm md:ml-0 sm:flex-col">
                    <div className="ml-[5px] flex items-center gap-4 md:ml-0">
                      <Img
                        src={Images.img_image_87}
                        alt="imageeightyseve"
                        className="h-[28px] w-[28px] rounded object-cover"
                      />
                      <Text as="p" className="mb-[3px] self-end">
                        No attached documents
                      </Text>
                    </div>
                    <Button
                      color="white_A700"
                      className="mr-1.5 min-w-[149px] rounded md:mr-0 sm:p-5"
                    >
                      Attach Document
                    </Button>
                  </div>
                  <Text size="lg" as="p" className="ml-[9px] mt-[35px] md:ml-0">
                    Loan links
                  </Text>
                  <div className="ml-[9px] mt-[15px] flex items-center gap-3.5 self-stretch rounded-lg bg-white-A700_01 p-[17px] shadow-sm md:ml-0">
                    <Img
                      src={Images.img_image_125}
                      alt="image125_one"
                      className="ml-[5px] h-[28px] w-[28px] rounded object-cover"
                    />
                    <Text as="p" className="mb-1 self-end">
                      No linked documents
                    </Text>
                  </div>
                  <div className="mb-[23px] mt-[50px] flex gap-[22px] self-end">
                    <Button
                      onClick={() => {
                        loanApproval({
                          status: "rejected",
                          id: activeLoan.id,
                          terms: "",
                          duration: "",
                        });
                      }}
                      color="white_A700_01"
                      size="2xl"
                      className="min-w-[146px] rounded-lg border border-solid border-black-900 font-bold sm:px-5"
                    >
                      Decline
                    </Button>
                    {loanType === "pending" ? (
                      <ApproveLoan loan={activeLoan} save={loanApproval} />
                    ) : (
                      loanType === "active" && (
                        <BButton
                          onClick={() => {
                            disburseRequest(activeLoan.id);
                          }}
                          color="pink_300"
                          size="2xl"
                          className="min-w-[146px] rounded-[21px] font-bold sm:px-5"
                        >
                          Disburse
                        </BButton>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <footer className="mt-[364px] flex items-center justify-center self-stretch bg-black-900 p-6 sm:p-5">
              <div className="flex w-[20%] flex-col items-center justify-center md:w-full">
                <div className="flex gap-4">
                  <Img
                    src={Images.img_logo_youtube_2}
                    alt="logoyoutubetwo"
                    className="h-[16px] w-[16px]"
                  />
                  <Img
                    src={Images.img_logo_twitter_2}
                    alt="logotwittertwo"
                    className="h-[16px] w-[16px]"
                  />
                  <Img
                    src={Images.img_logo_facebook_2}
                    alt="logofacebooktwo"
                    className="h-[16px] w-[16px]"
                  />
                  <Img
                    src={Images.img_logo_instagram_2}
                    alt="logoinstagram"
                    className="h-[16px] w-[16px]"
                  />
                </div>
                <Text as="p" className="mt-[31px] !text-gray-500">
                  © LoanHub DeFi, LLC. All rights reserved
                </Text>
                <div className="mt-[7px] flex items-start self-stretch">
                  <ul className="flex flex-col items-start gap-[11px]">
                    <li>
                      <a href="#" className="ml-3 md:ml-0">
                        <Text as="p" className="!text-gray-700">
                          Privacy
                        </Text>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <Text as="p" className="!text-gray-700">
                          Media Center
                        </Text>
                      </a>
                    </li>
                  </ul>
                  <ul className="relative ml-[-5px] flex flex-col items-start gap-1.5">
                    <li>
                      <a href="#">
                        <Text as="p" className="!text-gray-700">
                          Terms
                        </Text>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="flex self-end p-[5px]">
                          <Text as="p" className="self-end !text-gray-700">
                            Blog
                          </Text>
                        </div>
                      </a>
                    </li>
                  </ul>
                  <div className="relative ml-[-5px] flex flex-1 flex-col items-end">
                    <a
                      href="Devices"
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-[1] mr-3 md:mr-0"
                    >
                      <Text as="p" className="!text-gray-700">
                        Devices
                      </Text>
                    </a>
                    <ul className="relative mt-[-15px] flex flex-col items-start gap-3">
                      <li>
                        <a href="#">
                          <Text as="p" className="!text-gray-700">
                            Help
                          </Text>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="self-end">
                          <Text as="p" className="!text-gray-700">
                            Legacy Notices
                          </Text>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </>
      )}
    </>
  );
}
