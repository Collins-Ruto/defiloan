import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Text, Img, Button, Heading, SelectBox } from "../";
import * as Images from "../../assets/images";
import Wallet from "../Wallet";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import {
  addCollateral,
  getBorrowerActiveLoans,
  getBorrowerCollaterals,
  getBorrowerCompletedLoans,
  getBorrowerPendingLoans,
  getBorrowers,
} from "../../utils/borrowerManager";
import { getLenders } from "../../utils/lenderManager";
import AddLoan from "../loanManager/AddLoan";
import AddCollateral from "../loanManager/AddCollateral";
import { createLoan, rePaymentRequest } from "../../utils/loanManager";
import RepayLoan from "./RepayLoan";
import AddSavings from "./Save";
import Loader from "../utils/Loader";

const dropDownOptions = [
  { label: "Pending Loans", value: "pending" },
  { label: "Active Loans", value: "active" },
  { label: "Completed Loans", value: "completed" },
];

export default function BorrowerPage({ borrower }) {
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [collaterals, setCollaterals] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [activeLoan, setActiveLoan] = useState([]);
  const [loanType, setLoanType] = useState("pending");
  const [borrowers, setBorrowers] = useState([]);

  const getActiveLoans = useCallback(async () => {
    try {
      setLoading(true);
      setLoans(await getBorrowerActiveLoans(borrower.id));
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  });

  const getAllBorrowers = useCallback(async () => {
    try {
      setLoading(true);
      setBorrowers(await getBorrowers());
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  });

  const getPendingLoans = useCallback(async () => {
    try {
      setLoading(true);
      setLoans(await getBorrowerPendingLoans(borrower.id));
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  });

  const getCompletedLoans = useCallback(async () => {
    try {
      setLoading(true);
      setLoans(await getBorrowerCompletedLoans(borrower.id));
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  });

  // get lenders
  const fetchLenders = useCallback(async () => {
    try {
      setLoading(true);
      setLenders(await getLenders());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const fetchCollaterals = useCallback(async () => {
    try {
      setLoading(true);
      setCollaterals(
        await getBorrowerCollaterals(borrower.id).then((res) => {
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

  const addLoan = async (loan) => {
    try {
      setLoading(true);
      loan.amount = parseInt(loan.amount, 10) * 10 ** 8;
      createLoan(loan).then((resp) => {
        getPendingLoans();
      });
      toast(<NotificationSuccess text="Loan added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a loan." />);
    } finally {
      setLoading(false);
    }
  };

  const addSavings = async (savings) => {
    try {
      setLoading(true);
      savings.amount = parseInt(savings.amount, 10) * 10 ** 8;
      createLoan(savings).then((resp) => {
        getPendingLoans();
      });
      toast(<NotificationSuccess text="Savings added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a savings." />);
    } finally {
      setLoading(false);
    }
  };

  const newCollateral = async (collateral) => {
    try {
      setLoading(true);
      collateral.value = parseInt(collateral.value, 10);
      addCollateral(collateral).then((resp) => {
        fetchCollaterals();
      });
      toast(<NotificationSuccess text="Collateral added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a collateral." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to payBid book
  const repayment = async (loanId, amount) => {
    try {
      setLoading(true);
      const intAmount = parseInt(amount, 10) * 10 ** 8;
      rePaymentRequest(loanId, intAmount).then((resp) => {
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
    fetchCollaterals();
    fetchLenders();
    getAllBorrowers();
  }, [loanType]);

  console.log(borrowers, "brrw");

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex w-full flex-col items-center bg-white-A700_01 pt-8 shadow-xs sm:pt-5">
          <header className="flex w-[82%] items-center justify-center rounded-[42px] bg-white-A700_01 p-[19px] shadow-md md:w-full">
            <div className="mx-auto flex w-full max-w-[1091px] items-center justify-center gap-[13px] self-end md:flex-col">
              <div className="flex flex-1 items-start justify-between gap-5 md:self-stretch">
                <div className="flex w-[17%] justify-center">
                  <Img
                    src={Images.logo}
                    alt="logo"
                    className={"h-[36px] w-[120px]"}
                  />
                </div>
                <Img
                  src={Images.img_bell_6}
                  alt="bellsix_one"
                  className="mt-1.5 h-[24px] w-[24px]"
                />
              </div>
              <Wallet />
            </div>
          </header>
          <div className="mx-auto mt-[30px] flex w-full max-w-[1218px] flex-col items-start md:p-5">
            <Heading size="s" as="h1" className="ml-1.5 md:ml-0">
              Available loans
            </Heading>
            <div className="flex w-full justify-content-end">
              <AddSavings save={addSavings} lenders={lenders} />
              <AddCollateral save={newCollateral} />
            </div>
            <div className="mt-2.5 flex items-start justify-between gap-5 self-stretch md:flex-col">
              <div className="mt-[5px] grid w-[61%] grid-cols-[repeat(auto-fill,_minmax(187px_,_1fr))] gap-[30px]">
                <AddLoan
                  borrower={borrower}
                  lenders={lenders}
                  save={addLoan}
                  borrowers={borrowers}
                />
                <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[15px] bg-gray-300_77 p-[21px] shadow-sm sm:p-5">
                  <Img
                    src={Images.img_payment_1_gray_900_01}
                    alt="paymentone_one"
                    className="mt-1.5 h-[44px] w-[44px]"
                  />
                  <div className="mb-1 flex flex-col gap-[7px]">
                    <Heading size="s" as="h3">
                      Emergency Loan
                    </Heading>
                    <Text as="p">For sticky situations</Text>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-[18px] rounded-[15px] bg-gray-300_77 p-[21px] shadow-sm sm:p-5">
                  <Img
                    src={Images.img_payment_1_gray_900_01_44x44}
                    alt="paymentone_one"
                    className="mt-1.5 h-[44px] w-[44px]"
                  />
                  <div className="mb-1 flex flex-col items-start gap-[9px]">
                    <Heading size="s" as="h4">
                      Education Loan
                    </Heading>
                    <Text as="p">Pay School fees</Text>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-[18px] rounded-[15px] bg-gray-300_77 p-[21px] shadow-sm sm:p-5">
                  <Img
                    src={Images.img_payment_1_44x44}
                    alt="paymentone_one"
                    className="mt-1.5 h-[44px] w-[44px]"
                  />
                  <div className="mb-1 flex flex-col items-start gap-[9px]">
                    <Heading size="s" as="h5">
                      Business Loan
                    </Heading>
                    <Text as="p">Grow your business</Text>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[15px] bg-gray-300_77 p-[21px] shadow-sm sm:p-5">
                  <Img
                    src={Images.img_payment_1_gray_900_01_44x44}
                    alt="paymentone_one"
                    className="mt-1.5 h-[44px] w-[44px]"
                  />
                  <div className="mb-1 flex flex-col items-start gap-2">
                    <Heading size="s" as="h6">
                      Special Loan
                    </Heading>
                    <Text as="p">For sticky situations</Text>
                  </div>
                </div>
              </div>
              <div className="flex w-[31%] flex-col items-center rounded-[15px] border border-solid border-gray-100 bg-white-A700_01 pb-[42px] md:w-full md:pb-5">
                <div className="flex flex-col items-center self-stretch">
                  <div className="flex items-start justify-between gap-5 self-stretch bg-purple-A200_60 pb-[45px] md:pb-5">
                    <div className="h-[40px] w-[16%] rounded-[30px] bg-pink-300_66" />
                    <div className="h-[76px] w-[23%] rounded-[43px] bg-pink-300_66" />
                  </div>
                  <div className="relative mt-[-89px] w-[37%] rounded-[70px] bg-purple-50 md:w-full">
                    <Img
                      src={Images.img_rectangle_140x140}
                      alt="circleimage_one"
                      className="h-[140px] w-[140px] rounded-[50%]"
                    />
                  </div>
                </div>
                <Heading size="lg" as="h5" className="mt-[15px] !text-pink-300">
                  Jay Rutherford
                </Heading>
                <Text as="p" className="mt-[3px] text-center">
                  Borrower
                </Text>
                <Button
                  color="purple_A200"
                  size="2xl"
                  shape="round"
                  leftIcon={
                    <Img
                      src={Images.img_pen}
                      alt="Pen"
                      className="h-[20px] w-[20px]"
                    />
                  }
                  className="mt-8 min-w-[317px] gap-1.5 !rounded-[15px] sm:px-5"
                >
                  Edit profile
                </Button>
                <div className="mt-7 flex w-[46%] items-start gap-3.5 rounded-[20px] bg-gray-300_96 md:w-full md:p-5">
                  <div className="flex w-[38%] justify-center rounded-[20px] bg-gray-300_e5 p-[11px] shadow-sm">
                    <Img
                      src={Images.img_user}
                      alt="user_one"
                      className="h-[18px] w-[19px] self-end"
                    />
                  </div>
                  <Text as="p" className="mt-2.5 !font-medium">
                    4599 ICP
                  </Text>
                </div>
                <div className="mt-[18px] flex w-[69%] items-center gap-[29px] rounded-[20px] bg-gray-300_96 md:w-full md:p-5">
                  <Button
                    color="gray_300_e5"
                    size="2xl"
                    className="min-w-[121px] rounded-[20px]"
                  >
                    Loan Balance
                  </Button>
                  <Text as="p" className="!font-medium">
                    4599 ICP
                  </Text>
                </div>
              </div>
            </div>
            <div className="ml-[3px] mt-1.5 flex w-[88%] items-start justify-between gap-5 md:ml-0 md:w-full md:flex-col">
              <div className="flex w-[41%] flex-col gap-[13px] rounded-lg shadow-sm md:w-full">
                <div className="flex flex-col gap-[13px] rounded-lg bg-gray-200 shadow-sm md:w-full">
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
                          <Text as="p">
                            RePaid: {Number(loan.rePaid) / 10 ** 8} ICP
                          </Text>

                          <Text as="p">Lender: {loan.lender?.name}</Text>
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
                <div className="flex flex-col gap-[13px] rounded-lg bg-gray-200 shadow-sm md:w-full">
                  <Heading
                    size="3xl"
                    as="h4"
                    className="!font-epilogue px-4 py-2"
                  >
                    Collaterals
                  </Heading>
                  <div className="mb-10 flex flex-col gap-[5px]">
                    {collaterals?.map((collateral, index) => (
                      <div
                        key={index}
                        className={`flex flex-1 items-center justify-between gap-5 rounded-[15px] ${"bg-gray"} p-3 shadow-sm`}
                      >
                        <div className="ml-[18px] flex flex-col items-start gap-[7px] md:ml-0">
                          <Text size="md" as="p">
                            Asset Type: {collateral.assetType}
                          </Text>
                          <Text as="p">
                            Value: {Number(collateral.value)} ICP
                          </Text>
                          <Text as="p">Status: {collateral.status}</Text>
                          <Text as="p">Id: {collateral.id}</Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex w-[52%] flex-col items-start rounded-[15px] bg-gray-200 p-6 shadow-sm md:w-full sm:p-5">
                <div className="ml-[9px] mt-2 flex items-center justify-between gap-5 self-stretch md:ml-0">
                  <Heading size="3xl" as="h2" className="!font-epilogue">
                    Loan details
                  </Heading>
                  <Button size="xl" shape="square" className="w-[39px]">
                    <Img src={Images.img_image_96} />
                  </Button>
                </div>
                <div className="ml-[9px] mt-[35px] flex w-[60%] flex-col gap-5 md:ml-0 md:w-full">
                  <Heading size="xl" as="h4" className="!font-epilogue">
                    Title: {activeLoan.title}
                  </Heading>
                  <div className="flex items-center">
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
                      {activeLoan.lender?.name}
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <Img
                      src={Images.img_image_111}
                      alt="image111_one"
                      className="h-[24px] w-[24px] rounded object-cover"
                    />
                    <Text as="p" className="ml-3 self-end">
                      Loan application
                    </Text>
                    <Button
                      color="pink_300"
                      shape="round"
                      className="ml-10 min-w-[220px] !rounded-[12px] shadow-sm"
                    >
                      {activeLoan.createdDate}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <Img
                        src={Images.img_image_116}
                        alt="image116_one"
                        className="h-[19px] self-start rounded object-cover"
                      />
                      <Text as="p" className="self-end">
                        Loan projects
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
                  <div className="ml-2 flex w-[86%] items-center justify-between gap-5 md:ml-0 md:w-full">
                    <div className="flex items-center gap-5">
                      <Img
                        src={Images.img_image_102}
                        alt="image102_one"
                        className="h-[22px] rounded object-cover"
                      />
                      <Text as="p" className="self-end">
                        Priority
                      </Text>
                    </div>
                    <Button
                      color="white_A700_01"
                      size="xs"
                      className="min-w-[71px] rounded-[3px] border border-solid border-gray-900_03 font-medium"
                    >
                      Urgent
                    </Button>
                  </div>
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
                    color="white_A700_01"
                    size="2xl"
                    className="min-w-[146px] rounded-lg border border-solid border-black-900 font-bold sm:px-5"
                  >
                    Edit
                  </Button>
                  {loanType === "completed" ? (
                    <RepayLoan loan={activeLoan} save={repayment} />
                  ) : (
                    <Button
                      color="purple_A200"
                      size="2xl"
                      className="min-w-[146px] rounded-[21px] font-bold sm:px-5"
                    >
                      Delete{" "}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-[380px] mt-[152px] flex w-[35%] justify-center rounded bg-white-A700_01 p-[31px] shadow-sm md:ml-0 md:w-full sm:p-5">
              <Img
                src={Images.img_image_21_56x197}
                alt="imagetwentyone"
                className="h-[56px] w-[86%] object-cover"
              />
            </div>
          </div>
          <footer className="mt-[151px] flex items-center justify-center self-stretch bg-black-900 p-6 sm:p-5">
            <div className="flex w-[21%] flex-col items-center justify-center md:w-full">
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
              <div className="flex flex-col items-end self-stretch">
                <a href="#">
                  <div className="relative z-[1] mr-3 flex p-1.5 md:mr-0">
                    <Text as="p" className="!text-gray-700">
                      Devices
                    </Text>
                  </div>
                </a>
                <div className="relative mt-[-30px] flex self-stretch">
                  <div className="flex items-start">
                    <ul className="flex flex-col items-start">
                      <li>
                        <a href="#">
                          <div className="ml-3 flex p-[5px] md:ml-0">
                            <Text as="p" className="self-end !text-gray-700">
                              Privacy
                            </Text>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="flex self-center p-1.5">
                            <Text as="p" className="!text-gray-700">
                              Media Center
                            </Text>
                          </div>
                        </a>
                      </li>
                    </ul>
                    <a href="#">
                      <div className="relative ml-[-29px] flex p-1.5">
                        <Text as="p" className="!text-gray-700">
                          Terms
                        </Text>
                      </div>
                    </a>
                  </div>
                  <div className="relative ml-[-37px] flex flex-1 items-center">
                    <a href="#">
                      <div className="relative z-[2] flex self-end p-[5px]">
                        <Text as="p" className="self-end !text-gray-700">
                          Blog
                        </Text>
                      </div>
                    </a>
                    <ul className="relative ml-[-17px] flex flex-col items-start">
                      <li>
                        <a href="#">
                          <div className="flex p-[5px]">
                            <Text as="p" className="self-end !text-gray-700">
                              Help
                            </Text>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="flex self-end p-[5px]">
                            <Text as="p" className="self-end !text-gray-700">
                              Legacy Notices
                            </Text>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
